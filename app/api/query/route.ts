import { fetchOrdersByPhoneNumber, fetchVariantsByVariantIdArray } from "@/lib/data/fetch-data";
import { NextResponse } from "next/server";

export async function GET() {

    const resultQuery = await fetchOrdersByPhoneNumber("0123456780");

    return NextResponse.json({ resultQuery });
}


