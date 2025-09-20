import Banner from "@/app/ui/app/header-footer/banner";
import { PRODUCT_TYPES, ProductType } from "./lib/definations/types";
import { getConvertKeyProductTypeToVN } from "./lib/utils/types";
import ProductListBase from "./ui/app/product-list/product-list";

export default function Home() {


  return (
    <div className="w-full px-1 sm:px-5 md:px-6 lg:px-10">
      <Banner imageLink={"https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ac/8c/ac8cdc4164298c52561dd2232fce2200.png"} alt={"Banner quản cáo iphone 17 pro max."} />
      {
        PRODUCT_TYPES.map((productType) => {
          return (
            <ProductListBase
              key={productType}
              title={`${getConvertKeyProductTypeToVN(productType)} nổi bật`}
              productType={productType}
              navigator={{
                name: "Xem tất cả",
                href: `products/${productType}`
              }}
              isFeatureProduct layout={"horizontal"}
              limit={10}
            />
          );
        })
      }
    </div>
  );
}