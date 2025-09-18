import ProductCard from "./product-card";
import { ChevronRightIcon } from "lucide-react";
import { Product, ProductType } from "@/lib/definations/product";
import Link from "next/link";
import { products } from "@/lib/definations/product-example-data";

interface props {
    query: {
        key: string;
        value: string;
    }[];
    currentPage: number;
    productType: ProductType;
}

export default function ProductList({ query, currentPage, productType }: props) {

    const productList = products.filter(item => item.type === productType);

    return (
        <div className="w-full md:px-5 py-5 md:py-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-5">
                {productList.map((product, index) => {
                    return (<ProductCard key={`${product.id}-${index}`} product={product} />)
                })}
            </div>
        </div>
    );
}