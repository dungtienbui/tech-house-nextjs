import { notFound } from 'next/navigation';
import { fetchOrderByIdAndPhone } from '@/lib/data/fetch-data';
import OrderDetail from '@/ui/components/order/order-detail';
import { auth } from '@/auth';
import GoBackButton from '@/ui/app/user/purchases/order/go-back-button';

// === Component chính của trang ===
export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;

    console.log("orderId: ", orderId);

    const session = await auth();

    if (!session?.user.phone) {
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
    }

    const order = await fetchOrderByIdAndPhone(orderId, session.user.phone);

    if (!order) {
        notFound();
    }



    return (
        <div className='flex flex-col items-start gap-2'>
            <GoBackButton />
            <OrderDetail order={order} />
        </div>
    );
}