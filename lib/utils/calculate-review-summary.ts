import { ProductReviewDisplayDTO } from "@/lib/definations/data-dto";

// Định nghĩa kiểu dữ liệu cho đầu ra của hàm tính toán
export interface ReviewSummaryData {
    averageRating: number;
    totalReviews: number;
    satisfactionCount: string; // "6.5k" hoặc số tương tự
    ratingDistribution: {
        star: number;
        count: number;
        percentage: number;
    }[];
}

/**
 * Tính toán các số liệu tổng hợp từ danh sách các đánh giá sản phẩm.
 * @param reviews Mảng các đánh giá sản phẩm.
 * @returns Đối tượng chứa điểm trung bình, tổng số đánh giá, số lượng khách hàng hài lòng và phân bố đánh giá.
 */
export function calculateReviewSummary(
    reviews: ProductReviewDisplayDTO[]
): ReviewSummaryData {
    if (!reviews || reviews.length === 0) {
        return {
            averageRating: 0,
            totalReviews: 0,
            satisfactionCount: "0",
            ratingDistribution: Array(5).fill(0).map((_, i) => ({
                star: 5 - i, // 5, 4, 3, 2, 1
                count: 0,
                percentage: 0,
            })),
        };
    }

    let totalRating = 0;
    const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const totalReviews = reviews.length;

    reviews.forEach(review => {
        totalRating += review.rating;
        if (review.rating >= 1 && review.rating <= 5) {
            ratingCounts[review.rating]++;
        }
    });

    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    const ratingDistribution = Array(5).fill(0).map((_, i) => {
        const star = 5 - i; // Đảm bảo thứ tự 5, 4, 3, 2, 1
        const count = ratingCounts[star] || 0;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        return {
            star,
            count,
            percentage: parseFloat(percentage.toFixed(1)), // Làm tròn 1 chữ số thập phân
        };
    });

    // Ví dụ về số khách hàng hài lòng (có thể điều chỉnh logic này)
    // Giả sử hài lòng là rating >= 4
    const satisfiedCustomers = reviews.filter(r => r.rating >= 4).length;

    // Format số lượng khách hàng hài lòng (ví dụ: 6500 -> 6.5k)
    const formatCount = (num: number): string => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };

    return {
        averageRating: parseFloat(averageRating.toFixed(1)), // Làm tròn 1 chữ số thập phân
        totalReviews,
        satisfactionCount: formatCount(satisfiedCustomers),
        ratingDistribution,
    };
}