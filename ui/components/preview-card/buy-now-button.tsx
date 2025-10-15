'use client'
import { useCart } from "@/lib/context/guest-card-context";
import { CartItems } from "@/lib/definations/data-dto";
import { useRouter } from "next/navigation";


interface props {
    id: string;
    quantity: number;
}

export default function BuyNowButton({ id, quantity }: props) {

    const router = useRouter();

    const goToCheckout = async () => {

        const checkoutItems: CartItems = [{
            variant_id: id,
            quantity: quantity
        }];

        try {
            const queryApi = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ checkoutItems }),

            });

            const { apiQueryResult } = await queryApi.json();

            router.push(`/checkout/${apiQueryResult.checkout_id}`)

        } catch (e) {
            console.error((e as Error).message)
        }
    };

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                goToCheckout();
            }}
            type="button"
            className="bg-sky-100 text-blue-500 w-full py-2 rounded-md cursor-pointer border border-sky-100 hover:border-sky-500 duration-500"
        >
            Mua ngay
        </button>
    );
}