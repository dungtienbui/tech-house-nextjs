-- Bật extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- TẠO BẢNG CHÍNH (KHÔNG FOREIGN KEY)
-- =====================

CREATE TABLE "account" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "email" VARCHAR,
  "username" VARCHAR,
  "password" VARCHAR,
  "full_name" VARCHAR,
  "phone_number" VARCHAR UNIQUE,
  "address" VARCHAR,
  "gender" VARCHAR,
  "date_of_birth" DATE,
  "role" VARCHAR,
  "registration_date" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE "employee" (
  "employee_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "national_id" VARCHAR UNIQUE
);

CREATE TABLE "customer" (
  "customer_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "customer_points" INT
);

CREATE TABLE "product_image" (
  "image_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "image_caption" VARCHAR,
  "image_alt" VARCHAR,
  "image_url" VARCHAR,
  "added_date" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE "product_base" (
  "product_base_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "product_name" VARCHAR,
  "brand" VARCHAR,
  "product_type" VARCHAR,
  "description" VARCHAR,
  "base_price" NUMERIC(12, 2)
);

CREATE TABLE "phone_specs" (
  "product_base_id" UUID PRIMARY KEY,
  "operating_system" VARCHAR,
  "display" VARCHAR,
  "front_camera" VARCHAR,
  "rear_camera" VARCHAR,
  "battery_capacity" INT,
  "sim" VARCHAR,
  "connectivity" VARCHAR
);

CREATE TABLE "laptop_specs" (
  "product_base_id" UUID PRIMARY KEY,
  "operating_system" VARCHAR,
  "display" VARCHAR,
  "cpu" VARCHAR,
  "gpu" VARCHAR,
  "connectivity" VARCHAR,
  "battery" VARCHAR,
  "weight" VARCHAR
);

CREATE TABLE "headphone_specs" (
  "product_base_id" UUID PRIMARY KEY,
  "headphone_type" VARCHAR,
  "connectivity" VARCHAR,
  "usage_time" INT,
  "sound_technology" VARCHAR,
  "weight" INT
);

CREATE TABLE "keyboard_specs" (
  "product_base_id" UUID PRIMARY KEY,
  "keyboard_type" VARCHAR,
  "connectivity" VARCHAR,
  "key_count" INT,
  "backlight" BOOLEAN,
  "size" VARCHAR,
  "weight" INT
);

CREATE TABLE "variant" (
  "variant_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "product_base_id" UUID,
  "stock" INT,
  "variant_price" NUMERIC(12, 2)
);

CREATE TABLE "color" (
  "color_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "value" VARCHAR,
  "color_name" VARCHAR
);

CREATE TABLE "phone_variant" (
  "variant_id" UUID PRIMARY KEY,
  "ram" INT,
  "storage" INT,
  "color_id" UUID
);

CREATE TABLE "laptop_variant" (
  "variant_id" UUID PRIMARY KEY,
  "ram" INT,
  "storage" VARCHAR,
  "color_id" UUID
);

CREATE TABLE "headphone_variant" (
  "variant_id" UUID PRIMARY KEY,
  "color_id" UUID
);

CREATE TABLE "keyboard_variant" (
  "variant_id" UUID PRIMARY KEY,
  "switch_type" VARCHAR,
  "color_id" UUID
);

CREATE TABLE "product_base_image" (
  "image_id" UUID,
  "product_base_id" UUID,
  PRIMARY KEY ("image_id", "product_base_id")
);

CREATE TABLE "variant_image" (
  "image_id" UUID,
  "variant_id" UUID,
  PRIMARY KEY ("image_id", "variant_id")
);

CREATE TABLE "review" (
  "review_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "rating" INT,
  "feedback" VARCHAR,
  "variant_id" UUID,
  "customer_name" VARCHAR,
  "phone_number" VARCHAR,
  "email" VARCHAR
);

CREATE TABLE "promotion_type" (
  "promotion_type_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "promotion_type_name" VARCHAR,
  "promotion_type_info" VARCHAR,
  "unit" VARCHAR
);

CREATE TABLE "promotion" (
  "promotion_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "promotion_type" UUID,
  "value" VARCHAR,
  "promotion_info" VARCHAR,
  "start_date" DATE,
  "end_date" DATE
);

CREATE TABLE "product_promotion" (
  "product_base_id" UUID,
  "promotion_id" UUID,
  PRIMARY KEY ("product_base_id", "promotion_id")
);

CREATE TABLE "payment_method" (
  "payment_method_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "payment_method_name" VARCHAR,
  "available" BOOLEAN
);

CREATE TABLE "payment_status" (
  "payment_status_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "status_name" VARCHAR
);

CREATE TABLE "order" (
  "order_id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "order_created_at" TIMESTAMPTZ DEFAULT now(),
  "payment_method" UUID,
  "payment_status" UUID,
  "payment_time" TIMESTAMPTZ,
  "total_amount" NUMERIC(14, 2),
  "reward_points" INT
);

CREATE TABLE "buyer_info" (
  "customer_id" UUID,
  "buyer_name" VARCHAR,
  "phone_number" VARCHAR,
  "address" VARCHAR,
  "order_id" UUID PRIMARY KEY
);

CREATE TABLE "order_product" (
  "order_id" UUID,
  "specific_product_id" UUID,
  "quantity" INT,
  "product_price" NUMERIC(12, 2),
  PRIMARY KEY ("order_id", "specific_product_id")
);

CREATE TABLE "inventory_history" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "variant_id" UUID,
  "quantity" INT,
  "transaction_type" BOOLEAN,
  "transaction_date" DATE
);

