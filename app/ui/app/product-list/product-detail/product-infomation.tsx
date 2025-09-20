import { fetchSpecsOfVariant } from "@/app/lib/data/fetch-data";
import { ProductType } from "@/app/lib/definations/types";
import { mapSpecToArray } from "@/app/lib/utils/types";
import { ProductInfomationClientComponent } from "./product-infomation-client";

interface props {
    id: string;
    productType: ProductType;
}

export default async function ProductInformation({ id, productType }: props) {

    const resultQuery = await fetchSpecsOfVariant(id, productType);

    const description = resultQuery[0].description?.toString() ?? "";

    const specs = mapSpecToArray(resultQuery[0]);

    return (<>
        <ProductInfomationClientComponent description={description} review={"Review Tab"} specs={specs} />
    </>
    );
}
