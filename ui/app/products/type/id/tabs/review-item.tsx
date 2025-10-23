import { ProductReviewDisplayDTO } from "@/lib/definations/data-dto";
import StarRating from "./star-rating";

export default function ReviewItem({ item }: { item: ProductReviewDisplayDTO }) {
    const formattedDate = item.created_at.toLocaleDateString("vi-VN");

    return (
        <div className="p-2 border border-gray-200 rounded-lg shadow-sm z-0">
            <div className="font-semibold text-sm text-gray-800 mb-1">
                {item.user_name}
            </div>
            <div>
                <StarRating rating={item.rating} onlyStar />
            </div>

            {item.comment && (
                <p className="text-gray-700 leading-relaxed">
                    {item.comment}
                </p>
            )}

            {!item.comment && (
                <p className="text-gray-500 text-sm">
                    (Người dùng không để lại bình luận)
                </p>
            )}
            <div className="text-sm text-gray-500">
                {formattedDate}
            </div>
        </div>
    );
}