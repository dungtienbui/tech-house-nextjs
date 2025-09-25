import Pagination from "./type/pagination";
import PreviewCard from "../../components/preview-card/preview-card";
import { fetchRecommendedVariantsByKey, fetchRecommendedVariantsByKeyTotalPage } from "@/lib/data/fetch-data";

interface BaseProps {
    keyWord?: string;
    currentPage?: number;
    limit?: number;
}

export default async function RelevantProductList({
    keyWord,
    currentPage = 1,
    limit = 10,
}: BaseProps) {

    const productList = await fetchRecommendedVariantsByKey(
        keyWord ?? "",
        limit,
        currentPage,
    );

    const totalPages = await fetchRecommendedVariantsByKeyTotalPage(
        keyWord ?? "",
        limit,
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
                            variantId={product.variant_id}
                            key={`${product.variant_id}-${index}`}
                            title={`${product.brand_name}: ${product.product_name}`}
                            subtitle={subtitle}
                            price={product.variant_price.toString()}
                            navTo={`/products/${product.product_type}/${product.variant_id}`}
                            image={{
                                href: product.preview_image_url ?? "",
                                alt: product.preview_image_alt ?? `Image of ${product.brand_name}: ${product.product_name} product.`,
                            }}
                        />
                    );
                })}
            </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
    );
}
