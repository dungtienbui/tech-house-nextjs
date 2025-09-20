import { ProductType } from "@/app/lib/definations/types";
import ProductCard from "./product-card";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { fetchProductVariantsInShort } from "@/app/lib/data/fetch-data";

interface BaseProps {
    productType: ProductType;
    query?: { key: string; value: string }[];
    currentPage?: number;
    isFeatureProduct?: boolean;
    limit?: number;
    layout: "horizontal" | "grid";
    title?: string;
    navigator?: { name: string; href: string };
}

export default async function ProductListBase({
    productType,
    query,
    currentPage,
    isFeatureProduct,
    limit,
    layout,
    title,
    navigator,
}: BaseProps) {
    const productList = await fetchProductVariantsInShort(productType, {
        isPromoting: isFeatureProduct,
        limit,
    });

    return (
        <div className="w-full py-3 lg:py-5 px-4 lg:px-10">
            {/* Tiêu đề và navigator chỉ render nếu có */}
            {title && (
                <div className="mb-3">
                    <div className="flex flex-row justify-between items-end">
                        <div className="font-bold">{title}</div>
                        {navigator && (
                            <Link
                                href={isFeatureProduct ? `${navigator.href}?featured=true` : navigator.href}
                            >
                                <div className="flex flex-row items-center text-blue-400 hover:text-blue-500 hover:font-bold duration-200">
                                    <div>{navigator.name}</div>
                                    <ChevronRightIcon className="w-6" />
                                </div>
                            </Link>
                        )}
                    </div>
                    <div className="min-w-60 max-w-1/5 h-0 border border-sky-700"></div>
                </div>
            )}

            <div
                className={
                    layout === "horizontal"
                        ? "overflow-x-scroll grid grid-flow-col auto-cols-min gap-2 md:gap-5"
                        : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-5"
                }
            >
                {productList.map((product, index) => {
                    const subtitle =
                        "(" +
                        [
                            product.ram && `${product.ram}GB`,
                            product.storage && `${product.storage}GB`,
                            product.color_name && `${product.color_name}`,
                            product.switch_type && `${product.switch_type} switch`,
                        ]
                            .filter(Boolean)
                            .join("/") +
                        ")";
                    return (
                        <ProductCard
                            key={`${product.variant_id}-${index}`}
                            title={product.product_name}
                            subtitle={subtitle}
                            price={product.variant_price.toString()}
                            navTo={`/products/${productType}/${product.variant_id}`}
                            image={{
                                href: product.preview_image_url ?? "",
                                alt: product.preview_image_url ?? product.preview_image_caption ?? "",
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
