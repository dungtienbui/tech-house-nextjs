'use client'

import { useCart } from "@/lib/context/guest-card-context";
import { useGuest } from "@/lib/context/guest-context";
import { CartItems, GuestInfo } from "@/lib/definations/data-dto";
import { UserResponse } from "@/lib/definations/database-table-definations";
import { PaymentMethod } from "@/lib/definations/types";
import clsx from "clsx";
import { ChevronDown, ChevronsUp, LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MouseEvent } from "react";

interface props {
    checkoutItems: CartItems
    checkoutId: string
}

export default function CheckoutForm({ checkoutId, checkoutItems }: props) {

    const { guestInfo, setGuestInfo, isGuestInfoValid, getGuestInfoError, saveGuestInfo } = useGuest();

    const { removeFromCart } = useCart();

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

    const [isConfirm, setIsConfirm] = useState(false);

    const [hadClickSubmit, setHadClickSubmit] = useState(false);

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmitButton = async (e: MouseEvent<HTMLButtonElement>) => {

        setIsLoading(true);

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

        setIsLoading(false);
    }

    useEffect(() => {
        setHadClickSubmit(false);
    }, [isConfirm, guestInfo])

    const canSubmit = isGuestInfoValid() && !isLoading;

    const guestInfoError = getGuestInfoError();

    const { data: session } = useSession()


    const handleDefaultAddressButton = async (userId: string) => {
        await fetch("/api/user/address", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: session?.user.id }),
        })
            .then((res) => res.json())
            .then((data: UserResponse) => {
                const guestSigninInfo: GuestInfo = {
                    name: data.name,
                    phone: data.phone,
                    address: {
                        province: data.province ?? "",
                        ward: data.ward ?? "",
                        street: data.street ?? ""
                    }
                };
                setGuestInfo(guestSigninInfo);
            })
            .catch((err) => console.error("Lỗi fetch product info:", err))
    }

    return (
        < form
            className="w-full lg:w-[900px] xl:w-[1000px] bg-white p-6 rounded-xl shadow flex flex-col gap-4"
        >
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                <div className={clsx(
                    "text-lg font-bold"
                )}>
                    Thông tin khách hàng:
                </div>
                {session?.user.id && (
                    <button
                        type="button"
                        className="text-blue-500 hover:cursor-pointer"
                        onClick={() => {
                            handleDefaultAddressButton(session.user.id);
                        }}
                    >
                        Sử dụng địa chỉ mặc định
                    </button>
                )}
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Tỉnh/ Thành phố */}
                <input
                    value={guestInfo.address.province}
                    onChange={(e) => setGuestInfo({ address: { ...guestInfo.address, province: e.target.value } })}
                    placeholder="Tỉnh/ Thành phố"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />

                {/* Phường/ Xã */}
                <input
                    value={guestInfo.address.ward}
                    onChange={(e) => setGuestInfo({ address: { ...guestInfo.address, ward: e.target.value } })}
                    placeholder="Phường/ Xã"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
            </div>

            <input
                value={guestInfo.address.street}
                onChange={(e) => setGuestInfo({ address: { ...guestInfo.address, street: e.target.value } })}
                placeholder="Số Nhà, Tên Đường*"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
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

            <div className="mt-5 flex flex-row gap-3 justify-start items-start">
                <input className="mt-1" type="checkbox" required id="policy" name="confirm" checked={isConfirm} onChange={(e) => setIsConfirm(prev => !prev)} />
                <label htmlFor="policy">Tôi đồng ý với Chính sách xử lý dữ liệu cá nhân của TechHouse</label>
            </div>

            {/* Showing error */}
            <div className="space-y-2">
                {(hadClickSubmit && !isConfirm) && <div className="text-red-500">*Hãy đồng ý xác nhận*</div>}

                {guestInfoError?.name?.map((err, i) => (
                    <p key={i} className="text-sm text-red-500">{err}</p>
                ))}
                {guestInfoError?.phone?.map((err, i) => (
                    <p key={i} className="text-sm text-red-500">{err}</p>
                ))}
                {guestInfoError?.address?.map((err, i) => (
                    <p key={i} className="text-sm text-red-500">{err}</p>
                ))}
            </div>

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
                    {canSubmit && <ChevronsUp className={clsx(
                        "rotate-90 animate-bounce"
                    )} />}
                    <div>ĐẶT HÀNG</div>
                    {isLoading && <LoaderCircle />}
                    {canSubmit && <ChevronsUp className={clsx(
                        "-rotate-90 animate-bounce"
                    )} />}

                </button>
            </div>
        </form >
    );
}