import RelevantProductList from "@/ui/app/products/relevant-product-list";
import ProductListSkeleton from "@/ui/app/products/type/product-list-skeleton";
import Banner from "@/ui/components/banner/banner";
import { Suspense } from "react";



export default async function ProductsPage({
    searchParams,
}: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const searchParamsURL = await searchParams;
    const query = searchParamsURL?.query ?? "";
    const currentPage = Number(searchParamsURL?.page) || 1;
    
    return (
        <div className="w-full px-1 sm:px-4 md:px-6 lg:px-10 flex flex-col gap-3 lg:gap-5">
            <Banner imageLink={"https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ac/8c/ac8cdc4164298c52561dd2232fce2200.png"} alt={"Banner quản cáo iphone 17 pro max."} />
            <div className="flex flex-col justify-start items-start gap-3">
                <Suspense fallback={<ProductListSkeleton />} >
                    <RelevantProductList
                        keyWord={query}
                        currentPage={currentPage}
                        limit={10}
                    />
                </Suspense>
            </div>
        </div>
    );
}
