import { fetchCheckoutSessionById, fetchVariantPrices, fetchVariantStock } from '@/lib/data/fetch-data';
import { insertGuestOrder } from '@/lib/data/insert-data';
import { CartItemsSchema, GuestInfoSchema, GuestOrderData } from '@/lib/definations/data-dto';
import { PaymentMethodSchema } from '@/lib/definations/types';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';


export async function POST(req: Request) {

    try {
        const data = await req.json();
        const { guest, paymentMethod, checkoutSessionId } = data;

        try {

            const checkoutSession = await fetchCheckoutSessionById(String(checkoutSessionId));

            if (!checkoutSession) {
                throw new Error("Không tồn tại phiên thanh toán")
            }

            if (checkoutSession.cart.length === 0) {
                throw new Error("Không có sản phẩm trong phiên thanh toán")
            }

            const itemsValidated = checkoutSession.cart;

            const questValidated = GuestInfoSchema.parse(guest);
            const paymentMethodValidated = PaymentMethodSchema.parse(paymentMethod);

            const itemStocks = await fetchVariantStock(itemsValidated.map(item => item.variant_id));

            // console.log("itemStocks: ", itemStocks);

            itemsValidated.forEach((item) => {
                const stock = itemStocks[item.variant_id];
                if (!stock) {
                    throw new Error("Không tìm thấy sản phẩm trong kho");
                }

                if (stock < item.quantity) {
                    throw new Error("Không đủ sản phẩm trong kho");
                }

                const newStock = stock - item.quantity;

                itemStocks[item.variant_id] = newStock;
            })

            // console.log("itemStocks: ", itemStocks);

            const itemPrices = await fetchVariantPrices(itemsValidated.map(item => item.variant_id));

            const total_amount = itemsValidated.reduce((acc, prev) => acc + prev.quantity * (itemPrices[prev.variant_id] ?? 0), 0)


            const data: GuestOrderData = {
                payment_method: paymentMethodValidated,
                payment_status: 'pending',
                total_amount: total_amount,
                reward_points: Math.floor(total_amount / 100),
                buyer_name: questValidated.name,
                phone_number: questValidated.phone,
                province: questValidated.address.province,
                ward: questValidated.address.ward,
                street: questValidated.address.street,
                items: itemsValidated.map(item => ({
                    ...item,
                    variant_price: itemPrices[item.variant_id] ?? 0,
                    newStock: itemStocks[item.variant_id]
                }))
            }

            // console.log("data: ", data);

            const orderId = await insertGuestOrder(data);

            // console.log("orderId: ", orderId);

            revalidatePath("/user/purchases", "page");
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