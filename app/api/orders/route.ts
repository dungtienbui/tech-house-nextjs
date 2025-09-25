import { insertOrder } from '@/lib/data/insert-data';
import { CartItemsSchema, GuestInfoSchema } from '@/lib/definations/data-dto';
import { PaymentMethodSchema } from '@/lib/definations/types';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';


export async function POST(req: Request) {

    try {
        const data = await req.json();
        const { guest, items, paymentMethod, checkoutSessionId } = data;

        try {
            const questValidated = GuestInfoSchema.parse(guest);
            const itemsValidated = CartItemsSchema.parse(items);
            const paymentMethodValidated = PaymentMethodSchema.parse(paymentMethod);

            const orderId = await insertOrder(itemsValidated, questValidated, paymentMethodValidated, checkoutSessionId);

            revalidatePath("/orders");
            return NextResponse.json({ orderId });

        } catch (error) {
            if (error instanceof ZodError) {
                console.error("Validation errors:", error.message);
            } else {
                console.error("Unknown error:", error);
            }

            return NextResponse.json({ error }, { status: 500 });
        }



    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: String(err) }, { status: 500 });
        }

    }
}