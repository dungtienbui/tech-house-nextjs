import { fetchOrdersByPhoneNumber } from "@/lib/data/fetch-data";
import { NO_PREVIEW, OrderDTO, OrderProductDTO } from "@/lib/definations/data-dto";
import { PaymentStatus } from "@/lib/definations/types";
import { getPaymentStatusLabel, isPhoneNumberValid } from "@/lib/utils/types";
import Breadcrumbs from "@/ui/components/breadcrumbs/breadcrumbs";
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
        <div>
            <Breadcrumbs breadcrumbs={[
                {
                    label: "Trang chủ",
                    href: "/",
                    active: false
                },
                {
                    label: "Khách hàng",
                    href: `/user/purchase`,
                    active: false
                },
                {
                    label: `Đơn mua: ${trimmedPhone}`,
                    href: `/user/purchase/${trimmedPhone}`,
                    active: true
                },
            ]} />
            <div className="mt-5">
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
                ) : (
                    <div className="flex flex-col gap-5 lg:px-44">
                        {orders.map((order) => {
                            return (
                                <OrderInfo key={order.order_id} order={order} />
                            );
                        })}
                    </div>)}
            </div>
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
        <div className="border border-gray-300 rounded-md p-5 shadow">
            <div className="relative flex flex-col items-start gap-3">
                <div>
                    <span className="text-sm font-semibold">Mã hoá đơn: </span>
                    <span>{order.order_id}</span>
                </div>
                <div>
                    <span className="text-sm font-semibold">Ngày tạo: </span>
                    <span>{new Date(order.order_created_at).toLocaleString()}</span>
                </div>
                <div className="lg:absolute top-0 right-0">
                    <div className="lg:hidden">
                        <span className="text-sm font-semibold">Trạng thái: </span>
                        <span>{getPaymentStatusLabel(order.payment_status as PaymentStatus)}</span>
                    </div>
                    <span className={`hidden lg:block px-5 py-3 rounded-full border ${getPaymentStatusLabelColor(order.payment_status as PaymentStatus)}`}>{getPaymentStatusLabel(order.payment_status as PaymentStatus)}</span>
                </div>
                <div>
                    <span className="hidden lg:inline text-sm font-semibold">Người mua hàng: </span>
                    <span className="inline lg:hidden text-sm font-semibold">Anh/Chị: </span>
                    <span>{order.buyer_name}</span>
                </div>
                <div>
                    <span className="text-sm font-semibold">Địa chỉ: </span>
                    <span>{order.address} ailsdfj aksjfalskj. aklsjflkasj kajsfkljasldf klasjfklsa</span>
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
        <div className="flex flex-col md:flex-row md:justify-between">
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