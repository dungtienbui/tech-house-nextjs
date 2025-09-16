import ProductInfomation from "@/ui/app/product-list/product-detail/product-infomation";
import ProductOverview from "@/ui/app/product-list/product-detail/product-overview";

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    console.log("Product id: ", id);

    return (
        <div className="px-2 sm:px-5 md:px-10 mt-5 flex flex-col gap-10 mb-10 md:mb-20">
            <ProductOverview />
            <ProductInfomation />
        </div>
    )
}