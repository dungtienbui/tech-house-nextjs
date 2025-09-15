import { Product } from "@/lib/definations/product";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({
    product
}: {
    product: Product
}) {
    return (
        <Link
            className="group min-w-[160px] max-w-[180px] border border-slate-200 hover:shadow-md rounded-xl flex flex-col justify-between items-center gap-2 px-3 pb-2 pt-3 overflow-clip"
            href={`/product/${product.id}`}>
            <Image
                src={product.featuredImageLink.link}
                alt={product.name}
                width={600}
                height={600}
                className="flex-1 group-hover:transition-transform group-hover:-translate-y-3 translate-y-0 duration-300 "
            />
            <div className="w-full">
                <div className="mb-2 group-hover:text-blue-500">
                    <div className="font-normal">{product.brand} {product.name}</div>
                    <div className="text-red-500 font-bold">${product.basePrice}</div>
                </div>
                <button type="button" className="bg-sky-100 text-blue-500 w-full py-2 rounded-md cursor-pointer border border-sky-100 hover:border-sky-500 duration-500">Buy now</button>
            </div>
        </Link>
    );
}