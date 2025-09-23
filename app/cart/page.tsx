'use client'
import { useCart } from "@/lib/context/card-context";
import { NO_PREVIEW } from "@/lib/definations/data-dto";
import { ProductType } from "@/lib/definations/types";
import { Square, SquareCheckBig } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Cart() {

    const { cart, cartProductInfo, removeFromCart } = useCart();

    const [selected, setSelected] = useState<string[]>([]);

    const isSelectedAll = cart.every(item => selected.includes(item.variantId));

    return (
        <div className="p-6 pt-10 -translate-y-5 bg-gray-50 min-h-screen">
            <div className="overflow-x-auto rounded-2xl shadow">
                {cartProductInfo.length === 0 ? (
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
                        <table className="hidden min-[730px]:table w-full border-collapse bg-white">
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

                                    const quantity = cart.find(cartItem => cartItem.variantId === item.variant_id)?.quantity ?? 0;

                                    const totalCost = quantity * item.variant_price;

                                    const isSelected = selected.includes(item.variant_id);

                                    return (
                                        <CartTableRow
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
                                    )
                                })}
                            </tbody>
                        </table>

                        <div className="flex min-[730px]:hidden flex-col gap-3 p-3">
                            {
                                cartProductInfo.map((item) => {
                                    const optionStr = [
                                        item.ram ? `${item.ram}GB` : null,
                                        item.storage ? `${item.storage}GB` : null,
                                        item.switch_type ? `${item.switch_type} switch` : null,
                                        item.color_name,
                                    ].filter(item => item !== null).join(", ");

                                    const quantity = cart.find(cartItem => cartItem.variantId === item.variant_id)?.quantity ?? 0;

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
                    <div className="w-full p-5 flex flex-row justify-between items-center">
                        <button
                            className="text-red-500 border border-red-500 rounded-md hover:bg-red-100 hover:cursor-pointer p-1"
                            onClick={() => {
                                selected.forEach((item) => {
                                    removeFromCart(item);
                                });
                            }}
                        >
                            Xoá sản phẩm đã chọn
                        </button>
                        <button
                            className="px-20 py-2 bg-sky-500 rounded-md hover:bg-sky-400 hover:cursor-pointer text-white"
                        >
                            MUA HÀNG
                        </button>
                    </div>
                )
            }

        </div>
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



function CartTableCard({ id, type, name, option, price, quantity, totalCost, preview, removeCallBack }: CartTableRowProps) {
    return (
        <div className="flex flex-col border-b border-gray-500 py-3 px-1 gap-3 last:border-none">
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
                        className="font-medium hover:underline truncate"
                    >
                        {name}
                    </Link>
                    <span className="text-gray-500 text-sm">{option}</span>
                    <span className="text-sm">${price}</span>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm">Số lượng: {quantity}</span>
                <span className="text-red-500 font-semibold">${totalCost}</span>
            </div>
            <div className="flex justify-end">
                <button
                    className="text-red-500 border border-red-500 px-3 py-1 rounded-full hover:bg-red-50 text-sm"
                    onClick={removeCallBack}
                >
                    Xóa
                </button>
            </div>
        </div>
    );
}
