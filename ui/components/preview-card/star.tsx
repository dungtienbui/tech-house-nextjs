import React from 'react';

interface StarProps {
    fillPercentage: number; // Tỷ lệ tô màu của ngôi sao (0 đến 100)
    size?: number; // Kích thước của ngôi sao (mặc định 20)
    color?: string; // Màu của ngôi sao (mặc định vàng)
}

export default function Star({
    fillPercentage,
    size = 20,
    color = "#ffcd3c"
}: StarProps) {
    // Đảm bảo fillPercentage nằm trong khoảng từ 0 đến 100
    const actualFill = Math.max(0, Math.min(100, fillPercentage));

    // Kích thước SVG
    const width = size;
    const height = size;

    // Đường dẫn SVG của một ngôi sao 5 cánh (pentagram)
    const starPath = "M10 15l-5.878 3.09 1.123-6.545L.487 7.03l6.56-.955L10 0l2.953 6.075 6.56.955-4.758 4.505 1.123 6.545z";

    return (
        <svg
            className="inline-block align-middle" // Đảm bảo căn chỉnh tốt trong dòng văn bản
            width={width}
            height={height}
            viewBox="0 0 20 20" // Viewbox gốc của đường dẫn ngôi sao
            fill="none" // Không fill mặc định
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Ngôi sao nền (màu xám nhạt) */}
            <path
                d={starPath}
                fill="#e5e7eb" // Tailwind gray-200
            />

            {/* Ngôi sao phủ (màu vàng), được cắt theo fillPercentage */}
            <defs>
                <clipPath id="star-clip">
                    <rect x="0" y="0" width={actualFill / 100 * 20} height="20" /> {/* Cắt theo chiều ngang */}
                </clipPath>
            </defs>
            <path
                d={starPath}
                fill={color} // Màu ngôi sao chính
                clipPath="url(#star-clip)"
            />
        </svg>
    );
};