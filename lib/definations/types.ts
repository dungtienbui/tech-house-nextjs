import { z } from "zod";
import { PhoneSpec, LaptopSpec, KeyboardSpec, HeadphoneSpec } from "./database-table-definations";


export const ProductTypeSchema = z.enum(["phone", "laptop", "keyboard", "headphone"]);
export type ProductType = z.infer<typeof ProductTypeSchema>;


export type SpecResult = PhoneSpec | LaptopSpec | KeyboardSpec | HeadphoneSpec;
export type SpecResults = SpecResult[];

export const PaymentMethodSchema = z.enum(["cod", "online_banking"]);
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;


export const PaymentStatusSchema = z.enum([
    "pending",    // Đang chờ xử lý
    "confirmed",     // Đã xác nhận
    "shipping",       // Đang chuyển hàng
    "delivered",   // Đã giao hàng
    "completed",   // Đơn thành công
    "cancelled"   // Đơn đã hủy
]);
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;