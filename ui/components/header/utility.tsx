import { CircleUserRound } from "lucide-react";
import HeaderCart from "./header-cart-item";
import AccountButton from "./account-button";

export default function Utility() {
    return (
        <div className="flex-1 flex justify-end items-center gap-2 text-white font-bold">
            <AccountButton />
            <HeaderCart />
        </div>
    );
}