-- =====================
-- THÊM FOREIGN KEY
-- =====================

ALTER TABLE "employee"
ADD CONSTRAINT fk_employee_account FOREIGN KEY ("employee_id") REFERENCES "account" ("id");

ALTER TABLE "customer"
ADD CONSTRAINT fk_customer_account FOREIGN KEY ("customer_id") REFERENCES "account" ("id");

ALTER TABLE "phone_specs"
ADD CONSTRAINT fk_phone_specs FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id");

ALTER TABLE "laptop_specs"
ADD CONSTRAINT fk_laptop_specs FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id");

ALTER TABLE "headphone_specs"
ADD CONSTRAINT fk_headphone_specs FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id");

ALTER TABLE "keyboard_specs"
ADD CONSTRAINT fk_keyboard_specs FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id");

ALTER TABLE "variant"
ADD CONSTRAINT fk_variant_product FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id");

ALTER TABLE "phone_variant"
ADD CONSTRAINT fk_phone_variant FOREIGN KEY ("variant_id") REFERENCES "variant" ("variant_id"),
ADD CONSTRAINT fk_phone_variant_color FOREIGN KEY ("color_id") REFERENCES "color" ("color_id");

ALTER TABLE "laptop_variant"
ADD CONSTRAINT fk_laptop_variant FOREIGN KEY ("variant_id") REFERENCES "variant" ("variant_id"),
ADD CONSTRAINT fk_laptop_variant_color FOREIGN KEY ("color_id") REFERENCES "color" ("color_id");

ALTER TABLE "headphone_variant"
ADD CONSTRAINT fk_headphone_variant FOREIGN KEY ("variant_id") REFERENCES "variant" ("variant_id"),
ADD CONSTRAINT fk_headphone_variant_color FOREIGN KEY ("color_id") REFERENCES "color" ("color_id");

ALTER TABLE "keyboard_variant"
ADD CONSTRAINT fk_keyboard_variant FOREIGN KEY ("variant_id") REFERENCES "variant" ("variant_id"),
ADD CONSTRAINT fk_keyboard_variant_color FOREIGN KEY ("color_id") REFERENCES "color" ("color_id");

ALTER TABLE "product_base_image"
ADD CONSTRAINT fk_product_base_image FOREIGN KEY ("image_id") REFERENCES "product_image" ("image_id"),
ADD CONSTRAINT fk_product_base_image_product FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id");

ALTER TABLE "variant_image"
ADD CONSTRAINT fk_variant_image FOREIGN KEY ("image_id") REFERENCES "product_image" ("image_id"),
ADD CONSTRAINT fk_variant_image_variant FOREIGN KEY ("variant_id") REFERENCES "variant" ("variant_id");

ALTER TABLE "review"
ADD CONSTRAINT fk_review_product FOREIGN KEY ("variant_id") REFERENCES "variant" ("variant_id");

ALTER TABLE "promotion"
ADD CONSTRAINT fk_promotion_type FOREIGN KEY ("promotion_type") REFERENCES "promotion_type" ("promotion_type_id");

ALTER TABLE "product_promotion"
ADD CONSTRAINT fk_product_promotion_product FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id"),
ADD CONSTRAINT fk_product_promotion_promotion FOREIGN KEY ("promotion_id") REFERENCES "promotion" ("promotion_id");

ALTER TABLE "order"
ADD CONSTRAINT fk_order_payment_method FOREIGN KEY ("payment_method") REFERENCES "payment_method" ("payment_method_id"),
ADD CONSTRAINT fk_order_payment_status FOREIGN KEY ("payment_status") REFERENCES "payment_status" ("payment_status_id");

ALTER TABLE "buyer_info"
ADD CONSTRAINT fk_buyer_info_customer FOREIGN KEY ("customer_id") REFERENCES "customer" ("customer_id"),
ADD CONSTRAINT fk_buyer_info_order FOREIGN KEY ("order_id") REFERENCES "order" ("order_id");

ALTER TABLE "order_product"
ADD CONSTRAINT fk_order_product_order FOREIGN KEY ("order_id") REFERENCES "order" ("order_id"),
ADD CONSTRAINT fk_order_product_variant FOREIGN KEY ("specific_product_id") REFERENCES "variant" ("variant_id");

ALTER TABLE "inventory_history"
ADD CONSTRAINT fk_inventory_history_variant FOREIGN KEY ("variant_id") REFERENCES "variant" ("variant_id");
