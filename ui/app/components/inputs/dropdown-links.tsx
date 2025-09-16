"use client";

import { ProductVariant } from "@/lib/definations/product";
import { ChevronDownIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent } from "react";

interface props {
    products: ProductVariant[];
    currentProduct: ProductVariant;
    type: "ram" | "storage";
}

export default function DropdownLinks({ products, currentProduct, type }: props) {

    const router = useRouter();

    const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const productId = e.target.value;
        router.push(`${productId}`);
    }

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <label htmlFor="ram-selection">{type === "ram" ? "Ram" : "Bộ nhớ"}</label>
            <div className="w-full relative">
                <select
                    id="ram-selection"
                    name={type === "ram" ? "ram-selection" : "storage-selection"}
                    defaultValue={type === "ram" ? currentProduct.info.ram : currentProduct.info.storage}
                    onChange={handleSelectionChange}
                    className="appearance-none border border-gray-300 pl-3 py-2 w-full">
                    {
                        products.map((item) => {
                            const value = type === "ram" ? item.info.ram : item.info.storage;
                            return (
                                <option key={item.id} value={item.id}>
                                    {`${value} GB`}
                                </option>
                            )
                        })
                    }
                </select>
                <ChevronDownIcon className="absolute bottom-1/4 right-1 -z-10" />
            </div>
        </div>
    );
}
