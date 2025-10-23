// components/ProductReviewSummary.tsx
import React from 'react';
import { Star, HelpCircle } from 'lucide-react'; // Import HelpCircle
import { ProductReviewDisplayDTO } from '@/lib/definations/data-dto';
import { ReviewSummaryData, calculateReviewSummary } from '@/lib/utils/calculate-review-summary';
import ReviewProgressBar from './review-progress-bar';

interface ProductReviewSummaryProps {
    reviews: ProductReviewDisplayDTO[]; // Mảng các đánh giá sản phẩm
}

const ProductReviewSummary: React.FC<ProductReviewSummaryProps> = ({ reviews }) => {
    const summary: ReviewSummaryData = calculateReviewSummary(reviews);

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center p-6 bg-white rounded-lg shadow-sm border border-gray-200 gap-8">
            <div className="flex-shrink-0 w-full md:w-1/3 text-center md:text-left text-nowrap">
                <div className="flex items-center justify-center md:justify-start mb-2">
                    <Star className="h-10 w-10 text-orange-400 fill-orange-400 stroke-0 mr-2" />
                    <span className="text-5xl font-bold text-gray-900 leading-none">
                        {summary.averageRating.toFixed(1)}
                    </span>
                    <span className="text-xl text-gray-500 self-end mb-1">/5</span>
                </div>

                <p className="text-gray-600 mb-1 flex items-center justify-center md:justify-start">
                    <span className="font-semibold">{summary.satisfactionCount}</span>&nbsp;
                    khách hài lòng
                    <HelpCircle className="h-4 w-4 text-gray-400 ml-1 cursor-pointer" />
                </p>
                <p className="text-sm text-gray-500">
                    {summary.totalReviews} đánh giá
                </p>
            </div>
            <div className="flex-grow w-full md:w-2/3 space-y-2">
                {summary.ratingDistribution.map((dist) => (
                    <ReviewProgressBar
                        key={dist.star}
                        star={dist.star}
                        percentage={dist.percentage}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductReviewSummary;