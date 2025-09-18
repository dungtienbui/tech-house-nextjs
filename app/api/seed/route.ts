import { generateFakePhoneSpecs, generateFakeHeadphoneSpecs, generateFakeKeyboardSpecs, generateFakeLaptopSpecs, generateFakePhoneVariant, generateFakeHeadphoneVariant, generateFakeKeyboardVariant, generateFakeLaptopVariant, generateFakeProductBase, generateFakeVariant, generateFakeImage, generateFakeVariantImage, generateFakeColor } from "@/app/lib/data/fake-data-generators";
import { Color, HeadphoneSpecs, HeadphoneVariant, KeyboardSpecs, KeyboardVariant, LaptopSpecs, LaptopVariant, PhoneSpecs, PhoneVariant } from "@/app/lib/definations/database-table-definations";
import { randomInt } from "crypto";
import { NextResponse } from "next/server";
import { findAllColors, insertColor, insertHeadphoneSpecs, insertHeadphoneVariant, insertKeyboardSpecs, insertKeyboardVariant, insertLaptopSpecs, insertLaptopVariant, insertPhoneSpecs, insertPhoneVariant, insertProductBase, insertProductImage, insertVariant, insertVariantImage, resetTable } from "./utils";

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


export async function seedProduct(productType: "PHONE" | "LAPTOP" | "KEYBOARD" | "HEADPHONE") {
    const productColors = await findAllColors();
    if (productColors.length === 0) {
        throw new Error("Not have product colors");
    }

    const specsMap = {
        PHONE: generateFakePhoneSpecs,
        LAPTOP: generateFakeLaptopSpecs,
        HEADPHONE: generateFakeHeadphoneSpecs,
        KEYBOARD: generateFakeKeyboardSpecs,
    } as const;

    const variantMap = {
        PHONE: generateFakePhoneVariant,
        LAPTOP: generateFakeLaptopVariant,
        HEADPHONE: generateFakeHeadphoneVariant,
        KEYBOARD: generateFakeKeyboardVariant,
    } as const;

    const generateSpecs = specsMap[productType];
    const generateVariant = variantMap[productType];

    // 1. Tạo product base
    const productBaseArray = Array.from({ length: 10 }, () => generateFakeProductBase(productType));

    // 2. Tạo specs cho từng product base (và ép kiểu rõ ràng)
    let productSpecsArray:
        | PhoneSpecs[]
        | LaptopSpecs[]
        | HeadphoneSpecs[]
        | KeyboardSpecs[];

    if (productType === "PHONE") {
        productSpecsArray = productBaseArray.map((pb) => generateFakePhoneSpecs(pb));
    } else if (productType === "LAPTOP") {
        productSpecsArray = productBaseArray.map((pb) => generateFakeLaptopSpecs(pb));
    } else if (productType === "HEADPHONE") {
        productSpecsArray = productBaseArray.map((pb) => generateFakeHeadphoneSpecs(pb));
    } else {
        productSpecsArray = productBaseArray.map((pb) => generateFakeKeyboardSpecs(pb));
    }

    // 3. Tạo variant cho từng product base
    const variantArray = productBaseArray.flatMap((pb) =>
        Array.from({ length: 5 }, () => generateFakeVariant(pb))
    );

    // 4. Gắn màu vào variant
    const productVariantArray = variantArray.map((variant) => {
        const randomColor = productColors[randomInt(0, productColors.length - 1)];
        return generateVariant(variant, randomColor);
    });

    // 5. Tạo ảnh
    const imageArray = Array.from({ length: 50 }, () => generateFakeImage(productType));

    // 6. Map variant -> image
    const variantWithImageArray = variantArray.flatMap((variant, index) => {
        return Array.from({ length: 5 }, (_, idx) => {
            return generateFakeVariantImage(imageArray[(index * 5 + idx) % 50], variant);
        });
    });

    // ================== INSERT ==================

    // Insert product_base
    await Promise.all(productBaseArray.map(insertProductBase));

    // Insert specs (chọn đúng hàm)
    if (productType === "PHONE") {
        await Promise.all((productSpecsArray as PhoneSpecs[]).map(insertPhoneSpecs));
    } else if (productType === "LAPTOP") {
        await Promise.all((productSpecsArray as LaptopSpecs[]).map(insertLaptopSpecs));
    } else if (productType === "HEADPHONE") {
        await Promise.all((productSpecsArray as HeadphoneSpecs[]).map(insertHeadphoneSpecs));
    } else if (productType === "KEYBOARD") {
        await Promise.all((productSpecsArray as KeyboardSpecs[]).map(insertKeyboardSpecs));
    }

    // Insert variant (bảng chung)
    await Promise.all(variantArray.map(insertVariant));

    // Insert variant theo loại
    if (productType === "PHONE") {
        await Promise.all((productVariantArray as PhoneVariant[]).map(insertPhoneVariant));
    } else if (productType === "LAPTOP") {
        await Promise.all((productVariantArray as LaptopVariant[]).map(insertLaptopVariant));
    } else if (productType === "HEADPHONE") {
        await Promise.all((productVariantArray as HeadphoneVariant[]).map(insertHeadphoneVariant));
    } else if (productType === "KEYBOARD") {
        await Promise.all((productVariantArray as KeyboardVariant[]).map(insertKeyboardVariant));
    }

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

    //     await seedProduct("PHONE");
    //     await seedProduct("LAPTOP");
    //     await seedProduct("KEYBOARD");
    //     await seedProduct("HEADPHONE");

    //     return NextResponse.json({ message: "Successfull" });
    // } catch (err) {
    //     console.error("Database error:", err);
    //     return NextResponse.json({ error: "Database error" }, { status: 500 });
    // }

}