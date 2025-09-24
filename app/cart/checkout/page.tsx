'use client'

import { useCart } from "@/lib/context/card-context";
import { GuestInfo, useGuest } from "@/lib/context/guest-context";
import { CartItem, NO_PREVIEW } from "@/lib/definations/data-dto";
import { PaymentMethod } from "@/lib/definations/types";
import clsx from "clsx";
import { ChevronsUp, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";


export default function checkout() {

    const { guestInfo, setGuestInfo, isGuestInfoValid, getGuestInfoError } = useGuest();

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

    const { cart, cartProductInfo, selected, removeFromCart, removeSelectedCartItem } = useCart();

    const [isConfirmInfo, setIsConfirmInfo] = useState(false);

    const itemSelected = selected.map(s => cartProductInfo.find(item => item.variant_id === s)).filter(item => item !== undefined);

    const totalCost = itemSelected.reduce((acc, curr) => acc + curr.variant_price * curr.quantity, 0);

    const formGuestInfoRef = useRef<HTMLFormElement>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setIsConfirmInfo(false);
    }, [guestInfo, selected])

    const submitOrder = async (
        orderedItems: CartItem[],
        guest: GuestInfo,
        paymentMethod: PaymentMethod,
    ) => {
        if (orderedItems.length <= 0) {
            console.error("err: ", "orderedItems is empty!");
            return;
        }

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: orderedItems, guest, paymentMethod }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("errorData: ", errorData);
            }

            const data = await res.json();
            // console.log("data: ", data);
            orderedItems.forEach((item) => {
                removeFromCart(item.variantId);
                removeSelectedCartItem(item.variantId);
            })
        } catch (err) {
            if (err instanceof Error) {
                console.error("err: ", err);
            }
            console.error("err: ", String(err));
        }
    };

    const handleClickConfirm = () => {
        if (!isGuestInfoValid()) {
            return;
        } else {
            setIsConfirmInfo(true);
            submitButtonRef.current?.scrollIntoView({ block: "center", behavior: "smooth" })
        }
    }


    const handleClickSubmit = () => {
        if (!isConfirmInfo) {
            formGuestInfoRef.current?.scrollIntoView({ block: "center", behavior: "smooth" })
            return;
        }

        const orderedItems = cart.filter(c => selected.includes(c.variantId))
        submitOrder(orderedItems, guestInfo, paymentMethod);
    }

    return (
        <div className="flex flex-col gap-5 justify-start items-center">
            <div className="w-full lg:w-[900px] xl:w-[1000px] rounded-xl overflow-hidden bg-white shadow">
                {
                    itemSelected.length > 0 ? (
                        <>
                            <table className="hidden md:table w-full border-collapse">
                                <thead className="bg-white border-b border-sky-500">
                                    <tr>
                                        <th className="p-4 text-left font-semibold">Sản phẩm</th>
                                        <th className="p-4 text-left font-semibold text-nowrap">Biến thể</th>
                                        <th className="p-4 text-right font-semibold text-nowrap">Đơn giá</th>
                                        <th className="p-4 text-center font-semibold text-nowrap">Số lượng</th>
                                        <th className="p-4 text-right font-semibold text-nowrap">Số tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemSelected.map((item) => {
                                        const optionStr = [
                                            item.ram ? `${item.ram}GB` : null,
                                            item.storage ? `${item.storage}GB` : null,
                                            item.switch_type ? `${item.switch_type} switch` : null,
                                            item.color_name,
                                        ].filter(item => item !== null).join(", ");

                                        const totalCost = item.variant_price * item.quantity;

                                        return (
                                            <CartTableRow
                                                key={item.variant_id}
                                                name={`${item.product_name} - ${item.brand_name}`}
                                                option={optionStr}
                                                price={item.variant_price}
                                                quantity={item.quantity}
                                                totalCost={totalCost}
                                                preview={{
                                                    href: item.preview_image_url ?? NO_PREVIEW.href,
                                                    alt: item.preview_image_alt ?? NO_PREVIEW.alt
                                                }}
                                            />
                                        )
                                    })}
                                </tbody>
                            </table>

                            <div className="flex md:hidden flex-col gap-3 p-3">
                                <div className="text-lg font-bold">Thông tin sản phẩm:</div>
                                {
                                    itemSelected.map((item) => {
                                        const optionStr = [
                                            item.ram ? `${item.ram}GB` : null,
                                            item.storage ? `${item.storage}GB` : null,
                                            item.switch_type ? `${item.switch_type} switch` : null,
                                            item.color_name,
                                        ].filter(item => item !== null).join(", ");

                                        const totalCost = item.quantity * item.variant_price;
                                        return (
                                            <CartTableCard
                                                key={item.variant_id}
                                                name={`${item.product_name} - ${item.brand_name}`}
                                                option={optionStr}
                                                price={item.variant_price}
                                                quantity={item.quantity}
                                                totalCost={totalCost}
                                                preview={{
                                                    href: item.preview_image_url ?? NO_PREVIEW.href,
                                                    alt: item.preview_image_alt ?? NO_PREVIEW.alt
                                                }}
                                            />
                                        );
                                    })
                                }
                            </div>
                        </>
                    ) : (
                        <div className="w-full flex flex-col gap-3 justify-start items-center py-3 px-6">
                            <div className="text-red-500">Không có sản phẩm nào được chọn mua.</div>
                            <Link
                                href={"/cart"}
                                className="hover:underline
                                "
                            >
                                Click để Trở về duyệt giỏ hàng
                            </Link>

                        </div>
                    )
                }
            </div>

            <div className="w-full flex flex-row justify-between items-center py-3 px-6 lg:w-[900px] xl:w-[1000px] rounded-xl overflow-hidden bg-white shadow">
                <div className="font-bold text-lg">Tổng tiền thanh toán:</div>
                <div className="text-red-500 font-bold text-xl">${totalCost}</div>
            </div>

            {/* Form thông tin khách hàng */}
            <form
                ref={formGuestInfoRef}
                className="w-full lg:w-[900px] xl:w-[1000px] bg-white p-6 rounded-xl shadow flex flex-col gap-4"
            >
                <div className="flex flex-row justify-between items-center">
                    <div className={clsx(
                        "text-lg font-bold"
                    )}>
                        Thông tin khách hàng:
                    </div>
                    <div className={clsx(
                        {
                            "text-red-500": !isGuestInfoValid(),
                            "text-blue-500": isGuestInfoValid()
                        }
                    )}>*{getGuestInfoError() ?? "Thông tin hợp lệ"}*</div>
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
                        <option value="cash">Tiền mặt</option>
                        <option value="cod">Thanh toán khi nhận hàng</option>
                    </select>

                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                <div className="w-full flex flex-row justify-end">
                    <button
                        type="button"
                        onClick={handleClickConfirm}
                        className={clsx(
                            "flex-1 md:flex-none px-3 py-2 text-white rounded-lg",
                            "flex flex-row gap-3 justify-center",
                            {
                                "bg-blue-500 hover:bg-blue-400 transition cursor-pointer": isGuestInfoValid() && selected.length > 0,
                                "bg-gray-500 opacity-25": !isGuestInfoValid() || selected.length <= 0
                            }
                        )}
                        disabled={!isGuestInfoValid() || selected.length <= 0}
                    >
                        <ChevronsUp className={clsx(
                            "rotate-90 animate-bounce",
                            {
                                "hidden": !isGuestInfoValid() || isConfirmInfo || selected.length <= 0,
                            }
                        )} />
                        <div>Xác nhận thông tin đặt hàng</div>
                        <ChevronsUp className={clsx(
                            "-rotate-90 animate-bounce",
                            {
                                "hidden": !isGuestInfoValid() || isConfirmInfo || selected.length <= 0,
                            }
                        )} />
                    </button>
                </div>

            </form>
            <div className="mt-12 flex flex-col items-center gap-3">
                <div className={clsx(
                    "text-sm font-semibold",
                    {
                        "hidden": !isConfirmInfo
                    }
                )}>*Xác nhận thành công, bạn đã có thể đặt hàng*</div>
                <button
                    ref={submitButtonRef}
                    disabled={!isGuestInfoValid() || !isConfirmInfo || selected.length <= 0}
                    className={clsx(
                        "text-white w-[400px] py-3 flex flex-row gap-5 justify-center items-center",
                        {
                            "bg-gray-300": !isGuestInfoValid() || !isConfirmInfo || selected.length <= 0,
                            "bg-blue-500 hover:bg-blue-400 transition cursor-pointer": isGuestInfoValid() && isConfirmInfo && selected.length > 0,
                        }
                    )}
                    type="button"
                    onClick={handleClickSubmit}
                >

                    <ChevronsUp className={clsx(
                        "rotate-90 animate-bounce",
                        {
                            "hidden": !isGuestInfoValid() || !isConfirmInfo,
                        }
                    )} />
                    <div>ĐẶT HÀNG</div>
                    <ChevronsUp className={clsx(
                        "-rotate-90 animate-bounce",
                        {
                            "hidden": !isGuestInfoValid() || !isConfirmInfo,
                        }
                    )} />
                </button>
            </div>
        </div>
    );
}



