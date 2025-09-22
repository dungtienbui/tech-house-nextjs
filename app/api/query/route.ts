import { query } from "@/app/lib/data/db";
import { fetchProductVariantsInShort, fetchRecommendedVariantsByKey, fetchSpecsOfVariant, fetchVariantsOfProductBaseByVariantId } from "@/app/lib/data/fetch-data";
import { mapSpecToArray } from "@/app/lib/utils/types";
import { faker } from "@faker-js/faker";
import { NextResponse } from "next/server";

export async function GET() {

    const resultQuery = await fetchRecommendedVariantsByKey("keyboard");

    return NextResponse.json({ resultQuery });
}


