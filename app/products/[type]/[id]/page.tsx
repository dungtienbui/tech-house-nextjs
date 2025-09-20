import { isProductType } from "@/app/lib/utils/types";
import { ProductDetailCarousel } from "@/app/ui/app/components/embla-carousel/carousel";
import ProductInfomation from "@/app/ui/app/product-list/product-detail/product-infomation";
import ProductOptionForm from "@/app/ui/app/product-list/product-detail/product-option-form";
import ProductPolicyAndShipingInfo from "@/app/ui/app/product-list/product-detail/product-policy-shiping-info";
import { notFound } from "next/navigation";
export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ type: string, id: string }>
}) {
    const { id, type } = await params;

    if (!isProductType(type)) {
        notFound();
    }

    return (
        <div className="px-2 sm:px-5 md:px-10 mt-5 flex flex-col gap-10 mb-10 md:mb-20">
            <div className="flex flex-col md:flex-row justify-start items-stretch gap-10">
                <div className="flex-1">
                    <ProductDetailCarousel id={id} />
                </div>
                <div className="flex-1">
                    <ProductOptionForm variantId={id} />
                </div>
            </div >
            <ProductPolicyAndShipingInfo />
            <ProductInfomation id={id} productType={type} />
        </div>
    )
}
