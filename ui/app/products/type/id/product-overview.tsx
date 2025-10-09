import { Carousel } from "@/ui/components/embla-carousel/carousel";
import { Suspense } from "react";
import { CarouselSkeleton } from "@/ui/components/embla-carousel/carousel-skeleton";
import ProductOption from "./product-option";
import ProductOptionSkeleton from "./product-option-skeleton";


export default function ProductOverview({ id }: { id: string }) {

    return (
        <div className="flex flex-col md:flex-row justify-start items-stretch gap-10">
            <div className="flex-1">
                <Suspense fallback={<CarouselSkeleton />}>
                    <Carousel id={id} />
                </Suspense>
            </div>

            <div className="flex-1">
                <Suspense fallback={<ProductOptionSkeleton />}>
                    <ProductOption variantId={id} />
                </Suspense>
            </div>
        </div >
    );
}