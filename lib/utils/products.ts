import { PhoneSpecification, Product, ProductType } from "../definations/product";

export function filterProductsByType(products: Product[], type: ProductType) {
    return products.filter(item => item.type === type);
}

export function getProductTypeLabelInVN(type: ProductType): string {
    switch (type) {
        case ProductType.Phone:
            return "Điện thoại";
        case ProductType.Laptop:
            return "Máy tính xách tay";
        case ProductType.Headphone:
            return "Tai nghe";
        case ProductType.Keyboard:
            return "Bàn phím";
    }
}

export function isProductType(key: string): key is ProductType {
    return Object.values(ProductType).includes(key as ProductType);
}

export function parseProductType(key: string): ProductType | null {
    return isProductType(key) ? key : null;
}


const specsKeys = [
    "productId",
    "chipset",
    "operatingSystem",
    "screenSize",
    "screenTechnology",
    "frontCamera",
    "rearCamera",
    "batteryCapacity",
    "sim",
    "connectivity",
    "other",
] as const;

type SpecsKey = typeof specsKeys[number];

type SpecsSorted = {
    [K in SpecsKey]: K extends "screenSize" | "batteryCapacity" | "ram" | "storage"
    ? number
    : string;
} & { other?: string };

const specsVNMap: Record<SpecsKey, string> = {
    productId: "Mã sản phẩm",
    chipset: "Chip xử lý",
    operatingSystem: "Hệ điều hành",
    screenSize: "Kích thước màn hình",
    screenTechnology: "Công nghệ màn hình",
    frontCamera: "Camera trước",
    rearCamera: "Camera sau",
    batteryCapacity: "Dung lượng pin",
    sim: "SIM",
    connectivity: "Kết nối",
    other: "Khác",
};

type SpecsArrayItem = {
    key: SpecsKey;
    specs: string | number | undefined;
    index: number;
    specsVN: string;
};

export function specsObjectToArray(specs: PhoneSpecification): SpecsArrayItem[] {
    return specsKeys.map((key, index) => {
        return ({
            key,
            specs: specs[key],
            index,
            specsVN: specsVNMap[key],
        })
    });
}
