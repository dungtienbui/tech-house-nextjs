import { auth } from '@/auth';
import { fetchOrderByPhone } from '@/lib/data/fetch-data';
import { NO_PREVIEW } from '@/lib/definations/data-dto';
import { PaymentStatus, PaymentStatusSchema } from '@/lib/definations/types';
import { getPaymentStatusLabel } from '@/lib/utils/types';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Component chính của trang
export default async function UserPage(props: {
    searchParams?: Promise<{
        status?: string;
    }>;
}) {

    const session = await auth();

    if (!session?.user.phone) {
        notFound();
    }

    const searchParams = await props.searchParams;

    const statusValid = PaymentStatusSchema.safeParse(searchParams?.status);

    const orders = await fetchOrderByPhone(session?.user.phone, statusValid.success ? statusValid.data : "total");

    const getPaymentStatusLabelColor = (status: PaymentStatus) => {
        switch (status) {
            case "pending":
                return "bg-yellow-300";
            case "confirmed":
                return "bg-blue-300";
            case "shipping":
                return "bg-indigo-300";
            case "delivered":
                return "bg-green-300";
            case "completed":
                return "bg-emerald-300";
            case "cancelled":
                return "bg-red-300";
            default:
                return "bg-gray-300";
        }
    };

    return (
        <div className="space-y-4">
            {/* Một đơn hàng mẫu */}
            {
                orders.map((order) => {

                    const paymentStatusValidated = PaymentStatusSchema.safeParse(order.payment_status);

                    const numberOfProduct = order.products.length;

                    const URLParams = new URLSearchParams(searchParams);
                    URLParams.set("id", order.order_id);
                    const detailLink = `/user/purchases/order?${URLParams.toString()}`

                    return (
                        <div
                            key={order.order_id}
                            className="border rounded-lg p-4"
                        >
                            {/* Header của đơn hàng */}
                            <div className="flex flex-col gap-2 sm:flex-row justify-between sm:items-center pb-3 border-b">
                                <div>
                                    <p className="font-mono text-sm text-gray-700">Đơn hàng: <span className='font-bold'>#{order.order_id}</span></p>
                                    <p className="font-mono text-sm text-gray-700">Ngày tạo: <span className='font-bold'>{order.order_created_at.toLocaleDateString('vi-VN')}</span></p>
                                </div>
                                <span
                                    className={clsx(
                                        "text-xs font-medium px-3 py-1 rounded-full w-fit",
                                        paymentStatusValidated.success ? getPaymentStatusLabelColor(paymentStatusValidated.data) : "bg-gray-100 text-gray-500"
                                    )}
                                >
                                    {paymentStatusValidated.success ? getPaymentStatusLabel(paymentStatusValidated.data) : "######"}
                                </span>
                            </div>

                            {/* Thân của đơn hàng */}
                            {
                                order.products.map((product, idx) => {

                                    const extraInfo = [
                                        product.color_name ?? null,
                                        product.ram ? `${product.ram}GB` : null,
                                        product.storage ? `${product.storage}GB` : null,
                                        product.switch_type ? `${product.switch_type} switch` : null,
                                    ].filter(item => item !== null).join("/")

                                    const cost = product.variant_price * product.quantity;

                                    return (
                                        <div key={product.variant_id} className={clsx(
                                            {
                                                "border-b border-gray-200": idx < numberOfProduct - 1
                                            }
                                        )}>
                                            <div

                                                className="flex flex-col sm:flex-row justify-between items-stretch pt-4"
                                            >
                                                <div className="flex items-start space-x-4">
                                                    {/* Bạn cần tạo file ảnh này trong thư mục /public */}
                                                    <Image
                                                        src={product.preview_image_url ?? NO_PREVIEW.href}
                                                        alt={product.preview_image_alt ?? NO_PREVIEW.alt}
                                                        width={80}
                                                        height={80}
                                                        className="rounded-md object-cover border"
                                                    />
                                                    <div>
                                                        <p className="font-semibold">{product.product_name}</p>
                                                        <p className="text-sm text-gray-500 mt-1 text-nowrap">{extraInfo}</p>
                                                        <p className="text-xs">Số lượng: <span className="text-base font-bold">{product.quantity}</span></p>
                                                        <p className="text-xs">Giá sản phẩm: <span className="text-base font-bold text-red-500">${product.variant_price}</span></p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-between items-center">
                                                    <div className='block sm:hidden text-sm text-nowrap font-semibold'>Tổng tiền:{" "}</div>
                                                    <div className="text-lg text-red-500 font-bold">${cost}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            {/* Footer của đơn hàng */}
                            <div className="flex flex-row justify-between mt-4 border-t pt-4">
                                <div className="font-bold text-nowrap">Tổng tiền thanh toán:</div>
                                <div className="text-xl text-red-600 font-bold">{order.total_amount}</div>
                            </div>
                            <div className="flex flex-row justify-end mt-3">
                                <Link
                                    className="border border-blue-500 text-blue-500 px-5 py-1 rounded-md"
                                    href={detailLink}
                                >
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    );
                })
            }
            {
                orders.length === 0 && (
                    <p className='text-center'>Bạn không có đơn hàng nào {statusValid.success && <span className='font-bold'>"{getPaymentStatusLabel(statusValid.data)}"</span>}</p>
                )
            }
        </div >
    );
};