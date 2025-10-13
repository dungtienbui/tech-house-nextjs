import { fetchCartItemsByUserId } from "@/lib/data/fetch-data";
import { InsertItemsToCart } from "@/lib/data/insert-data";
import { CartItemsSchema } from "@/lib/definations/data-dto";
import { NextResponse } from "next/server";
import z from "zod";

export async function POST(req: Request) {
    const { items, userId } = await req.json();
    try {

        const itemsValidated = CartItemsSchema.safeParse(items);

        if (!itemsValidated.success) {
            const err = z.flattenError(itemsValidated.error).fieldErrors
            console.log("error: ", err);
            return NextResponse.json({ error: "Lỗi kiểu dữ liệu CartItems" }, { status: 500 })
        }

        const resultQuery = await InsertItemsToCart(userId, itemsValidated.data);

        console.log("resultQuery: ", resultQuery);
        return NextResponse.json({ resultQuery });
    } catch (e) {
        const err = e as Error;
        console.log("error: ", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}


export async function GET(req: Request) {
    const { userId } = await req.json();
    try {

        const resultQuery = await fetchCartItemsByUserId(userId);

        console.log("resultQuery: ", resultQuery);
        return NextResponse.json({ resultQuery });
    } catch (e) {
        const err = e as Error;
        console.log("error: ", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}