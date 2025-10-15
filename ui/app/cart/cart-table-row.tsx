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

export default function CartTableRow({ id, type, name, option, price, quantity, totalCost, preview, removeCallBack, selectedCallBack, isSelected }: CartTableRowProps) {
    return (
        <tr className="border-b last:border-none hover:bg-gray-50 transition">
            <td className="p-4">
                <button type="button" onClick={selectedCallBack}>
                    {isSelected ? (<SquareCheckBig className="text-gray-400" />) : (<Square className="text-gray-400" />)}
                </button>
            </td>
            <td className="p-4 flex flex-row gap-2 justify-start items-center">
                <Image src={preview.href} alt={preview.alt} width={80} height={80} />
                <Link
                    href={`/products/${type}/${id}`}
                    className="font-medium hover:underline"
                >
                    {name}
                </Link>
            </td>
            <td className="p-4">{option}</td>
            <td className="p-4 text-right">${price}</td>
            <td className="p-4 text-center">{quantity}</td>
            <td className="p-4 text-right font-semibold text-red-500">${totalCost}</td>
            <td className="p-4 text-center">
                <button
                    className="inline text-red-500 cursor-pointer border-red-500 hover:border p-2 rounded-full"
                    onClick={removeCallBack}
                    type="button"
                >
                    Xóa
                </button>
            </td>
        </tr>
    );
}