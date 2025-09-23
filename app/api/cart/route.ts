import { fetchVariantsByVariantIdArray } from "@/lib/data/fetch-data";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const ids: string[] = body.ids;
    const result = await fetchVariantsByVariantIdArray(ids);
    return NextResponse.json(result);
}