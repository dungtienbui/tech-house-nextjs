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

CREATE TABLE
  "product_image" (
    "image_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "image_caption" VARCHAR,
    "image_alt" VARCHAR NULL,
    "image_url" VARCHAR,
    "added_date" TIMESTAMPTZ DEFAULT now ()
  );

CREATE TABLE
  "product_base" (
    "product_base_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "product_name" VARCHAR,
    "brand" VARCHAR,
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
  "payment_method" (
    "payment_method_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "payment_method_name" VARCHAR,
    "available" BOOLEAN
  );

CREATE TABLE
  "payment_status" (
    "payment_status_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "status_name" VARCHAR
  );

CREATE TABLE
  "order" (
    "order_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    "order_created_at" TIMESTAMPTZ DEFAULT now (),
    "payment_method" UUID,
    "payment_status" UUID,
    "payment_time" TIMESTAMPTZ,
    "total_amount" NUMERIC(14, 2),
    "reward_points" INT,
    CONSTRAINT fk_order_payment_method FOREIGN KEY ("payment_method") REFERENCES "payment_method" ("payment_method_id"),
    CONSTRAINT fk_order_payment_status FOREIGN KEY ("payment_status") REFERENCES "payment_status" ("payment_status_id")
  );

CREATE TABLE
  "buyer_info" (
    "customer_id" UUID,
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
    "specific_product_id" UUID,
    "quantity" INT,
    "product_price" NUMERIC(12, 2),
    PRIMARY KEY ("order_id", "specific_product_id"),
    CONSTRAINT fk_order_product_order FOREIGN KEY ("order_id") REFERENCES "order" ("order_id"),
    CONSTRAINT fk_order_product_variant FOREIGN KEY ("specific_product_id") REFERENCES "variant" ("variant_id")
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