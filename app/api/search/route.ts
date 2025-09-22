import { NextResponse } from "next/server";
import { fetchRecommendedVariantsByKey } from "@/app/lib/data/fetch-data";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") ?? "";

    const recommendedVars = await fetchRecommendedVariantsByKey(query);

    return NextResponse.json(recommendedVars);
}
