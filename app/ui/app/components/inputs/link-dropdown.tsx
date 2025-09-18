"use client";

import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";

interface props {
    title: string;
    options: {
        name: string;
        value: string;
    }[];
    defaultOption: {
        name: string;
        value: string;
    };
}

export default function LinkDropdown({ title, options, defaultOption }: props) {

    const router = useRouter();

    const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const productId = e.target.value;
        router.push(`${productId}`);
    }

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <label htmlFor="link-dropdown">{title}</label>
            <div className="w-full relative">
                <select
                    id="link-dropdown"
                    name="link-dropdown"
                    defaultValue={defaultOption.value}
                    onChange={handleSelectionChange}
                    className="appearance-none border border-gray-300 pl-3 py-2 w-full">
                    {
                        options.map((item) => {
                            return (
                                <option key={item.value} value={item.value}>
                                    {item.name}
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
