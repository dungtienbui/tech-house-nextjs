CREATE TABLE "account" (
  "id" varchar PRIMARY KEY,
  "email" varchar,
  "username" varchar,
  "password" varchar,
  "full_name" varchar,
  "phone_number" varchar UNIQUE,
  "address" varchar,
  "gender" varchar,
  "date_of_birth" date,
  "role" varchar,
  "registration_date" timestamp default now()
);

CREATE TABLE "employee" (
  "employee_id" varchar PRIMARY KEY,
  "national_id" varchar UNIQUE
);

CREATE TABLE "customer" (
  "customer_id" varchar PRIMARY KEY,
  "customer_points" int
);

CREATE TABLE "image" (
  "image_id" varchar PRIMARY KEY,
  "image_caption" varchar,
  "image_alt" varchar,
  "image_url" varchar,
  "added_date" timestamp default now()
);

CREATE TABLE "product_base_image" (
  "image_id" varchar,
  "product_base_id" varchar,
  PRIMARY KEY ("image_id", "product_base_id")
);

CREATE TABLE "variant_image" (
  "image_id" varchar,
  "variant_id" varchar,
  PRIMARY KEY ("image_id", "variant_id")
);

CREATE TABLE "product_type" (
  "product_type_id" varchar PRIMARY KEY,
  "product_type_name" varchar UNIQUE
);

CREATE TABLE "product_category" (
  "category_id" varchar PRIMARY KEY,
  "category_name" varchar UNIQUE
);

CREATE TABLE "category_detail" (
  "category_id" varchar,
  "product_type_id" varchar,
  PRIMARY KEY ("category_id", "product_type_id")
);

CREATE TABLE "product_base" (
  "product_base_id" varchar PRIMARY KEY,
  "product_name" varchar,
  "brand" varchar,
  "product_type_id" varchar,
  "description" varchar,
  "base_price" numeric(12, 2)
);

CREATE TABLE "phone_specs" (
  "product_base_id" varchar PRIMARY KEY,
  "operating_system" varchar,
  "display" varchar,
  "front_camera" varchar,
  "rear_camera" varchar,
  "battery_capacity" int,
  "sim" varchar,
  "connectivity" varchar
);

CREATE TABLE "laptop_specs" (
  "product_base_id" varchar PRIMARY KEY,
  "operating_system" varchar,
  "display" varchar,
  "cpu" varchar,
  "gpu" varchar,
  "connectivity" varchar,
  "battery" varchar,
  "weight" varchar
);

CREATE TABLE "headphone_specs" (
  "product_base_id" varchar PRIMARY KEY,
  "headphone_type" varchar,
  "connectivity" varchar,
  "usage_time" int,
  "sound_technology" varchar,
  "weight" int
);

CREATE TABLE "keyboard_specs" (
  "product_base_id" varchar PRIMARY KEY,
  "keyboard_type" varchar,
  "connectivity" varchar,
  "key_count" int,
  "backlight" boolean,
  "size" varchar,
  "weight" int
);

CREATE TABLE "variant" (
  "variant_id" varchar PRIMARY KEY,
  "product_base_id" varchar,
  "stock" int,
  "variant_price" numeric(12, 2)
);

CREATE TABLE "phone_variant" (
  "variant_id" varchar PRIMARY KEY,
  "ram" int,
  "storage" int,
  "color_id" varchar
);

CREATE TABLE "laptop_variant" (
  "variant_id" varchar PRIMARY KEY,
  "ram" int,
  "storage" varchar,
  "color_id" varchar
);

CREATE TABLE "headphone_variant" (
  "variant_id" varchar PRIMARY KEY,
  "color_id" varchar
);

CREATE TABLE "keyboard_variant" (
  "variant_id" varchar PRIMARY KEY,
  "switch_type" varchar,
  "color_id" varchar
);

CREATE TABLE "color" (
  "color_id" varchar PRIMARY KEY,
  "value" varchar,
  "color_name" varchar
);

CREATE TABLE "review" (
  "review_id" varchar,
  "rating" int,
  "feedback" varchar,
  "product_base_id" varchar,
  "customer_name" varchar,
  "phone_number" varchar,
  "email" varchar,
  PRIMARY KEY ("review_id", "product_base_id")
);

CREATE TABLE "promotion_type" (
  "promotion_type_id" varchar PRIMARY KEY,
  "promotion_type_name" varchar,
  "promotion_type_info" varchar,
  "unit" varchar
);

CREATE TABLE "promotion" (
  "promotion_id" varchar PRIMARY KEY,
  "promotion_type" varchar,
  "value" varchar,
  "promotion_info" varchar,
  "start_date" date,
  "end_date" date
);

CREATE TABLE "product_promotion" (
  "product_base_id" varchar,
  "promotion_id" varchar,
  PRIMARY KEY ("product_base_id", "promotion_id")
);

