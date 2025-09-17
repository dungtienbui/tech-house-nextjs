import CarouselSkeleton from "@/ui/app/components/embla-carousel/carousel-skeleton";
import ProductInfomation from "@/ui/app/product-list/product-detail/product-infomation";
import ProductOverview from "@/ui/app/product-list/product-detail/product-overview";
import ProductPolicyAndShipingInfo from "@/ui/app/product-list/product-detail/product-policy-shiping-info";
import { Suspense } from "react";
export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    return (
        <div className="px-2 sm:px-5 md:px-10 mt-5 flex flex-col gap-10 mb-10 md:mb-20">
            <Suspense fallback={<CarouselSkeleton />} >
                <ProductOverview id={id} />
            </Suspense>
            <ProductPolicyAndShipingInfo />
            <ProductInfomation id={id} />
        </div>
    )
}