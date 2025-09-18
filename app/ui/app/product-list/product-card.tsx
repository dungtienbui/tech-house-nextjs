import { Product } from "@/lib/definations/product";
import Image from "next/image";
import Link from "next/link";

interface props {
    product: Product;
}

export default function ProductCard({ product }: props) {
    return (
        <Link
            className="group min-h-72 border border-slate-200 hover:shadow-md rounded-xl flex flex-col justify-between items-center px-3 py-3 xl:px-5 overflow-clip"
            href={`/products/${product.type}/${product.id}`}>
            <div className="flex-1 flex justify-center items-center">
                <Image
                    src={product.featuredImage.link}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="group-hover:transition-transform group-hover:-translate-y-3 translate-y-0 duration-300 "
                />
            </div>
            <div className="w-full">
                <div className="mb-2 group-hover:text-blue-500">
                    <div className="font-normal text-sm">{product.brand} {product.name}</div>
                    <div className="text-red-500 font-bold">${product.basePrice}</div>
                </div>
                <button type="button" className="bg-sky-100 text-blue-500 w-full py-2 rounded-md cursor-pointer border border-sky-100 hover:border-sky-500 duration-500">Buy now</button>
            </div>
        </Link>
    );
}