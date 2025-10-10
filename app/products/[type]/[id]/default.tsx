import { ProductTypeSchema } from "@/lib/definations/types";
import { getConvertKeyProductTypeToVN } from "@/lib/utils/types";
import ProductOverview from "@/ui/app/products/type/id/product-overview";
import ProductPolicyAndShipingInfo from "@/ui/app/products/type/id/product-policy-shiping-info";
import Breadcrumbs from "@/ui/components/breadcrumbs/breadcrumbs";
import { notFound } from "next/navigation";


export default async function ProductDetailDefaultPage({
    params,
}: {
    params: Promise<{ type: string, id: string }>
}) {
    const { id, type } = await params;

    const typeParse = ProductTypeSchema.safeParse(type);

    if (!typeParse.success) {
        notFound();
    }

    const productType = typeParse.data;

    return (
        <div className="px-2 sm:px-5 md:px-10 mb-10 md:mb-20 flex flex-col gap-3">
            <Breadcrumbs breadcrumbs={[
                {
                    label: "Trang chủ",
                    href: "/",
                    active: false
                },
                {
                    label: `${getConvertKeyProductTypeToVN(productType)}`,
                    href: `/products/${type}`,
                    active: true
                }
            ]} />
            <div className="flex flex-col gap-10">
                <ProductOverview id={id} />
                <ProductPolicyAndShipingInfo />
            </div>
        </div>
    )
}

