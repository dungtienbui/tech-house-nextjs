import { CartItems } from "@/lib/definations/data-dto";
import { useCreateCheckoutSession } from "@/lib/hook/use-checkout-session-hook";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutButton(
    {
        disable,
        checkoutItems
    }: {
        disable: boolean;
        checkoutItems: CartItems
    }
) {
    const router = useRouter();

    const { createSession, isPending, data: checkoutSessionData, error: createCheckoutSessionError } = useCreateCheckoutSession();

    const handleGotoCheckoutButton = () => {
        createSession(checkoutItems);
    }


    useEffect(() => {
        if (checkoutSessionData && checkoutSessionData.success && checkoutSessionData.sessionId) {
            router.push(`/checkout?id=${checkoutSessionData.sessionId}`);
        }
    }, [checkoutSessionData, router])

    const errorMessage = checkoutSessionData?.error || createCheckoutSessionError?.message;

    return (
        <div>
            <button
                disabled={disable}
                onClick={handleGotoCheckoutButton}
                className={clsx(
                    "w-full flex flex-row justify-center items-center gap-5 px-5 py-2 rounded-md text-white",
                    {
                        "bg-gray-300": disable,
                        "bg-sky-500 hover:bg-sky-400": !disable,
                    }
                )}
            >
                <div className="flex-1">
                    MUA HÀNG
                </div>
            </button>
            <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
    );
}