'use client'
import { useCart } from "@/lib/context/card-context";
import { CartItems, NO_PREVIEW } from "@/lib/definations/data-dto";
import { ProductType } from "@/lib/definations/types";
import clsx from "clsx";
import { ChevronsUp, Square, SquareCheckBig } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Cart() {

    const router = useRouter();

    const { cart, cartProductInfo, removeFromCart } = useCart();


    const [selected, setSelected] = useState<string[]>([]);

    function selectCartItem(id: string) {
        if (!selected.includes(id)) {
            setSelected([...selected, id]);
        }
    }

    function selectAllCartItems() {
        setSelected(cart.map(item => item.variant_id));
    }

    function removeSelectedCartItem(id: string) {
        if (selected.includes(id)) {
            setSelected(selected.filter(s => s !== id));
        }
    }

    function removeAllSelectedCartItems() {
        setSelected([]);
    }

    const isSelectedAll = cart.length > 0 && cart.every(item => selected.includes(item.variant_id));

    const totalCost = selected.reduce((acc, id) => {
        const exsit = cartProductInfo.find(c => c.variant_id === id);
        if (exsit) {
            return acc + exsit.quantity * exsit.variant_price;
        }

        return acc + 0;
    }, 0);

    const goToCheckout = async () => {

        const checkoutItems: CartItems = cart.filter((item) => selected.includes(item.variant_id));

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
        <div className="px-5 lg:px-10">
            <div className="rounded-2xl shadow">
                {cart.length === 0 ? (
                    <div className="flex flex-col justify-center items-center gap-5 pb-10">
                        <Image
                            src={"https://cdn-icons-png.flaticon.com/512/11329/11329060.png"}
                            alt={"Cart empty!"}
                            width={150}
                            height={150}
                        />
                        <div className="flex flex-col gap-3 text-center">
                            <div className="text-sm font-bold">Giỏ hàng của bạn còn trống</div>
                            <Link
                                className="px-10 py-3 bg-sky-500 text-white"
                                href={"/"}>
                                MUA NGAY
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <table className="hidden min-[750px]:table w-full border-collapse bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 text-left">
                                        <button type="button" onClick={() => {
                                            if (isSelectedAll) {
                                                removeAllSelectedCartItems();
                                            } else {
                                                selectAllCartItems();
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
                                        item.color.color_name,
                                    ].filter(item => item !== null).join(", ");

                                    const totalCost = item.variant_price * item.quantity;

                                    const isSelected = selected.includes(item.variant_id);

                                    return (
                                        <CartTableRow
                                            id={item.variant_id}
                                            type={item.product_type}
                                            key={item.variant_id}
                                            name={`${item.product_name} - ${item.brand}`}
                                            option={optionStr}
                                            price={item.variant_price}
                                            quantity={item.quantity}
                                            totalCost={totalCost}
                                            preview={{
                                                href: item.preview_image.image_url ?? NO_PREVIEW.href,
                                                alt: item.preview_image.image_alt ?? item.preview_image.image_caption ?? NO_PREVIEW.alt,
                                            }}
                                            removeCallBack={() => removeFromCart(item.variant_id)}
                                            isSelected={isSelected}
                                            selectedCallBack={() => {
                                                if (isSelected) {
                                                    removeSelectedCartItem(item.variant_id);
                                                } else {
                                                    selectCartItem(item.variant_id)
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
                                        item.color.color_name,
                                    ].filter(item => item !== null).join(", ");

                                    const totalCost = item.variant_price * item.quantity;

                                    const isSelected = selected.includes(item.variant_id);

                                    return (
                                        <CartTableCard
                                            id={item.variant_id}
                                            type={item.product_type}
                                            key={item.variant_id}
                                            name={`${item.product_name} - ${item.brand}`}
                                            option={optionStr}
                                            price={item.variant_price}
                                            quantity={item.quantity}
                                            totalCost={totalCost}
                                            preview={{
                                                href: item.preview_image.image_url ?? NO_PREVIEW.href,
                                                alt: item.preview_image.image_alt ?? item.preview_image.image_caption ?? NO_PREVIEW.alt,
                                            }}
                                            removeCallBack={() => removeFromCart(item.variant_id)}
                                            isSelected={isSelected}
                                            selectedCallBack={() => {
                                                if (isSelected) {
                                                    removeSelectedCartItem(item.variant_id);
                                                } else {
                                                    selectCartItem(item.variant_id)
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
            {cart.length > 0 && (
                <div className="w-full flex flex-row justify-between items-start px-2 sm:px-10 py-5">
                    {/* Nut xoa san pham lua chon */}
                    <button
                        disabled={!(selected.length > 0)}
                        className={clsx(
                            "hidden sm:block border rounded-md hover:cursor-pointer p-1",
                            {
                                "border-gray-300 text-gray-300": !(selected.length > 0),
                                "border-red-500 text-red-500 hover:bg-red-100": (selected.length > 0),
                            }
                        )}
                        onClick={() => {
                            selected.forEach((item) => {
                                removeFromCart(item);
                            });
                        }}
                    >
                        Xoá sản phẩm đã chọn
                    </button>

                    {/* Nut thanh toan */}
                    <div className="flex-1 sm:flex-none sm:min-w-64 flex flex-col gap-5 items-end">
                        <div className="w-full flex flex-row justify-between items-center sm:flex-col sm:items-end gap-2">
                            <div>
                                <span className="text-sm font-semibold">
                                    Tổng cộng <span className="hidden sm:inline text-base font-normal">({selected.length} sản phẩm)</span> :
                                </span>

                            </div>
                            <div className="text-xl text-red-500">
                                ${totalCost}
                            </div>
                        </div>
                        <button
                            disabled={!(selected.length > 0)}
                            onClick={goToCheckout}
                            className={clsx(
                                "w-full flex flex-row justify-center items-center gap-5 px-5 py-2 rounded-md text-white",
                                {
                                    "bg-gray-300": !(selected.length > 0),
                                    "bg-sky-500 hover:bg-sky-400": (selected.length > 0),
                                }
                            )}
                        >
                            <ChevronsUp className={clsx(
                                "rotate-90 animate-bounce",
                                {
                                    "hidden": !(selected.length > 0),
                                }
                            )} />
                            <div className="flex-1">
                                MUA HÀNG
                            </div>
                            <ChevronsUp className={clsx(
                                "-rotate-90 animate-bounce",
                                {
                                    "hidden": !(selected.length > 0),
                                }
                            )} />
                        </button>
                    </div>
                </div>
            )}
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
                <div className="flex flex-col items-end">
                    <span className="text-sm">x {quantity}</span>
                    <span className="text-red-500 font-semibold">${totalCost}</span>
                </div>

            </div>

        </div>
    );
}
