import { OrderProductDTO } from "@/lib/definations/data-dto";
import { formatCurrency } from "@/lib/utils/funcs";
import Image from "next/image";
import ReviewButton from "./review-button";

interface props {
    product: OrderProductDTO;
    orderId: string;
}

export default function OrderProduct({ product, orderId }: props) {
    return (
        <div className="flex flex-col sm:flex-row products-start gap-4 border-b pb-4 last:border-b-0">
            <div className="flex flex-row gap-4" >
                <Image
                    src={product.preview_image_url || '/placeholder.png'}
                    alt={product.preview_image_alt || product.product_name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                />
                <div className="flex-1">
                    <p className="font-semibold text-gray-800">{product.product_name}</p>
                    <p className="text-sm text-gray-500">
                        {product.color_name && `Màu: ${product.color_name}`}
                        {product.ram && `, RAM: ${product.ram}GB`}
                        {product.storage && `, Bộ nhớ: ${product.storage}GB`}
                    </p>
                    <p className="text-sm text-gray-500">Số lượng: {product.quantity}</p>
                </div>
            </div >
            <div className="flex flex-col gap-2">
                <p className="font-semibold text-gray-700"><span className="inline sm:hidden text-sm font-normal">Chi phí:{" "}</span>{formatCurrency(product.variant_price)}</p>
                <ReviewButton orderId={orderId} variantId={product.variant_id} productName={product.product_name} />
            </div>
        </div>
    );
}