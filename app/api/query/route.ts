import { query } from "@/app/lib/data/db";
import { NextResponse } from "next/server";

async function findAllPhone() {
    const resultQuery = await query(
        `
        SELECT * 
            FROM product_base
            LEFT JOIN variant ON product_base.product_base_id = variant.product_base_id
            LEFT JOIN phone_variant ON variant.variant_id = phone_variant.variant_id
            LEFT JOIN color ON phone_variant.color_id = color.color_id
            WHERE product_base.product_type = 'PHONE'
        `
    )

    return resultQuery;
}

export async function GET() {
    const result = await findAllPhone();
    return NextResponse.json(result);
}