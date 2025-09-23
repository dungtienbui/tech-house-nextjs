import { ProductDetailCarousel } from "@/ui/components/embla-carousel/carousel";
import ProductOptionForm from "./product-option-form";


export default function ProductOverview({ id }: { id: string }) {

    
    
    return (
        <div className="flex flex-col md:flex-row justify-start items-stretch gap-10">
            <div className="flex-1">
                <ProductDetailCarousel id={id} />
            </div>
            <div className="flex-1">
                <ProductOptionForm variantId={id} />
            </div>
        </div >
    );
}