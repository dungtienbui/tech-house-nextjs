import { fetchProductVariantsInShort } from "@/app/lib/data/fetch-data";
import { NextResponse } from "next/server";

export async function GET() {

    const resultQuery = await fetchProductVariantsInShort("phone", {
        limit: 3,
        isPromoting: true,
    });

    return NextResponse.json({ resultQuery });
}


