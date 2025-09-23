'use client'

import { useCart } from "@/lib/context/card-context";
import { Handbag, ShoppingCart } from "lucide-react"
import Link from "next/link";

export default function HeaderCart() {

    const { cart } = useCart();

    return (
        <Link href={"/cart"} className="flex flex-row items-center gap-2 py-1 px-2 rounded-full border border-sky-500 hover:border-gray-50">
            <div className="relative">
                {
                    cart.length > 0 && (
                        <div className="absolute -top-2 -right-2 text-xs min-[550px]:text-sm rounded-full min-w-6 px-1 bg-red-500 text-white flex justify-center items-center">
                            <div>{cart.length}</div>
                        </div>
                    )
                }
                <ShoppingCart width={30} />
            </div>
            <p className="hidden min-[550px]:block">Giỏ hàng</p>
        </Link>
    )
}