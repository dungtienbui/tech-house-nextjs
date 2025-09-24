-- Bật extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- TẠO BẢNG CHÍNH (CÓ FOREIGN KEY TRỰC TIẾP)
-- =====================
CREATE TABLE
  "account" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "email" VARCHAR,
    "username" VARCHAR,
    "password" VARCHAR,
    "full_name" VARCHAR,
    "phone_number" VARCHAR UNIQUE,
    "address" VARCHAR,
    "gender" VARCHAR,
    "date_of_birth" DATE,
    "role" VARCHAR,
    "registration_date" TIMESTAMPTZ DEFAULT now ()
  );

CREATE TABLE
  "employee" (
    "employee_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "national_id" VARCHAR UNIQUE,
    CONSTRAINT fk_employee_account FOREIGN KEY ("employee_id") REFERENCES "account" ("id")
  );

CREATE TABLE
  "customer" (
    "customer_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "customer_points" INT,
    CONSTRAINT fk_customer_account FOREIGN KEY ("customer_id") REFERENCES "account" ("id")
  );

CREATE TABLE
  "color" (
    "color_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "value" VARCHAR,
    "color_name" VARCHAR
  );

INSERT INTO
  "color" (value, color_name)
VALUES
  ('#000000', 'Black'),
  ('#FFFFFF', 'White'),
  ('#FF0000', 'Red'),
  ('#00FF00', 'Lime'),
  ('#0000FF', 'Blue'),
  ('#FFFF00', 'Yellow'),
  ('#FFA500', 'Orange'),
  ('#800080', 'Purple'),
  ('#FFC0CB', 'Pink'),
  ('#808080', 'Gray'),
  ('#A52A2A', 'Brown'),
  ('#008000', 'Green'),
  ('#00FFFF', 'Cyan'),
  ('#FFD700', 'Gold'),
  ('#F5F5DC', 'Beige'),
  ('#D2691E', 'Chocolate'),
  ('#8B0000', 'Dark Red'),
  ('#4B0082', 'Indigo'),
  ('#FF1493', 'Deep Pink'),
  ('#F0E68C', 'Khaki');

CREATE TABLE
  "product_image" (
    "image_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "image_caption" VARCHAR,
    "image_alt" VARCHAR NULL,
    "image_url" VARCHAR,
    "added_date" TIMESTAMPTZ DEFAULT now ()
  );

CREATE TABLE
  "product_brand" (
    "brand_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (), -- khóa chính UUID
    "brand_name" VARCHAR(100) NOT NULL, -- tên thương hiệu
    "product_type" VARCHAR(50) NOT NULL, -- loại sản phẩm: phone, laptop, ...
    "logo_url" TEXT, -- link logo (optional)
    "country" VARCHAR(50) -- quốc gia (optional)
  );

-- Phone brands
INSERT INTO
  product_brand (brand_name, product_type, country, logo_url)
VALUES
  (
    'Apple',
    'phone',
    'US',
    'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
  ),
  (
    'Samsung',
    'phone',
    'KR',
    'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg'
  ),
  (
    'Xiaomi',
    'phone',
    'CN',
    'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg'
  ),
  (
    'Oppo',
    'phone',
    'CN',
    'https://upload.wikimedia.org/wikipedia/commons/5/5e/OPPO_Logo.svg'
  ),
  (
    'Vivo',
    'phone',
    'CN',
    'https://upload.wikimedia.org/wikipedia/commons/2/29/Vivo_logo.svg'
  ),
  (
    'Realme',
    'phone',
    'CN',
    'https://upload.wikimedia.org/wikipedia/commons/c/c5/Realme_logo.svg'
  ),
  (
    'OnePlus',
    'phone',
    'CN',
    'https://upload.wikimedia.org/wikipedia/commons/4/4e/OnePlus_logo.svg'
  ),
  (
    'Google',
    'phone',
    'US',
    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
  ),
  (
    'Huawei',
    'phone',
    'CN',
    'https://upload.wikimedia.org/wikipedia/commons/6/66/Huawei_logo.svg'
  ),
  (
    'Sony',
    'phone',
    'JP',
    'https://upload.wikimedia.org/wikipedia/commons/2/20/Sony_Logo.svg'
  ),
  (
    'Asus',
    'phone',
    'TW',
    'https://upload.wikimedia.org/wikipedia/commons/6/6a/ASUS_Logo.svg'
  ),
  (
    'Nokia',
    'phone',
    'FI',
    'https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg'
  );

-- Laptop brands
INSERT INTO
  product_brand (brand_name, product_type, country, logo_url)
