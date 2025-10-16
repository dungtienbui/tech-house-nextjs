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

export default function CheckoutItemCard({ name, option, price, quantity, totalCost, preview }: props) {
    return (
        <div className="flex justify-between items-start gap-3 py-1 sm:p-3 border-b border-gray-500 last:border-none">
            <div className="flex gap-3">
                <Image
                    src={preview.href}
                    alt={preview.alt}
                    width={80}
                    height={80}
                    className="rounded-md"
                />
                <div className="flex flex-col justify-between min-w-0">
                    <span
                        className="font-medium text-ellipsis"
                    >
                        {name}
                    </span>
                    <span className="text-gray-500 text-sm">{option}</span>
                    <span className="text-sm">${price}</span>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-sm text-nowrap"><span>x</span> <span className="text-base font-bold">{quantity}</span></span>
                <span className="text-red-500 font-semibold text-lg">${totalCost}</span>
            </div>
        </div>
    );
}