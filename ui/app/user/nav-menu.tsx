'use client'

import clsx from "clsx";
import { ClipboardListIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


// Map of links to display in the side navigation.
const links = [
    {
        name: 'Đơn hàng đã mua',
        href: '/user/purchases',
        icon: ClipboardListIcon,
    },
    {
        name: 'Thông tin và sổ địa chỉ',
        href: '/user/profile',
        icon: MapPinIcon,
    },
];

export default function NavMenu() {

    const pathname = usePathname();

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-2" >
            {
                links.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link href={item.href}
                            key={item.href}
                            className={clsx(
                                "flex items-center space-x-3 p-3 rounded-md font-semibold",
                                {
                                    "bg-sky-100 text-blue-500": pathname === item.href
                                }
                            )}
                        >
                            <Icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })
            }
        </div >
    )
}