import { CartItem, CartItems, CheckoutSession, OrderDetailsDTO, ProductBrand, ProductImage, ProductReviewDisplayDTO, ProductVariantDTO, RecommendedVariantDTO, SpecKeyValueDTO, UserDTO } from "../definations/data-dto";
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
): Promise<ProductVariantDTO[]> {

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

  const variants = await query<ProductVariantDTO>(queryString, preparedStatement);

  const variantIds = variants.map(i => i.variant_id);

  const reviews = await fetchProductReviewStatisticsByVariantIds(variantIds);

  return variants.map((item) => {
    const review = reviews.find(r => r.variant_id === item.variant_id);
    if (!review) {
      return item;
    }

    return {
      ...item,
      review: {
        star: review.star,
        count: review.count
      }
    }
  })
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

export async function fetchVariantStock(variantIds: string[]) {
  if (variantIds.length === 0) return {};

  // Tạo danh sách placeholder an toàn để tránh SQL injection
  const placeholders = variantIds.map((_, i) => `$${i + 1}`).join(",");

  const sql = `
    SELECT v.variant_id, v.stock
    FROM variant v
    WHERE v.variant_id IN (${placeholders});
  `;

  const result = await query<{ variant_id: string; stock: number }>(
    sql,
    variantIds
  );

  // Chuyển kết quả rows thành object { id: price }
  const priceMap: Record<string, number> = {};
  for (const row of result) {
    priceMap[row.variant_id] = Number(row.stock);
  }

  return priceMap;
}

export async function fetchCheckoutSessionById(
  checkoutSessionId: string
) {
  const queryString = `select * from checkout_session cs where cs.checkout_id = $1`;

  const resultQuery = await query<CheckoutSession>(queryString, [checkoutSessionId]);

  return resultQuery[0];
}

export async function fetchUserByPhone(phone: string): Promise<UserDTO | null> {
  const result = await query<UserDTO>("SELECT id, name, phone, province, ward, street, created_at, updated_at FROM users WHERE phone = $1", [phone]);
  return result[0] || null;
}

export async function fetchUserFullByPhone(phone: string): Promise<UserDTO & { password: string } | null> {
  const result = await query<UserDTO & { password: string }>("SELECT * FROM users WHERE phone = $1", [phone]);
  return result[0] || null;
}

export async function fetchUserById(id: string): Promise<UserDTO | null> {
  const result = await query<UserDTO>("SELECT id, name, phone, province, ward, street, created_at, updated_at FROM users WHERE id = $1", [id]);
  return result[0] || null;
}

export async function fetchOrderByPhone(phoneNumber: string, queryStatus: PaymentStatus | "total"): Promise<OrderDetailsDTO[]> {
  const sqlQuery = `
      SELECT
        o.order_id,
        o.order_created_at,
        o.payment_method,
        o.payment_status,
        o.total_amount,
        o.reward_points,
        o.user_id,
        o.buyer_name,
        o.phone_number,
        o.province,
        o.ward,
        o.street,
        -- Gộp các sản phẩm liên quan thành một mảng JSON
        COALESCE(
          json_agg(
            json_build_object(
              'product_name', pb.product_name,
              'variant_id', v.variant_id,
              'product_type', pb.product_type,
              'quantity', op.quantity,
              'variant_price', op.variant_price,
              'color_name', c.color_name,
              'ram', v.ram,
              'storage', v.storage,
              'switch_type', v.switch_type,
              'preview_image_url', pi.image_url,
              'preview_image_alt', pi.image_alt
            )
          ) FILTER (WHERE op.order_id IS NOT NULL),
          '[]'::json
        ) AS products
      FROM
        "order" AS o
      LEFT JOIN order_product op ON o.order_id = op.order_id
      LEFT JOIN variant v ON v.variant_id = op.variant_id
      LEFT JOIN product_base pb ON pb.product_base_id = v.product_base_id
      LEFT JOIN color c ON v.color_id = c.color_id
      LEFT JOIN product_image pi ON v.preview_id = pi.image_id
      WHERE
        o.phone_number = $1
        ${queryStatus !== "total" ? "and o.payment_status = $2" : ""}
      GROUP BY
        o.order_id
      ORDER BY
        o.order_created_at DESC;
    `;

  const values = queryStatus !== "total" ? [phoneNumber, queryStatus] : [phoneNumber]
  // Sử dụng hàm query bạn đã cung cấp
  const orders = await query<OrderDetailsDTO>(sqlQuery, values);

  return orders;

}


export async function fetchCartItemsByUserId(userId: string): Promise<CartItems | []> {

  const queryString = `
    SELECT
      uc.variant_id,
      uc.quantity
    FROM user_cart AS uc
    WHERE uc.user_id = $1;
  `;

  const result = await query<CartItem>(queryString, [userId]);
  return result || [];
}


export async function fetchOrderByIdAndPhone(id: string, phone: string): Promise<OrderDetailsDTO> {
  const sqlQuery = `
      SELECT
        o.order_id,
        o.order_created_at,
        o.payment_method,
        o.payment_status,
        o.total_amount,
        o.reward_points,
        o.user_id,
        o.buyer_name,
        o.phone_number,
        o.province,
        o.ward,
        o.street,
        -- Gộp các sản phẩm liên quan thành một mảng JSON
        COALESCE(
          json_agg(
            json_build_object(
              'product_name', pb.product_name,
              'variant_id', v.variant_id,
              'product_type', pb.product_type,
              'quantity', op.quantity,
              'variant_price', op.variant_price,
              'color_name', c.color_name,
              'ram', v.ram,
              'storage', v.storage,
              'switch_type', v.switch_type,
              'preview_image_url', pi.image_url,
              'preview_image_alt', pi.image_alt
            )
          ) FILTER (WHERE op.order_id IS NOT NULL),
          '[]'::json
        ) AS products
      FROM
        "order" AS o
      LEFT JOIN order_product op ON o.order_id = op.order_id
      LEFT JOIN variant v ON v.variant_id = op.variant_id
      LEFT JOIN product_base pb ON pb.product_base_id = v.product_base_id
      LEFT JOIN color c ON v.color_id = c.color_id
      LEFT JOIN product_image pi ON v.preview_id = pi.image_id
      WHERE
        o.phone_number = $1 and o.order_id = $2
      GROUP BY
        o.order_id;
    `;

  const orders = await query<OrderDetailsDTO>(sqlQuery, [phone, id]);

  return orders[0];

}

export async function fetchOrderById(id: string): Promise<OrderDetailsDTO> {
  const sqlQuery = `
      SELECT
        o.order_id,
        o.order_created_at,
        o.payment_method,
        o.payment_status,
        o.total_amount,
        o.reward_points,
        o.user_id,
        o.buyer_name,
        o.phone_number,
        o.province,
        o.ward,
        o.street,
        -- Gộp các sản phẩm liên quan thành một mảng JSON
        COALESCE(
          json_agg(
            json_build_object(
              'product_name', pb.product_name,
              'variant_id', v.variant_id,
              'product_type', pb.product_type,
              'quantity', op.quantity,
              'variant_price', op.variant_price,
              'color_name', c.color_name,
              'ram', v.ram,
              'storage', v.storage,
              'switch_type', v.switch_type,
              'preview_image_url', pi.image_url,
              'preview_image_alt', pi.image_alt
            )
          ) FILTER (WHERE op.order_id IS NOT NULL),
          '[]'::json
        ) AS products
      FROM
        "order" AS o
      LEFT JOIN order_product op ON o.order_id = op.order_id
      LEFT JOIN variant v ON v.variant_id = op.variant_id
      LEFT JOIN product_base pb ON pb.product_base_id = v.product_base_id
      LEFT JOIN color c ON v.color_id = c.color_id
      LEFT JOIN product_image pi ON v.preview_id = pi.image_id
      WHERE
        o.order_id = $1
      GROUP BY
        o.order_id;
    `;

  const orders = await query<OrderDetailsDTO>(sqlQuery, [id]);

  return orders[0];

}


export async function checkHasOrderByIdAndPhone(id: string, phone: string): Promise<{ order_id: string }> {
  const sqlQuery = `
      SELECT
        o.order_id
      FROM
        "order" AS o
      WHERE
        o.phone_number = $1 and o.order_id = $2
    `;

  const orders = await query<{ order_id: string }>(sqlQuery, [phone, id]);

  return orders[0];

}

export async function fetchProductReviewsByVariantId(
  variantId: string
): Promise<ProductReviewDisplayDTO[]> {

  const queryStr = `
    SELECT
      pr.review_id,
      pr.user_id,
      u.name AS user_name,
      pr.rating,
      pr.comment,
      pr.created_at
    FROM 
      product_review AS pr
    JOIN 
      "users" AS u ON pr.user_id = u.id
    JOIN 
      variant AS v ON pr.variant_id = v.variant_id
    WHERE 
      v.variant_id = $1
    ORDER BY 
      pr.created_at DESC;
  `;

  const values = [variantId];

  const resultQuery = await query<ProductReviewDisplayDTO>(queryStr, values);

  // Hàm này trả về một mảng các review
  return resultQuery;
}


export interface ProductReviewStats {
  variant_id: string;
  star: number; // Điểm trung bình (Average rating)
  count: number; // Tổng số đánh giá (Total count)
}

export async function fetchProductReviewStatisticsByVariantIds(
  variantIds: string[]
): Promise<ProductReviewStats[]> {

  // Tránh lỗi SQL nếu mảng rỗng
  if (!variantIds || variantIds.length === 0) {
    return [];
  }

  const queryStr = `
    SELECT
      pr.variant_id,
      -- Tính điểm trung bình (làm tròn đến 2 chữ số thập phân)
      ROUND(AVG(pr.rating)::numeric, 2) AS star,
      -- Đếm tổng số đánh giá
      COUNT(pr.review_id) AS count
    FROM 
      product_review AS pr
    WHERE 
      pr.variant_id = ANY($1::uuid[])
    GROUP BY 
      pr.variant_id
    ORDER BY 
      pr.variant_id;
  `;

  const values = [variantIds];

  try {
    const resultQuery = await query<ProductReviewStats>(queryStr, values);
    return resultQuery;
  } catch (error) {
    console.error("Error fetching product review statistics by variant IDs:", error);
    throw new Error("Failed to fetch product review statistics.");
  }
}


export async function purchaseCheck(orderId: string, variantId: string, userId: string): Promise<boolean> {
  const queryString = `
      SELECT op.quantity
      FROM "order" o
      JOIN order_product op ON o.order_id = op.order_id
      WHERE o.order_id = $1 
      AND op.variant_id = $2
      AND o.user_id = $3;`;

  const values = [orderId, variantId, userId];

  const result = await query(queryString, values);

  if (!result || result.length === 0) {
    return false;
  }

  return true;

}