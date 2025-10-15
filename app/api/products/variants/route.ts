import { fetchVariantsByVariantIdArray } from "@/lib/data/fetch-data";
import { NextResponse } from "next/server";
import { z } from "zod";

// Tạo schema để validate
const IdsSchema = z.object({
    ids: z.array(z.uuid()),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Validate dữ liệu
        const validation = IdsSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
        }

        const { ids } = validation.data;

        if (ids.length === 0) {
            return NextResponse.json([]);
        }

        const result = await fetchVariantsByVariantIdArray(ids);
        return NextResponse.json(result);

    } catch (error) {
        // 2. Bắt lỗi chung
        console.error("API Error:", error);
        return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
    }
}