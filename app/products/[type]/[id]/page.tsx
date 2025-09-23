import { isProductType, getConvertKeyProductTypeToVN } from "@/lib/utils/types";
import ProductInformation from "@/ui/app/products/type/id/product-information";
import { ProductInformationSkeleton } from "@/ui/app/products/type/id/product-information-skeleton";
import ProductOverview from "@/ui/app/products/type/id/product-overview";
import ProductPolicyAndShipingInfo from "@/ui/app/products/type/id/product-policy-shiping-info";
import Breadcrumbs from "@/ui/components/breadcrumbs/breadcrumbs";
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
        <div className="px-2 sm:px-5 md:px-10 mb-10 md:mb-20 flex flex-col gap-3">
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
