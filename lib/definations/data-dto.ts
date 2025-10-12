import z from "zod";
import { Color, ProductBrand } from "./database-table-definations";
import { PaymentStatus, ProductType } from "./types";

export const NO_PREVIEW = {
    href: "https://placehold.co/100x100.png?text=No+Preview",
    alt: "No preview image"
}

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
export interface RecommendedVariantDTO {
    // Thông tin chung
    variant_id: string;
    product_name: string;
    product_type: string;
    variant_price: number;
    brand_name: string;
    color_name: string;
    ram?: number;
    storage?: number;
    switch_type?: string;
    preview_image_url: string | null;
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

//***********************************************************/
// zod
//***********************************************************/
// Schema cho 1 cart item
export const CartItemSchema = z.object({
    variant_id: z.uuid(),
    quantity: z.number().int().positive(),
});

// Schema cho mảng cart items
export const CartItemsSchema = z.array(CartItemSchema).min(1, "Cart must have at least one item");

// Tạo type TypeScript tự động từ schema
export type CartItem = z.infer<typeof CartItemSchema>;   // { variant_id: string; quantity: number; }
export type CartItems = z.infer<typeof CartItemsSchema>; // CartItem[]



export const CheckoutSessionSchema = z.object({
    checkout_id: z.uuid(),
    cart: CartItemsSchema,
    expires_at: z.string().refine((val) => !isNaN(Date.parse(val))),
    created_at: z.string().refine((val) => !isNaN(Date.parse(val))),
});

// Kiểu TypeScript từ Zod
export type CheckoutSession = z.infer<typeof CheckoutSessionSchema>;


export const GuestInfoSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone is required"),
    email: z.email("Invalid email address"),
    address: z.string().min(1, "Address is required"),
});

// Kiểu TypeScript từ Zod
export type GuestInfo = z.infer<typeof GuestInfoSchema>;


export interface CartProductInfo extends ProductVariantDTO {
    quantity: number;
}


export interface OrderProductDTO {
    product_name: string;
    variant_id: string;
    product_type: ProductType;
    quantity: number;
    variant_price: number;
    color_name: string | null;
    ram: number | null;
    storage: number | null;
    switch_type: string | null;
    preview_image_url: string | null;
    preview_image_alt: string | null;

}

export interface OrderDTO {
    order_id: string;
    order_created_at: string;
    payment_method: string | null;
    payment_status: PaymentStatus | null;
    total_amount: number;
    reward_points: number;
    buyer_name: string;
    phone_number: string;
    address: string;
    products: OrderProductDTO[];
}

export const SignupFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Tên phải có ít nhất 2 ký tự.' })
        .trim(),
    phone: z
        .string()
        // Regex đơn giản cho SĐT Việt Nam (10 số, bắt đầu bằng 03, 05, 07, 08, 09)
        .regex(/^(0[3|5|7|8|9])+([0-9]{8})\b/, {
            message: 'Vui lòng nhập số điện thoại hợp lệ.',
        }),
    password: z
        .string()
        .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự.' })
        .regex(/[a-zA-Z]/, { message: 'Phải chứa ít nhất một chữ cái.' })
        .regex(/[0-9]/, { message: 'Phải chứa ít nhất một chữ số.' })
        // .regex(/[^a-zA-Z0-9]/, {
        //     message: 'Phải chứa ít nhất một ký tự đặc biệt.',
        // })
        .trim(),
});

export const SigninFormSchema = z.object({
    phone: z
        .string()
        .regex(/^(0[3|5|7|8|9])+([0-9]{8})\b/, {
            message: "Số điện thoại không hợp lệ.",
        }),
    password: z
        .string()
        .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự." }),
});

export type AuthFormState =
    | {
        errors?: {
            name?: string[];
            phone?: string[];
            password?: string[];
            other?: string[];
        }
        message?: string;
    }
    | undefined
