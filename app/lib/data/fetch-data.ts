import { ProductVariantInShortDTO } from "../definations/data-dto";
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

  const queryStr = `
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
    return await query<ProductVariantInShortDTO>(queryStr, preparedStatement);
  } else {
    return await query<ProductVariantInShortDTO>(queryStr);
  }

}
