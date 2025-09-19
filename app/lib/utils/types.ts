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