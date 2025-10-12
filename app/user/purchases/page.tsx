import { auth } from '@/auth';
import { fetchOrdersByPhoneNumber } from '@/lib/data/fetch-data';
import { NO_PREVIEW } from '@/lib/definations/data-dto';
import { PaymentStatus, PaymentStatusSchema } from '@/lib/definations/types';
import { getPaymentStatusLabel } from '@/lib/utils/types';
import clsx from 'clsx';
import Image from 'next/image';
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

    const statusValid = PaymentStatusSchema.safeParse(searchParams?.status ?? "total");

    const orders = await fetchOrdersByPhoneNumber(session.user.phone, statusValid.success ? statusValid.data : undefined);

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
                    return (
                        <div
                            key={order.order_id}
                            className="border rounded-lg p-4"
                        >
                            {/* Header của đơn hàng */}
                            <div className="flex justify-between items-center pb-3 border-b">
                                <span className="font-mono text-sm text-gray-700">Đơn hàng: #{order.order_id}</span>
                                <span
                                    className={clsx(
                                        "text-xs font-medium px-3 py-1 rounded-full",
                                        order.payment_status ? getPaymentStatusLabelColor(order.payment_status) : "bg-gray-100 text-gray-500"
                                    )}
                                >
                                    {order.payment_status ? getPaymentStatusLabel(order.payment_status) : "######"}
                                </span>
                            </div>

                            {/* Thân của đơn hàng */}
                            {
                                order.products.map((product) => {

                                    const extraInfo = [
                                        product.color_name ?? null,
                                        product.ram ? `${product.ram}GB` : null,
                                        product.storage ? `${product.storage}GB` : null,
                                        product.switch_type ? `${product.switch_type} switch` : null,
                                    ].filter(item => item !== null).join("/")

                                    const cost = product.variant_price * product.quantity;

                                    return (
                                        <div
                                            key={product.variant_id}
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
                                                </div>
                                            </div>
                                            <div className="mt-4 sm:mt-0">
                                                <div className="flex flex-row justify-between">
                                                    <div className='block sm:hidden text-sm text-nowrap'>Giá sản phẩm:{" "}</div>
                                                    <div className="text-red-500 w-full text-right">${product.variant_price}</div>
                                                </div>
                                                <div className="flex flex-row justify-between">
                                                    <div className='block sm:hidden text-sm text-nowrap'>Số lượng:{" "}</div>
                                                    <div className="text-sm w-full text-right">x <span className="text-base">{product.quantity}</span></div>
                                                </div>

                                                <div className="flex flex-row justify-between">
                                                    <div className='block sm:hidden text-sm text-nowrap'>Tổng tiền:{" "}</div>
                                                    <div>
                                                        <div className="border-b border-gray-300" />
                                                        <div className="text-lg text-red-500 mt-2 w-full text-right">${cost}</div>
                                                    </div>
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
                        </div>
                    );
                })
            }
            {
                orders.length === 0 && (
                    <p className='text-center'>Bạn không có đơn hàng nào {statusValid.success && <span className='font-bold'>"{getPaymentStatusLabel(statusValid.data)}"</span>}</p>
                )
            }
        </div>
    );
};