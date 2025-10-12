import { CheckoutSession, OrderDTO, ProductVariantDTO, RecommendedVariantDTO, SpecKeyValueDTO } from "../definations/data-dto";
import { ProductBrand, ProductImage, User } from "../definations/database-table-definations";
import { PaymentStatus, ProductType } from "../definations/types";
import { query } from "./db";

export async function fetchColors() {
  return await query(`
    select * from color;
  `)
}

export async function fetchBrandByProductType(productType: ProductType) {
  return await query<ProductBrand>(`
    select * from product_brand pb
    where pb.product_type = $1;
  `, [productType]);
}

export async function fetchBrands() {
  return await query(`
    select * from product_brand pb
  `);
}

export async function fetchRecommendedVariantsByKeyTotalPage(key: string, numberItemOfPage: number = 5) {

  const whereStr = `where 
    pb.product_name ILIKE $2 OR
    pb2.brand_name ILIKE $2 OR
    pb.product_type ILIKE $2 OR
    v.ram::text ILIKE $2 OR
    v.storage::text ILIKE $2 OR
    v.switch_type ILIKE $2 OR
    c.color_name ILIKE $2`;

  const queryString = `
    SELECT 
      COUNT(*) AS count
    FROM variant v
    LEFT JOIN product_base pb 
        ON v.product_base_id = pb.product_base_id
    LEFT JOIN product_brand pb2
      ON pb.brand_id = pb2.brand_id
    LEFT JOIN color c 
        ON v.color_id = c.color_id
    LEFT JOIN product_image pi 
        ON v.preview_id = pi.image_id
    ${key !== "" ? whereStr : ""}
    limit $1
    ;
    `
  const resultQuery = await query<{ count: number }>(queryString, key !== "" ? [numberItemOfPage, `%${key}%`] : [numberItemOfPage]);

  return Math.ceil(resultQuery[0].count / numberItemOfPage);
}

export async function fetchRecommendedVariantsByKey(key: string, numberItemOfPage: number = 5, page: number = 1) {

  const offset = (page - 1) * numberItemOfPage;

  const whereStr = `where 
    pb.product_name ILIKE $3 OR
    pb2.brand_name ILIKE $3 OR
    pb.product_type ILIKE $3 OR
    v.ram::text ILIKE $3 OR
    v.storage::text ILIKE $3 OR
    v.switch_type ILIKE $3 OR
    c.color_name ILIKE $3`;

  const queryString = `
    SELECT 
      v.variant_id,
      v.variant_price,
      v.ram,
      v.storage,
      v.switch_type,
      pb.product_base_id,
      pb.product_name,
      pb2.brand_name,
      pb.product_type,
      c.color_name,
      c.value AS color_value,
      pi.image_url AS preview_image_url,
      pi.image_caption AS preview_image_caption
    FROM variant v
    LEFT JOIN product_base pb 
        ON v.product_base_id = pb.product_base_id
    LEFT JOIN product_brand pb2
      ON pb.brand_id = pb2.brand_id
    LEFT JOIN color c 
        ON v.color_id = c.color_id
    LEFT JOIN product_image pi 
        ON v.preview_id = pi.image_id
    ${key !== "" ? whereStr : ""}
    order by v.is_promoting DESC, v.date_added DESC
    limit $1 offset $2
    ;
    `

  // console.log("queryString: ", queryString);
  return query<RecommendedVariantDTO>(queryString, key !== "" ? [numberItemOfPage, offset, `%${key}%`] : [numberItemOfPage, offset]);
}

