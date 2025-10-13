import { randomUUID } from "crypto";
import { Address, CartItem, CartItems, CartItemsSchema, GuestInfo, GuestOrderData } from "../definations/data-dto";
import { Color, ProductImage, ProductBaseImage, Variant, VariantImage, PhoneSpec, LaptopSpec, KeyboardSpec, HeadphoneSpec, ProductBase, User, UserResponse } from "../definations/database-table-definations";
import { PaymentMethod, ProductType, SpecResult } from "../definations/types";
import { saltAndHashPassword } from "../utils/password";
import { pool, query } from "./db";
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


export async function insertCheckoutSession(
    checkoutItems: CartItems,
) {
    const parsed = CartItemsSchema.safeParse(checkoutItems);

    if (!parsed.success) {
        console.log(parsed.error);
        throw new Error("Cart không hợp lệ");
    }

    const queryStr = `
      INSERT INTO checkout_session (cart, expires_at)
      VALUES ($1, $2)
      RETURNING checkout_id, created_at, expires_at;
    `;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // khoang 1 giờ từ bây giờ

    const checkoutItemsJson = JSON.stringify(checkoutItems);

    const resultQuery = await query<{ checkout_id: string, created_at: string, expires_at: string }>(queryStr, [checkoutItemsJson, expiresAt])

    return resultQuery[0];
}

export async function deleteCheckoutSession(
    id: string,
) {

    const queryStr = `
      DELETE FROM checkout_session cs
      WHERE cs.checkout_id = $1
      RETURNING *;
    `;

    const resultQuery = await query(queryStr, [id]);

    return resultQuery[0];
}


export async function insertUser({
    name,
    phone,
    password,
}: {
    name: string;
    phone: string;
    password: string;
}) {

    const queryStr = `
      INSERT INTO users (name, phone, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, phone, created_at, updated_at;
    `;

    const hashedPassword = await saltAndHashPassword(password);

    const values = [name, phone, hashedPassword];

    const resultQuery = await query<User>(queryStr, values);

    return resultQuery[0];
}

export async function updateUserAdderss({
    userId,
    address
}: {
    userId: string;
    address: Address;
}) {

    const queryStr = `
        UPDATE "users"
        SET
            "province" = $1,
            "ward" = $2,
            "street" = $3,
            "updated_at" = CURRENT_TIMESTAMP
        WHERE
            "id" = $4
        RETURNING id, name, phone, province, ward, street, created_at, updated_at;
    `;

    const values = [
        address.province,
        address.ward,
        address.street,
        userId
    ]

    const resultQuery = await query<UserResponse>(queryStr, values);

    return resultQuery[0];
}

export async function updateUserName({
    userId,
    name
}: {
    userId: string;
    name: string;
}) {

    const queryStr = `
        UPDATE "users"
        SET
            "name" = $1,
            "updated_at" = CURRENT_TIMESTAMP
        WHERE
            "id" = $2
        RETURNING id, name, phone, province, ward, street, created_at, updated_at;
    `;

    const resultQuery = await query<UserResponse>(queryStr, [userId, name]);

    return resultQuery[0];
}

export async function insertGuestOrder(
    orderData: GuestOrderData
): Promise<string> {

    if (orderData.items.length === 0) {
        throw new Error("Không có sản phẩm nào trong đơn hàng");
    }

    // Lấy một client từ connection pool
    const client = await pool.connect();

    try {
        // Bắt đầu một transaction
        await client.query('BEGIN');

        // 1. Chèn vào bảng "order"
        const insertOrderQuery = `
        INSERT INTO "order" (
            payment_method, payment_status, total_amount, reward_points,
            user_id, buyer_name, phone_number, province, ward, street
        )
        VALUES ($1, $2, $3, $4, NULL, $5, $6, $7, $8, $9)
        RETURNING order_id;
        `;

        const orderValues = [
            orderData.payment_method,
            orderData.payment_status,
            orderData.total_amount,
            orderData.reward_points,
            orderData.buyer_name,
            orderData.phone_number,
            orderData.province,
            orderData.ward,
            orderData.street,
        ];

        // Thực thi câu lệnh và lấy order_id trả về
        const orderResult = await client.query<{ order_id: string }>(insertOrderQuery, orderValues);
        const newOrderId = orderResult.rows[0].order_id;

        if (!newOrderId) {
            throw new Error('Failed to create order, could not retrieve order_id.');
        }

        // 2. Chèn vào bảng "order_product" cho từng sản phẩm
        const insertProductQuery = `
        INSERT INTO "order_product" (order_id, variant_id, quantity, variant_price)
        VALUES ($1, $2, $3, $4);
        `;

        // Tạo một mảng các promise để chèn tất cả sản phẩm
        const productInsertPromises = orderData.items.map(item => {
            const productValues = [
                newOrderId,
                item.variant_id,
                item.quantity,
                item.variant_price,
            ];
            return client.query(insertProductQuery, productValues);
        });

        // Chờ tất cả các promise chèn sản phẩm hoàn thành
        await Promise.all(productInsertPromises);

        // 3. Cập nhật "stock"
        const updateStockQuery = `
            UPDATE variant AS v
            SET
                stock = new_data.stock
            FROM
                (
                    SELECT
                        unnest($1::UUID[]) AS variant_id,
                        unnest($2::INT[]) AS stock
                ) AS new_data
            WHERE
                v.variant_id = new_data.variant_id
            RETURNING *
        `;


        const variantIds = orderData.items.map(item => item.variant_id);
        const stocks = orderData.items.map(item => item.newStock);

        const updateStockResult = await client.query<Variant>(updateStockQuery, [variantIds, stocks]);

        // Nếu mọi thứ thành công, commit transaction
        await client.query('COMMIT');

        return newOrderId;
    } catch (error) {
        // Nếu có lỗi, rollback lại tất cả các thay đổi
        await client.query('ROLLBACK');
        console.error('Error inserting guest order:', error);
        throw new Error('Could not create the order.');
    } finally {
        // Luôn luôn giải phóng client trở lại pool
        client.release();
    }
}


export async function InsertItemsToCart(userId: string, items: CartItem[]): Promise<{
    user_id: string, variant_id: string, quantity: number
}[]> {
    if (items.length === 0) {
        throw new Error("Mảng item bị rỗng");
    }

    const variantIds = items.map(item => item.variant_id);
    const quantities = items.map(item => item.quantity);

    const sql = `
        INSERT INTO user_cart (user_id, variant_id, quantity)
        SELECT
            $1::UUID,
            unnest($2::UUID[]) AS variant_id,
            unnest($3::INT[]) AS quantity
        ON CONFLICT (user_id, variant_id)
        DO UPDATE SET
            quantity = EXCLUDED.quantity
        RETURNING user_id, variant_id, quantity
    `;

    try {
        const resultQuery = await query<{ user_id: string, variant_id: string, quantity: number }>(sql, [userId, variantIds, quantities]);
        console.log(`✅ Đã thêm/cập nhật ${items.length} sản phẩm vào giỏ hàng cho user ${userId}.`);
        return resultQuery;

    } catch (error) {
        console.error("❌ Lỗi khi thao tác với giỏ hàng:", error);
        throw new Error("Không thể thêm sản phẩm vào giỏ hàng.");
    }
}
