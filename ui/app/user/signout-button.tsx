'use client'

import { signOut } from "next-auth/react";

export default function SignoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-center p-3 border border-red-500 text-red-500 rounded-md font-semibold hover:bg-red-50 transition-transform active:scale-95"
            type="button"
        >
            Đăng Xuất
        </button>
    );
}