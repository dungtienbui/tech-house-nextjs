import { Circle, ShoppingCart } from "lucide-react";
import NumberInputWithButtonBothSide from "../../components/inputs/number-input";
import { Product, ProductVariant } from "@/lib/definations/product";
import LinkHorizontalSelection from "../../components/inputs/link-horizontal-selection";

interface props {
    product: Product;
    productVariants: ProductVariant[];
}

export default function ProductOptionForm({ product, productVariants }: props) {


    const colorOptions = productVariants.reduce((acc: {
        id: string;
        name: string;
        value: string;
        href: string;
    }[], curr) => {
        const exists = acc.find(item => item.id === curr.info.color.id);

        if (!exists) {
            acc.push({
                id: curr.info.color.id,
                name: curr.info.color.name,
                value: curr.info.color.value,
                href: `${curr.id}`,
            });
        }
        return acc;
    }, []);

    const colorDefaultOpion = {
        id: product.info.color.id,
    }

    const productOptions = productVariants.filter(item => item.info.color.id === product.info.color.id).map((item) => {
        return {
            id: item.id,
            name: `${item.info.ram}GB - ${item.info.storage}GB`,
            href: `${item.id}`
        }
    });

    const productDefaultOption = {
        id: product.id,
    }

    return (
        <form className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <div className="text-xl md:text-2xl font-bold">{`${product.name} (${product.info.ram}GB Ram - ${product.info.storage}GB bộ nhớ - ${product.info.color.name})`}</div>
                <div className="grid grid-cols-2">
                    <p className="text-gray-400">Thương hiệu: <b className="text-black">{product.brand}</b></p>
                    <p className="text-gray-400">Số lượng: <b className="text-black">{product.stock}</b></p>
                </div>
            </div>
            <div className="">
                <p className="text-red-500 text-xl">$<strong>{product.variantPrice}</strong></p>
            </div>
            <div className="w-full h-0 border-t border-gray-300" />
            <div className="flex flex-col gap-5">
                <LinkHorizontalSelection title={"Màu sắc"} options={colorOptions} defaultOption={colorDefaultOpion} icon={Circle} />
                <LinkHorizontalSelection title={"Cấu hình (Ram & Lưu trữ)"} options={productOptions} defaultOption={productDefaultOption} />
            </div>
            <div className="w-full h-0 border-t border-gray-300" />
            <div className="flex flex-row flex-wrap gap-5">
                <div className="flex-1 min-w-1/4">
                    <NumberInputWithButtonBothSide />
                </div>
                <div className="flex-1 lg:flex-2 min-w-fit">
                    <button type="button" className="px-2 w-full h-full flex flex-row justify-center items-center gap-1 lg:gap-3 py-2 border-2 border-sky-500 font-bold text-md text-blue-500 hover:bg-sky-500 hover:text-white hover:shadow-lg duration-300">
                        <div>Mua ngay</div>
                        <ShoppingCart />
                    </button>
                </div>
                <div className="flex-1 min-w-fit">
                    <button type="button" className="px-2 w-full h-full py-2 border-2 border-sky-500 font-bold text-md text-blue-500 hover:bg-sky-500 hover:text-white hover:shadow-lg duration-300">Thêm vào giỏ</button>
                </div>
            </div>
        </form>
    )
}