CREATE TABLE "payment_method" (
  "payment_method_id" varchar PRIMARY KEY,
  "payment_method_name" varchar,
  "available" bool
);

CREATE TABLE "payment_status" (
  "payment_status_id" varchar PRIMARY KEY,
  "status_name" varchar
);

CREATE TABLE "order" (
  "order_id" varchar PRIMARY KEY,
  "order_created_at" timestamp default now(),
  "payment_method" varchar,
  "payment_status" varchar,
  "payment_time" timestamp,
  "total_amount" numeric(14, 2),
  "reward_points" int
);

CREATE TABLE "buyer_info" (
  "customer_id" varchar,
  "buyer_name" varchar,
  "phone_number" varchar,
  "address" varchar,
  "order_id" varchar PRIMARY KEY
);

CREATE TABLE "order_product" (
  "order_id" varchar,
  "specific_product_id" varchar,
  "quantity" int,
  "product_price" numeric(12, 2),
  PRIMARY KEY ("order_id", "specific_product_id")
);

CREATE TABLE "inventory_history" (
  "id" varchar PRIMARY KEY,
  "variant_id" varchar,
  "quantity" int,
  "transaction_type" bool,
  "transaction_date" date
);

ALTER TABLE "employee" ADD FOREIGN KEY ("employee_id") REFERENCES "account" ("id");

ALTER TABLE "customer" ADD FOREIGN KEY ("customer_id") REFERENCES "account" ("id");

ALTER TABLE "featured_image" ADD FOREIGN KEY ("image_id") REFERENCES "image" ("image_id");

ALTER TABLE "featured_image" ADD FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id");

ALTER TABLE "variant_image" ADD FOREIGN KEY ("image_id") REFERENCES "image" ("image_id");

ALTER TABLE "variant_image" ADD FOREIGN KEY ("variant_id") REFERENCES "variant" ("variant_id");

ALTER TABLE "category_detail" ADD FOREIGN KEY ("category_id") REFERENCES "product_category" ("category_id");

ALTER TABLE "category_detail" ADD FOREIGN KEY ("product_type_id") REFERENCES "product_type" ("product_type_id");

ALTER TABLE "product_base" ADD FOREIGN KEY ("product_type_id") REFERENCES "product_type" ("product_type_id");

ALTER TABLE "phone_specs" ADD FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id");

ALTER TABLE "laptop_specs" ADD FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id");

ALTER TABLE "headphone_specs" ADD FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id");

ALTER TABLE "keyboard_specs" ADD FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id");

ALTER TABLE "variant" ADD FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id");

ALTER TABLE "phone_variant" ADD FOREIGN KEY ("variant_id") REFERENCES "variant" ("variant_id");

ALTER TABLE "phone_variant" ADD FOREIGN KEY ("color_id") REFERENCES "color" ("color_id");

ALTER TABLE "laptop_variant" ADD FOREIGN KEY ("variant_id") REFERENCES "variant" ("variant_id");

ALTER TABLE "laptop_variant" ADD FOREIGN KEY ("color_id") REFERENCES "color" ("color_id");

ALTER TABLE "headphone_variant" ADD FOREIGN KEY ("variant_id") REFERENCES "variant" ("variant_id");

ALTER TABLE "headphone_variant" ADD FOREIGN KEY ("color_id") REFERENCES "color" ("color_id");

ALTER TABLE "keyboard_variant" ADD FOREIGN KEY ("variant_id") REFERENCES "variant" ("variant_id");

ALTER TABLE "keyboard_variant" ADD FOREIGN KEY ("color_id") REFERENCES "color" ("color_id");

ALTER TABLE "review" ADD FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id");

ALTER TABLE "promotion" ADD FOREIGN KEY ("promotion_type") REFERENCES "promotion_type" ("promotion_type_id");

ALTER TABLE "product_promotion" ADD FOREIGN KEY ("product_base_id") REFERENCES "product_base" ("product_base_id");

ALTER TABLE "product_promotion" ADD FOREIGN KEY ("promotion_id") REFERENCES "promotion" ("promotion_id");

ALTER TABLE "order" ADD FOREIGN KEY ("payment_method") REFERENCES "payment_method" ("payment_method_id");

ALTER TABLE "order" ADD FOREIGN KEY ("payment_status") REFERENCES "payment_status" ("payment_status_id");

ALTER TABLE "buyer_info" ADD FOREIGN KEY ("customer_id") REFERENCES "customer" ("customer_id");

ALTER TABLE "buyer_info" ADD FOREIGN KEY ("order_id") REFERENCES "order" ("order_id");

ALTER TABLE "order_product" ADD FOREIGN KEY ("order_id") REFERENCES "order" ("order_id");

ALTER TABLE "order_product" ADD FOREIGN KEY ("specific_product_id") REFERENCES "variant" ("variant_id");

ALTER TABLE "inventory_history" ADD FOREIGN KEY ("variant_id") REFERENCES "variant" ("variant_id");
