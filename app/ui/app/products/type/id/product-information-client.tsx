'use client'

import clsx from "clsx";
import { useState } from "react";

const tabs: {
    id: "description" | "specs" | "reviews";
    label: string;
}[] = [
        { id: "description", label: "MÔ TẢ" },
        { id: "specs", label: "THÔNG SỐ KĨ THUẬT" },
        { id: "reviews", label: "ĐÁNH GIÁ" },
    ];


export function ProductInformationClientComponent({
    description,
    review,
    specs
}: {
    description: string;
    review: string;
    specs: {
        name: string;
        value: string;
    }[]
}) {

    const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
    const handleButtonClick = (tab: "description" | "specs" | "reviews") => {
        if (tab !== activeTab) {
            setActiveTab(tab);
        }
    }

    return (
        <div className="flex flex-col gap-1 sm:gap-2 md:gap-5">
            <div className="w-full">
                <div className="flex flex-row justify-center gap-10 items-stretch">
                    <div className="hidden md:block flex-1" />
                    {tabs.map((tab) => {
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                className={clsx(
                                    "uppercase duration-300 min-w-fit",
                                    {
                                        "border-b-2 border-sky-300 font-bold": activeTab === tab.id,
                                        "text-gray-500 hover:text-black": activeTab !== tab.id,
                                        "flex-1 sm:flex-2": tab.id === "specs",
                                        "flex-1": tab.id !== "specs",
                                    },
                                )}
                                onClick={() => handleButtonClick(tab.id)}
                            >{tab.label}</button>
                        )
                    })}
                    <div className="hidden sm:block flex-1" />
                </div>
                <div className="w-full h-0 border-t border-gray-300" />
            </div>
            <div className="px-5 lg:px-15 xl:px-32">
                {activeTab === "description" ? (
                    <DescriptionTab description={description} />
                ) : activeTab === "reviews" ? (
                    <ReviewsTab reviews={review} />
                ) : (
                    <SpecsTab specs={specs} />
                )}
            </div>
        </div>
    );
}

function DescriptionTab({ description }: { description: string }) {
    return (
        <div className="w-full min-h-64 border border-gray-300 rounded-xl p-5 md:p-10 bg-white shadow-lg">{description}</div>
    )
}

function ReviewsTab({ reviews }: { reviews: string }) {
    return (
        <div className="w-full min-h-64 border border-gray-300 rounded-xl p-5 md:p-10 bg-white shadow-lg">{reviews}</div>
    )
}

function SpecsTab({ specs }: { specs: { name: string, value: string }[] }) {

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-y-2 sm:gap-x-10 sm:gap-y-5">
            {specs.map((spec) => {
                return (
                    <div
                        key={spec.name}
                        className="lg:flex lg:flex-row lg:justify-between lg:gap-5 px-5 py-2 md:px-10 md:py-3 border border-gray-300  rounded-xl"
                    >
                        <div className="inline lg:block font-bold">{`${spec.name}: `}</div>
                        <div className="inline lg:block">{spec.value}</div>
                    </div>
                )
            })}

        </div>
    )
}
