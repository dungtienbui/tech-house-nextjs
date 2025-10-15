// DB type defination

import { ProductType } from "./types";

// =====================
// user
// =====================
export interface User {
    id: string;
    name: string;
    phone: string;
    password: string;
    created_at: string;
    updated_at: string;
}

export interface UserResponse {
    id: string;
    name: string;
    phone: string;
    province?: string;
    ward?: string;
    street?: string;
    created_at: string;
    updated_at: string;
}

export interface ProductBaseImage {
    image_id: string; // FK Image
    product_base_id: string; // FK ProductBase
}

export interface VariantImage {
    image_id: string; // FK Image
    variant_id: string; // FK Variant
}


// =====================
// Product Base
// =====================
export interface ProductBase {
    product_base_id: string;
    product_name: string;
    brand_id: string;
    product_type: string; // FK ProductType
    description: string;
    base_price: number;
}

// =====================
// Variants
// =====================
export interface Variant {
    variant_id: string;
    product_base_id: string;
    stock: number;
    variant_price: number;
    preview_id?: string | null;
    is_promoting?: boolean;

    //variant properties
    color_id: string;

    ram?: number | null;
    storage?: number | null;
    switch_type?: string | null;
    date_added: string;
}


// =====================
// Product spec
// =====================
export interface PhoneSpec {
    product_base_id: string;   // UUID
    weight?: number | null;    // g
    screen_size?: number | null; // inch
    display_tech?: string | null; // OLED, AMOLED...
    chipset?: string | null;
    os?: string | null;
    battery?: number | null;   // mAh
    camera?: string | null;    // "12MP"
    material?: string | null;
    connectivity?: string | null; // "Wi-Fi 6E, 5G"
}


export interface LaptopSpec {
    product_base_id: string;
    weight?: number | null;
    screen_size?: number | null;
    display_tech?: string | null;
    chipset?: string | null;
    os?: string | null;
    battery?: number | null;
    material?: string | null;
    connectivity?: string | null;
    gpu_card?: string | null;
}


export interface KeyboardSpec {
    product_base_id: string;
    weight?: number | null;
    material?: string | null;
    connectivity?: string | null;
    number_of_keys?: number | null;
    usage_time?: number | null;
}

export interface HeadphoneSpec {
    product_base_id: string;
    weight?: number | null;
    connectivity?: string | null;
    usage_time?: number | null;
    compatibility?: string | null; // "iPhone, Android, Laptop"
}


// =====================
// Reviews
// =====================
export interface Review {
    review_id: string;
    rating: number;
    feedback: string;
    variant_id: string; // FK Variant
    customer_name: string;
    phone_number: string;
    email?: string;
}

// =====================
// Promotions
// =====================
export interface PromotionType {
    promotion_type_id: string;
    promotion_type_name: string;
    promotion_type_info: string;
    unit: string;
}

export interface Promotion {
    promotion_id: string;
    promotion_type: string; // FK PromotionType
    value: string;
    promotion_info: string;
    start_date: string; // ISO Date
    end_date: string; // ISO Date
}

export interface ProductPromotion {
    product_base_id: string; // FK ProductBase
    promotion_id: string; // FK Promotion
}

// =====================
// Orders
// =====================


// =====================
// Inventory
// =====================
export interface InventoryHistory {
    id: string;
    variant_id: string; // FK Variant
    quantity: number;
    transaction_type: boolean;
    transaction_date: string; // ISO Date
}