export async function fetchVariants(
  productType?: ProductType,
  optional?: {
    limit?: number;
    isPromoting?: boolean;
    currentPage?: number;
  },
  queries?: {
    param: string,
    value: string[],
  }[]
) {

  const numberItemOfPage = optional?.limit ?? 10;
  const currPage = optional?.currentPage ?? 1
  const offset = (currPage - 1) * numberItemOfPage;

  const optionalStr = [
    productType && `pb.product_type = $3`,
    optional?.isPromoting && `v.is_promoting = $4`
  ].filter(Boolean).join(" and ");

  // console.log("queries: ", queries);

  const queriesStr = queries ? queries.map((queries, index) => {
    if (queries.param === "ram") {
      return `(${queries.value.map((v, idx) => `v.ram=${v}`).join(" or ")})`
    } else if (queries.param === "storage") {
      return `(${queries.value.map((v, idx) => `v.storage=${v}`).join(" or ")})`
    } else if (queries.param === "brand") {
      return `(${queries.value.map((v, idx) => `pb2.brand_name='${v}'`).join(" or ")})`
    } else {
      return "";
    }

  }) : [];

  const whereArray = [...queriesStr, optionalStr];

  const whereStr = whereArray.length > 0 ? `where ${whereArray.join(" and ")
    } ` : "";

  const limitStr = "limit $1 offset $2";

  const queryString = `
    SELECT
      v.variant_id,
      v.stock,
      v.variant_price,
      v.is_promoting,
      v.ram,
      v.storage,
      v.switch_type,
      v.date_added,
      --Thông tin từ product_base
      pb.product_base_id,
      pb.product_name,
      to_json(pb2) AS brand,
        pb.product_type,
        pb.description,
        pb.base_price,
        --Thông tin màu sắc(có thể null)
      to_json(c) AS color,
      --Ảnh preview(có thể null)
      json_build_object(
        'image_id', pi.image_id,
        'image_url', pi.image_url,
        'image_caption', pi.image_caption,
        'image_alt', pi.image_alt
      ) as preview_image
    FROM variant v
    LEFT JOIN product_base pb 
        ON v.product_base_id = pb.product_base_id
    LEFT JOIN product_brand pb2
      ON pb.brand_id = pb2.brand_id
    LEFT JOIN color c 
        ON v.color_id = c.color_id
    LEFT JOIN product_image pi 
        ON v.preview_id = pi.image_id
    ${whereStr}
    order by v.is_promoting DESC, v.date_added DESC
    ${limitStr}
    ;
  `;


  const preparedStatement = [
    numberItemOfPage,
    offset,
    productType ? productType : null,
    optional?.isPromoting ? optional.isPromoting : null,
  ].filter(item => item !== null);


  return await query<ProductVariantDTO>(queryString, preparedStatement);
}

export async function fetchVariantsTotalPage(
  productType?: ProductType,
  optional?: {
    limit?: number;
    isPromoting?: boolean;
  },
  queries?: {
    param: string,
    value: string[],
  }[]
) {

  const optionalStr = [
    productType && `pb.product_type = $2`,
    optional?.isPromoting && `v.is_promoting = $3`
  ].filter(Boolean).join(" and ");

  // console.log("queries: ", queries);

  const queriesStr = queries ? queries.map((queries, index) => {
    if (queries.param === "ram") {
      return `(${queries.value.map((v, idx) => `v.ram=${v}`).join(" or ")})`
    } else if (queries.param === "storage") {
      return `(${queries.value.map((v, idx) => `v.storage=${v}`).join(" or ")})`
    } else if (queries.param === "brand") {
      return `(${queries.value.map((v, idx) => `pb2.brand_name='${v}'`).join(" or ")})`
    } else {
      return "";
    }

  }) : [];

  // console.log("queriesStr: ", queriesStr);

  const whereArray = [...queriesStr, optionalStr];

  const whereStr = whereArray.length > 0 ? `where ${whereArray.join(" and ")} ` : "";

  const numberItemOfPage = optional?.limit ?? 10;

  const limitStr = `limit $1`;

  const queryString = `
      SELECT
      COUNT(*) AS count
      FROM variant v
      LEFT JOIN product_base pb 
          ON v.product_base_id = pb.product_base_id
      LEFT JOIN product_brand pb2
        ON pb.brand_id = pb2.brand_id
      LEFT JOIN color c 
          ON v.color_id = c.color_id
      LEFT JOIN product_image pi 
          ON v.preview_id = pi.image_id
      ${whereStr}
      ${limitStr}
      ;
  `;

  // console.log("queryString: ", queryString);

  const preparedStatement = [
    numberItemOfPage,
    productType ? productType : null,
    optional?.isPromoting ? optional.isPromoting : null,
  ].filter(item => item !== null);

  const resultQuery = await query<{ count: number }>(queryString, preparedStatement);

  return Math.ceil(resultQuery[0].count / numberItemOfPage);
}

