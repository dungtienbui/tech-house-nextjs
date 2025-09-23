import { CircleUserRound } from "lucide-react";
import HeaderCart from "./header-cart-item";

export default function Utility() {
    return (
        <div className="flex-1 flex justify-end items-center gap-2 text-white font-bold">
            <div className="flex flex-row items-center gap-1 py-1 px-2 rounded-full border border-sky-500 hover:border-gray-50">
                <CircleUserRound className="w-[30px]" />
                <p className="hidden min-[550px]:block">Đăng nhập</p>
            </div>
            <HeaderCart />
        </div>
    );
}