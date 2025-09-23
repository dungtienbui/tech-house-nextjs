import { PRODUCT_TYPES } from "@/lib/definations/types";
import HomePageProductList from "@/ui/app/home-page-product-list";
import HomePageProductListSkeleton from "@/ui/app/home-page-product-list-skeleton";
import Banner from "@/ui/components/banner/banner";
import { Suspense } from "react";


export default async function Home() {

  return (
    <div className="w-full px-1 sm:px-5 md:px-6 lg:px-10">
      <Banner imageLink={"https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ac/8c/ac8cdc4164298c52561dd2232fce2200.png"} alt={"Banner quản cáo iphone 17 pro max."} />
      <div className="flex flex-col gap-5 mt-5">
        {
          PRODUCT_TYPES.map((productType) => {
            return (
              <Suspense key={productType} fallback={<HomePageProductListSkeleton />}>
                <HomePageProductList
                  productType={productType}
                  navigator={{
                    name: "Xem tất cả",
                    href: `products/${productType}`
                  }}
                  limit={10}
                />
              </Suspense>
            );
          })
        }
      </div>
    </div>
  );
}