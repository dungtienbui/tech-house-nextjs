import HeaderCart from "./header-cart-item";
import Account from "./account";

export default function Utility() {
    return (
        <div className="flex-1 flex justify-end items-center gap-2 text-white font-bold">
            <Account />
            <HeaderCart />
        </div>
    );
}