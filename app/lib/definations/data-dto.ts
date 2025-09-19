import { Color, HeadphoneSpec, KeyboardSpec, LaptopSpec, PhoneSpec, ProductImage } from "./database-table-definations";
//***********************************************************/

export interface ProductSpecsDTO {
    product_base_id: string;
    // Dùng chung cho Phone & Laptop
    operating_system?: string;
    display?: string;
    connectivity?: string;

    // Phone-specific
    front_camera?: string;
    rear_camera?: string;
    battery_capacity?: number;
    sim?: string;

    // Laptop-specific
    cpu?: string;
    gpu?: string;
    battery?: string;
    weight?: string; // giữ 1 kiểu string, UI có thể định dạng "1.3kg"

    // Headphone-specific
    headphone_type?: string;
    usage_time?: number;
    sound_technology?: string;

    // Keyboard-specific
    keyboard_type?: string;
    key_count?: number;
    backlight?: boolean;
    size?: string;
}

//***********************************************************/

export interface ProductVariantInShortDTO {
    // Thông tin chung
    variant_id: string;
    product_base_id: string;
    product_name: string;
    brand: string;
    product_type: string;
    stock: number;
    variant_price: number;
    is_promoting: boolean;
    // Các thuộc tính biến thể
    ram?: number;
    storage?: number;
    switch_type?: string;
    // Ảnh preview
    preview_image_id: string | null;
    preview_image_url: string | null;
    preview_image_caption: string | null;
    preview_image_alt: string | null;
    // Thông tin màu sắc
    color_id: string | null;
    color_name: string | null;
    color_value: string | null;
}
