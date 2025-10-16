'use server';

import { z } from 'zod';
import { CartItems, CartItemsSchema, GuestInfoSchema } from '../definations/data-dto';
import { insertCheckoutSession, insertOrder } from '../data/insert-data';
import { fetchCheckoutSessionById, fetchVariantsByVariantIdArray } from '../data/fetch-data';

export async function createCheckoutSession(items: CartItems): Promise<{
    success: boolean;
    error?: string;
    sessionId?: string;
}> {
    const validationResult = CartItemsSchema.safeParse(items);

    if (!validationResult.success) {
        const flatError = z.flattenError(validationResult.error).formErrors.join("; ")
        return { success: false, error: flatError };
    }

    const validatedItems = validationResult.data;

    try {
        const resultQuery = await insertCheckoutSession(validatedItems);

        // THAY ĐỔI QUAN TRỌNG: Trả về sessionId thay vì redirect
        return { success: true, sessionId: resultQuery.checkout_id };

    } catch (error) {
        console.error("Lỗi khi tạo checkout session:", error);
        // Đảm bảo kiểu trả về nhất quán
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'Đã có lỗi từ server. Vui lòng thử lại.' };
    }
}

// Định nghĩa trạng thái trả về của action
export type CheckoutFormState = {
    errors?: {
        name?: string[];
        phone?: string[];
        address?: string[];
        policy?: string[];
        paymentMethod?: string[];
    };
    sussess?: boolean;
    message?: string;
    fields?: {
        name: FormDataEntryValue | null;
        phone: FormDataEntryValue | null;
        address: {
            province: FormDataEntryValue | null;
            ward: FormDataEntryValue | null;
            street: FormDataEntryValue | null;
        };
        paymentMethod: FormDataEntryValue | null;
        policy: FormDataEntryValue | null;
    };
};


export async function completeCheckoutAction(
    checkoutId: string,
    checkoutItems: CartItems,
    prevState: CheckoutFormState,
    formData: FormData
): Promise<CheckoutFormState> {

    const checkoutSession = await fetchCheckoutSessionById(checkoutId);

    if (checkoutSession === undefined) {
        return {
            message: 'Thông tìm thấy phiên thanh toán. Vui lòng thử lại.',
        };
    }

    const expires = new Date(checkoutSession.expires_at);

    if (expires < new Date()) {
        return {
            message: 'Phiên thanh toán đã hết hạn. Vui lòng thử lại.',
        };
    }

    // 1. Trích xuất dữ liệu từ FormData
    const rawData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: {
            province: formData.get('province'),
            ward: formData.get('ward'),
            street: formData.get('street'),
        },
        paymentMethod: formData.get('paymentMethod'),
        policy: formData.get('policy'),
    };

    // 2. Validate dữ liệu bằng Zod
    // Thêm validation cho policy checkbox
    const FormSchemaWithPolicy = GuestInfoSchema.extend({
        paymentMethod: z.enum([
            "cod", "online-banking"
        ], "Phương thức thanh toán không hợp lệ"),
        policy: z.literal('on', "Hãy đồng ý với chính sách của Tech house"),
    });

    const validationResult = FormSchemaWithPolicy.safeParse(rawData);

    // Nếu validation thất bại, trả về lỗi ngay lập tức
    if (!validationResult.success) {
        return {
            errors: z.flattenError(validationResult.error).fieldErrors,
            message: 'Vui lòng kiểm tra lại thông tin.',
            fields: rawData,
        };
    }

    const validatedData = validationResult.data;

    const variantIds = checkoutItems.map(item => item.variant_id);

    const variants = await fetchVariantsByVariantIdArray(variantIds);

    const itemsData = checkoutItems.map((item) => {
        const exist = variants.find(v => v.variant_id === item.variant_id);

        if (!exist) {
            return {
                variant_id: "",
                quantity: 0,
                variant_price: 0,
                newStock: 0
            }
        }

        const newStock = exist.stock - item.quantity;

        return {
            variant_id: item.variant_id,
            quantity: item.quantity,
            variant_price: exist.variant_price,
            newStock: newStock
        }
    })

    itemsData.forEach((item) => {
        if (item.variant_id === "") {
            return {
                message: 'Không tìm thấy sản phẩm trong hệ thống. Vui lòng thử lại.',
            };
        }

        if (item.newStock < 0) {
            return {
                message: 'Không đủ sản phẩm trong kho. Vui lòng thử lại.',
            };
        }
    })

    const totalAmount = itemsData.reduce((acc, item) => acc + item.quantity * item.variant_price, 0)

    try {
        // 3. Gọi logic nghiệp vụ (ví dụ: tạo đơn hàng)
        const newOrder = await insertOrder({
            payment_status: "pending",
            total_amount: totalAmount,
            reward_points: Math.floor(totalAmount / 100),
            buyer_name: validatedData.name,
            phone_number: validatedData.phone,
            province: validatedData.address.province,
            ward: validatedData.address.ward,
            street: validatedData.address.street,
            payment_method: validatedData.paymentMethod,
            items: itemsData,
        });

        return {
            sussess: true,
            message: "Tạo hoá đơn thành công"
        }

    } catch (error) {
        console.error("Lỗi khi hoàn tất checkout:", error);
        return { message: 'Đã có lỗi từ server. Vui lòng thử lại.', fields: rawData, };
    }
}