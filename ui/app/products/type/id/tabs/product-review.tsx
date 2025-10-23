import { fetchProductReviewsByVariantId } from "@/lib/data/fetch-data";
import ReviewItem from "./review-item"; // Giả sử ReviewItem đã có
import ProductReviewSummary from "./product-review-summary"; // Giả sử ProductReviewSummary đã có
import { ProductReviewDisplayDTO } from "@/lib/definations/data-dto"; // Đảm bảo import DTO

export default async function ProductReviews({ id }: { id: string }) {

    const reviews: ProductReviewDisplayDTO[] = await fetchProductReviewsByVariantId(id);

    if (reviews.length === 0) {
        return (
            <div className="flex justify-center p-10">
                <div className="text-center max-w-lg">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Sản phẩm chưa có đánh giá.</h4>
                    <p className="text-gray-500">
                        Nếu đã mua sản phẩm này tại Tech House, hãy đánh giá ngay để giúp hàng ngàn người chọn mua hàng tốt nhất bạn nhé!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-5 md:p-10">
            <div className="flex flex-col md:flex-row md:space-x-8">

                <div className="w-full md:w-1/2 mb-8 md:mb-0">
                    <div className="md:sticky md:top-20">
                        <ProductReviewSummary reviews={reviews} />
                    </div>
                </div>

                <div className="w-full md:w-1/2 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
                        Tất cả đánh giá ({reviews.length})
                    </h2>

                    {reviews.map((item) => (
                        <ReviewItem key={item.review_id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}