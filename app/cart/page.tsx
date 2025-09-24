'use client'
import { useCart } from "@/lib/context/card-context";
import { useGuest } from "@/lib/context/guest-context";
import { NO_PREVIEW } from "@/lib/definations/data-dto";
import { ProductType } from "@/lib/definations/types";
import Breadcrumbs from "@/ui/components/breadcrumbs/breadcrumbs";
import clsx from "clsx";
import { ChevronRight, ChevronsDown, ChevronsUp, Square, SquareCheckBig } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";


export default function Cart() {

    const { cart, cartProductInfo, removeFromCart, priceMap, loading } = useCart();

    const { guestInfo, setGuestInfo, clearGuestInfo, saveGuestInfo, isGuestInfoValid, getGuestInfoError } = useGuest();

    const [selected, setSelected] = useState<string[]>([]);

    const isSelectedAll = cart.length > 0 && cart.every(item => selected.includes(item.variantId));

    const totalCost = selected.reduce((acc, id) => {
        const entry = priceMap.get(id);
        if (!entry) return acc;
        return acc + entry.quantity * entry.price;
    }, 0);

    const [hadCheckingGuestinfo, setHadCheckingGuestinfo] = useState(false);

    useEffect(() => {
        setHadCheckingGuestinfo(false);
    }, [selected, guestInfo])

    const canSubmit = hadCheckingGuestinfo && selected.length > 0 && isGuestInfoValid();

    const guestInfoFormRef = useRef<HTMLFormElement>(null);
    const guestSubmitButton = useRef<HTMLButtonElement>(null);

    const handleClickSubmitButton = () => {
        if (!guestInfoFormRef.current) {
            return;
        }

        if (canSubmit && isGuestInfoValid()) {
            console.log("submitted");
        }

        const rect = guestInfoFormRef.current.getBoundingClientRect();
        const isVisible =
            rect.top >= 0 &&
            rect.bottom <= window.innerHeight;

        if (!isVisible) {
            // Cuộn mượt đến form
            guestInfoFormRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }

    }

    const handleConfirmGuestInfo = () => {
        if (!guestInfoFormRef.current || !guestSubmitButton.current || !isGuestInfoValid()) {
            return;
        }

        saveGuestInfo();
        setHadCheckingGuestinfo(true);

        guestSubmitButton.current.scrollIntoView({ behavior: "smooth", block: "center" });

    }

    return (
        <div className="px-5 lg:px-10">
            <div className="rounded-2xl shadow">
                {cart.length === 0 ? (
                    <div className="mb-20 mt-10 flex flex-col items-center">
                        <div className="mb-5 flex flex-col items-center">
                            <Image
                                src={"https://cdn-icons-png.flaticon.com/512/11329/11329060.png"}
                                alt={"Cart empty!"}
                                width={150}
                                height={150}
                            />
                            <div className="text-gray-500">Giỏ hàng của bạn còn trống</div>
                        </div>
                        <Link
                            className="text-lg px-10 py-2 bg-sky-500 text-white"
                            href={"/"}>
                            MUA NGAY
                        </Link>
                    </div>
                ) : (
                    <>
                        <table className="hidden min-[750px]:table w-full border-collapse bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 text-left">
                                        <button type="button" onClick={() => {
                                            if (isSelectedAll) {
                                                setSelected([]);
                                            } else {
                                                setSelected(cart.map(item => item.variantId));
                                            }
                                        }}>
                                            {isSelectedAll ? (<SquareCheckBig className="text-gray-400" />) : (<Square className="text-gray-400" />)}
                                        </button>
                                    </th>
                                    <th className="p-4 text-left font-semibold min-w-[250px]">Sản phẩm</th>
                                    <th className="p-4 text-left font-semibold">Biến thể</th>
                                    <th className="p-4 text-right font-semibold">Đơn giá</th>
                                    <th className="p-4 text-center font-semibold">Số lượng</th>
                                    <th className="p-4 text-right font-semibold">Số tiền</th>
                                    <th className="p-4 text-center font-semibold">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartProductInfo.map((item) => {
                                    const optionStr = [
                                        item.ram ? `${item.ram}GB` : null,
                                        item.storage ? `${item.storage}GB` : null,
                                        item.switch_type ? `${item.switch_type} switch` : null,
                                        item.color_name,
                                    ].filter(item => item !== null).join(", ");

                                    const entry = priceMap.get(item.variant_id) ?? { quantity: 0, price: 0 };
                                    const totalCost = entry.price * entry.quantity;

                                    const isSelected = selected.includes(item.variant_id);

                                    return (
                                        <CartTableRow
                                            id={item.variant_id}
                                            type={item.product_type}
                                            key={item.variant_id}
                                            name={`${item.product_name} - ${item.brand_name}`}
                                            option={optionStr}
                                            price={entry.price}
                                            quantity={entry.quantity}
                                            totalCost={totalCost}
                                            preview={{
                                                href: item.preview_image_url ?? NO_PREVIEW.href,
                                                alt: item.preview_image_alt ?? NO_PREVIEW.alt
                                            }}
                                            removeCallBack={() => removeFromCart(item.variant_id)}
                                            isSelected={isSelected}
                                            selectedCallBack={() => {
                                                if (isSelected) {
                                                    setSelected(selected.filter(s => s !== item.variant_id));
                                                } else {
                                                    setSelected(prev => [...prev, item.variant_id]);
                                                }
                                            }}
                                        />
                                    )
                                })}
                            </tbody>
                        </table>

                        <div className="flex min-[750px]:hidden flex-col gap-3 p-3">
                            {
                                cartProductInfo.map((item) => {
                                    const optionStr = [
                                        item.ram ? `${item.ram}GB` : null,
                                        item.storage ? `${item.storage}GB` : null,
                                        item.switch_type ? `${item.switch_type} switch` : null,
                                        item.color_name,
                                    ].filter(item => item !== null).join(", ");

                                    const quantity = cart.find(cartItem => cartItem.variantId === item.variant_id)?.quantity ?? 0;

                                    const isSelected = selected.includes(item.variant_id);
                                    const totalCost = quantity * item.variant_price;
                                    return (
                                        <CartTableCard
                                            id={item.variant_id}
                                            type={item.product_type}
                                            key={item.variant_id}
                                            name={`${item.product_name} - ${item.brand_name}`}
                                            option={optionStr}
                                            price={item.variant_price}
                                            quantity={quantity}
                                            totalCost={totalCost}
                                            preview={{
                                                href: item.preview_image_url ?? NO_PREVIEW.href,
                                                alt: item.preview_image_alt ?? NO_PREVIEW.alt
                                            }}
                                            removeCallBack={() => removeFromCart(item.variant_id)}
                                            isSelected={isSelected}
                                            selectedCallBack={() => {
                                                if (isSelected) {
                                                    setSelected(selected.filter(s => s !== item.variant_id));
                                                } else {
                                                    setSelected(prev => [...prev, item.variant_id]);
                                                }
                                            }}
                                        />
                                    );
                                })
                            }
                        </div>
                    </>
                )}

            </div>
            {
                cart.length > 0 && (
                    <div className="w-full flex flex-col items-center">
                        <div className={clsx(
                            "w-full p-5 flex flex-row justify-between items-center",
                            "max-[730px]:fixed max-[730px]:bg-white max-[730px]:border-t max-[730px]:border-gray-300 max-[730px]:bottom-0 max-[730px]:left-0 max-[730px]:right-0 max-[730px]:z-50"
                        )}>
                            <button
                                className="hidden sm:block text-red-500 border border-red-500 rounded-md hover:bg-red-100 hover:cursor-pointer p-1"
                                onClick={() => {
                                    selected.forEach((item) => {
                                        removeFromCart(item);
                                    });
                                }}
                            >
                                Xoá sản phẩm đã chọn
                            </button>
                            <div className="flex-1 sm:flex-none flex flex-col md:flex-row tems-center justify-between gap-5">
                                <div className="w-fit text-nowrap">
                                    <div className={clsx(
                                        "text-green-500 text-xs font-bold",
                                        {
                                            "hidden": !canSubmit,
                                        }
                                    )}>
                                        *Xác nhận thành công, bạn có thể mua hàng ngay bây giờ*
                                    </div>
                                    <p className="inline pr-2">
                                        Tổng cộng ({selected.length} sản phẩm):
                                    </p>
                                    <p className="inline text-xl text-red-500">
                                        ${totalCost}
                                    </p>
                                </div>
                                <button
                                    ref={guestSubmitButton}
                                    onClick={handleClickSubmitButton}
                                    disabled={!(selected.length > 0)}
                                    className={clsx(
                                        "flex flex-row gap-3",
                                        "px-5 py-2 bg-sky-500 rounded-md  text-white",
                                        {
                                            "hover:bg-sky-400 hover:cursor-pointer": canSubmit,
                                            "opacity-25": !(selected.length > 0),
                                        }
                                    )}
                                >
                                    <ChevronsUp className={clsx(
                                        "rotate-90 animate-bounce",
                                        {
                                            "hidden": !canSubmit,
                                        }
                                    )} />
                                    <div className="flex-1">
                                        MUA HÀNG
                                    </div>
                                    <ChevronsUp className={clsx(
                                        "-rotate-90 animate-bounce",
                                        {
                                            "hidden": !canSubmit,
                                        }
                                    )} />
                                </button>
                            </div>
                        </div>

                        {/* Form thông tin khách hàng */}
                        <form ref={guestInfoFormRef} className="mt-5 mx-5 w-full md:w-10/12 lg:max-w-1/2 bg-white p-6 rounded-xl shadow flex flex-col gap-4">
                            <h2 className={clsx(
                                "text-lg font-semibold",
                                {
                                    "text-red-500": !isGuestInfoValid(),
                                    // "text-black": isGuestInfoValid()
                                }
                            )}>
                                Thông tin khách hàng*
                            </h2>

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
                            <div className={clsx(
                                "w-fit text-nowrap text-sm font-bold text-red-500",
                                {
                                    "hidden": isGuestInfoValid(),
                                    // "text-black": isGuestInfoValid()
                                }
                            )}>{getGuestInfoError()}</div>
                            <div className="flex flex-col md:flex-row gap-5 justify-end items-start">
                                <button
                                    type="button"
                                    className={clsx(
                                        "w-full md:w-fit px-6 py-2 bg-blue-500 text-white rounded-lg",
                                        "flex flex-row gap-3 justify-center",
                                        {
                                            "hover:bg-blue-400 transition": isGuestInfoValid(),
                                            "opacity-25": !isGuestInfoValid()
                                        }
                                    )}
                                    onClick={handleConfirmGuestInfo}
                                    disabled={!isGuestInfoValid()}
                                >
                                    <ChevronsUp className={clsx(
                                        "rotate-90 animate-bounce",
                                        {
                                            "hidden": hadCheckingGuestinfo,
                                        }
                                    )} />
                                    <div>Xác nhận thông tin đặt hàng</div>
                                    <ChevronsUp className={clsx(
                                        "-rotate-90 animate-bounce",
                                        {
                                            "hidden": hadCheckingGuestinfo,
                                        }
                                    )} />
                                </button>
                                {/* <button
                                    type="button"
                                    className={clsx(
                                        "w-full md:w-fit px-6 py-2 bg-green-500 text-white rounded-lg",
                                        {
                                            "hover:bg-green-400 transition": isGuestInfoValid(),
                                            "opacity-25": !isGuestInfoValid()
                                        }
                                    )}
                                    onClick={saveGuestInfo}
                                    disabled={!isGuestInfoValid()}
                                >
                                    Lưu thông tin
                                </button> */}
                            </div>
                        </form>
                    </div >
                )
            }
        </div >
    );
}

