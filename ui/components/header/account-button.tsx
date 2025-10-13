import { auth } from "@/auth";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";

export default async function AccountButton() {
    const session = await auth();
    return (
        <Link
            className="flex flex-row items-center gap-1 py-1 px-2 rounded-full border border-sky-500 hover:border-gray-50"
            href={session ? "/user/purchases" : "/signin"}
        >
            <CircleUserRound className="w-[30px]" />
            <p className="hidden min-[550px]:block">{session ? session.user.name ?? "Khách hàng" : "Đăng nhập"}</p>
        </Link>
    );
}