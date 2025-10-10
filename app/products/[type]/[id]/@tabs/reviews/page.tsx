import { ProductTabSkeleton } from "@/ui/app/products/type/id/tabs/product-tab-skeleton";
import ProductReviews from "@/ui/app/products/type/id/tabs/product-review";
import { Suspense } from "react";

export default function ReviewsPage() {
    return (
        <Suspense fallback={<ProductTabSkeleton />}>
            <ProductReviews />
        </Suspense>);
}