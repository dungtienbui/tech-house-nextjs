'use client'
import { useCart } from "@/lib/context/card-context";
import { useRouter } from "next/navigation";


interface props {
    id: string;
    quantity: number;
}

export default function BuyNowButton({ id, quantity }: props) {

    const router = useRouter();

    const { buyNow } = useCart();

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                buyNow(id, quantity);
                router.push("/cart");
            }}
            type="button"
            className="bg-sky-100 text-blue-500 w-full py-2 rounded-md cursor-pointer border border-sky-100 hover:border-sky-500 duration-500"
        >
            Mua ngay
        </button>
    );
}