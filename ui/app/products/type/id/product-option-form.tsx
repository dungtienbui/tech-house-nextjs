import { fetchVariantsOfProductBaseByVariantId } from "@/lib/data/fetch-data";
import LinkHorizontalSelection from "@/ui/components/inputs/link-horizontal-selection";
import { Circle, ShoppingCart } from "lucide-react";
import { notFound } from "next/navigation";
import SubmitOptionFormSection from "./submit-option-form-section";


interface props {
    variantId: string;
}

export default async function ProductOptionForm({ variantId }: props) {

    const productVariants = await fetchVariantsOfProductBaseByVariantId(variantId);

    if (productVariants.length === 0) {
        notFound();
    }

    const variant = productVariants.find(item => item.variant_id === variantId);

    if (!variant) {
        notFound();
    }

    const colorOptions = productVariants.reduce((acc: {
        id: string;
        name: string;
        value?: string;
        href: string;
    }[], curr) => {
        const exists = acc.find(item => item.id === curr.color.color_id);

        if (!exists) {
            acc.push({
                id: curr.color.color_id,
                name: curr.color.color_name,
                value: curr.color.value,
                href: `${curr.variant_id}`,
            });
        }
        return acc;
    }, []);

    const colorDefaultOpion = {
        id: variant.color.color_id,
    }

    const productOptions = variant.product_type === "headphone"
        ? []
        : productVariants.filter(item => item.color.color_id === variant.color.color_id).map((item) => {

            const optionName = (item.product_type === "phone" || item.product_type === "laptop")
                ? `${item.ram}GB - ${item.storage}GB`
                : `${item.switch_type} switch`

            return {
                id: item.variant_id,
                name: optionName,
                href: `${item.variant_id}`
            }
        });

    const productDefaultOption = {
        id: variant.variant_id,
    }

    const productOptionSelectTitle = (variant.product_type === "phone" || variant.product_type === "laptop") ? "Cấu hình (Ram & Lưu trữ)" : variant.product_type === "keyboard" ? "Loại switch" : "";

    const productNameSub = "(" +
        [
            variant.ram && `${variant.ram}GB`,
            variant.storage && `${variant.storage}GB`,
            variant.color.color_name && `${variant.color.color_name}`,
            variant.switch_type && `${variant.switch_type} switch`,
        ]
            .filter(Boolean)
            .join("-") +
        ")";

    return (
        <form className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <div className="text-xl md:text-2xl font-bold">{`${variant.product_name} ${productNameSub}`}</div>
                <div className="grid grid-cols-2">
                    <div className="text-gray-400 flex flex-row">
                        <div>Thương hiệu:</div>
                        <div className="flex flex-row">
                            {/* {
                                variant.brand.logo_url && (
                                    <Image
                                        src={variant.brand.logo_url}
                                        alt={`${variant.brand.brand_name} brand`}
                                        width={30}
                                        height={30}
                                    />
                                )
                            } */}
                            <div className="pl-1"><b className="text-black">{variant.brand.brand_name}</b></div>
                        </div>
                    </div>
                    <p className="text-gray-400">Số lượng: <b className="text-black">{variant.stock}</b></p>
                </div>
            </div>
            <div className="">
                <p className="text-red-500 text-xl">$<strong>{variant.variant_price}</strong></p>
            </div>
            <div className="w-full h-0 border-t border-gray-300" />
            <div className="flex flex-col gap-5">
                <LinkHorizontalSelection title={"Màu sắc"} options={colorOptions} defaultOption={colorDefaultOpion} icon={Circle} />
                <LinkHorizontalSelection title={productOptionSelectTitle} options={productOptions} defaultOption={productDefaultOption} />
            </div>
            <div className="w-full h-0 border-t border-gray-300" />
            <SubmitOptionFormSection varirantId={variant.variant_id} />
        </form>
    )
}