import { ProductTypeSchema } from "@/lib/definations/types";
import { ProductTabSkeleton } from "@/ui/app/products/type/id/tabs/product-tab-skeleton";
import ProductSpecs from "@/ui/app/products/type/id/tabs/product-specs";
import { Suspense } from "react";

export default async function SpecsPage({
    params,
}: {
    params: Promise<{ type: string, id: string }>
}) {
    const { id, type } = await params;

    const typeParse = ProductTypeSchema.safeParse(type);

    return (
        <Suspense fallback={<ProductTabSkeleton />}>
            <ProductSpecs type={typeParse.success ? typeParse.data : null} id={id} />
        </Suspense>
    );
}