'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export default function TabNavigation() {

    const tabs: {
        id: "description" | "specifications" | "reviews";
        label: string;
    }[] = [
            { id: "description", label: "MÔ TẢ" },
            { id: "specifications", label: "THÔNG SỐ KĨ THUẬT" },
            { id: "reviews", label: "ĐÁNH GIÁ" },
        ];

    const { id, type } = useParams();

    const pathname = usePathname();

    const tabsParam = pathname.split("/").pop();

    const activeTab = (tabsParam === "specifications" || tabsParam === "description" || tabsParam === "reviews") ? tabsParam : "description";

    return (
        <div className="w-full">
            <div className="flex flex-row justify-center gap-10 items-stretch">
                <div className="hidden md:block flex-1" />
                {tabs.map((tab) => {
                    return (
                        <Link
                            key={tab.id}
                            className={clsx(
                                "uppercase duration-300 min-w-fit text-center",
                                {
                                    "border-b-2 border-sky-300 font-bold": activeTab === tab.id,
                                    "text-gray-500 hover:text-black": activeTab !== tab.id,
                                    "flex-1 sm:flex-2": tab.id === "specifications",
                                    "flex-1": tab.id !== "specifications",
                                }
                            )} href={`/products/${type}/${id}/${tab.id}`}
                        >{tab.label}</Link>
                    )
                })}
                <div className="hidden sm:block flex-1" />
            </div>
            <div className="w-full h-0 border-t border-gray-300" />
        </div>
    );
}