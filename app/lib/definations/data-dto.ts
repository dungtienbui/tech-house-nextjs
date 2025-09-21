import { Color, ProductBrand } from "./database-table-definations";
import { ProductType } from "./types";


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
    product_type: string;
    stock: number;
    variant_price: number;
    is_promoting: boolean;

    brand_name: string;

    // Các thuộc tính biến thể
    // Thông tin màu sắc
    color_id: string;
    color_name: string;
    color_value: string;
    // Các thuộc tính biến khác
    ram?: number;
    storage?: number;
    switch_type?: string;

    // Ảnh preview
    preview_image_id: string | null;
    preview_image_url: string | null;
    preview_image_caption: string | null;
    preview_image_alt: string | null;
}


export interface ProductVariantDTO {
    // Thông tin variant
    variant_id: string;
    stock: number;
    variant_price: number;
    is_promoting: boolean;
    date_added: string;

    // variant properties
    color: Color;

    ram: number | null;
    storage: number | null;
    switch_type: string | null;

    // Thông tin product_base
    product_base_id: string;
    product_name: string;
    product_type: ProductType;
    description: string;
    base_price: number;

    brand: ProductBrand;


    // JSON object ảnh preview (có thể null)
    preview_image: {
        image_id: string;
        image_url: string;
        image_caption: string;
        image_alt: string;
    };
}


export interface SpecKeyValueDTO {
    // Common fields across specs
    product_base_id?: string;
    variant_id?: string;
    description?: string;
    product_type?: ProductType;

    weight?: number | null;
    screen_size?: number | null;
    display_tech?: string | null;
    chipset?: string | null;
    os?: string | null;
    battery?: number | null;
    camera?: string | null;
    material?: string | null;
    connectivity?: string | null;

    // Laptop-specific
    gpu_card?: string | null;

    // Keyboard-specific
    number_of_keys?: number | null;
    usage_time?: number | null;

    // Headphone-specific
    compatibility?: string | null;
}
