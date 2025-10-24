'use client'

import { useCreateCheckoutSession } from "@/lib/hook/use-checkout-session-hook";
import clsx from "clsx";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


interface props {
    id: string;
    quantity: number;
}

export default function BuyNowButton({ id, quantity }: props) {

    const { createSession, isPending, data } = useCreateCheckoutSession()

    const router = useRouter();

    const goToCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();

        const items = [{
            variant_id: id,
            quantity: quantity
        }];

        createSession(items)
    };

    useEffect(() => {
        if (data && data.success === true && data.sessionId) {
            const param = new URLSearchParams();
            param.set("id", data.sessionId);
            router.push(`/checkout?${param.toString()}`);
        }
    }, [data, router])

    return (
        <button
            onClick={goToCheckout}
            type="button"
            className={clsx(
                "w-full py-2 rounded-md cursor-pointer border flex flex-row gap-2 justify-center",
                {
                    "bg-sky-100 text-blue-500 w-full py-2 rounded-md cursor-pointer border border-sky-100 hover:border-sky-500 duration-500": !isPending,
                    "bg-gray-100 text-gray-500 w-full py-2 rounded-md cursor-pointer border border-gray-100": isPending,
                }
            )}
        >
            {isPending ? "Chuyển hướng..." : "Mua ngay"}
            {isPending && <LoaderCircle className="animate-spin" />}

        </button>
    );
}