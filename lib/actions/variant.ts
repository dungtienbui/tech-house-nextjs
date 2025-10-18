'use server'

import { fetchVariantsByVariantIdArray } from "../data/fetch-data";
import { ProductVariantDTO } from "../definations/data-dto";

export async function getVariantByIds(variantIds: string[]): Promise<ProductVariantDTO[]> {
    try {
        const variants = await fetchVariantsByVariantIdArray(variantIds);
        return variants;
    } catch (error) {
        console.log("error: ", (error as Error).message);
        return [];
    }
}