'use client'
import { useGuest } from "@/lib/context/guest-context";
import { BookUser } from "lucide-react";
import { useState } from "react";
import { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { isPhoneNumberValid } from "@/lib/utils/types";

export default function FindPuschaseForm() {

    const router = useRouter();

    const { guestInfo } = useGuest();

    const [phone, setPhone] = useState(guestInfo.phone);
    const [error, setError] = useState<string | null>(null);

    const handleClickButton = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const trimmedPhone = phone.trim();

        if (!isPhoneNumberValid(trimmedPhone)) {
            return;
        }

        router.push(`/user/purchase/${encodeURIComponent(trimmedPhone)}`);
    };
    return (
        <form onSubmit={(e) => { e.preventDefault() }} className="p-10 w-full sm:w-auto sm:min-w-96 flex flex-col gap-5 justify-center items-center sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow">
            <div className="w-full flex flex-col gap-5 justify-center items-center">
                <div className="text-xl text-nowrap">Tra cứu thông tin đơn hàng</div>
                <div className="w-full relative">
                    <input
                        onChange={(e) => { setPhone(e.target.value) }}
                        value={phone}
                        className="w-full py-3 pl-12 border border-gray-300 rounded-full"
                        type="text"
                        placeholder="Nhập số điện thoại mua hàng"
                    />
                    <BookUser width={25} height={25} className="absolute top-1/2 left-3 -translate-y-3" />
                </div>
                <button
                    onClick={handleClickButton}
                    type="button"
                    className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-full"
                >
                    TRA CỨU
                </button>
            </div>
            {error && (<div className="text-sx text-red-500 text-wrap">{error}</div>)}
        </form>
    );
}