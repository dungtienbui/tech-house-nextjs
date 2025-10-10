import { CircleUserRound } from "lucide-react";

export default function AccountButton() {
    return (
        <>
            <div
                className="flex flex-row items-center gap-1 py-1 px-2 rounded-full border border-sky-500 hover:border-gray-50"
            >
                <CircleUserRound className="w-[30px]" />
                <p className="hidden min-[550px]:block">Khách hàng</p>
            </div>
        </>
    );
}