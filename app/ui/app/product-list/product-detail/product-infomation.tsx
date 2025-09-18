'use client'

import { Color, PhoneSpecification } from "@/lib/definations/product";
import { phoneSpecs, products } from "@/lib/definations/product-example-data";
import { specsObjectToArray } from "@/lib/utils/products";
import clsx from "clsx";
import { notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const tabs: {
    id: "description" | "specs" | "reviews";
    label: string;
}[] = [
        { id: "description", label: "MÔ TẢ" },
        { id: "specs", label: "THÔNG SỐ KĨ THUẬT" },
        { id: "reviews", label: "ĐÁNH GIÁ" },
    ];

interface props {
    id: string;
}

export default function ProductInformation({ id }: props) {

    const product = products.find(item => item.id === id);

    if (!product) {
        notFound();
    }

    const phoneSpec = phoneSpecs.find(item => item.productId === product.productId);

    console.log("phoneSpec: ", phoneSpec);

    if (!phoneSpec) {
        notFound();
    }

    const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
    const handleButtonClick = (tab: "description" | "specs" | "reviews") => {
        if (tab !== activeTab) {
            setActiveTab(tab);
        }
    }

    return (
        <div className="flex flex-col gap-2 sm:gap-5 md:gap-10">
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
                    <DescriptionTab description={product.description} />
                ) : activeTab === "reviews" ? (
                    <ReviewsTab reviews={"Reviews Tab"} />
                ) : (
                    <SpecsTab specs={phoneSpec} />
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

function SpecsTab({ specs }: { specs: PhoneSpecification }) {

    const specsArray = specsObjectToArray(specs);

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-y-2 sm:gap-x-10 sm:gap-y-5">
            {specsArray.map((spec) => {
                return (
                    <div
                        key={spec.key}
                        className="lg:flex lg:flex-row lg:justify-between lg:gap-5 px-5 py-2 md:px-10 md:py-3 border border-gray-300  rounded-xl"
                    >
                        <div className="inline lg:block font-bold">{`${spec.specsVN}: `}</div>
                        <div className="inline lg:block">{spec.specs}</div>
                    </div>
                )
            })}

        </div>
    )
}
