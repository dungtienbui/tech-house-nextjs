import { fetchBrandByProductType } from "@/app/lib/data/fetch-data";
import { ProductType } from "@/app/lib/definations/types";
import FilterMenuClientComponent from "./filter-menu-client";
import { getConvertKeyProductTypeToVN } from "@/app/lib/utils/types";

interface props {
    productType: ProductType;
    queries?: {
        param: string;
        value: string[];
    }[]
}

export default async function FilterMenu({ productType, queries }: props) {

    const brands = await fetchBrandByProductType(productType);

    const queriesMappingObject =
        queries?.reduce((acc, qr) => {
            acc[qr.param] = qr.value;
            return acc;
        }, {} as Record<string, string[]>) ?? {};

    const filterSectionsTmp = [
        {
            title: "RAM",
            inputName: "ram",
            options: [
                { id: "ram1", label: "2GB", value: "2" },
                { id: "ram2", label: "4GB", value: "4" },
                { id: "ram3", label: "8GB", value: "8" },
                { id: "ram4", label: "16GB", value: "16" },
                { id: "ram5", label: "32GB", value: "32" },
            ],
        },
        {
            title: "Bộ nhớ lưu trữ",
            inputName: "storage",
            options: [
                { id: "storage1", label: "64GB", value: "64" },
                { id: "storage2", label: "128GB", value: "128" },
                { id: "storage3", label: "256GB", value: "256" },
                { id: "storage4", label: "512GB", value: "512" },
                { id: "storage5", label: "1TB", value: "1024" },
            ],
        },
    ];

    filterSectionsTmp.unshift(
        {
            title: `Hãng ${getConvertKeyProductTypeToVN(productType)}`,
            inputName: "brand",
            options: brands.map((brand) => {
                return {
                    id: brand.brand_id,
                    label: brand.brand_name,
                    value: brand.brand_name
                }
            })
        }
    );

    const filterSections = filterSectionsTmp.map((item) => {
        const i = item.options.map((i) => {
            if (queriesMappingObject[item.inputName] && queriesMappingObject[item.inputName].includes(i.value)) {
                return { ...i, checked: true };
            } else {
                return i;
            }
        })

        return { ...item, options: i };
    });

    return (
        <>
            <FilterMenuClientComponent sections={filterSections} />
        </>
    )
}