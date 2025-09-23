import { fetchSpecsOfVariant } from "@/lib/data/fetch-data";
import { ProductType } from "@/lib/definations/types";
import { mapSpecToArray } from "@/lib/utils/types";
import { ProductInformationClientComponent } from "./product-information-client";


interface props {
    id: string;
    productType: ProductType;
}

export default async function ProductInformation({ id, productType }: props) {

    const resultQuery = await fetchSpecsOfVariant(id, productType);

    const description = resultQuery[0].description?.toString() ?? "";

    const specs = mapSpecToArray(resultQuery[0]);

    return (<ProductInformationClientComponent description={description} review={"Review Tab"} specs={specs} />);
}
