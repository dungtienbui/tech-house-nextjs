'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Star } from 'lucide-react';
import clsx from 'clsx';
import { ReviewFormState, submitReviewAction } from '@/lib/actions/review';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="bg-blue-500 text-white px-3 py-1 rounded-sm">
            {pending ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
    );
}

interface ReviewFormProps {
    variantId: string;
    orderId: string;
    productName: string;
    onFormSuccess: () => void; // Hàm để gọi khi gửi thành công (đóng modal)
}

export function ReviewForm({ variantId, orderId, productName, onFormSuccess }: ReviewFormProps) {
    const initialState: ReviewFormState = { success: false, message: '', errors: {} };
    const submitReviewWithIds = submitReviewAction.bind(null, variantId, orderId);
    const [state, formAction] = useActionState(submitReviewWithIds, initialState);

    const formRef = useRef<HTMLFormElement>(null);
    const [selectedRating, setSelectedRating] = useState(0);

    useEffect(() => {
        if (state.success) {
            alert(state.message); // Bạn có thể thay bằng toast
            onFormSuccess(); // Đóng modal
            formRef.current?.reset();
            setSelectedRating(0);
        } else if (state.message) {
            // Hiển thị lỗi chung (ví dụ: "Bạn đã đánh giá rồi")
            alert(`Lỗi: ${state.message}`);
        }
    }, [state, onFormSuccess]);

    return (
        <form ref={formRef} action={formAction} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">{productName}</h3>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá của bạn</label>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                        <Star
                            key={starValue}
                            size={28}
                            className={clsx(
                                "cursor-pointer transition-colors",
                                starValue <= selectedRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            )}
                            onClick={() => setSelectedRating(starValue)}
                        />
                    ))}
                    <input type="hidden" name="rating" value={selectedRating} required />
                </div>
                {state.errors?.rating && <p className="text-red-500 text-sm mt-1">{state.errors.rating[0]}</p>}
            </div>

            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Bình luận (tùy chọn)</label>
                <textarea name="comment" id="comment" placeholder="Chia sẻ cảm nhận..." rows={4} className="mt-1 w-full border border-gray-200 p-1 rounded-sm" />
                {state.errors?.comment && <p className="text-red-500 text-sm mt-1">{state.errors.comment[0]}</p>}
            </div>

            <SubmitButton />
        </form>
    );
}