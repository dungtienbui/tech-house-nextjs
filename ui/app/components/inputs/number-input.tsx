'use client'

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export default function NumberInputWithButtonBothSide() {

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
        if (isNaN(number)) {
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

    return (
        <div className="w-full h-full flex flex-row items-center border border-gray-300">
            <button className="flex-1 h-full hover:bg-gray-100" onClick={() => handleButtonClick("left")}>
                <Minus className="m-auto" />
            </button>
            <input type="text" name="quantity" value={quantity} onChange={(e) => handleInputChangeValue(e.target.value)} onBlur={(e) => isNaN(parseInt(e.target.value)) && setQuantity("1")} className="appearance-none flex-2 w-full h-full text-center m-0" />

            <button className="flex-1 h-full hover:bg-gray-100" onClick={() => handleButtonClick("right")}>
                <Plus className="m-auto" />
            </button>
        </div>
    );

}