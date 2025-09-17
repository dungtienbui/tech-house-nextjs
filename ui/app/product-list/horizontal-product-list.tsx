import ProductCard from "./product-card";
import { ChevronRightIcon } from "lucide-react";
import { Product, ProductType } from "@/lib/definations/product";
import Link from "next/link";
import { products } from "@/lib/definations/product-example-data";

interface props {
    title: string;
    navigator?: {
        name: string;
        href: string;
    };
    productType: ProductType;
    isFeatureProduct?: boolean;
}

export default function HorizontalProductList({ title, navigator, productType, isFeatureProduct }: props) {

    const productList = products.filter(item => item.type === productType);

    return (
        <div className="w-full py-3 lg:py-5 px-4 lg:px-10">
            <div className="mb-3">
                <div className="flex flex-row justify-between items-end">
                    <div className="font-bold">{title}</div>
                    {
                        navigator && (
                            <Link href={isFeatureProduct ? `${navigator.href}?featured=true` : navigator.href}>
                                <div className="flex flex-row items-center text-blue-400 hover:text-blue-500 hover:font-bold duration-200">
                                    <div>{navigator.name}</div>
                                    <ChevronRightIcon className="w-6" />
                                </div>
                            </Link>
                        )
                    }

                </div>
                <div className="min-w-60 max-w-1/5 h-0 border border-sky-700"></div>
            </div>
            <div className="overflow-x-scroll flex flex-row gap-8 pb-4">
                {productList.map((product, index) => {
                    return <ProductCard key={`${product.id}-${index}`} product={product} />
                })}
            </div>
        </div>
    );
}