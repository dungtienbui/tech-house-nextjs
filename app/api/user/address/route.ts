import { fetchUserById } from "@/lib/data/fetch-data";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const userId: string = body.userId;
    const result = await fetchUserById(userId);
    return NextResponse.json(result);
}

