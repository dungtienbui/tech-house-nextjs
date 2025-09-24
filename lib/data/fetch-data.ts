import { ProductVariantDTO, ProductVariantInShortDTO, RecommendedVariantsInShortDTO, SpecKeyValueDTO } from "../definations/data-dto";
import { ProductBrand, ProductImage } from "../definations/database-table-definations";
import { ProductType } from "../definations/types";
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
  return query<RecommendedVariantsInShortDTO>(queryString, key !== "" ? [numberItemOfPage, offset, `%${key}%`] : [numberItemOfPage, offset]);
}

// Has sql injection attack in queries param ?????????
export async function fetchProductVariantsInShort(
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

  // console.log("queriesStr: ", queriesStr);

  const whereArray = [...queriesStr, optionalStr];

  const whereStr = whereArray.length > 0 ? `where ${whereArray.join(" and ")
    } ` : "";

  const limitStr = "limit $1 offset $2";

  const queryString = `
SELECT
v.variant_id,
  v.stock,
  v.variant_price,
  v.date_added,
  v.is_promoting,
  v.ram,
  v.storage,
  v.switch_type,
  --Thông tin từ product_base
pb.product_base_id,
  pb.product_name,
  --Product brand
pb2.brand_name,
  pb.product_type,
  pb.description,
  pb.base_price,
  --Thông tin màu sắc(có thể null)
c.color_id,
  c.color_name,
  c.value AS color_value,
    --Ảnh preview(có thể null)
pi.image_id AS preview_image_id,
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


  return await query<ProductVariantInShortDTO>(queryString, preparedStatement);
}

export async function fetchProductVariantsInShortTotalPage(
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

export async function fetchVariantsOfProductBaseByVariantId(variantId: string) {
  const queryString = `
    WITH base AS(
  SELECT 
            v.product_base_id
        FROM variant v
        WHERE v.variant_id = $1
)
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
    JOIN product_base pb 
        ON v.product_base_id = pb.product_base_id
    LEFT JOIN product_brand pb2 
        ON pb.brand_id = pb2.brand_id
    JOIN base b 
        ON pb.product_base_id = b.product_base_id
    LEFT JOIN color c 
        ON v.color_id = c.color_id
    LEFT JOIN product_image pi 
        ON v.preview_id = pi.image_id
    ORDER BY v.date_added DESC;
`;

  const resultQuery = query<ProductVariantDTO>(queryString, [variantId]);
  return resultQuery;
}


export async function fetchImagesOfVariantById(variantId: string) {
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


export async function fetchSpecsOfVariant(variantId: string, productType: ProductType) {

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
    pb.description,
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



// Has sql injection attack in queries param ?????????
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
      v.date_added,
      v.is_promoting,
      v.ram,
      v.storage,
      v.switch_type,
      --Thông tin từ product_base
      pb.product_base_id,
      pb.product_name,
      --Product brand
      pb2.brand_name,
      pb.product_type,
      pb.description,
      pb.base_price,
      --Thông tin màu sắc(có thể null)
      c.color_id,
      c.color_name,
      c.value AS color_value,
        --Ảnh preview(có thể null)
      pi.image_id AS preview_image_id,
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
    WHERE v.variant_id IN (${whereStr});
`;

  // console.log("queryString: ", queryString);

  return await query<ProductVariantInShortDTO>(queryString, variantIdArray);
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