import { getConvertKeyProductTypeToVN, isProductType } from "@/app/lib/utils/types";
import Banner from "@/app/ui/components/banner/banner";
import ProductList from "@/app/ui/app/products/type/product-list";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductListSkeleton from "@/app/ui/app/products/type/product-list-skeleton";
import Breadcrumbs from "@/app/ui/components/breadcrumbs/breadcrumbs";
import FilterMenu from "@/app/ui/app/products/type/filter-menu";
import { toArray } from "@/app/lib/utils/funcs";
import FilterMenuSkeleton from "@/app/ui/app/products/type/filter-menue-skeleton";

export default async function ProductListPage({
    params,
    searchParams,
}: {
    params: Promise<{ type: string }>;
    searchParams?: Promise<{
        brand?: string[];
        ram?: string[];
        storage?: string[];
    }>;
}) {
    const { type } = await params;

    if (!isProductType(type)) {
        notFound();
    }

    const searchParamsQuery = await searchParams;

    const queries = [
        {
            param: "brand",
            value: toArray(searchParamsQuery?.brand),
        },
        {
            param: "ram",
            value: toArray(searchParamsQuery?.ram),
        },
        {
            param: "storage",
            value: toArray(searchParamsQuery?.storage),
        },
    ].filter(item => item.value.length > 0);

    return (
        <div className="w-full px-1 sm:px-4 md:px-6 lg:px-10 flex flex-col gap-3 lg:gap-5">
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
            <div className="flex flex-col justify-start items-start gap-3">
                <Suspense fallback={<FilterMenuSkeleton />}>
                    <FilterMenu productType={type} queries={queries} />
                </Suspense>
                <Suspense fallback={<ProductListSkeleton />} >
                    <ProductList
                        productType={type}
                        layout={"grid"}
                        queries={queries}
                    />
                </Suspense>
            </div>
        </div>
    );
}
