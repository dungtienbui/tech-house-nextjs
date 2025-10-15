'use client'

import { useSession } from "next-auth/react";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";

export default function Account() {

    const { status, data: session } = useSession();

    if (status === "loading") {
        return (
            <div className="relative rounded-full overflow-clip">
                <div
                    className="flex flex-row items-center gap-1 py-1 px-2 shimmer"
                >
                    <CircleUserRound className="w-[30px]" />
                    <div className="hidden min-[550px]:block w-10"></div>
                </div>
            </div>
        );
    } else if (status === "authenticated") {
        return (
            <Link
                className="flex flex-row items-center gap-1 py-1 px-2 rounded-full border border-sky-500 hover:border-gray-50"
                href="/user/purchases"
            >
                <CircleUserRound className="w-[30px]" />
                <p className="hidden min-[550px]:block">{session.user.name}</p>
            </Link>
        );
    }

    return (
        <Link
            className="flex flex-row items-center gap-1 py-1 px-2 rounded-full border border-sky-500 hover:border-gray-50"
            href="/signin"
        >
            <CircleUserRound className="w-[30px]" />
            <p className="hidden min-[550px]:block">Đăng nhập</p>
        </Link>
    );
}