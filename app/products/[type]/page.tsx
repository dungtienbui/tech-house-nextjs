import { isProductType } from "@/lib/utils/products";
import Banner from "@/ui/app/header-footer/banner";
import ProductList from "@/ui/app/product-list/product-list";
import { notFound } from "next/navigation";

export default async function PhoneListPage({
    params,
}: {
    params: Promise<{ type: string }>
}) {
    const { type } = await params;

    if (!isProductType(type)) {
        notFound();
    }

    return (
        <div className="w-full px-1 sm:px-5 md:px-6 lg:px-10">
            <Banner imageLink={"https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ac/8c/ac8cdc4164298c52561dd2232fce2200.png"} alt={"Banner quản cáo iphone 17 pro max."} />
            <ProductList
                productType={type} query={[]} currentPage={0}
            />
        </div>
    );
}
