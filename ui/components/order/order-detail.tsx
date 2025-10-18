import { MapPin, User, Phone } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/funcs';
import OrderStatusStepper from '@/ui/app/track-order/order/order-status-stepper';
import { OrderDetailsDTO } from '@/lib/definations/data-dto';
import OrderProduct from './order-product';

// === Component chính của trang ===
export default function OrderDetail({ order }: { order: OrderDetailsDTO }) {

    return (
        <div className="min-h-screen">
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
                                <OrderProduct key={item.variant_id} product={item} orderId={order.order_id} />
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