'use client'

import { useCart } from "@/lib/context/card-context";
import { useGuest } from "@/lib/context/guest-context";
import { CartItems } from "@/lib/definations/data-dto";
import { PaymentMethod } from "@/lib/definations/types";
import clsx from "clsx";
import { ChevronDown, ChevronsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MouseEvent } from "react";

interface props {
    checkoutItems: CartItems,
    checkoutId: string
}

export default function CheckoutForm({ checkoutItems, checkoutId }: props) {


    const { guestInfo, setGuestInfo, isGuestInfoValid, getGuestInfoError, saveGuestInfo } = useGuest();

    const { removeFromCart } = useCart();

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

    const [isConfirm, setIsConfirm] = useState(false);

    const [hadClickSubmit, setHadClickSubmit] = useState(false);

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmitButton = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!isConfirm) {
            setHadClickSubmit(true);
            return;
        }

        saveGuestInfo();

        try {
            const apiQuery = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    guest: guestInfo,
                    items: checkoutItems,
                    paymentMethod: paymentMethod,
                    checkoutSessionId: checkoutId

                })
            })

            const apiQueryData = await apiQuery.json();

            if (apiQueryData.orderId === "") {
                return;
            }

            checkoutItems.forEach(item => removeFromCart(item.variant_id));

            router.push(`/user/purchases`);

        } catch (error) {
            console.error("error: ", error);
        }
    }

    useEffect(() => {
        setHadClickSubmit(false);
    }, [isConfirm, guestInfo])

    const canSubmit = isGuestInfoValid() && !isLoading;

    const guestInfoError = getGuestInfoError();

    return (
        < form
            className="w-full lg:w-[900px] xl:w-[1000px] bg-white p-6 rounded-xl shadow flex flex-col gap-4"
        >
            <div className="flex flex-row justify-between items-center">
                <div className={clsx(
                    "text-lg font-bold"
                )}>
                    Thông tin khách hàng:
                </div>
            </div>


            <input
                value={guestInfo.name}
                onChange={(e) => setGuestInfo({ name: e.target.value })}
                placeholder="Tên"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <input
                value={guestInfo.phone}
                onChange={(e) => setGuestInfo({ phone: e.target.value })}
                placeholder="Số điện thoại"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <input
                value={guestInfo.email}
                onChange={(e) => setGuestInfo({ email: e.target.value })}
                placeholder="Email"
                type="email"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <textarea
                value={guestInfo.address}
                onChange={(e) => setGuestInfo({ address: e.target.value })}
                placeholder="Địa chỉ"
                className="border border-gray-300 rounded-lg px-4 py-2 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
            />

            <div className="text-lg font-bold">Phương thức thanh toán:</div>
            <div className="relative w-full">
                <select
                    className="appearance-none w-full border border-gray-300 rounded-md p-2 pr-10 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                >
                    <option value="online_banking">Chuyển khoản ngân hàng</option>
                    <option value="cod">Thanh toán khi nhận hàng</option>
                </select>

                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            <div className="mt-5 flex flex-row gap-3 justify-start items-center">
                <input type="checkbox" required id="policy" name="confirm" checked={isConfirm} onChange={(e) => setIsConfirm(prev => !prev)} />
                <label htmlFor="policy">Tôi đồng ý với Chính sách xử lý dữ liệu cá nhân của TechHouse</label>
            </div>
            {<div className={clsx(
                "text-red-500",
                {
                    "hidden": !(hadClickSubmit && !isConfirm)
                }
            )}>*Hãy đồng ý xác nhận*</div>}
            {<div className={clsx(
                "text-red-500",
                {
                    "hidden": !guestInfoError
                }
            )}>*{guestInfoError}*</div>}

            <div className="w-full px-3 mt-5 flex flex-col items-center gap-3">
                <button
                    onClick={handleSubmitButton}
                    className={clsx(
                        "text-white w-full md:w-[400px] py-3 flex flex-row gap-5 justify-center items-center rounded-2xl shadow",
                        {
                            "bg-sky-500 hover:bg-sky-400 active:bg-blue-500": canSubmit,
                            "bg-gray-500 opacity-70": !canSubmit,
                        }
                    )}
                    type="button"
                    disabled={!canSubmit}
                >

                    <ChevronsUp className={clsx(
                        "rotate-90 animate-bounce",
                        {
                            "hidden": !canSubmit,
                        }
                    )} />
                    <div>ĐẶT HÀNG</div>
                    <ChevronsUp className={clsx(
                        "-rotate-90 animate-bounce",
                        {
                            "hidden": !canSubmit,
                        }
                    )} />
                </button>
            </div>
        </form >
    );
}