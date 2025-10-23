import { Star } from "lucide-react";
import React from "react";

// Kích thước mặc định của ngôi sao
const STAR_SIZE = 18;

// Màu sắc
const FULL_STAR_COLOR = "#FFCD3C"; // Màu vàng (yellow-400)
const EMPTY_STAR_COLOR = "#C0C0C0"; // Màu xám nhạt

/**
 * Hiển thị điểm đánh giá (rating) bằng các ngôi sao, hỗ trợ giá trị thập phân.
 * * @param rating Điểm đánh giá (float) từ 1.00 đến 5.00
 */
const StarRating: React.FC<{ rating: number, onlyStar?: boolean }> = ({ rating, onlyStar }) => {
    // Làm tròn rating đến 1 chữ số thập phân để hiển thị
    const roundedRating = Math.round(rating * 10) / 10;
    const stars = Array(5).fill(0);

    return (
        <div className="flex items-center space-x-0.5">
            {stars.map((_, index) => {
                const starValue = index + 1; // Giá trị của ngôi sao hiện tại (1, 2, 3, 4, 5)
                let color = EMPTY_STAR_COLOR;
                let clipPath = 'none'; // Dùng để tô màu một phần

                if (rating >= starValue) {
                    // Ngôi sao đầy đủ
                    color = FULL_STAR_COLOR;
                } else if (rating > index && rating < starValue) {
                    // Ngôi sao tô màu một phần

                    // Tính tỷ lệ tô màu (ví dụ: rating 3.5 cho ngôi sao thứ 4 (index=3): 3.5 - 3 = 0.5)
                    const fractionalPart = rating - index;

                    // Tính phần trăm tô màu theo chiều ngang (clipPath)
                    const fillPercentage = fractionalPart * 100;

                    // Sử dụng clip-path để chỉ hiển thị phần tô màu
                    // Clip path sử dụng viewbox của icon, giả định viewbox là 24x24
                    clipPath = `inset(0 ${100 - fillPercentage}% 0 0)`;

                    // Đặt màu ngôi sao phủ là màu vàng
                    color = FULL_STAR_COLOR;
                } else {
                    // Ngôi sao rỗng
                    color = EMPTY_STAR_COLOR;
                }

                // --- CUSTOM STAR COMPONENT ---
                // Vì icon Star từ Lucide-react không hỗ trợ clip-path trực tiếp qua props, 
                // cách đơn giản nhất là render hai icon Star (nền và phủ) 
                // hoặc sử dụng CSS modules/Tailwind JIT để áp dụng style/clipPath động.

                // Ở đây, ta sẽ sử dụng kỹ thuật CSS để tạo ra hiệu ứng tô màu một phần.
                // Do hạn chế của việc sử dụng icon component, ta phải dùng Div bọc
                // để áp dụng màu nền (ngôi sao rỗng) và màu phủ (ngôi sao đầy).

                return (
                    <div
                        key={index}
                        style={{ width: STAR_SIZE, height: STAR_SIZE, position: 'relative' }}
                    >
                        {/* 1. Ngôi sao nền (luôn là màu xám) */}
                        <Star
                            size={STAR_SIZE}
                            fill={EMPTY_STAR_COLOR}
                            strokeWidth={0}
                            className="absolute top-0 left-0"
                        />

                        {/* 2. Ngôi sao phủ (chỉ hiển thị phần tô màu) */}
                        {rating > index && (
                            <Star
                                size={STAR_SIZE}
                                fill={FULL_STAR_COLOR}
                                strokeWidth={0}
                                className="absolute top-0 left-0"
                                style={{
                                    // Áp dụng clipping cho ngôi sao phủ
                                    clipPath: clipPath !== 'none'
                                        ? `inset(0 ${100 - (rating - index) * 100}% 0 0)`
                                        : 'none',
                                    // Đảm bảo ngôi sao đầy đủ không bị cắt (nếu clipPath là 'none')
                                    width: rating >= starValue ? STAR_SIZE : undefined,
                                }}
                            />
                        )}
                    </div>
                );
            })}

            {!onlyStar && <span className="ml-2 text-sm font-semibold text-gray-700">
                {roundedRating} / 5
            </span>}
        </div>
    );
};

export default StarRating;