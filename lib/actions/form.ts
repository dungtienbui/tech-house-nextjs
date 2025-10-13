'use server';

import { z } from 'zod';
import { AddressFormState, AddressSchema } from '../definations/data-dto';
import { updateUserAdderss } from '../data/insert-data';
import { auth, signOut } from '@/auth';
import { revalidatePath } from 'next/cache';


export async function updateAddressAction(
    prevState: AddressFormState,
    formData: FormData,
): Promise<AddressFormState> {
    // 1. Chuyển đổi FormData thành một object thông thường
    const rawData = Object.fromEntries(formData.entries());

    // 2. Xác thực dữ liệu với Zod
    const validatedFields = AddressSchema.safeParse(rawData);

    // 3. Nếu validation thất bại, trả về lỗi
    if (!validatedFields.success) {
        console.error('Validation failed:', z.flattenError(validatedFields.error).fieldErrors,);

        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
        };
    }

    const session = await auth();

    if (!session?.user.id) {
        await signOut({ redirectTo: "/signin" });

        return {
            errors: {
                other: ["Phiên làm việc đã hết hạn, vui lòng đăng nhập lại."]
            }
        };
    }

    // 4. Nếu validation thành công
    try {
        // ---- Logic xử lý dữ liệu ở đây ----
        // Ví dụ: Gọi API, lưu vào database, ...
        console.log('Dữ liệu đã được xác thực:', validatedFields.data);
        //
        // ------------------------------------

        const resultQuery = await updateUserAdderss({
            userId: session.user.id,
            address: validatedFields.data
        });

        // console.log("resultQuery: ", resultQuery);
        // Trả về thông báo thành công

        revalidatePath("/user/profile", "page");

        return { message: 'Cập nhật địa chỉ thành công!' };
    } catch (e) {

        console.log("error: ", (e as Error).message);
        // Xử lý lỗi từ server (ví dụ: database không kết nối được)
        return {
            errors: {
                other: ["Lỗi máy chủ, vui lòng thử lại!"]
            }
        };
    }
}