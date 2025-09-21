import { fetchSpecsOfVariant } from "@/app/lib/data/fetch-data";
import { ProductType } from "@/app/lib/definations/types";
import { mapSpecToArray } from "@/app/lib/utils/types";
import { ProductInformationClientComponent } from "./product-information-client";
import { wait } from "@/app/lib/utils/funcs";

interface props {
    id: string;
    productType: ProductType;
}

export default async function ProductInformation({ id, productType }: props) {

    const resultQuery = await fetchSpecsOfVariant(id, productType);

    const description = resultQuery[0].description?.toString() ?? "";

    const specs = mapSpecToArray(resultQuery[0]);

    await wait(2000);

    return (<ProductInformationClientComponent description={description} review={"Review Tab"} specs={specs} />);
}
