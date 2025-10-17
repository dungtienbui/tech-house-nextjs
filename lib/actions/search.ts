'use server';

import z from "zod";
import { fetchRecommendedVariantsByKey } from "../data/fetch-data";
import { RecommendedVariantDTO } from "../definations/data-dto";

export type RecommendedFormState = {
    // Sửa lại ở đây để khớp với Zod
    errors?: string;
    message?: string;
    success?: boolean;
    data?: RecommendedVariantDTO[];
    prevQuery?: string;
};

const RecommendedKeySchema = z.string();

export async function searchBarAction(
    prevState: RecommendedFormState,
    formData: FormData
): Promise<RecommendedFormState> {
    const search = formData.get("search");

    const searchValidated = RecommendedKeySchema.safeParse(search);

    if (!searchValidated.success) {
        return {
            errors: z.flattenError(searchValidated.error).fieldErrors,
            message: "Vui lòng nhập từ khoá khác",
            prevQuery: search?.toString()
        };
    }

    const data = await fetchRecommendedVariantsByKey(searchValidated.data);

    if (!data || data.length === 0) {
        return {
            success: true,
            data: [],
            message: "Không tìm thấy sản phẩm liên quan.",
            prevQuery: searchValidated.data
        };
    }

    return {
        success: true,
        data: data,
        prevQuery: searchValidated.data
    };
}