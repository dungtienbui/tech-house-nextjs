import { fetchProductVariantsInShort, fetchSpecsOfVariant, fetchVariantsOfProductBaseByVariantId } from "@/app/lib/data/fetch-data";
import { mapSpecToArray } from "@/app/lib/utils/types";
import { NextResponse } from "next/server";

export async function GET() {

    // const resultQuery = await fetchProductVariantsInShort("phone", {
    //     limit: 3,
    //     isPromoting: true,
    // });

    const resultQuery = await fetchSpecsOfVariant("16d16d55-6354-49ca-a606-3767bf7181fb", "keyboard");

    return NextResponse.json(JSON.stringify(mapSpecToArray(resultQuery[0])));
}


