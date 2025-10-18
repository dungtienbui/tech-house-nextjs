'use server';

import z from 'zod';
import { revalidatePath } from 'next/cache';
import { insertProductReview } from '@/lib/data/insert-data'; // Hàm bạn đã cung cấp
import { auth } from '@/auth';
import { purchaseCheck } from '../data/fetch-data';

// Schema Zod để validate form
const ReviewSchema = z.object({
    rating: z.coerce.number().min(1, 'Vui lòng chọn ít nhất 1 sao.'),
    comment: z.string().max(500, 'Bình luận quá dài.').optional().nullable(),
});

// Kiểu trạng thái trả về của action
export type ReviewFormState = {
    success: boolean;
    message?: string;
    errors?: {
        rating?: string[];
        comment?: string[];
    };
};

export async function submitReviewAction(
    variantId: string,
    orderId: string,
    prevState: ReviewFormState,
    formData: FormData
): Promise<ReviewFormState> {

    const session = await auth();

    const userId = session?.user.id;

    if (!userId) {
        return { success: false, message: 'Bạn cần đăng nhập để đánh giá.' };
    }

    // 1. Validate dữ liệu form
    const validatedFields = ReviewSchema.safeParse({
        rating: formData.get('rating'),
        comment: formData.get('comment'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: z.flattenError(validatedFields.error).fieldErrors,
        };
    }
    const { rating, comment } = validatedFields.data;

    try {
        // 2. Xác thực quyền: Kiểm tra xem người dùng có thực sự đã mua sản phẩm này

        const check = await purchaseCheck(orderId, variantId, userId);

        if (!check) {
            return { success: false, message: 'Bạn chỉ có thể đánh giá sản phẩm đã được mua.' };
        }

        // 3. Ghi vào database (hàm này đã có UNIQUE constraint)
        await insertProductReview({
            user_id: userId,
            variant_id: variantId,
            order_id: orderId,
            rating: rating,
            comment: comment,
        });

        // 4. Cập nhật cache
        revalidatePath(`/user/purchase/${orderId}`); // Làm mới trang chi tiết đơn hàng
        // revalidatePath(`/products/...`); // Làm mới trang sản phẩm nếu cần

        return { success: true, message: 'Cảm ơn bạn đã đánh giá!' };

    } catch (error: any) {
        // Xử lý lỗi UNIQUE constraint (nếu người dùng đã review rồi)
        if (error.code === '23505') { // Mã lỗi của PostgreSQL cho UNIQUE violation
            return { success: false, message: 'Bạn đã đánh giá sản phẩm này cho đơn hàng này rồi.' };
        }
        console.error('Lỗi khi gửi đánh giá:', error);
        return { success: false, message: 'Đã xảy ra lỗi. Vui lòng thử lại.' };
    }
}