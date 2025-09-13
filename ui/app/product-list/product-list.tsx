import { products } from "@/lib/definations/product-example-data";
import ProductCard from "./product-card";

export default function ProductList() {
    const exProducts = products.concat(products);
    return (
        <div className="overflow-auto grid grid-cols-2 min-[600px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-items-center px-4 xl:px-6 mt-7">
            {exProducts.map((product, index) => {
                return <ProductCard key={`${product.id}-${index}`} product={product} />
            })}
        </div>
    );
}