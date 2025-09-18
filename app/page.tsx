import { ProductType } from "@/lib/definations/product";
import { getProductTypeLabelInVN } from "@/lib/utils/products";
import Banner from "@/app/ui/app/header-footer/banner";
import HorizontalProductList from "@/app/ui/app/product-list/horizontal-product-list";

export default function Home() {

  const productTypes = Object.values(ProductType);

  return (
    <div className="w-full px-1 sm:px-5 md:px-6 lg:px-10">
      <Banner imageLink={"https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ac/8c/ac8cdc4164298c52561dd2232fce2200.png"} alt={"Banner quản cáo iphone 17 pro max."} />
      {
        productTypes.map((type) => {
          return (
            <HorizontalProductList
              key={type}
              title={`${getProductTypeLabelInVN(type)} nổi bật`}
              productType={type}
              navigator={{
                name: "Xem tất cả",
                href: `products/${type}`
              }}
              isFeatureProduct
            />
          );
        })
      }
    </div>
  );
}