interface CartTableRowProps {
    name: string;
    option: string;
    price: number;
    quantity: number;
    totalCost: number;
    preview: {
        href: string;
        alt: string;
    }
}

function CartTableRow({ name, option, price, quantity, totalCost, preview }: CartTableRowProps) {
    return (
        <tr className="border-b border-gray-300 last:border-none">
            <td className="p-4 flex flex-row gap-2 justify-start items-center">
                <Image src={preview.href} alt={preview.alt} width={80} height={80} />
                <span className="font-medium hover:underline">
                    {name}
                </span>
            </td>
            <td className="p-4">{option}</td>
            <td className="p-4 text-right">${price}</td>
            <td className="p-4 text-center">{quantity}</td>
            <td className="p-4 text-right font-semibold text-red-500">${totalCost}</td>
        </tr>
    );
}



function CartTableCard({ name, option, price, quantity, totalCost, preview }: CartTableRowProps) {
    return (
        <div className="flex justify-between items-start gap-3 py-1 sm:p-3 border-b border-gray-500 last:border-none">
            <div className="flex gap-3">
                <Image
                    src={preview.href}
                    alt={preview.alt}
                    width={80}
                    height={80}
                    className="rounded-md"
                />
                <div className="flex flex-col justify-between min-w-0">
                    <span
                        className="font-medium hover:underline text-ellipsis"
                    >
                        {name}
                    </span>
                    <span className="text-gray-500 text-sm">{option}</span>
                    <span className="text-sm">${price}</span>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-sm text-nowrap"><span>x</span> <span className="text-base font-bold">{quantity}</span></span>
                <span className="text-red-500 font-semibold text-lg">${totalCost}</span>
            </div>
        </div>
    );
}