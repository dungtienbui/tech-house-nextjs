import { generateFakeProductBase, generateFakeVariant, generateFakeVariantImage, generateSpecs, generateFakeImagePlacehold } from "@/app/lib/data/fake-data-generators";
import { Color, ProductBrand } from "@/app/lib/definations/database-table-definations";
import { randomInt } from "crypto";
import { NextResponse } from "next/server";
import { insertProductBase, insertProductImage, insertSpec, insertVariant, insertVariantImage } from "../../lib/data/insert-data";
import { fetchBrandByProductType, fetchBrands, fetchColors } from "@/app/lib/data/fetch-data";
import { ProductType } from "@/app/lib/definations/types";
import { query } from "@/app/lib/data/db";


export async function seedProduct(productType: ProductType) {
    const productColors = await fetchColors() as Color[];
    if (productColors.length === 0) {
        throw new Error("Not have product colors");
    }

    const productBrands = await fetchBrandByProductType(productType) as ProductBrand[];
    if (productBrands.length === 0) {
        throw new Error("Not have product productBrands");
    }

    const getRandomBrand = (arr: ProductBrand[]) => arr[randomInt(0, arr.length)];

    // 1. Tạo product base
    const productBaseArray = Array.from({ length: 10 }, () => generateFakeProductBase(productType, getRandomBrand(productBrands)));

    // 2. Tạo specs cho từng product base (và ép kiểu rõ ràng)
    const productSpecs = generateSpecs(productType, productBaseArray);

    // 2.1 Tạo preview image array 
    const previewArray = productBaseArray.flatMap((pb, idx) =>
        Array.from({ length: 5 }, () => generateFakeImagePlacehold({ width: 600, height: 600 }))
    );

    // 3. Tạo variant cho từng product base
    const variantArray = productBaseArray.flatMap((pb, idx) =>
        Array.from({ length: 5 }, (_, idx1) => generateFakeVariant(pb, previewArray[idx * 5 + idx1], productColors[randomInt(0, 4)]))
    );

    // 5. Tạo ảnh
    const imageArray = variantArray.flatMap((pb, idx) =>
        Array.from({ length: 5 }, () => generateFakeImagePlacehold({ width: 1000, height: 600 }))
    );

    // 6. Map variant -> image
    const variantWithImageArray = variantArray.flatMap((variant, index) => {
        return Array.from({ length: 5 }, (_, idx) => {
            return generateFakeVariantImage(imageArray[index * 5 + idx], variant);
        });
    });

    // ================== INSERT ==================

    // Insert product_base
    await Promise.all(productBaseArray.map(insertProductBase));

    // Insert product_spec
    await Promise.all(productSpecs.map((item) => insertSpec(item, productType)))

    // Insert variant preview image
    await Promise.all(previewArray.map(insertProductImage));

    // Insert variant (bảng chung)
    await Promise.all(variantArray.map(insertVariant));

    // Insert image
    await Promise.all(imageArray.map(insertProductImage));

    // Gắn ảnh với variant
    await Promise.all(variantWithImageArray.map(insertVariantImage));
}


export async function GET() {

    return NextResponse.json({ message: "No thing" });

    // try {
    //     const productBrands = await fetchBrands() as ProductBrand[];
    //     if (productBrands.length === 0) {
    //         throw new Error("Not have product productBrands");
    //     }

    //     const productBases = await query<{
    //         product_base_id: string;
    //         product_type: ProductType;
    //         brand: string;
    //     }>(`
    //     select pb.product_base_id, pb.product_type, pb.brand_id 
    //     from product_base pb 
    // `);


    //     const updateBrand = async (id: string, brand: string) => {
    //         const res = await query(`
    //         update product_base pb 
    //         set brand_id = $1
    //         where pb.product_base_id = $2
    //     `, [brand, id]);
    //     }

    //     const getRandomBrand = (arr: ProductBrand[], type: ProductType) => {
    //         const brandByType = arr.filter(item => item.product_type === type);
    //         return brandByType[randomInt(0, brandByType.length)].brand_id;
    //     };

    //     await Promise.all(
    //         productBases.map((productBase) => {
    //             return updateBrand(productBase.product_base_id, getRandomBrand(productBrands, productBase.product_type));
    //         })
    //     );

    //     const resultQuery = await query<{
    //         product_base_id: string;
    //         product_type: ProductType;
    //         brand: string;
    //     }>(`
    //     select pb.product_base_id, pb.product_type, pb.brand_id 
    //     from product_base pb 
    // `);

    //     return NextResponse.json({ resultQuery });
    // } catch (err) {
    //     console.error("Database error:", err);
    //     return NextResponse.json({ error: "Database error" }, { status: 500 });
    // }

}