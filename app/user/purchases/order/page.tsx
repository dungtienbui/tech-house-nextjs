import { notFound } from 'next/navigation';
import { fetchOrderByIdAndPhone } from '@/lib/data/fetch-data';
import OrderDetail from '@/ui/components/order/order-detail';
import { auth } from '@/auth';
import GoBackButton from '@/ui/app/user/purchases/order/go-back-button';

// === Component chính của trang ===
export default async function OrderDetailPage({ searchParams }: { searchParams: Promise<{ id: string }> }) {
    const { id } = await searchParams;

    const session = await auth();

    if (!session?.user.phone) {
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
    }

    const order = await fetchOrderByIdAndPhone(id, session.user.phone);

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