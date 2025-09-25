'use client'

import { useCart } from "@/lib/context/card-context";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface props {
    varirantId: string
}

export default function SubmitOptionFormSection({ varirantId }: props) {

    const router = useRouter();

    const { addToCart, buyNow } = useCart();

    const [quantity, setQuantity] = useState("1");

    const handleInputChangeValue = (value: string) => {

        if (value === "" || /^[0-9]+$/.test(value)) {
            setQuantity(value);
        } else {
            setQuantity(quantity);
        }
    }

    const handleButtonClick = (buttonType: "left" | "right") => {
        const number = parseInt(quantity);
        if (!Number.isInteger(number)) {
            return;
        }
        if (buttonType === "left") {
            if (number > 1) {
                setQuantity((number - 1).toString());
            }
        } else {
            setQuantity((number + 1).toString());
        }
    }

    const handleBuyNowButton = () => {
        const quantityNumber = parseInt(quantity);
        if (!Number.isInteger(quantityNumber) || quantityNumber < 1) {
            return;
        }
        buyNow(varirantId, quantityNumber);
        router.push("/cart");
    }

    return (
        <div className="flex flex-row flex-wrap gap-5">
            <div className="flex-1 min-w-1/4">
                <div className="w-full h-full flex flex-row items-center border-2 border-sky-500">
                    <button type="button" className="flex-1 h-full hover:bg-gray-100" onClick={() => handleButtonClick("left")}>
                        <Minus className="m-auto" />
                    </button>

                    <input
                        type="text"
                        name="quantity"
                        value={quantity}
                        onChange={(e) => handleInputChangeValue(e.target.value)}
                        onBlur={(e) => (e.target.value === "0" || !Number.isInteger(parseInt(e.target.value))) && setQuantity("1")}
                        className="appearance-none flex-2 w-full h-full text-center m-0"
                    />

                    <button type="button" className="flex-1 h-full hover:bg-gray-100" onClick={() => handleButtonClick("right")}>
                        <Plus className="m-auto" />
                    </button>
                </div>
            </div>
            <div className="flex-1 lg:flex-2 min-w-fit">
                <button onClick={handleBuyNowButton} type="button" className="px-2 w-full h-full flex flex-row justify-center items-center gap-1 lg:gap-3 py-2 border-2 border-sky-500 font-bold text-md text-blue-500 hover:bg-sky-500 hover:text-white hover:shadow-lg duration-300">
                    <div>Mua ngay</div>
                </button>
            </div>
            <button
                type="button"
                className="flex-1 w-fit text-nowrap px-2 py-2 border-2 border-sky-500 font-bold text-md text-blue-500 hover:bg-sky-500 hover:text-white hover:shadow-lg duration-300"
                onClick={() => {
                    const numberItem = parseInt(quantity);


                    if (Number.isInteger(numberItem) && numberItem > 0) {
                        addToCart(varirantId, numberItem);
                    }

                }}
            >
                Thêm vào giỏ
            </button>
        </div>
    );
}