export async function fetchVariantImages(variantId: string) {
  const queryString = `
SELECT
pi.image_id,
  pi.image_url,
  pi.image_caption,
  pi.image_alt,
  pi.added_date
    FROM variant v
    LEFT JOIN variant_image vi
        ON v.variant_id = vi.variant_id
    LEFT JOIN product_image pi
      on vi.image_id = pi.image_id
    where v.variant_id = $1
    order by pi.added_date
  `;

  const resultQuery = query<ProductImage>(queryString, [variantId]);

  return resultQuery
}

export async function fetchProductSpecs(variantId: string, productType: ProductType) {

  const joinSpec = `${productType}_spec`;

  const queryString = `
    WITH base AS(
      SELECT
        v.product_base_id,
        v.variant_id,
        v.ram,
        v."storage",
        v.switch_type,
        c.color_name,
        pb.product_type
      FROM variant v
      LEFT JOIN product_base pb on v.product_base_id = pb.product_base_id
      LEFT JOIN color c ON v.color_id = c.color_id
      WHERE v.variant_id = $1
    )
    SELECT
      *
    FROM base b
    LEFT JOIN ${joinSpec} ps ON b.product_base_id = ps.product_base_id;
  `;

  const resultQuery = query<SpecKeyValueDTO>(queryString, [variantId]);

  return resultQuery
}

export async function fetchProductDescription(variantId: string) {
  const queryString = `
    SELECT
      pb.description
    FROM variant v
    LEFT JOIN product_base pb on v.product_base_id = pb.product_base_id
    WHERE v.variant_id = $1
  `;

  const resultQuery = query<{ description: string }>(queryString, [variantId]);

  return resultQuery
}

export async function fetchVariantsByVariantIdArray(
  variantIdArray: string[]
) {

  if (variantIdArray.length === 0) {
    return [];
  }

  const whereStr = variantIdArray.map((id, idx) => {
    return `$${idx + 1}`
  }).join(",")

  const queryString = `
    SELECT
      v.variant_id,
      v.stock,
      v.variant_price,
      v.is_promoting,
      v.ram,
      v.storage,
      v.switch_type,
      v.date_added,
      --Thông tin từ product_base
      pb.product_base_id,
      pb.product_name,
      to_json(pb2) AS brand,
        pb.product_type,
        pb.description,
        pb.base_price,
        --Thông tin màu sắc(có thể null)
      to_json(c) AS color,
      --Ảnh preview(có thể null)
      json_build_object(
        'image_id', pi.image_id,
        'image_url', pi.image_url,
        'image_caption', pi.image_caption,
        'image_alt', pi.image_alt
      ) as preview_image
    FROM variant v
    LEFT JOIN product_base pb 
      ON v.product_base_id = pb.product_base_id
    LEFT JOIN product_brand pb2
      ON pb.brand_id = pb2.brand_id
    LEFT JOIN color c 
      ON v.color_id = c.color_id
    LEFT JOIN product_image pi 
      ON v.preview_id = pi.image_id
    WHERE v.variant_id IN (${whereStr});
`;

  // console.log("queryString: ", queryString);

  return await query<ProductVariantDTO>(queryString, variantIdArray);
}

