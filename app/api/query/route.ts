import { fetchVariantsByVariantIdArray } from "@/lib/data/fetch-data";
import { NextResponse } from "next/server";

export async function GET() {

    const resultQuery = await fetchVariantsByVariantIdArray([
        "c7e75883-84d9-4a68-861a-0267468e62a0",
        "7a3d15ce-ffec-45e4-9182-0222dda46414",
        "1a9bb94e-78b7-482c-b9d7-9922380a5caa",
        "558a4f1e-af11-40aa-a458-ff07cbf7e431"
    ]);

    return NextResponse.json({ resultQuery });
}