interface CartTableRowProps {
    id: string;
    type: ProductType;
    name: string;
    option: string;
    price: number;
    quantity: number;
    totalCost: number;
    preview: {
        href: string;
        alt: string;
    }
    removeCallBack: () => void
    isSelected?: boolean;
    selectedCallBack?: () => void;
}

function CartTableRow({ id, type, name, option, price, quantity, totalCost, preview, removeCallBack, selectedCallBack, isSelected }: CartTableRowProps) {
    return (
        <tr className="border-b last:border-none hover:bg-gray-50 transition">
            <td className="p-4">
                <button type="button" onClick={selectedCallBack}>
                    {isSelected ? (<SquareCheckBig className="text-gray-400" />) : (<Square className="text-gray-400" />)}
                </button>
            </td>
            <td className="p-4 flex flex-row gap-2 justify-start items-center">
                <Image src={preview.href} alt={preview.alt} width={80} height={80} />
                <Link
                    href={`/products/${type}/${id}`}
                    className="font-medium hover:underline"
                >
                    {name}
                </Link>
            </td>
            <td className="p-4">{option}</td>
            <td className="p-4 text-right">${price}</td>
            <td className="p-4 text-center">{quantity}</td>
            <td className="p-4 text-right font-semibold text-red-500">${totalCost}</td>
            <td className="p-4 text-center">
                <button
                    className="inline text-red-500 cursor-pointer border-red-500 hover:border p-2 rounded-full"
                    onClick={removeCallBack}
                    type="button"
                >
                    Xóa
                </button>
            </td>
        </tr>
    );
}



