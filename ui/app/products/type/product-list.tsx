import { fetchProductVariantsInShort, fetchProductVariantsInShortTotalPage } from "@/lib/data/fetch-data";
import { ProductType } from "@/lib/definations/types";
import PreviewCard from "@/ui/components/preview-card/preview-card";
import Pagination from "./pagination";

interface BaseProps {
    productType: ProductType;
    queries?: {
        param: string,
        value: string[],
    }[];
    currentPage?: number;
    isFeatureProduct?: boolean;
    limit?: number;
    layout: "horizontal" | "grid";
    title?: string;
    navigator?: { name: string; href: string };
}

export default async function ProductList({
    productType,
    queries,
    currentPage = 1,
    isFeatureProduct,
    limit = 10,
}: BaseProps) {

    const productList = await fetchProductVariantsInShort(
        productType,
        {
            isPromoting: isFeatureProduct,
            limit,
            currentPage,
        },
        queries
    );

    const totalPages = await fetchProductVariantsInShortTotalPage(
        productType,
        {
            limit: 10,
        },
        queries
    )

    // await wait(3000);

    return (
        <div className="flex flex-col gap-5 items-center">
            <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-5"
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
            <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
    );
}
