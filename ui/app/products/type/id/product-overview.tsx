import { Carousel } from "@/ui/components/embla-carousel/carousel";
import ProductOptionForm from "./product-option-form";
import { Suspense } from "react";
import { CarouselSkeleton } from "@/ui/components/embla-carousel/carousel-skeleton";
import ProductOptionFormSkeleton from "./product-option-form-skeleton";


export default function ProductOverview({ id }: { id: string }) {

    return (
        <div className="flex flex-col md:flex-row justify-start items-stretch gap-10">
            <div className="flex-1">
                <Suspense fallback={<CarouselSkeleton />}>
                    <Carousel id={id} />
                </Suspense>
            </div>

            <div className="flex-1">
                <Suspense fallback={<ProductOptionFormSkeleton />}>
                    <ProductOptionForm variantId={id} />
                </Suspense>
            </div>
        </div >
    );
}