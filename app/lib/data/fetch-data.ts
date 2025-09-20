import { ProductVariantDTO, ProductVariantInShortDTO, SpecKeyValueDTO } from "../definations/data-dto";
import { ProductImage } from "../definations/database-table-definations";
import { ProductType } from "../definations/types";
import { query } from "./db";

export async function fetchColors() {
  return await query(`
    select * from color;
  `)
}

export async function fetchProductVariantsInShort(
  productType?: ProductType,
  optional?: {
    limit?: number;
    isPromoting?: boolean;
  }) {

  const whereArray = [
    productType && `pb.product_type = $1`,
    optional?.isPromoting && `v.is_promoting = $2`
  ].filter(Boolean);

  const whereStr = whereArray.length > 0 ? `where ${whereArray.join(" and ")}` : "";


  const limitStr = optional?.limit ? `limit $3` : "";

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
        -- Thông tin từ product_base
        pb.product_base_id,
        pb.product_name,
        pb.brand,
        pb.product_type,
        pb.description,
        pb.base_price,
        -- Thông tin màu sắc (có thể null)
        c.color_id,
        c.color_name,
        c.value AS color_value,
        -- Ảnh preview (có thể null)
        pi.image_id AS preview_image_id,
        pi.image_url AS preview_image_url,
        pi.image_caption AS preview_image_caption
    FROM variant v
    JOIN product_base pb 
        ON v.product_base_id = pb.product_base_id
    LEFT JOIN color c 
        ON v.color_id = c.color_id
    LEFT JOIN product_image pi 
        ON v.preview_id = pi.image_id
    ${whereStr}
    order by v.date_added
    ${limitStr}
    ;
  `;

  const preparedStatement = [
    productType && productType,
    optional?.isPromoting && optional.isPromoting,
    optional?.limit && optional.limit,
  ].filter(Boolean);

  if (preparedStatement.length > 0) {
    return await query<ProductVariantInShortDTO>(queryString, preparedStatement);
  } else {
    return await query<ProductVariantInShortDTO>(queryString);
  }
}

export async function fetchVariantsOfProductBaseByVariantId(variantId: string) {
  const queryString = `
    WITH base AS (
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
        -- Thông tin từ product_base
        pb.product_base_id,
        pb.product_name,
        pb.brand,
        pb.product_type,
        pb.description,
        pb.base_price,
        -- Thông tin màu sắc (có thể null)
        json_build_object(
            'color_id', c.color_id,
            'color_name', c.color_name,
            'value', c.value
        ) as color,
        -- Ảnh preview (có thể null)
        json_build_object(
            'image_id', pi.image_id,
            'image_url', pi.image_url,
            'image_caption', pi.image_caption,
            'image_alt', pi.image_alt
        ) as preview_image
    FROM variant v
    JOIN product_base pb 
        ON v.product_base_id = pb.product_base_id
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
    where v.variant_id  = $1
    order by pi.added_date
  `;

  const resultQuery = query<ProductImage>(queryString, [variantId]);

  return resultQuery
}


export async function fetchSpecsOfVariant(variantId: string, productType: ProductType) {

  const joinSpec = `${productType}_spec`;

  const queryString = `
    WITH base AS (
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