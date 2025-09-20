import { SpecKeyValueDTO } from "../definations/data-dto";
import { PRODUCT_TYPES, ProductType } from "../definations/types";

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

export function isProductType(pt: string): pt is ProductType {
    return (PRODUCT_TYPES as readonly string[]).includes(pt);
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
