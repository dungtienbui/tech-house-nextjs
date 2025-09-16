import { products, productVariants } from "@/lib/definations/product-example-data";
import clsx from "clsx";
import { ChevronDownIcon, ShoppingCart } from "lucide-react";
import NumberInputWithButtonBothSide from "../../components/inputs/number-input";
import Link from "next/link";
import DropdownLinks from "../../components/inputs/dropdown-links";

export default function ProductOptionForm() {
    const product = products[0];
    const productVariant = productVariants[0];

    return (
        <form className="w-full">
            <div className="text-xl md:text-2xl font-bold">{`${product.name} (${productVariant.info.ram}GB Ram - ${productVariant.info.storage}GB bộ nhớ - ${productVariant.info.color.name})`}</div>
            <div className="grid grid-cols-2 gap-y-2 mt-2">
                <p className="text-gray-400">Thương hiệu: <b className="text-black">{product.brand}</b></p>
                <p className="text-gray-400">Số lượng: <b className="text-black">{productVariant.stock}</b></p>
            </div>
            <div className="mt-3">
                <p className="text-red-500 text-xl">$<strong>{productVariant.variantPrice}</strong></p>
            </div>
            <div className="w-full h-0 border-t border-gray-300 my-4" />
            <div>
                <div className="mb-2">Màu sắc</div>
                <div className="flex flex-row flex-wrap justify-start gap-5 items-center">
                    {productVariants.map((item) => {
                        return (
                            <Link href={`${item.id}`} key={item.id} className={clsx(
                                "flex flex-row gap-1 justify-start items-center border border-gray-300 rounded-xl px-3 py-2",
                                {
                                    "bg-sky-50 border-sky-300": productVariant.info.color.id === item.info.color.id,
                                }
                            )}>
                                <div className={clsx(
                                    "w-5 h-5 border border-gray-300 rounded-full",
                                )}
                                    style={{ backgroundColor: item.info.color.value }}
                                />
                                <p className={clsx(
                                    "text-sm",
                                    {
                                        "text-blue-500": item.id === productVariant.id
                                    }
                                )}>{item.info.color.name}</p>
                            </Link>
                        )
                    })
                    }
                </div>
            </div>
            <div className="flex flex-row gap-5 mt-3">
                <div className="flex-1 min-w-1/4">
                    <DropdownLinks products={productVariants} currentProduct={productVariant} type="ram" />
                </div>
                <div className="flex-1 lg:flex-2">
                    <DropdownLinks products={productVariants} currentProduct={productVariant} type="storage" />
                </div>
                <div className="hidden min-[900px]:block flex-1"></div>
            </div>
            <div className="w-full h-0 border-t border-gray-300 my-5" />
            <div className="flex flex-row flex-wrap gap-5">
                <div className="flex-1 min-w-1/4">
                    <NumberInputWithButtonBothSide />
                </div>
                <div className="flex-1 lg:flex-2 min-w-fit">
                    <button type="button" className="px-2 w-full h-full flex flex-row justify-center items-center gap-1 lg:gap-3 py-2 border-2 border-sky-500 font-bold text-md text-blue-500 hover:bg-sky-500 hover:text-white hover:shadow-lg duration-300">
                        <div>Mua ngay</div>
                        <ShoppingCart />
                    </button>
                </div>
                <div className="flex-1 min-w-fit">
                    <button type="button" className="px-2 w-full h-full py-2 border-2 border-sky-500 font-bold text-md text-blue-500 hover:bg-sky-500 hover:text-white hover:shadow-lg duration-300">Thêm vào giỏ</button>
                </div>
            </div>
        </form>
    )
}