export async function fetchVariantPrices(variantIds: string[]) {
  if (variantIds.length === 0) return {};

  // Tạo danh sách placeholder an toàn để tránh SQL injection
  const placeholders = variantIds.map((_, i) => `$${i + 1}`).join(",");

  const sql = `
    SELECT v.variant_id, v.variant_price
    FROM variant v
    WHERE v.variant_id IN (${placeholders});
  `;

  const result = await query<{ variant_id: string; variant_price: number }>(
    sql,
    variantIds
  );

  // Chuyển kết quả rows thành object { id: price }
  const priceMap: Record<string, number> = {};
  for (const row of result) {
    priceMap[row.variant_id] = Number(row.variant_price);
  }

  return priceMap;
}

export async function fetchOrdersByPhoneNumber(phone: string, status?: PaymentStatus): Promise<OrderDTO[]> {

  const queryStr = `
    SELECT
      o.order_id,
      o.order_created_at,
      o.payment_method,
      o.payment_status,
      o.total_amount,
      o.reward_points,

      b.buyer_name,
      b.phone_number,
      b.address,

      op.variant_id,
      op.quantity,
      op.variant_price,

      c.color_name,
      v.ram,
      v.storage,
      v.switch_type,
      pi.image_url AS preview_image_url,
      pi.image_alt AS preview_image_alt,

      pb.product_name,
      pb.product_type

      FROM "order" o
      JOIN buyer_info b ON b.order_id = o.order_id
      JOIN order_product op ON op.order_id = o.order_id
      JOIN variant v ON v.variant_id = op.variant_id
      JOIN product_base pb ON pb.product_base_id = v.product_base_id
      JOIN color c ON v.color_id = c.color_id
      JOIN product_image pi ON v.preview_id = pi.image_id

      WHERE b.phone_number = $1 ${status ? "and o.payment_status = $2" : ""}
      ORDER BY o.order_created_at DESC
  `;

  const result = await query(queryStr, status ? [phone, status] : [phone]);

  // Gom nhóm theo order_id
  const ordersMap = new Map<string, OrderDTO>();

  for (const row of result) {
    if (!ordersMap.has(row.order_id)) {
      ordersMap.set(row.order_id, {
        order_id: row.order_id,
        order_created_at: row.order_created_at,
        payment_method: row.payment_method,
        payment_status: row.payment_status,
        total_amount: Number(row.total_amount),
        reward_points: row.reward_points,
        buyer_name: row.buyer_name,
        phone_number: row.phone_number,
        address: row.address,
        products: [],
      });
    }

    const order = ordersMap.get(row.order_id)!;

    order.products.push({
      variant_id: row.variant_id,
      quantity: row.quantity,
      variant_price: Number(row.variant_price),
      product_name: row.product_name,
      color_name: row.color_name,
      ram: row.ram,
      storage: row.storage,
      switch_type: row.switch_type,
      preview_image_url: row.preview_image_url,
      preview_image_alt: row.preview_image_alt,
      product_type: row.product_type
    });
  }

  return Array.from(ordersMap.values());
}

export async function fetchCheckoutSessionById(
  checkoutSessionId: string
) {
  const queryString = `select * from checkout_session cs where cs.checkout_id = $1`;

  const resultQuery = await query<CheckoutSession>(queryString, [checkoutSessionId]);

  return resultQuery[0];
}

export async function fetchVariantsByCheckoutSessionId(
  checkoutSessionId: string
) {

  const checkoutSession = await fetchCheckoutSessionById(checkoutSessionId);

  const variantIdArray = checkoutSession.cart.map(item => item.variant_id);

  const varriants = await fetchVariantsByVariantIdArray(variantIdArray);

  return varriants;
}

export async function fetchUserByPhone(phone: string): Promise<User | null> {
  const result = await query<User>("SELECT * FROM users WHERE phone = $1", [phone]);
  return result[0] || null;
}

export async function fetchUserById(id: string): Promise<User | null> {
  const result = await query<User>("SELECT * FROM users WHERE id = $1", [id]);
  return result[0] || null;
}



