'use client'

import { NO_PREVIEW } from "@/lib/definations/data-dto";
import clsx from "clsx";
import { ChevronsUp, Square, SquareCheckBig } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CartTableCard from "./cart-table-card";
import CartTableRow from "./cart-table-row";
import { useVariantsByIds } from "@/lib/hook/use-variants-hook";
import { useCart } from "@/lib/hook/use-cart-hook";
import CheckoutButton from "./check-out-button";


export default function ClientCart() {

    const { items, removeFromCart } = useCart();

    const [selected, setSelected] = useState<string[]>([]);

    function selectCartItem(id: string) {
        if (!selected.includes(id)) {
            setSelected([...selected, id]);
        }
    }

    function selectAllCartItems() {
        setSelected(items.map(item => item.variant_id));
    }

    function removeSelectedCartItem(id: string) {
        if (selected.includes(id)) {
            setSelected(selected.filter(s => s !== id));
        }
    }

    function removeAllSelectedCartItems() {
        setSelected([]);
    }

    const isSelectedAll = items.length > 0 && items.every(item => selected.includes(item.variant_id));

    const checkoutItems = items.filter(item => selected.includes(item.variant_id));

    const variantIds = items.map(item => item.variant_id);

    const { data: variants } = useVariantsByIds(variantIds);

    const detailedCart = useMemo(() => {

        if (!variants) {
            return [];
        }

        const data = items.map(item => {
            const productInfo = variants.find(v => v.variant_id === item.variant_id);

            if (!productInfo) {
                return undefined;
            }

            return {
                ...productInfo,
                variant_price: parseFloat(String(productInfo.variant_price)),
                quantity: item.quantity,
            };
        }).filter(item => item !== undefined);

        return data;

    }, [items, variants]);

    const totalCost = useMemo(() => {

        const cost = selected.reduce((accumulator, selectedId) => {
            const item = detailedCart.find(cartItem => cartItem.variant_id === selectedId);

            if (item) {
                return accumulator + (item.variant_price * item.quantity);
            }
            return accumulator;
        }, 0);

        return cost;
    }, [selected, detailedCart]);


    return (
        <div className="px-5 lg:px-10">
            <div className="rounded-2xl shadow">
                {items.length === 0 ? (
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
                                {detailedCart.map((item) => {
                                    const optionStr = [
                                        item.ram ? `${item.ram}GB` : null,
                                        item.storage ? `${item.storage}GB` : null,
                                        item.switch_type ? `${item.switch_type} switch` : null,
                                        item.color.color_name,
                                    ].filter(item => item !== null).join(", ");

                                    const cost = item.variant_price * item.quantity;

                                    const isSelected = selected.includes(item.variant_id);

                                    const name = `${item.brand.brand_name} - ${item.product_name}`;

                                    return (
                                        <CartTableRow
                                            id={item.variant_id}
                                            type={item.product_type}
                                            key={item.variant_id}
                                            name={name}
                                            option={optionStr}
                                            price={item.variant_price}
                                            quantity={item.quantity}
                                            totalCost={cost}
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
                                detailedCart.map((item) => {
                                    const optionStr = [
                                        item.ram ? `${item.ram}GB` : null,
                                        item.storage ? `${item.storage}GB` : null,
                                        item.switch_type ? `${item.switch_type} switch` : null,
                                        item.color.color_name,
                                    ].filter(item => item !== null).join(", ");

                                    const cost = item.variant_price * item.quantity;

                                    const isSelected = selected.includes(item.variant_id);

                                    const name = `${item.brand.brand_name} - ${item.product_name}`;

                                    return (
                                        <CartTableCard
                                            id={item.variant_id}
                                            type={item.product_type}
                                            key={item.variant_id}
                                            name={name}
                                            option={optionStr}
                                            price={item.variant_price}
                                            quantity={item.quantity}
                                            totalCost={cost}
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
            {items.length > 0 && (
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
                        <CheckoutButton disable={selected.length === 0} checkoutItems={checkoutItems} />
                    </div>
                </div>
            )}
        </div >
    );
}
