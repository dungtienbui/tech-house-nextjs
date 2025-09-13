import { products } from "@/lib/definations/product-example-data";
import ProductCard from "./product-card";
import { ChevronRightIcon } from "lucide-react";

export default function ProductList() {
    const exProducts = products.concat(products);
    return (
        <div className="w-full py-5 px-10">
            <div className="mb-3">
                <div className="flex flex-row justify-between items-end">
                    <div className="font-bold">Điện thoại nổi bật</div>
                    <div className="flex flex-row items-center text-blue-400 hover:text-blue-500 hover:font-bold duration-200">
                        <div>Xem tất cả</div>
                        <ChevronRightIcon className="w-6" />
                    </div>
                </div>
                <div className="min-w-60 max-w-1/5 h-0 border border-sky-700"></div>
            </div>
            <div className="overflow-x-scroll flex flex-row gap-8 pb-4">
                {exProducts.map((product, index) => {
                    return <ProductCard key={`${product.id}-${index}`} product={product} />
                })}
            </div>
        </div>
    );
}