import { CircleUserRound, Handbag } from "lucide-react";

export default function Utility() {
    return (
        <div className="flex-1 flex justify-around md:justify-end items-center gap-2 text-white font-bold order-2 sm:order3">
            <div className="flex flex-row items-center gap-1 py-1 px-2 rounded-full border border-sky-500 hover:border-gray-50">
                <CircleUserRound className="w-[30px]" />
                <p className="hidden md:block">Đăng nhập</p>
            </div>
            <div className="flex flex-row items-center gap-1 py-1 px-2 rounded-full border border-sky-500 hover:border-gray-50">
                <Handbag className="w-[30px]" />
                <p className="hidden md:block">Giỏ hàng</p>
            </div>
        </div>
    );
}