VALUES
  (
    'Apple',
    'laptop',
    'US',
    'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
  ),
  (
    'Dell',
    'laptop',
    'US',
    'https://upload.wikimedia.org/wikipedia/commons/7/76/Dell_Logo.svg'
  ),
  (
    'HP',
    'laptop',
    'US',
    'https://upload.wikimedia.org/wikipedia/commons/3/3a/Hewlett-Packard_Logo.svg'
  ),
  (
    'Lenovo',
    'laptop',
    'CN',
    'https://upload.wikimedia.org/wikipedia/commons/0/06/Lenovo_logo_2015.svg'
  ),
  (
    'Asus',
    'laptop',
    'TW',
    'https://upload.wikimedia.org/wikipedia/commons/6/6a/ASUS_Logo.svg'
  ),
  (
    'Acer',
    'laptop',
    'TW',
    'https://upload.wikimedia.org/wikipedia/commons/f/f5/Acer_2011.svg'
  ),
  (
    'MSI',
    'laptop',
    'TW',
    'https://upload.wikimedia.org/wikipedia/commons/1/13/MSI_logo.svg'
  ),
  (
    'Razer',
    'laptop',
    'US',
    'https://upload.wikimedia.org/wikipedia/commons/9/91/Razer_logo.svg'
  ),
  (
    'Microsoft',
    'laptop',
    'US',
    'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg'
  ),
  (
    'Samsung',
    'laptop',
    'KR',
    'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg'
  ),
  (
    'LG',
    'laptop',
    'KR',
    'https://upload.wikimedia.org/wikipedia/commons/2/20/LG_logo_%282014%29.svg'
  ),
  (
    'Huawei',
    'laptop',
    'CN',
    'https://upload.wikimedia.org/wikipedia/commons/6/66/Huawei_logo.svg'
  );

-- Headphone brands
INSERT INTO
  product_brand (brand_name, product_type, country, logo_url)
VALUES
  (
    'Sony',
    'headphone',
    'JP',
    'https://upload.wikimedia.org/wikipedia/commons/2/20/Sony_Logo.svg'
  ),
  (
    'Bose',
    'headphone',
    'US',
    'https://upload.wikimedia.org/wikipedia/commons/4/47/Bose_logo.svg'
  ),
  (
    'Sennheiser',
    'headphone',
    'DE',
    'https://upload.wikimedia.org/wikipedia/commons/3/34/Sennheiser_logo.svg'
  ),
  (
    'Apple (AirPods)',
    'headphone',
    'US',
    'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
  ),
  (
    'Samsung (Galaxy Buds)',
    'headphone',
    'KR',
    'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg'
  ),
  (
    'JBL',
    'headphone',
    'US',
    'https://upload.wikimedia.org/wikipedia/commons/2/27/JBL_logo.svg'
  ),
  (
    'Beats',
    'headphone',
    'US',
    'https://upload.wikimedia.org/wikipedia/commons/0/0f/Beats_by_Dre_logo.svg'
  ),
  (
    'Audio-Technica',
    'headphone',
    'JP',
    'https://upload.wikimedia.org/wikipedia/commons/6/62/Audio-Technica_logo.svg'
  ),
  (
    'Shure',
    'headphone',
    'US',
    'https://upload.wikimedia.org/wikipedia/commons/8/8d/Shure_logo.svg'
  ),
  (
    'Bang & Olufsen',
    'headphone',
    'DK',
    'https://upload.wikimedia.org/wikipedia/commons/2/25/Bang_and_Olufsen_logo.svg'
  ),
  (
    'Skullcandy',
    'headphone',
    'US',
    'https://upload.wikimedia.org/wikipedia/commons/3/38/Skullcandy_logo.svg'
  ),
  (
    'Anker (Soundcore)',
    'headphone',
    'CN',
    'https://upload.wikimedia.org/wikipedia/commons/e/e4/Anker_logo.svg'
  );

-- Keyboard brands
INSERT INTO
  product_brand (brand_name, product_type, country, logo_url)
