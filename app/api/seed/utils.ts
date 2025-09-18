import { query } from "@/app/lib/data/db";
import { Color, ProductImage, ProductBaseImage, Variant, VariantImage, PhoneSpecs, LaptopSpecs, HeadphoneSpecs, KeyboardSpecs, ProductBase, PhoneVariant, LaptopVariant, HeadphoneVariant, KeyboardVariant } from "@/app/lib/definations/database-table-definations";

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

export async function findAllColors() {
    const colors = await query<Color>("SELECT * FROM color;");
    return colors;
}

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

export async function insertVariant(item: Variant) {
    return await query(
        `INSERT INTO variant(variant_id, product_base_id, stock, variant_price) 
     VALUES ($1, $2, $3, $4)`,
        [item.variant_id, item.product_base_id, item.stock, item.variant_price]
    );
}

export async function insertVariantImage(item: VariantImage) {
    return await query(
        `INSERT INTO variant_image(image_id, variant_id) 
     VALUES ($1, $2)`,
        [item.image_id, item.variant_id]
    );
}

export async function insertPhoneSpecs(specs: PhoneSpecs) {
    return await query(
        `INSERT INTO phone_specs(product_base_id, operating_system, display, front_camera, rear_camera, battery_capacity, sim, connectivity)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
            specs.product_base_id,
            specs.operating_system,
            specs.display,
            specs.front_camera,
            specs.rear_camera,
            specs.battery_capacity,
            specs.sim,
            specs.connectivity,
        ]
    );
}

export async function insertLaptopSpecs(specs: LaptopSpecs) {
    return await query(
        `INSERT INTO laptop_specs(product_base_id, operating_system, display, cpu, gpu, connectivity, battery, weight)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
            specs.product_base_id,
            specs.operating_system,
            specs.display,
            specs.cpu,
            specs.gpu,
            specs.connectivity,
            specs.battery,
            specs.weight,
        ]
    );
}

export async function insertHeadphoneSpecs(specs: HeadphoneSpecs) {
    return await query(
        `INSERT INTO headphone_specs(product_base_id, headphone_type, connectivity, usage_time, sound_technology, weight)
     VALUES ($1, $2, $3, $4, $5, $6)`,
        [
            specs.product_base_id,
            specs.headphone_type,
            specs.connectivity,
            specs.usage_time,
            specs.sound_technology,
            specs.weight,
        ]
    );
}

export async function insertKeyboardSpecs(specs: KeyboardSpecs) {
    return await query(
        `INSERT INTO keyboard_specs(product_base_id, keyboard_type, connectivity, key_count, backlight, size, weight)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
            specs.product_base_id,
            specs.keyboard_type,
            specs.connectivity,
            specs.key_count,
            specs.backlight,
            specs.size,
            specs.weight,
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
            item.brand,
            item.product_type,
            item.description,
            item.base_price,
        ]
    );
}

export async function insertPhoneVariant(variant: PhoneVariant) {
    return await query(
        `INSERT INTO phone_variant(variant_id, ram, storage, color_id)
     VALUES ($1, $2, $3, $4)`,
        [variant.variant_id, variant.ram, variant.storage, variant.color_id]
    );
}

export async function insertLaptopVariant(variant: LaptopVariant) {
    return await query(
        `INSERT INTO laptop_variant(variant_id, ram, storage, color_id)
     VALUES ($1, $2, $3, $4)`,
        [variant.variant_id, variant.ram, variant.storage, variant.color_id]
    );
}

export async function insertHeadphoneVariant(variant: HeadphoneVariant) {
    return await query(
        `INSERT INTO headphone_variant(variant_id, color_id)
     VALUES ($1, $2)`,
        [variant.variant_id, variant.color_id]
    );
}

export async function insertKeyboardVariant(variant: KeyboardVariant) {
    return await query(
        `INSERT INTO keyboard_variant(variant_id, switch_type, color_id)
     VALUES ($1, $2, $3)`,
        [variant.variant_id, variant.switch_type, variant.color_id]
    );
}

