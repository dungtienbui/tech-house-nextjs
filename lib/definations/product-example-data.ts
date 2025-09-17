import { Color, ProductVariant, Image, PhoneSpecification, PhoneVariant, Product, ProductType, ProductBase } from "./product";

// --- Colors ---
const black: Color = { id: "c01", name: "Black", value: "#000000" };
const white: Color = { id: "c02", name: "White", value: "#FFFFFF" };
const red: Color = { id: "c03", name: "Red", value: "#FF0000" };
const blue: Color = { id: "c04", name: "Blue", value: "#0000FF" };
const green: Color = { id: "c05", name: "Green", value: "#00FF00" };

// --- Images ---
const phoneImages1: Image[] = [
    { id: "img01", link: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/334864/iphone-16e-white-4-638756438053606377-750x500.jpg", dateAdded: new Date("2025-09-01") },
    { id: "img02", link: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/281570/iphone-15-blue-2-638629450171966290-750x500.jpg", dateAdded: new Date("2025-09-01") },
    { id: "img11", link: "https://cdn.tgdd.vn/Products/Images/42/329135/Slider/vi-vn-iphone-16-1.jpg", dateAdded: new Date("2025-09-03") },
    { id: "img12", link: "https://cdn.tgdd.vn/Products/Images/42/329135/Slider/vi-vn-iphone-16-1.jpg", dateAdded: new Date("2025-09-03") },
];

const phoneImages2: Image[] = [
    { id: "img03", link: "https://cdn.tgdd.vn/Products/Images/42/334932/samsung-galaxy-a56-5g-gray-thumb-1-600x600.jpg", dateAdded: new Date("2025-09-02") },
    { id: "img04", link: "https://cdn.tgdd.vn/Products/Images/42/334932/samsung-galaxy-a56-5g-gray-thumb-1-600x600.jpg", dateAdded: new Date("2025-09-02") },
    { id: "img13", link: "https://cdn.tgdd.vn/Products/Images/42/342910/masstel-alfa-5-vang-dong-thumb-600x600.jpg", dateAdded: new Date("2025-09-03") },
    { id: "img14", link: "https://cdn.tgdd.vn/Products/Images/42/334970/tecno-spark-30c-white-thumb-600x600.jpg", dateAdded: new Date("2025-09-03") },
];

const phoneImages3: Image[] = [
    { id: "img05", link: "https://cdn.tgdd.vn/Products/Images/42/342910/masstel-alfa-5-vang-dong-thumb-600x600.jpg", dateAdded: new Date("2025-09-03") },
    { id: "img06", link: "https://cdn.tgdd.vn/Products/Images/42/334970/tecno-spark-30c-white-thumb-600x600.jpg", dateAdded: new Date("2025-09-03") },
    { id: "img15", link: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/326124/msi-thin-15-b12ucx-i5-2046vn-140225-102530-055-600x600.jpg", dateAdded: new Date("2025-09-05") },
    { id: "img16", link: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/4547/342559/ban-phim-co-bluetooth-akko-3098b-plus-matcha-red-bean-akko-piano-pro-thumb-638911244604499925-600x600.jpg", dateAdded: new Date("2025-09-05") },
];

const phoneImages4: Image[] = [
    { id: "img07", link: "https://cdn.tgdd.vn/Products/Images/42/338738/samsung-galaxy-z-fold7-black-thumb-1-600x600.jpg", dateAdded: new Date("2025-09-04") },
    { id: "img08", link: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/311178/asus-vivobook-go-15-e1504fa-r5-nj776w-140225-100949-251-600x600.jpg", dateAdded: new Date("2025-09-04") },
    { id: "img17", link: "https://cdn.tgdd.vn/Products/Images/42/342910/masstel-alfa-5-vang-dong-thumb-600x600.jpg", dateAdded: new Date("2025-09-03") },
    { id: "img18", link: "https://cdn.tgdd.vn/Products/Images/42/334970/tecno-spark-30c-white-thumb-600x600.jpg", dateAdded: new Date("2025-09-03") },
];

const phoneImages5: Image[] = [
    { id: "img09", link: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/326124/msi-thin-15-b12ucx-i5-2046vn-140225-102530-055-600x600.jpg", dateAdded: new Date("2025-09-05") },
    { id: "img10", link: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/4547/342559/ban-phim-co-bluetooth-akko-3098b-plus-matcha-red-bean-akko-piano-pro-thumb-638911244604499925-600x600.jpg", dateAdded: new Date("2025-09-05") },
    { id: "img19", link: "https://cdn.tgdd.vn/Products/Images/42/342910/masstel-alfa-5-vang-dong-thumb-600x600.jpg", dateAdded: new Date("2025-09-03") },
    { id: "img20", link: "https://cdn.tgdd.vn/Products/Images/42/334970/tecno-spark-30c-white-thumb-600x600.jpg", dateAdded: new Date("2025-09-03") },
];

// --- Phone Variants ---
const phoneVariants1: PhoneVariant = { id: "pv01", ram: 8, storage: 128, color: black };
const phoneVariants2: PhoneVariant = { id: "pv02", ram: 12, storage: 256, color: white };
const phoneVariants3: PhoneVariant = { id: "pv03", ram: 8, storage: 256, color: red };
const phoneVariants4: PhoneVariant = { id: "pv04", ram: 16, storage: 512, color: blue };
const phoneVariants5: PhoneVariant = { id: "pv05", ram: 12, storage: 512, color: green };

// --- Phone Specifications ---
const phoneSpecs: PhoneSpecification[] = [
    {
        productId: "p01",
        chipset: "Snapdragon 8 Gen 2",
        operatingSystem: "Android 14",
        screenSize: 6.7,
        screenTechnology: "AMOLED",
        frontCamera: "12MP",
        rearCamera: "50MP + 12MP",
        batteryCapacity: 4500,
        sim: "Dual SIM",
        connectivity: "5G, Wi-Fi 6, Bluetooth 5.2",
        other: "Fast charging 65W",
    },
    {
        productId: "p02",
        chipset: "Apple A18 Bionic",
        operatingSystem: "iOS 18",
        screenSize: 6.5,
        screenTechnology: "OLED",
        frontCamera: "12MP",
        rearCamera: "48MP + 12MP",
        batteryCapacity: 4300,
        sim: "Dual SIM",
        connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3",
        other: "MagSafe support",
    },
    {
        productId: "p03",
        chipset: "Snapdragon 8 Gen 1",
        operatingSystem: "Android 13",
        screenSize: 6.6,
        screenTechnology: "AMOLED",
        frontCamera: "10MP",
        rearCamera: "48MP + 12MP + 12MP",
        batteryCapacity: 5000,
        sim: "Dual SIM",
        connectivity: "5G, Wi-Fi 6, Bluetooth 5.2",
        other: "Wireless charging",
    },
    {
        productId: "p04",
        chipset: "MediaTek Dimensity 9200",
        operatingSystem: "Android 14",
        screenSize: 6.9,
        screenTechnology: "AMOLED",
        frontCamera: "12MP",
        rearCamera: "108MP + 12MP + 12MP",
        batteryCapacity: 4700,
        sim: "Dual SIM",
        connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3",
    },
    {
        productId: "p05",
        chipset: "Snapdragon 8 Gen 2",
        operatingSystem: "Android 14",
        screenSize: 6.8,
        screenTechnology: "AMOLED",
        frontCamera: "12MP",
        rearCamera: "50MP + 12MP + 12MP",
        batteryCapacity: 4600,
        sim: "Dual SIM",
        connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3",
        other: "Fast charging 120W",
    },
];

// --- ProductBases ---
const productsBase: ProductBase[] = [
    { id: "p01", name: "Galaxy S25", brand: "Samsung", type: ProductType.Phone, description: "High-end Samsung smartphone", basePrice: 999.99, featuredImage: phoneImages1[0] },
    { id: "p02", name: "iPhone 18", brand: "Apple", type: ProductType.Phone, description: "Latest iPhone model", basePrice: 1099.99, featuredImage: phoneImages2[0] },
    { id: "p03", name: "Pixel 10", brand: "Google", type: ProductType.Phone, description: "Google flagship phone", basePrice: 899.99, featuredImage: phoneImages3[0] },
    { id: "p04", name: "Xiaomi Ultra", brand: "Xiaomi", type: ProductType.Phone, description: "High-performance Xiaomi phone", basePrice: 949.99, featuredImage: phoneImages4[0] },
    { id: "p05", name: "OnePlus 12", brand: "OnePlus", type: ProductType.Phone, description: "Fast and sleek OnePlus smartphone", basePrice: 999.99, featuredImage: phoneImages5[0] },
];

// --- Product Variants ---
const productVariants: ProductVariant[] = [
    { id: "pv01", productId: "p01", stock: 100, variantPrice: 999.99, image: phoneImages1, info: phoneVariants1 },
    { id: "pv02", productId: "p02", stock: 50, variantPrice: 1099.99, image: phoneImages2, info: phoneVariants2 },
    { id: "pv03", productId: "p03", stock: 80, variantPrice: 899.99, image: phoneImages3, info: phoneVariants3 },
    { id: "pv04", productId: "p04", stock: 60, variantPrice: 949.99, image: phoneImages4, info: phoneVariants4 },
    { id: "pv05", productId: "p05", stock: 70, variantPrice: 999.99, image: phoneImages5, info: phoneVariants5 },
    { id: "pv06", productId: "p01", stock: 70, variantPrice: 888.88, image: phoneImages5, info: phoneVariants5 },
    { id: "pv07", productId: "p01", stock: 40, variantPrice: 788.88, image: phoneImages4, info: phoneVariants3 },
];

// --- Product ---
const products: Product[] = productVariants.map((variant) => {
    const base = productsBase.find((p) => p.id === variant.productId);
    if (!base) {
        throw new Error(`Không tìm thấy ProductBase cho productId: ${variant.productId}`);
    }
    return {
        ...base,
        ...variant,
    };
});


// --- Export ---
export { products, phoneSpecs, productVariants };
