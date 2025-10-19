import { fetchCheckoutSessionById, fetchUserById, fetchVariantsByVariantIdArray } from "@/lib/data/fetch-data";
import { NO_PREVIEW } from "@/lib/definations/data-dto";
import CheckoutForm from "@/ui/app/checkout/checkout-form";
import CheckoutItemCard from "@/ui/app/checkout/checkout-item-card";
import CheckoutItemRow from "@/ui/app/checkout/checkout-item-row";
import Link from "next/link";


export default async function checkoutInSession({ searchParams }: {
    searchParams: Promise<{ id: string }>
}) {

    const { id } = await searchParams;

    const checkoutSession = await fetchCheckoutSessionById(id);

    if (checkoutSession === undefined) {
        throw new Error("Check out session is not exsist");
    }

    const expires = new Date(checkoutSession.expires_at);

    if (expires < new Date()) {
        throw new Error("Expires date session checkout.");
    }

    const cart = checkoutSession.cart;

    if (cart.length === 0) {
        throw new Error("Can not find items in checkout.");
    }

    const variants = await fetchVariantsByVariantIdArray(cart.map(item => item.variant_id));

    if (!variants || variants.length === 0) {
        throw new Error("Can not find items info.");
    }

    const detailedCart = cart.map(item => {
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

    const totalPayment = detailedCart.reduce((accumulator, item) => {
        return accumulator + (item.variant_price * item.quantity);
    }, 0);

    return (
        <div className="flex flex-col gap-5 justify-start items-center">
            <div className="w-full lg:w-[900px] xl:w-[1000px] rounded-xl overflow-hidden bg-white shadow">
                {
                    detailedCart.length > 0 ? (
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
                                    {detailedCart.map((item) => {
                                        const optionStr = [
                                            item.ram ? `${item.ram}GB` : null,
                                            item.storage ? `${item.storage}GB` : null,
                                            item.switch_type ? `${item.switch_type} switch` : null,
                                            item.color.color_name,
                                        ].filter(item => item !== null).join(", ");

                                        const totalCost = item.variant_price * item.quantity;

                                        return (
                                            <CheckoutItemRow
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
                                            />
                                        )
                                    })}
                                </tbody>
                            </table>

                            <div className="flex md:hidden flex-col gap-3 p-3">
                                <div className="text-lg font-bold">Thông tin sản phẩm:</div>
                                {
                                    detailedCart.map((item) => {
                                        const optionStr = [
                                            item.ram ? `${item.ram}GB` : null,
                                            item.storage ? `${item.storage}GB` : null,
                                            item.switch_type ? `${item.switch_type} switch` : null,
                                            item.color.color_name,
                                        ].filter(item => item !== null).join(", ");

                                        const totalCost = item.variant_price * item.quantity;

                                        return (
                                            <CheckoutItemCard
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

            <CheckoutForm checkoutItems={cart} checkoutId={id} />
        </div>
    );
}