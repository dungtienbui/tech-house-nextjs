import { fetchCheckoutSessionById, fetchVariantsByVariantIdArray } from "@/lib/data/fetch-data";
import { CartItems, NO_PREVIEW } from "@/lib/definations/data-dto";
import CheckoutForm from "@/ui/app/checkout/checkout-form";
import Image from "next/image";
import Link from "next/link";


export default async function checkoutInSession({ params }: {
    params: Promise<{ sessionId: string }>
}) {

    const { sessionId } = await params;

    const checkoutSession = await fetchCheckoutSessionById(sessionId);

    if (checkoutSession === undefined) {
        throw new Error("SessionId is not exsist");
    }

    const cart = checkoutSession.cart;

    const expires = new Date(checkoutSession.expires_at);

    if (expires < new Date()) {
        throw new Error("Expires date session checkout.");
    }

    const checkOutItemInfo = await fetchVariantsByVariantIdArray(checkoutSession.cart.map(item => item.variant_id));

    const getItemQuantity = (cart: CartItems, variantId: string) => {
        return cart.find(item => item.variant_id === variantId)?.quantity ?? 0;
    }

    const totalPayment = checkOutItemInfo.reduce((acc, prev) => acc + prev.variant_price * getItemQuantity(cart, prev.variant_id), 0);

    return (
        <div className="flex flex-col gap-5 justify-start items-center">
            <div className="w-full lg:w-[900px] xl:w-[1000px] rounded-xl overflow-hidden bg-white shadow">
                {
                    checkOutItemInfo.length > 0 ? (
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
                                    {checkOutItemInfo.map((item) => {
                                        const optionStr = [
                                            item.ram ? `${item.ram}GB` : null,
                                            item.storage ? `${item.storage}GB` : null,
                                            item.switch_type ? `${item.switch_type} switch` : null,
                                            item.color.color_name,
                                        ].filter(item => item !== null).join(", ");

                                        const quantity = getItemQuantity(cart, item.variant_id);

                                        const totalCost = item.variant_price * quantity;

                                        return (
                                            <CartTableRow
                                                key={item.variant_id}
                                                name={`${item.product_name} - ${item.brand}`}
                                                option={optionStr}
                                                price={item.variant_price}
                                                quantity={quantity}
                                                totalCost={totalCost}
                                                preview={{
                                                    href: item.preview_image.image_url ?? NO_PREVIEW.href,
                                                    alt: item.preview_image.image_alt ?? item.preview_image.image_caption ?? NO_PREVIEW.alt,
                                                }}
                                            />
                                        )
                                    })}
                                </tbody>
                            </table>

                            <div className="flex md:hidden flex-col gap-3 p-3">
                                <div className="text-lg font-bold">Thông tin sản phẩm:</div>
                                {
                                    checkOutItemInfo.map((item) => {
                                        const optionStr = [
                                            item.ram ? `${item.ram}GB` : null,
                                            item.storage ? `${item.storage}GB` : null,
                                            item.switch_type ? `${item.switch_type} switch` : null,
                                            item.color.color_name,
                                        ].filter(item => item !== null).join(", ");

                                        const quantity = getItemQuantity(cart, item.variant_id);

                                        const totalCost = item.variant_price * quantity;

                                        return (
                                            <CartTableCard
                                                key={item.variant_id}
                                                name={`${item.product_name} - ${item.brand}`}
                                                option={optionStr}
                                                price={item.variant_price}
                                                quantity={quantity}
                                                totalCost={totalCost}
                                                preview={{
                                                    href: item.preview_image.image_url ?? NO_PREVIEW.href,
                                                    alt: item.preview_image.image_alt ?? item.preview_image.image_caption ?? NO_PREVIEW.alt,
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
                <div className="text-red-500 font-bold text-xl">${totalPayment}</div>
            </div>

            <CheckoutForm checkoutItems={cart} checkoutId={sessionId} />
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
                        className="font-medium text-ellipsis"
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