VALUES
  (
    'Logitech',
    'keyboard',
    'CH',
    'https://upload.wikimedia.org/wikipedia/commons/4/4b/Logitech_logo.svg'
  ),
  (
    'Razer',
    'keyboard',
    'US',
    'https://upload.wikimedia.org/wikipedia/commons/9/91/Razer_logo.svg'
  ),
  (
    'Corsair',
    'keyboard',
    'US',
    'https://upload.wikimedia.org/wikipedia/commons/e/ef/Corsair_logo.svg'
  ),
  (
    'SteelSeries',
    'keyboard',
    'DK',
    'https://upload.wikimedia.org/wikipedia/commons/7/73/Steelseries_logo.svg'
  ),
  (
    'Keychron',
    'keyboard',
    'HK',
    'https://upload.wikimedia.org/wikipedia/commons/7/70/Keychron_logo.svg'
  ),
  (
    'Ducky',
    'keyboard',
    'TW',
    'https://upload.wikimedia.org/wikipedia/commons/3/3d/Ducky_logo.svg'
  ),
  (
    'Akko',
    'keyboard',
    'CN',
    'https://upload.wikimedia.org/wikipedia/commons/4/4e/Akko_logo.svg'
  ),
  (
    'Leopold',
    'keyboard',
    'KR',
    'https://upload.wikimedia.org/wikipedia/commons/8/84/Leopold_logo.svg'
  ),
  (
    'HyperX',
    'keyboard',
    'US',
    'https://upload.wikimedia.org/wikipedia/commons/0/0b/HyperX_logo.svg'
  ),
  (
    'ASUS ROG',
    'keyboard',
    'TW',
    'https://upload.wikimedia.org/wikipedia/commons/f/f0/Republic_of_Gamers_logo.svg'
  ),
  (
    'Cooler Master',
    'keyboard',
    'TW',
    'https://upload.wikimedia.org/wikipedia/commons/c/c7/Cooler_Master_logo.svg'
  ),
  (
    'Varmilo',
    'keyboard',
    'CN',
    'https://upload.wikimedia.org/wikipedia/commons/8/8c/Varmilo_logo.svg'
  );

CREATE TABLE
  "product_base" (
    "product_base_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "product_name" VARCHAR,
    "brand_id" UUID,
    CONSTRAINT fk_product_base_brand FOREIGN KEY ("brand_id") REFERENCES "product_brand" ("brand_id"),
    "product_type" VARCHAR,
    "description" VARCHAR,
    "base_price" NUMERIC(12, 2)
  );

CREATE TABLE
  "variant" (
    "variant_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "product_base_id" UUID,
    "stock" INT,
    "variant_price" NUMERIC(12, 2),
    "preview_id" UUID,
    "is_promoting" BOOLEAN,
    "color_id" UUID,
    "ram" INT NULL,
    "storage" INT NULL,
    "switch_type" VARCHAR NULL,
    "date_added" TIMESTAMPTZ DEFAULT now (),
    CONSTRAINT fk_variant_product FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id"),
    CONSTRAINT fk_variant_product_preview FOREIGN KEY ("preview_id") REFERENCES "product_image" ("image_id"),
    CONSTRAINT uq_variant_unique_phone_laptop UNIQUE (
      product_base_id,
      ram,
      storage,
      color_id,
      switch_type
    )
  );

CREATE TABLE
  "phone_spec" (
    "product_base_id" UUID PRIMARY KEY,
    "weight" INT,
    "screen_size" NUMERIC(4, 1),
    "display_tech" VARCHAR,
    "chipset" VARCHAR,
    "os" VARCHAR,
    "battery" INT,
    "camera" VARCHAR,
    "material" VARCHAR,
    "connectivity" VARCHAR,
    CONSTRAINT fk_phone_spec FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id")
  );

CREATE TABLE
  "laptop_spec" (
    "product_base_id" UUID PRIMARY KEY,
    "weight" INT,
    "screen_size" NUMERIC(4, 1),
    "display_tech" VARCHAR,
    "chipset" VARCHAR,
    "os" VARCHAR,
    "battery" INT,
    "material" VARCHAR,
    "connectivity" VARCHAR,
    "gpu_card" VARCHAR,
    CONSTRAINT fk_laptop_spec FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id")
  );

CREATE TABLE
  "keyboard_spec" (
    "product_base_id" UUID PRIMARY KEY,
    "weight" INT,
    "material" VARCHAR,
    "connectivity" VARCHAR,
    "number_of_keys" INT,
    "usage_time" INT,
    CONSTRAINT fk_keyboard_spec FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id")
  );

CREATE TABLE
  "headphone_spec" (
    "product_base_id" UUID PRIMARY KEY,
    "weight" INT,
    "connectivity" VARCHAR,
    "usage_time" INT,
    "compatibility" VARCHAR,
    CONSTRAINT fk_headphone_spec FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id")
  );

CREATE TABLE
  "product_base_image" (
    "image_id" UUID,
    "product_base_id" UUID,
    PRIMARY KEY ("image_id", "product_base_id"),
    CONSTRAINT fk_product_base_image FOREIGN KEY ("image_id") REFERENCES "product_image" ("image_id"),
    CONSTRAINT fk_product_base_image_product FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id")
  );

