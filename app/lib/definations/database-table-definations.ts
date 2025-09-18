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
    image_alt?: string;
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

// =====================
// Product Base & Specs
// =====================
export interface ProductBase {
    product_base_id: string;
    product_name: string;
    brand: string;
    product_type: string; // FK ProductType
    description: string;
    base_price?: number;
}

export interface PhoneSpecs {
    product_base_id: string; // FK ProductBase
    operating_system: string;
    display: string;
    front_camera: string;
    rear_camera: string;
    battery_capacity: number;
    sim: string;
    connectivity: string;
}

export interface LaptopSpecs {
    product_base_id: string; // FK ProductBase
    operating_system: string;
    display: string;
    cpu: string;
    gpu: string;
    connectivity: string;
    battery: string;
    weight: string;
}

export interface HeadphoneSpecs {
    product_base_id: string; // FK ProductBase
    headphone_type: string;
    connectivity: string;
    usage_time: number;
    sound_technology: string;
    weight: number;
}

export interface KeyboardSpecs {
    product_base_id: string; // FK ProductBase
    keyboard_type: string;
    connectivity: string;
    key_count: number;
    backlight: boolean;
    size: string;
    weight: number;
}

// =====================
// Variants & Colors
// =====================
export interface Variant {
    variant_id: string;
    product_base_id: string; // FK ProductBase
    stock: number;
    variant_price: number;
}

export interface Color {
    color_id: string;
    value: string;
    color_name: string;
}

export interface PhoneVariant {
    variant_id: string; // FK Variant
    ram: number;
    storage: number;
    color_id: string; // FK Color
}

export interface LaptopVariant {
    variant_id: string; // FK Variant
    ram: number;
    storage: string;
    color_id: string; // FK Color
}

export interface HeadphoneVariant {
    variant_id: string; // FK Variant
    color_id: string; // FK Color
}

export interface KeyboardVariant {
    variant_id: string; // FK Variant
    switch_type: string;
    color_id: string; // FK Color
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
