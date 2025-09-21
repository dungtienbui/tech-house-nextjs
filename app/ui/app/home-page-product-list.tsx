import { ProductType } from "@/app/lib/definations/types";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { fetchProductVariantsInShort } from "@/app/lib/data/fetch-data";
import { getConvertKeyProductTypeToVN } from "@/app/lib/utils/types";
import PreviewCard from "../components/preview-card/preview-card";

interface BaseProps {
    productType: ProductType;
    limit?: number;
    title?: string;
    navigator: { name: string; href: string };
}

export default async function HomePageProductList({
    productType,
    limit,
    navigator,
}: BaseProps) {

    const productList = await fetchProductVariantsInShort(productType, {
        isPromoting: true,
        limit,
    });

    return (
        <div className="w-full px-4">
            <div className="mb-3">
                <div className="flex flex-row justify-between items-end">
                    <div className="font-bold">{`${getConvertKeyProductTypeToVN(productType)} nổi bật`}</div>
                    <Link
                        href={`${navigator.href}?featured=true`}
                    >
                        <div className="flex flex-row items-center text-blue-400 hover:text-blue-500 hover:font-bold duration-200">
                            <div>{navigator.name}</div>
                            <ChevronRightIcon className="w-6" />
                        </div>
                    </Link>
                </div>
                <div className="min-w-60 max-w-1/5 h-0 border border-sky-700"></div>
            </div>
            <div
                className="overflow-x-scroll grid grid-flow-col auto-cols-min gap-2 md:gap-5 pb-3"
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
                        <PreviewCard
                            key={`${product.variant_id}-${index}`}
                            title={`${product.brand_name}: ${product.product_name}`}
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
