import { fetchOrdersByPhoneNumber } from "@/lib/data/fetch-data";
import { NO_PREVIEW, OrderDTO, OrderProductDTO } from "@/lib/definations/data-dto";
import { PaymentStatus } from "@/lib/definations/types";
import { getPaymentStatusLabel, isPhoneNumberValid } from "@/lib/utils/types";
import Devider from "@/ui/components/divider/divider";
import Image from "next/image";
import Link from "next/link";

export default async function PurchasesByPhonePage({
    params,
}: {
    params: Promise<{ phone: string }>
}) {
    const { phone } = await params;

    const trimmedPhone = phone.trim();

    if (!isPhoneNumberValid(trimmedPhone)) {
        throw new Error("Phone number is invalid.");
    }

    const orders = await fetchOrdersByPhoneNumber(trimmedPhone);

    return (
        <div className="flex flex-col md:flex-row gap-5 justify-center items-center">
            {orders.length === 0 ? (
                <div className="flex flex-col justify-center items-center gap-5">
                    <Image src={"/shopping-bag.svg"} alt={"Empty shopping bag image"} width={200} height={200} />
                    <div className="flex flex-col gap-3 text-center">
                        <div className="text-sm font-bold">Số điện thoại này chưa có đơn mua nào!</div>
                        <Link
                            className="px-10 py-3 bg-sky-500 text-white"
                            href={"/"}
                        >
                            MUA HÀNG NGAY
                        </Link>
                    </div>
                </div>
            ) :
                (
                    <div>
                        <h2 className="font-semibold mb-4">
                            <span>Đơn mua của: </span>
                            <span className="text-xl">{phone}</span>
                        </h2>
                        {orders.map((order) => {
                            return (
                                <OrderInfo key={order.order_id} order={order} />
                            );
                        })}
                    </div>
                )
            }
        </div>
    );
}

function OrderInfo({ order }: { order: OrderDTO }) {

    const getPaymentStatusLabelColor = (status: PaymentStatus) => {
        switch (status) {
            case "pending":
                return "text-yellow-600 bg-yellow-100";
            case "paid":
                return "text-green-600 bg-green-100";
            case "failed":
                return "text-red-600 bg-red-100";
            case "refunded":
                return "text-blue-600 bg-blue-100";
            case "cancelled":
                return "text-gray-600 bg-gray-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    return (
        <div className="p-5 border-t md:border border-gray-500 md:rounded-2xl mb-5">
            <div className="relative">
                <div className="flex flex-col items-start">
                    <div>
                        <span className="text-sm font-semibold">Mã hoá đơn: </span>
                        <span>{order.order_id}</span>
                    </div>
                    <div>
                        <span className="text-sm font-semibold">Ngày tạo: </span>
                        <span>{new Date(order.order_created_at).toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-sm font-semibold">Trạng thái: </span>
                        <span className={`px-2 text-sm rounded-full border ${getPaymentStatusLabelColor(order.payment_status as PaymentStatus)}`}>{getPaymentStatusLabel(order.payment_status as PaymentStatus)}</span>
                    </div>
                    <div>
                        <span className="text-sm font-semibold">Người mua hàng: </span>
                        <span>{order.buyer_name}</span>
                    </div>
                    <div>
                        <span className="text-sm font-semibold">Địa chỉ: </span>
                        <span>{order.address} ailsdfj aksjfalskj. aklsjflkasj kajsfkljasldf klasjfklsa</span>
                    </div>
                </div>
            </div>
            <Devider border="border-b" borderColor="border-gray-300" margin="my-3" />
            <div className="text-sm font-semibold my-3">Sản phẩm được mua: </div>
            <div className="flex flex-col gap-5">
                {
                    order.products.map((product) => <ProductInfo key={product.variant_id} product={product} />)
                }

            </div>
            <Devider border="border-b" borderColor="border-gray-300" margin="my-3" />
            <div className="flex flex-row justify-between">
                <span className="text-sm font-semibold">Tổng thanh toán: </span>
                <span className="text-red-500 text-lg font-bold">${order.total_amount}</span>
            </div>
        </div>
    );
}

function ProductInfo({ product }: { product: OrderProductDTO }) {

    const optionStr = [
        product.ram ? `${product.ram}GB` : null,
        product.storage ? `${product.storage}GB` : null,
        product.switch_type ? `${product.switch_type} switch` : null,
        product.color_name,
    ]
        .filter(Boolean)
        .join("/");

    const name = `${product.product_name} - ${optionStr}`;

    return (
        <div className="flex flex-col items-end md:flex-row md:justify-between md:items-start">
            <div className="flex flex-row gap-2">
                <Image
                    src={product.preview_image_url ?? NO_PREVIEW.href}
                    alt={product.preview_image_alt ?? NO_PREVIEW.alt}
                    width={70}
                    height={70}
                    className="rounded-md"
                />
                <Link className="text-wrap truncate hover:underline" href={`/products/${product.product_type}/${product.variant_id}`}>{name}</Link>
            </div>
            <div className="flex flex-col justify-between items-end min-w-1/4">
                <div>${product.variant_price}</div>
                <div>x {product.quantity}</div>
                <div className="text-red-500">
                    ${product.variant_price * product.variant_price}
                </div>
            </div>
        </div>
    );
}