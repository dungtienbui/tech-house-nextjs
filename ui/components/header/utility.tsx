import { CircleUserRound } from "lucide-react";
import HeaderCart from "./header-cart-item";
import AccountButton from "./account-button";
import { Suspense } from "react";

export default function Utility() {
    return (
        <div className="flex-1 flex justify-end items-center gap-2 text-white font-bold">
            <Suspense fallback={
                <div className="relative rounded-full overflow-clip">
                    <div
                        className="flex flex-row items-center gap-1 py-1 px-2 shimmer"
                    >
                        <CircleUserRound className="w-[30px]" />
                        <div className="hidden min-[550px]:block w-10"></div>
                    </div>
                </div>
            }>
                <AccountButton />
            </Suspense>
            <HeaderCart />
        </div>
    );
}