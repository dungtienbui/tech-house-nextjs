'use client';

import { useState, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import RecommendedProductCard from "./recommend-product-card";
import { RecommendedVariantsInShortDTO } from "@/app/lib/definations/data-dto";
import clsx from "clsx";
import { Circle } from "lucide-react";

export default function SearchBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [recommendedVars, setRecommendedVars] = useState<RecommendedVariantsInShortDTO[]>([]);

    const [isLoading, setLoading] = useState(false);

    const fetchData = useDebouncedCallback(async (term: string) => {
        const res = await fetch(`/api/search?query=${encodeURIComponent(term)}`);
        const data = await res.json() as RecommendedVariantsInShortDTO[];
        setRecommendedVars(data);
        setLoading(false);
    }, 500);

    const areaRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (areaRef.current && !areaRef.current.contains(target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={areaRef} className="relative w-full min-[800px]:flex-1 flex flex-col items-center order-last min-[800px]:order-none">
            <input
                onChange={(e) => {
                    setLoading(true);
                    fetchData(e.target.value);
                }}
                onFocus={() => {
                    setLoading(true);
                    setIsOpen(true);
                    fetchData("");
                }}
                placeholder="Tìm kiếm..."
                type="search"
                className="bg-gray-50 w-full md:w-11/12 px-3 py-1 rounded-full"
            />

            <div className={clsx(
                "absolute p-3 top-9 w-full flex flex-col gap-2 border border-blue-300 rounded-xl bg-white shadow-2xl overflow-auto",
                {
                    "hidden": !isOpen,
                    "block": isOpen,

                }
            )}
            >
                {recommendedVars.map((rv) => {
                    const optionStr = [
                        rv.ram ? `${rv.ram}GB` : null,
                        rv.storage ? `${rv.storage}GB` : null,
                        rv.switch_type ? `${rv.switch_type} switch` : null,
                        rv.color_name,
                    ]
                        .filter(Boolean)
                        .join("/");
                    const name = `${rv.brand_name} ${rv.product_name} ${optionStr}`;
                    const href = `/products/${rv.product_type}/${rv.variant_id}`
                    return (
                        <RecommendedProductCard
                            key={rv.variant_id}
                            name={name}
                            href={href}
                            price={rv.variant_price}
                            preview={{
                                previewURL: rv.preview_image_url ?? "https://placehold.co/100x100.png?text=No+Preview",
                                previewAlt: rv.preview_image_alt ?? "No preview image",
                            }}
                            callBackOnNavigate={() => setIsOpen(false)}
                        />
                    );
                })}
                <div className={clsx(
                    "text-center",
                    {
                        "hidden": !isLoading,
                        "block": isLoading,
                    }
                )}>
                    <div className="flex justify-center items-center gap-5">
                        <Circle className="w-3 h-3 animate-bounce" color="gray" />
                        <Circle className="w-3 h-3 animate-bounce" color="gray" />
                        <Circle className="w-3 h-3 animate-bounce" color="gray" />
                    </div>
                </div>
            </div>
        </div>
    );
}
