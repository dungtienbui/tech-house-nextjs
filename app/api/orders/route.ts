import { GuestInfo } from '@/lib/context/guest-context';
import { insertOrder } from '@/lib/data/insert-data';
import { isCartItem, isCartItemArray, isGuestInfoValid, isPaymentMethod } from '@/lib/utils/types';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {

    try {
        const data = await req.json();
        const { guest, items, paymentMethod } = data;

        // Validate cơ bản
        if (!guest || !paymentMethod || !items || items.length === 0) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        if (!isGuestInfoValid(guest)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        if (!isCartItemArray(items)) {
            return;
        }

        if (!isPaymentMethod(paymentMethod)) {
            return;
        }

        // TODO: lưu vào database
        // console.log('Order received:', { guest, items });

        const orderId = await insertOrder(items, guest, paymentMethod);

        return NextResponse.json({ message: `orderId: ${orderId}` });
    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: String(err) }, { status: 500 });
        }

    }
}