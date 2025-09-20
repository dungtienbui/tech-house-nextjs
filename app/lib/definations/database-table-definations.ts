// DB type defination

// =====================
// Account & Roles
// =====================
export interface Account {
    id: string; // UUID
    email?: string;
    username: string;
    password: string;
    full_name: string;
    phone_number: string;
    address?: string;
    gender?: string;
    date_of_birth?: string; // ISO Date string
    role: string;
    registration_date: string; // ISO Timestamp
}

export interface Employee {
    employee_id: string; // FK to Account.id
    national_id: string;
}

export interface Customer {
    customer_id: string; // FK to Account.id
    customer_points: number;
}

// =====================
// Images
// =====================
export interface ProductImage {
    image_id: string;
    image_caption: string;
    image_alt?: string | null;
    image_url: string;
    added_date: string; // ISO Timestamp
}

export interface ProductBaseImage {
    image_id: string; // FK Image
    product_base_id: string; // FK ProductBase
}

export interface VariantImage {
    image_id: string; // FK Image
    variant_id: string; // FK Variant
}

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
// Product Base
// =====================
export interface ProductBase {
    product_base_id: string;
    product_name: string;
    brand: string;
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
// Color
// =====================
export interface Color {
    color_id: string;
    value: string;
    color_name: string;
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
// Payments & Orders
// =====================
export interface PaymentMethod {
    payment_method_id: string;
    payment_method_name: string;
    available: boolean;
}

export interface PaymentStatus {
    payment_status_id: string;
    status_name: string;
}

export interface Order {
    order_id: string;
    order_created_at: string; // ISO Timestamp
    payment_method: string; // FK PaymentMethod
    payment_status: string; // FK PaymentStatus
    payment_time: string; // ISO Timestamp
    total_amount: number;
    reward_points: number;
}

export interface BuyerInfo {
    customer_id: string; // FK Customer
    buyer_name: string;
    phone_number: string;
    address: string;
    order_id: string; // FK Order
}

export interface OrderProduct {
    order_id: string; // FK Order
    specific_product_id: string; // FK Variant
    quantity: number;
    product_price: number;
}

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
