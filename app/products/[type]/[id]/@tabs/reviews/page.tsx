import { ProductTabSkeleton } from "@/ui/app/products/type/id/tabs/product-tab-skeleton";
import ProductReviews from "@/ui/app/products/type/id/tabs/product-review";
import { Suspense } from "react";

export default async function ReviewsPage({
    params,
}: {
    params: Promise<{ type: string, id: string }>
}) {

    const { id } = await params;

    return (
        <Suspense fallback={<ProductTabSkeleton />}>
            <ProductReviews id={id} />
        </Suspense>);
}