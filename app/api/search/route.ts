import { fetchRecommendedVariantsByKey } from "@/lib/data/fetch-data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") ?? "";

    const recommendedVars = await fetchRecommendedVariantsByKey(query);

    return NextResponse.json(recommendedVars);
}
