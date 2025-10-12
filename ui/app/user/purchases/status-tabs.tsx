'use client'

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const links = [
    {
        name: 'Tất cả',
        query: 'total',
    },
    {
        name: 'Chờ xử lý',
        query: 'pending',
    },
    {
        name: 'Đã xác nhận',
        query: 'confirmed',
    },
    {
        name: 'Đang chuyển hàng',
        query: 'shipping',
    },
    {
        name: 'Đã giao hàng',
        query: 'delivered',
    },
    {
        name: 'Thành công',
        query: 'completed',
    },
    {
        name: 'Đã hủy',
        query: 'cancelled',
    },
];

export default function StatusTabs() {
    const pathname = usePathname();

    const searchParam = useSearchParams();

    const url = new URLSearchParams(searchParam);

    const currStatusSearchParam = searchParam.get("status") ?? "total";

    return (
        <div className="flex space-x-1 sm:space-x-4 mb-6 text-sm text-nowrap overflow-x-scroll">
            {
                links.map((item) => {

                    url.set("status", item.query);

                    return (
                        <Link
                            key={item.query}
                            href={`${pathname}?${url.toString()}`}
                            className={clsx(
                                "py-2 px-1 sm:px-4 font-semibold",
                                {
                                    "text-blue-500 border-2 border-blue-500": currStatusSearchParam === item.query,
                                    "text-gray-500 border-2 border-gray-500": currStatusSearchParam !== item.query,

                                }
                            )}
                        >
                            {item.name}
                        </Link>
                    )
                })
            }

        </div >
    );
}