import Banner from "@/ui/app/header/banner";
import ProductList from "@/ui/app/product-list/product-list";

export default function Home() {
  return (
    <main className="w-full">
      <Banner imageLink={"https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ac/8c/ac8cdc4164298c52561dd2232fce2200.png"} alt={"Banner quản cáo iphone 17 pro max."} />
      <ProductList />
      <ProductList />
      <ProductList />
      <ProductList />
    </main>
  );
}