function CartTableCard({ id, type, name, option, price, quantity, totalCost, preview, removeCallBack, selectedCallBack, isSelected }: CartTableRowProps) {
    return (
        <div className="flex flex-col border-b border-gray-500 py-3 px-1 gap-5 last:border-none">
            <div className="flex justify-between items-start">
                <div className="flex gap-3">
                    <Image
                        src={preview.href}
                        alt={preview.alt}
                        width={80}
                        height={80}
                        className="rounded-md"
                    />
                    <div className="flex flex-col justify-between min-w-0">
                        <Link
                            href={`/products/${type}/${id}`}
                            className="font-medium hover:underline ellipsis"
                        >
                            {name}
                        </Link>
                        <span className="text-gray-500 text-sm">{option}</span>
                        <span className="text-sm">${price}</span>
                    </div>
                </div>
                <button type="button" onClick={selectedCallBack}>
                    {isSelected ? (<SquareCheckBig width={35} height={35} className="text-gray-400" />) : (<Square width={35} height={35} className="text-gray-400" />)}
                </button>
            </div>
            <div className="flex justify-between items-center">
                <button
                    className="translate-x-3 text-red-500 border border-white hover:border-red-500 px-3 py-1 rounded-full hover:bg-red-50 text-sm"
                    onClick={removeCallBack}
                >
                    Xóa
                </button>
                <div className="flex flex-col justify-end">
                    <span className="text-sm">Số lượng: {quantity}</span>
                    <span className="text-red-500 font-semibold">${totalCost}</span>
                </div>

            </div>

        </div>
    );
}
