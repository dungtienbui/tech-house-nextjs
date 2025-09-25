import { fetchOrdersByPhoneNumber, fetchVariantsByVariantIdArray } from "@/lib/data/fetch-data";
import { deleteCheckoutSession } from "@/lib/data/insert-data";
import { NextResponse } from "next/server";

export async function GET() {

    const resultQuery = await deleteCheckoutSession("e1a9b142-3bfa-4f3c-affa-7c033bd752e8");

    return NextResponse.json({ resultQuery });
}


