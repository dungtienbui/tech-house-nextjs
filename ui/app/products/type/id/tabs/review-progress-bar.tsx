// components/ReviewProgressBar.tsx
import React from 'react';
import { Star } from 'lucide-react'; // Sử dụng icon Star từ lucide-react

interface ReviewProgressBarProps {
    star: number; // Mức sao (1-5)
    percentage: number; // Phần trăm đánh giá cho mức sao này
}

const ReviewProgressBar: React.FC<ReviewProgressBarProps> = ({ star, percentage }) => {
    return (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
            {/* Số sao */}
            <div className="w-4 text-right font-medium text-gray-800">
                {star}
            </div>

            {/* Icon Star */}
            <Star className="h-4 w-4 text-orange-400 fill-orange-400 stroke-0" /> {/* Fill màu cam như ảnh */}

            {/* Thanh tiến trình */}
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" // Màu xanh như ảnh
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            {/* Phần trăm */}
            <div className="w-10 text-right font-medium text-gray-800">
                {percentage.toFixed(0)}% {/* Làm tròn 0 chữ số thập phân cho phần trăm hiển thị */}
            </div>
        </div>
    );
};

export default ReviewProgressBar;