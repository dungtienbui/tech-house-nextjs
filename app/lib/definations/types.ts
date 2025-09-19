import { PhoneSpec, LaptopSpec, KeyboardSpec, HeadphoneSpec } from "./database-table-definations";


export const PRODUCT_TYPES = ["phone", "laptop", "keyboard", "headphone"] as const;
export type ProductType = typeof PRODUCT_TYPES[number];

export type SpecResult = PhoneSpec | LaptopSpec | KeyboardSpec | HeadphoneSpec;
export type SpecResults = SpecResult[];