CREATE TABLE
  "variant_image" (
    "image_id" UUID,
    "variant_id" UUID,
    PRIMARY KEY ("image_id", "variant_id"),
    CONSTRAINT fk_variant_image FOREIGN KEY ("image_id") REFERENCES "product_image" ("image_id"),
    CONSTRAINT fk_variant_image_variant FOREIGN KEY ("variant_id") REFERENCES "variant" ("variant_id")
  );

CREATE TABLE
  "review" (
    "review_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "rating" INT,
    "feedback" VARCHAR,
    "variant_id" UUID,
    "customer_name" VARCHAR,
    "phone_number" VARCHAR,
    "email" VARCHAR,
    CONSTRAINT fk_review_product FOREIGN KEY ("variant_id") REFERENCES "variant" ("variant_id")
  );

CREATE TABLE
  "promotion_type" (
    "promotion_type_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "promotion_type_name" VARCHAR,
    "promotion_type_info" VARCHAR,
    "unit" VARCHAR
  );

CREATE TABLE
  "promotion" (
    "promotion_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "promotion_type" UUID,
    "value" VARCHAR,
    "promotion_info" VARCHAR,
    "start_date" DATE,
    "end_date" DATE,
    CONSTRAINT fk_promotion_type FOREIGN KEY ("promotion_type") REFERENCES "promotion_type" ("promotion_type_id")
  );

CREATE TABLE
  "product_promotion" (
    "product_base_id" UUID,
    "promotion_id" UUID,
    PRIMARY KEY ("product_base_id", "promotion_id"),
    CONSTRAINT fk_product_promotion_product FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id"),
    CONSTRAINT fk_product_promotion_promotion FOREIGN KEY ("promotion_id") REFERENCES "promotion" ("promotion_id")
  );

CREATE TABLE
  "order" (
    "order_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "order_created_at" TIMESTAMPTZ DEFAULT now (),
    "payment_method" VARCHAR,
    "payment_status" VARCHAR,
    "total_amount" NUMERIC(14, 2),
    "reward_points" INT,
  );

CREATE TABLE
  "buyer_info" (
    "customer_id" UUID NULL,
    "buyer_name" VARCHAR,
    "phone_number" VARCHAR,
    "address" VARCHAR,
    "order_id" UUID PRIMARY KEY,
    CONSTRAINT fk_buyer_info_customer FOREIGN KEY ("customer_id") REFERENCES "customer" ("customer_id"),
    CONSTRAINT fk_buyer_info_order FOREIGN KEY ("order_id") REFERENCES "order" ("order_id")
  );

CREATE TABLE
  "order_product" (
    "order_id" UUID,
    "variant_id" UUID,
    "quantity" INT,
    "variant_price" NUMERIC(12, 2),
    PRIMARY KEY ("order_id", "specific_product_id"),
    CONSTRAINT fk_order_product_order FOREIGN KEY ("order_id") REFERENCES "order" ("order_id"),
    CONSTRAINT fk_order_product_variant FOREIGN KEY ("variant_id") REFERENCES "variant" ("variant_id")
  );

CREATE TABLE
  "inventory_history" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "variant_id" UUID,
    "quantity" INT,
    "transaction_type" BOOLEAN,
    "transaction_date" DATE,
    CONSTRAINT fk_inventory_history_variant FOREIGN KEY ("variant_id") REFERENCES "variant" ("variant_id")
  );

  CREATE OR REPLACE FUNCTION insert_order(
  p_payment_method VARCHAR,
  p_payment_status VARCHAR,
  p_total_amount NUMERIC(14,2),
  p_reward_points INT,
  p_customer_id UUID,
  p_buyer_name VARCHAR,
  p_phone_number VARCHAR,
  p_address VARCHAR,
  p_products JSONB  -- [{ "variant_id": "...", "quantity": 2, "variant_price": 123.45 }]
)
RETURNS UUID AS $$
DECLARE
  v_order_id UUID;
BEGIN
  -- 1. Insert vào order
  INSERT INTO "order" (payment_method, payment_status, total_amount, reward_points)
  VALUES (p_payment_method, p_payment_status, p_total_amount, p_reward_points)
  RETURNING order_id INTO v_order_id;

  -- 2. Insert buyer_info
  INSERT INTO buyer_info (order_id, customer_id, buyer_name, phone_number, address)
  VALUES (v_order_id, p_customer_id, p_buyer_name, p_phone_number, p_address);

  -- 3. Insert order_product (dùng jsonb_array_elements để tạo nhiều dòng)
  INSERT INTO order_product (order_id, variant_id, quantity, variant_price)
  SELECT
    v_order_id,
    (product->>'variant_id')::UUID,
    (product->>'quantity')::INT,
    (product->>'variant_price')::NUMERIC(12,2)
  FROM jsonb_array_elements(p_products) AS product;

  -- Trả về order_id vừa tạo
  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql;
