'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductVariantDTO } from '../definations/data-dto';

const fetchVariantsByIds = async (ids: string[]): Promise<ProductVariantDTO[]> => {
    if (!ids || ids.length === 0) {
        return [];
    }

    const response = await fetch("/api/products/variants", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
        throw new Error("Lỗi khi lấy thông tin sản phẩm");
    }

    return response.json();
};

export function useVariantsByIds(ids: string[]) {
    return useQuery({
        /**
         * Đây là phần quan trọng nhất. Query key phải chứa cả các ID
         * để React Query biết rằng nếu mảng ID thay đổi, nó cần fetch lại dữ liệu.
         */
        queryKey: ['products', ids.sort()], // Sắp xếp ID để đảm bảo thứ tự không ảnh hưởng đến cache

        /**
         * Hàm sẽ được thực thi để lấy dữ liệu.
         */
        queryFn: () => fetchVariantsByIds(ids),

        /**
         * Tùy chọn tối ưu: Chỉ kích hoạt query này khi có ít nhất một ID.
         * Điều này ngăn việc gọi API với một mảng rỗng.
         */
        enabled: ids.length > 0,
    });
}