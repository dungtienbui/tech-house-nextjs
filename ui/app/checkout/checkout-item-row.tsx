import Image from "next/image";

interface props {
    name: string;
    option: string;
    price: number;
    quantity: number;
    totalCost: number;
    preview: {
        href: string;
        alt: string;
    }
}

export default function CheckoutItemRow({ name, option, price, quantity, totalCost, preview }: props) {
    return (
        <tr className="border-b border-gray-300 last:border-none">
            <td className="p-4 flex flex-row gap-2 justify-start items-center">
                <Image src={preview.href} alt={preview.alt} width={80} height={80} />
                <span className="font-medium hover:underline">
                    {name}
                </span>
            </td>
            <td className="p-4">{option}</td>
            <td className="p-4 text-right">${price}</td>
            <td className="p-4 text-center">{quantity}</td>
            <td className="p-4 text-right font-semibold text-red-500">${totalCost}</td>
        </tr>
    );
}