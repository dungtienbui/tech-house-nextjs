import { GuestInfo } from "../context/guest-context";
import { CartItem } from "../definations/data-dto";
import { Color, ProductImage, ProductBaseImage, Variant, VariantImage, PhoneSpec, LaptopSpec, KeyboardSpec, HeadphoneSpec, ProductBase } from "../definations/database-table-definations";
import { PaymentMethod, ProductType, SpecResult } from "../definations/types";
import { query } from "./db";
import { fetchVariantPrices } from "./fetch-data";

export async function resetTable(tableName: string) {
    return await query(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE;`);
}

export async function insertColor(item: Color) {
    return await query<Color>(
        `INSERT INTO color(color_id, value, color_name)
     VALUES ($1, $2, $3)`,
        [item.color_id, item.value, item.color_name]
    );
};

export async function insertProductImage(item: ProductImage) {
    return await query(
        `INSERT INTO product_image(image_id, image_caption, image_alt, image_url, added_date) 
     VALUES ($1, $2, $3, $4, $5)`,
        [
            item.image_id,
            item.image_caption,
            item.image_alt,
            item.image_url,
            item.added_date,
        ]
    );
}

export async function insertProductBaseImage(item: ProductBaseImage) {
    return await query(
        `INSERT INTO product_base_image(image_id, product_base_id) 
     VALUES ($1, $2)`,
        [item.image_id, item.product_base_id]
    );
}

export async function insertVariant(variant: Variant) {
    return await query(
        `
        INSERT INTO variant (
        variant_id,
        product_base_id,
        stock,
        variant_price,
        preview_id,
        is_promoting,
        color_id,
        ram,
        storage,
        switch_type
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);
        `,
        [
            variant.variant_id,
            variant.product_base_id,
            variant.stock,
            variant.variant_price,
            variant.preview_id ?? null,
            variant.is_promoting ?? false,
            variant.color_id ?? null,
            variant.ram ?? null,
            variant.storage ?? null,
            variant.switch_type ?? null,
        ]
    );
}

export async function insertVariantImage(item: VariantImage) {
    return await query(
        `INSERT INTO variant_image(image_id, variant_id) 
     VALUES ($1, $2)`,
        [item.image_id, item.variant_id]
    );
}


export async function insertSpec(spec: SpecResult, productType: ProductType) {
    switch (productType) {
        case "phone":
            return insertPhoneSpec(spec as PhoneSpec);

        case "laptop":
            return insertLaptopSpec(spec as LaptopSpec);

        case "keyboard":
            return insertKeyboardSpec(spec as KeyboardSpec);

        case "headphone":
            return insertHeadphoneSpec(spec as HeadphoneSpec);

        default:
            throw new Error(`Unsupported productType: ${productType}`);
    }
}

async function insertPhoneSpec(spec: PhoneSpec) {
    return query(
        `INSERT INTO phone_spec (
      product_base_id,
      weight,
      screen_size,
      display_tech,
      chipset,
      os,
      battery,
      camera,
      material,
      connectivity
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
            spec.product_base_id,
            spec.weight,
            spec.screen_size,
            spec.display_tech,
            spec.chipset,
            spec.os,
            spec.battery,
            spec.camera,
            spec.material,
            spec.connectivity,
        ]
    );
}

async function insertLaptopSpec(spec: LaptopSpec) {
    return query(
        `INSERT INTO laptop_spec (
      product_base_id,
      weight,
      screen_size,
      display_tech,
      chipset,
      os,
      battery,
      material,
      connectivity,
      gpu_card
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
            spec.product_base_id,
            spec.weight,
            spec.screen_size,
            spec.display_tech,
            spec.chipset,
            spec.os,
            spec.battery,
            spec.material,
            spec.connectivity,
            spec.gpu_card,
        ]
    );
}

async function insertKeyboardSpec(spec: KeyboardSpec) {
    return query(
        `INSERT INTO keyboard_spec (
      product_base_id,
      weight,
      material,
      connectivity,
      number_of_keys,
      usage_time
    ) VALUES ($1,$2,$3,$4,$5,$6)`,
        [
            spec.product_base_id,
            spec.weight,
            spec.material,
            spec.connectivity,
            spec.number_of_keys,
            spec.usage_time,
        ]
    );
}

async function insertHeadphoneSpec(spec: HeadphoneSpec) {
    return query(
        `INSERT INTO headphone_spec (
      product_base_id,
      weight,
      connectivity,
      usage_time,
      compatibility
    ) VALUES ($1,$2,$3,$4,$5)`,
        [
            spec.product_base_id,
            spec.weight,
            spec.connectivity,
            spec.usage_time,
            spec.compatibility,
        ]
    );
}


export async function insertProductBase(item: ProductBase) {
    return await query(
        `INSERT INTO product_base(product_base_id, product_name, brand, product_type, description, base_price)
     VALUES ($1, $2, $3, $4, $5, $6)`,
        [
            item.product_base_id,
            item.product_name,
            item.product_type,
            item.product_type,
            item.description,
            item.base_price,
        ]
    );
}


export async function insertOrder(
    cart: CartItem[],
    guest: GuestInfo,
    paymentMethod: PaymentMethod
): Promise<string> {
    if (!cart || cart.length === 0) {
        console.warn("No cart");
        throw new Error("Cart is empty");
    }

    const variantIds = cart.map(c => c.variant_id);
    const variantPrices = await fetchVariantPrices(variantIds);

    // Chuyển mảng cart thành JSON để truyền vào Postgres function
    const data = cart.map((item) => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
        variant_price: variantPrices[item.variant_id],
    }))

    const productsJson = JSON.stringify(data);

    // TODO: tính totalAmount thực tế (tốt nhất nên fetch giá từ DB)
    const totalAmount = data.reduce((acc, curr) => acc + curr.variant_price * curr.quantity, 0);

    const rewardPoints = Math.floor(totalAmount / 100);

    const sql = `
    SELECT insert_order(
      $1, $2, $3, $4, $5,
      $6, $7, $8,
      $9::jsonb
    ) AS order_id;
  `;

    const params = [
        paymentMethod,   // $1 p_payment_method
        "pending",       // $2 p_payment_status
        totalAmount,     // $3 p_total_amount
        rewardPoints,    // $4 p_reward_points
        null,            // $5 p_customer_id (null = khách vãng lai)
        guest.name,      // $6 p_buyer_name
        guest.phone,     // $7 p_phone_number
        guest.address,   // $8 p_address
        productsJson,    // $9 p_products
    ];

    const result = await query<{ order_id: string }>(sql, params);

    console.log("result: ", result);
    
    return result[0].order_id;
}


