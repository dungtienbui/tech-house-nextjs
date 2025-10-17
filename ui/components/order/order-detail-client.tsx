'client'

import Image from 'next/image';
import { MapPin, User, Phone } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/funcs';
import OrderStatusStepper from '@/ui/app/track-order/order/order-status-stepper';
import { OrderDetailsDTO } from '@/lib/definations/data-dto';

// === Component chính của trang ===
export default function OrderDetail({ order }: { order: OrderDetailsDTO }) {

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng</h1>
                    <p className="text-gray-500">
                        Mã đơn hàng: <span className="font-semibold text-gray-700">{order.order_id}</span>
                    </p>
                    <p className="text-gray-500">
                        Ngày đặt: <span className="font-semibold text-gray-700">{new Date(order.order_created_at).toLocaleDateString('vi-VN')}</span>
                    </p>
                </div>

                {/* Trạng thái đơn hàng */}
                <OrderStatusStepper status={order.payment_status} />

                {/* Bố cục chính */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
                    {/* Cột trái: Danh sách sản phẩm */}
                    <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Sản phẩm</h2>
                        <div className="space-y-4">
                            {order.products.map(item => (
                                <div key={item.variant_id} className="flex items-start gap-4 border-b pb-4 last:border-b-0">
                                    <Image
                                        src={item.preview_image_url || '/placeholder.png'}
                                        alt={item.preview_image_alt || item.product_name}
                                        width={80}
                                        height={80}
                                        className="rounded-md object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{item.product_name}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.color_name && `Màu: ${item.color_name}`}
                                            {item.ram && `, RAM: ${item.ram}GB`}
                                            {item.storage && `, Bộ nhớ: ${item.storage}GB`}
                                        </p>
                                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-gray-700">{formatCurrency(item.variant_price)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cột phải: Thông tin & Tổng kết */}
                    <div className="space-y-6">
                        {/* Thông tin giao hàng */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>
                            <div className="space-y-2 text-gray-700">
                                <p className="flex items-center gap-2"><User size={16} /> {order.buyer_name}</p>
                                <p className="flex items-center gap-2"><Phone size={16} /> {order.phone_number}</p>
                                <p className="flex items-start gap-2"><MapPin size={16} /> {`${order.street}, ${order.ward}, ${order.province}`}</p>
                            </div>
                        </div>

                        {/* Tổng kết đơn hàng */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Tổng kết</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Tạm tính:</span>
                                    <span>{formatCurrency(order.total_amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phí vận chuyển:</span>
                                    <span>Miễn phí</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                                    <span>Tổng cộng:</span>
                                    <span>{formatCurrency(order.total_amount)}</span>
                                </div>
                                <p className="text-sm text-green-600 text-center mt-2">
                                    (Bạn nhận được {order.reward_points} điểm thưởng)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}