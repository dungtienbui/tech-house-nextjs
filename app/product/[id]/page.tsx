import { phoneSpecs, products, productVariants } from "@/lib/definations/product-example-data";
import ProductOverview from "@/ui/app/product-list/product-detail/product-overview";

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    console.log("Product id: ", id);

    return (
        <div className="px-10 mt-5">
            <ProductOverview />
        </div>
    )
}