import { getConvertKeyProductTypeToVN, isProductType } from "@/app/lib/utils/types";
import Banner from "@/app/ui/components/banner/banner";
import ProductList from "@/app/ui/app/products/type/product-list";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductListSkeleton from "@/app/ui/app/products/type/product-list-skeleton";
import Breadcrumbs from "@/app/ui/components/breadcrumbs/breadcrumbs";

export default async function ProductListPage({
    params,
}: {
    params: Promise<{ type: string }>
}) {
    const { type } = await params;

    if (!isProductType(type)) {
        notFound();
    }
    return (
        <div className="w-full px-1 sm:px-4 md:px-6 lg:px-10">
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
                },
            ]} />
            <Banner imageLink={"https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ac/8c/ac8cdc4164298c52561dd2232fce2200.png"} alt={"Banner quản cáo iphone 17 pro max."} />
            <div className="md:px-5 my-2 md:my-5">
                <Suspense fallback={<ProductListSkeleton />} >
                    <ProductList
                        productType={type}
                        layout={"grid"}
                    />
                </Suspense>
            </div>
        </div>
    );
}
