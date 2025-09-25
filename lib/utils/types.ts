import { SpecKeyValueDTO, GuestInfo, CartItem } from "../definations/data-dto";
import { ProductType, PaymentStatus } from "../definations/types";


export function getConvertKeyProductTypeToVN(pt: ProductType): string {
    switch (pt) {
        case "phone":
            return "Điện thoại";
        case "laptop":
            return "Laptop";
        case "keyboard":
            return "Bàn phím";
        case "headphone":
            return "Tai nghe";
        default:
            return "Không xác định";
    }
}

// Mapping key sang tiếng Việt
const specKeyVNMap: Record<keyof SpecKeyValueDTO, string> = {
    description: 'Mô tả',
    product_type: 'Loại sản phẩm',
    weight: 'Trọng lượng (g)',
    screen_size: 'Kích thước màn hình (inch)',
    display_tech: 'Công nghệ màn hình',
    chipset: 'Chipset',
    os: 'Hệ điều hành',
    battery: 'Dung lượng pin (mAh)',
    camera: 'Camera',
    material: 'Chất liệu',
    connectivity: 'Kết nối',
    gpu_card: 'Card đồ họa',
    number_of_keys: 'Số phím',
    usage_time: 'Thời gian sử dụng (giờ)',
    compatibility: 'Tương thích',
    product_base_id: "",
    variant_id: ""
};


// Hàm map SpecKeyValueDTO sang mảng { name, value }, bỏ product_base_id
export function mapSpecToArray(spec: SpecKeyValueDTO): { name: string; value: string }[] {

    const isOmitKey = (key: string) => key !== 'product_base_id' && key !== 'variant_id' && key !== 'description'

    return Object.entries(spec)
        .filter(
            ([key, value]) =>
                isOmitKey(key) && value !== null && value !== undefined
        )
        .map(([key, value]) => ({
            name: specKeyVNMap[key as keyof SpecKeyValueDTO] || key,
            value: String(value),
        }));
}


export const isGuestInfoValid = (guestInfo: GuestInfo): boolean => {
    if (!guestInfo.name.trim() || !guestInfo.phone.trim() || !guestInfo.email.trim() || !guestInfo.address.trim()) {
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestInfo.email)) return false;

    const phoneRegex = /^(0|\+84)(\d{9})$/;
    if (!phoneRegex.test(guestInfo.phone)) return false;

    return true;
}

export function isCartItem(obj: unknown): obj is CartItem {
    return (
        typeof obj === "object" &&
        obj !== null &&
        "variant_id" in obj &&
        "quantity" in obj &&
        typeof (obj as any).variant_id === "string" &&
        typeof (obj as any).quantity === "number"
    );
}

export function isCartItemArray(arr: unknown): arr is CartItem[] {
    return Array.isArray(arr) && arr.every(isCartItem);
}


export function isPhoneNumberValid(phone: string) {

    const phoneRegex = /^(0|\+84)\d{9,10}$/;
    if (!phoneRegex.test(phone)) {
        return false;
    }

    return true;
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
    switch (status) {
        case "pending":
            return "Đang chờ xử lý";
        case "paid":
            return "Đã thanh toán";
        case "failed":
            return "Thanh toán thất bại";
        case "refunded":
            return "Đã hoàn tiền";
        case "cancelled":
            return "Đã hủy đơn";
        default:
            return "Không xác định"; // fallback
    }
}
