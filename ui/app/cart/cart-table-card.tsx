import { ProductType } from "@/lib/definations/types";
import { SquareCheckBig, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CartTableRowProps {
    id: string;
    type: ProductType;
    name: string;
    option: string;
    price: number;
    quantity: number;
    totalCost: number;
    preview: {
        href: string;
        alt: string;
    }
    removeCallBack: () => void
    isSelected?: boolean;
    selectedCallBack?: () => void;
}


export default function CartTableCard({ id, type, name, option, price, quantity, totalCost, preview, removeCallBack, selectedCallBack, isSelected }: CartTableRowProps) {
    return (
        <div className="flex flex-col border-b border-gray-500 py-3 px-1 gap-5 last:border-none">
            <div className="flex justify-between items-start">
                <div className="flex gap-3">
                    <Image
                        src={preview.href}
                        alt={preview.alt}
                        width={80}
                        height={80}
                        className="rounded-md"
                    />
                    <div className="flex flex-col justify-between min-w-0">
                        <Link
                            href={`/products/${type}/${id}`}
                            className="font-medium hover:underline ellipsis"
                        >
                            {name}
                        </Link>
                        <span className="text-gray-500 text-sm">{option}</span>
                        <span className="text-sm">${price}</span>
                    </div>
                </div>
                <button type="button" onClick={selectedCallBack}>
                    {isSelected ? (<SquareCheckBig width={35} height={35} className="text-gray-400" />) : (<Square width={35} height={35} className="text-gray-400" />)}
                </button>
            </div>
            <div className="flex justify-between items-center">
                <button
                    className="translate-x-3 text-red-500 border border-white hover:border-red-500 px-3 py-1 rounded-full hover:bg-red-50 text-sm"
                    onClick={removeCallBack}
                >
                    Xóa
                </button>
                <div className="flex flex-col items-end">
                    <span className="text-sm">x {quantity}</span>
                    <span className="text-red-500 font-semibold">${totalCost}</span>
                </div>

            </div>

        </div>
    );
}
