import { getConvertKeyProductTypeToVN, isProductType } from "@/app/lib/utils/types";
import ProductInformation from "@/app/ui/app/products/type/id/product-information";
import { ProductInformationSkeleton } from "@/app/ui/app/products/type/id/product-information-skeleton";
import ProductOptionForm from "@/app/ui/app/products/type/id/product-option-form";
import ProductOverview from "@/app/ui/app/products/type/id/product-overview";
import ProductPolicyAndShipingInfo from "@/app/ui/app/products/type/id/product-policy-shiping-info";
import Breadcrumbs from "@/app/ui/components/breadcrumbs/breadcrumbs";
import { ProductDetailCarousel } from "@/app/ui/components/embla-carousel/carousel";
import { notFound } from "next/navigation";
import { Suspense } from "react";
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
        <div className="px-2 sm:px-5 md:px-10 mb-10 md:mb-20">
            <Breadcrumbs breadcrumbs={[
                {
                    label: "Trang chủ",
                    href: "/",
                    active: false
                },
                {
                    label: `${getConvertKeyProductTypeToVN(type)}`,
                    href: `/products/${type}`,
                    active: true
                }
            ]} />
            <div className="flex flex-col gap-10">
                <ProductOverview id={id} />
                <ProductPolicyAndShipingInfo />
                <Suspense fallback={<ProductInformationSkeleton />}>
                    <ProductInformation id={id} productType={type} />
                </Suspense>
            </div>
        </div>
    )
}
