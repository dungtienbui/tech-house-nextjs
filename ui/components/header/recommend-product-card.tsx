import Image from "next/image";
import Link from "next/link";

interface props {
    name: string;
    href: string;
    price: number;
    preview: {
        previewURL: string;
        previewAlt: string;
    }
    callBackOnNavigate?: () => void
}

export default function RecommendedProductCard({ name, href, price, preview, callBackOnNavigate }: props) {
    return (
        <Link
            className="flex flex-row justify-start items-center gap-2"
            href={href}
            onNavigate={callBackOnNavigate}
        >
            <Image src={preview.previewURL} alt={preview.previewAlt} width={60} height={60} className="rounded-md" />
            <div className="flex flex-col justify-start items-start">
                <div className="font-bold text-sm">{name}</div>
                <div className="text-red-500">{`$${price}`}</div>
            </div>
        </Link>
    )
}