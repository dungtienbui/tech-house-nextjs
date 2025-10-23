import { ProductType } from "@/lib/definations/types";
import { getConvertKeyProductTypeToVN } from "@/lib/utils/types";
import { ChevronRightIcon } from "lucide-react";
import PreviewCard from "../components/preview-card/preview-card";
import Link from "next/link";
import { fetchVariants } from "@/lib/data/fetch-data";
import { NO_PREVIEW } from "@/lib/definations/data-dto";


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

    const productList = await fetchVariants(productType, {
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
                    const title = `${product.brand.brand_name}: ${product.product_name}`;
                    const subtitle =
                        "(" +
                        [
                            product.ram && `${product.ram}GB`,
                            product.storage && `${product.storage}GB`,
                            `${product.color.color_name}`,
                            product.switch_type && `${product.switch_type} switch`,
                        ]
                            .filter(Boolean)
                            .join("/") +
                        ")";
                    return (
                        <PreviewCard
                            variantId={product.variant_id}
                            key={`${product.variant_id}-${index}`}
                            title={title}
                            subtitle={subtitle}
                            price={product.variant_price.toString()}
                            navTo={`/products/${productType}/${product.variant_id}`}
                            image={{
                                href: product.preview_image.image_url ?? NO_PREVIEW.href,
                                alt: product.preview_image.image_alt ?? product.preview_image.image_caption ?? NO_PREVIEW.alt,
                            }}
                            review={product.review}
                        />
                    );
                })}
            </div>
        </div>
    );
}
