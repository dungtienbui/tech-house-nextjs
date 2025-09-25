import { ProductTypeSchema } from "@/lib/definations/types";
import { toArray } from "@/lib/utils/funcs";
import { getConvertKeyProductTypeToVN } from "@/lib/utils/types";
import FilterMenu from "@/ui/app/products/type/filter-menu";
import FilterMenuSkeleton from "@/ui/app/products/type/filter-menue-skeleton";
import ProductList from "@/ui/app/products/type/product-list";
import ProductListSkeleton from "@/ui/app/products/type/product-list-skeleton";
import Banner from "@/ui/components/banner/banner";
import Breadcrumbs from "@/ui/components/breadcrumbs/breadcrumbs";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function ProductListPage({
    params,
    searchParams,
}: {
    params: Promise<{ type: string }>;
    searchParams?: Promise<{
        brand?: string[];
        ram?: string[];
        storage?: string[];
        page?: string;
    }>;
}) {
    const { type } = await params;

    const typeParse = ProductTypeSchema.safeParse(type);

    if (!typeParse.success) {
        notFound();
    }

    const productType = typeParse.data;

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

    const currentPage = Number(searchParamsQuery?.page) || 1;

    return (
        <div className="w-full px-1 sm:px-4 md:px-6 lg:px-10 flex flex-col gap-3 lg:gap-5">
            <Breadcrumbs breadcrumbs={[
                {
                    label: "Trang chủ",
                    href: "/",
                    active: false
                },
                {
                    label: `${getConvertKeyProductTypeToVN(productType)}`,
                    href: `/products/${productType}`,
                    active: true
                },
            ]} />
            <Banner imageLink={"https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ac/8c/ac8cdc4164298c52561dd2232fce2200.png"} alt={"Banner quản cáo iphone 17 pro max."} />
            <div className="flex flex-col justify-start items-start gap-3">
                <Suspense fallback={<FilterMenuSkeleton />}>
                    <FilterMenu productType={productType} queries={queries} />
                </Suspense>
                <Suspense fallback={<ProductListSkeleton />} >
                    <ProductList
                        productType={productType}
                        layout={"grid"}
                        queries={queries}
                        currentPage={currentPage}
                        limit={10}
                    />
                </Suspense>
            </div>
        </div>
    );
}
