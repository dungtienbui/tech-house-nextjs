export enum ProductType {
    Phone = "phone",
    Laptop = "laptop",
    Headphone = "headphone",
    Keyboard = "keyboard"
}

export type ProductBase = {
    id: string;
    name: string;
    brand: string;
    type: ProductType;
    description: string;
    basePrice: number;
    featuredImage: Image;
}

export type PhoneSpecification = {
    productId: string;          // Liên kết với Product
    chipset: string;
    operatingSystem: string;
    screenSize: number;
    screenTechnology: string;
    frontCamera: string;
    rearCamera: string;
    batteryCapacity: number;
    sim: string;
    connectivity: string;
    other?: string;             // Thông tin thêm, optional
}

export type ProductVariant = {
    id: string;
    productId: string;
    stock: number;
    variantPrice: number;
    image: Image[];
    info: PhoneVariant;
}

export type Product = ProductBase & ProductVariant

export type PhoneVariant = {
    id: string;
    ram: number;
    storage: number;
    color: Color;
}

export type Color = {
    id: string;
    name: string;
    value: string;
}

export type Image = {
    id: string;
    link: string;
    dateAdded: Date;
}