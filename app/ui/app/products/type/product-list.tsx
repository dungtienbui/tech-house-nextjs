import { ProductType } from "@/app/lib/definations/types";
import { fetchProductVariantsInShort } from "@/app/lib/data/fetch-data";
import PreviewCard from "../../../components/preview-card/preview-card";

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

export default async function ProductList({
    productType,
    query,
    currentPage,
    isFeatureProduct,
    limit,
}: BaseProps) {

    const productList = await fetchProductVariantsInShort(productType, {
        isPromoting: isFeatureProduct,
        limit,
    });

    return (
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
    );
}
