'use client';

import { useState, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import RecommendedProductCard from "./recommend-product-card";
import clsx from "clsx";
import { Circle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { NO_PREVIEW, RecommendedVariantsInShortDTO } from "@/lib/definations/data-dto";

export default function SearchBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [recommendedVars, setRecommendedVars] = useState<RecommendedVariantsInShortDTO[]>([]);

    const [isLoading, setLoading] = useState(true);

    const [query, setQuery] = useState("");

    const fetchData = useDebouncedCallback(async () => {
        setLoading(true);
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data = await res.json() as RecommendedVariantsInShortDTO[];
        setRecommendedVars(data);
        setLoading(false);
    }, 500);

    const areaRef = useRef<HTMLDivElement>(null);

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

    const router = useRouter();
    const params = new URLSearchParams();

    const handleClickSearchSubmit = () => {

        params.set("query", query);

        const href = `/products?${params.toString()}`;

        router.push(href);

        setQuery("");
        setIsOpen(false);
    }

    return (
        <div ref={areaRef} className="relative w-full min-[800px]:flex-1 flex flex-col items-center order-last min-[800px]:order-none">
            <div className="relative w-full md:w-11/12 flex flex-row">
                <input
                    onChange={(e) => {
                        setQuery(e.target.value);
                        fetchData();
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                        fetchData();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleClickSearchSubmit();
                            (e.target as HTMLInputElement).blur();
                        }

                        if (e.key === "Tab") {
                            setIsOpen(false);
                        }
                    }}
                    value={query}
                    // onBlur={(e) => { }}
                    placeholder="Tìm kiếm..."
                    type="search"
                    className="w-full bg-gray-50 h-9 px-3 py-1 rounded-full"
                />
                <button onClick={handleClickSearchSubmit} type="button" className="absolute top-0 bottom-0 right-0 px-4 py-1 bg-yellow-300 rounded-r-full hover:cursor-pointer hover:bg-yellow-200">
                    <Search color="black" />
                </button>
            </div>

            <div className={clsx(
                "absolute p-3 top-11 w-full flex flex-col gap-2 border border-blue-300 ring ring-blue-500 rounded-xl bg-white shadow-2xl overflow-auto",
                {
                    "hidden": !isOpen,
                    "block": isOpen,

                }
            )}
            >
                {recommendedVars.length !== 0 ?
                    recommendedVars.map((rv) => {
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
                                    previewURL: rv.preview_image_url ?? NO_PREVIEW.href,
                                    previewAlt: rv.preview_image_alt ?? NO_PREVIEW.alt,
                                }}
                                callBackOnNavigate={() => setIsOpen(false)}
                            />
                        );
                    }) : query !== "" && (
                        <div className="text-center text-sm">
                            <div>Không tìm thấy sản phẩm liên quan.</div>
                            <div>Vui lòng nhập từ khoá khác.</div>
                        </div>
                    )}

                {isLoading && (
                    <div className="flex justify-center items-center gap-5">
                        <Circle className="w-3 h-3 animate-bounce" color="gray" />
                        <Circle className="w-3 h-3 animate-bounce" color="gray" />
                        <Circle className="w-3 h-3 animate-bounce" color="gray" />
                    </div>
                )}
            </div>
        </div>
    );
}
