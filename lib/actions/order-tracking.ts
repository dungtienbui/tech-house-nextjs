'use server'

import { z } from 'zod';
import { fetchOrderByIdAndPhone } from '../data/fetch-data';
import { OrderDetailsDTO } from '../definations/data-dto';

// 1. Định nghĩa Schema để validate dữ liệu từ form
const TrackOrderSchema = z.object({
    orderId: z.uuid('Vui lòng nhập mã đơn hàng hợp lệ.'),
    phone: z.string().regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ.'),
});

// 2. Định nghĩa State trả về của Action
export type TrackOrderFormState = {
    errors?: {
        orderId?: string[];
        phone?: string[];
    };
    message?: string;
    success?: boolean;
    data?: OrderDetailsDTO
};

// 3. Viết Action chính
export async function trackOrderAction(
    prevState: TrackOrderFormState,
    formData: FormData
): Promise<TrackOrderFormState> {
    // Trích xuất dữ liệu từ form
    const rawData = {
        orderId: formData.get('orderId'),
        phone: formData.get('phone'),
    };

    // Validate dữ liệu
    const validationResult = TrackOrderSchema.safeParse(rawData);

    // Nếu validation thất bại, trả về lỗi ngay lập tức
    if (!validationResult.success) {
        return {
            errors: z.flattenError(validationResult.error).fieldErrors,
            message: 'Vui lòng kiểm tra lại thông tin.',
        };
    }

    const validatedData = validationResult.data;

    try {
        // Gọi hàm tìm kiếm đơn hàng trong database
        const order = await fetchOrderByIdAndPhone(validatedData.orderId, validatedData.phone);

        // Nếu không tìm thấy đơn hàng
        if (!order) {
            return {
                message: 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại thông tin.',
            };
        }

        return {
            success: true,
            message: "Đã tìm thấy đơn hàng",
            data: order
        }

        // Nếu tìm thấy, không trả về gì cả, chỉ redirect
    } catch (error) {
        console.error('Lỗi tra cứu đơn hàng:', error);
        return {
            message: 'Đã có lỗi từ server. Vui lòng thử lại.',
        };
    }
}