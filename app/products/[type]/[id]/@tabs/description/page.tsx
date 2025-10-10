import ProductDescription from "@/ui/app/products/type/id/tabs/product-description";
import { ProductTabSkeleton } from "@/ui/app/products/type/id/tabs/product-tab-skeleton";
import { Suspense } from "react";

export default async function DescriptionPage({
    params,
}: {
    params: Promise<{ type: string, id: string }>
}) {

    const { id } = await params;

    return (
        <Suspense fallback={<ProductTabSkeleton />}>
            <ProductDescription id={id} />
        </Suspense>
    );
}