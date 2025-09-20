import { generateFakeProductBase, generateFakeVariant, generateFakeVariantImage, generateFakeColor, generateSpecs, generateFakeImagePlacehold } from "@/app/lib/data/fake-data-generators";
import { Color } from "@/app/lib/definations/database-table-definations";
import { randomInt } from "crypto";
import { NextResponse } from "next/server";
import { insertColor, insertProductBase, insertProductImage, insertSpec, insertVariant, insertVariantImage, resetTable } from "../../lib/data/insert-data";
import { fetchColors } from "@/app/lib/data/fetch-data";
import { ProductType, PRODUCT_TYPES } from "@/app/lib/definations/types";

async function seedColors() {
    const productColors: Color[] = [
        generateFakeColor("Black", "#000000"),
        generateFakeColor("White", "#FFFFFF"),
        generateFakeColor("Blue", "#0000FF"),
        generateFakeColor("Red", "#FF0000"),
        generateFakeColor("Green", "#00FF00"),
        generateFakeColor("Gray", "#808080"),
        generateFakeColor("Gold", "#FFD700"),
        generateFakeColor("Silver", "#C0C0C0"),
        generateFakeColor("Purple", "#800080"),
        generateFakeColor("Pink", "#FFC0CB"),
    ];

    const resultQuery = await Promise.all(
        productColors.map((color) => insertColor(color))
    );

    return resultQuery;
}


export async function seedProduct(productType: ProductType) {
    const productColors = await fetchColors() as Color[];
    if (productColors.length === 0) {
        throw new Error("Not have product colors");
    }

    // 1. Tạo product base
    const productBaseArray = Array.from({ length: 10 }, () => generateFakeProductBase(productType));

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
    //     await resetTable("color");
    //     await resetTable("product_base");
    //     await resetTable("variant");
    //     await resetTable("product_image");

    //     await seedColors();

    //     PRODUCT_TYPES.map(async (item) => {
    //         await seedProduct(item);
    //     })

    //     return NextResponse.json({ message: "Successfull" });
    // } catch (err) {
    //     console.error("Database error:", err);
    //     return NextResponse.json({ error: "Database error" }, { status: 500 });
    // }

}