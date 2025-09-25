// app/api/checkout/route.ts
import { insertCheckoutSession } from "@/lib/data/insert-data";
import { CartItemsSchema } from "@/lib/definations/data-dto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { checkoutItems } = await req.json();

    const parsed = CartItemsSchema.safeParse(checkoutItems);

    if (!parsed.success) {
        console.log(parsed.error);
        throw new Error("Cart không hợp lệ");
    }

    const validatedItems = parsed.data;

    const apiQueryResult = await insertCheckoutSession(validatedItems);

    return NextResponse.json({ apiQueryResult });
}