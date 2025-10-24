// context/GuestCartContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { CartItems, CartItemsSchema } from "../definations/data-dto";

const initializeCart = (): CartItems => {
    // Chỉ chạy ở phía client (browser)
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const savedCart = localStorage.getItem("guest_cart");
        if (savedCart) {
            const parsedCart: CartItems = JSON.parse(savedCart);
            const parsedCartValidated = CartItemsSchema.safeParse(parsedCart);

            if (parsedCartValidated.success) {
                return parsedCartValidated.data;
            }
        }
    } catch (error) {
        console.warn("Không thể đọc giỏ hàng của khách từ localStorage.", error);
    }
    return [];
};

// 1. --- Định nghĩa các kiểu dữ liệu ---
// Kiểu dữ liệu cho giá trị của Context
type GuestCartContextType = {
    readonly items: CartItems;
    addToCart: (variantId: string, quantity?: number) => void;
    removeFromCart: (variantId: string) => void;
    removeMultipleItems: (variantIds: string[]) => void;
    updateItemQuantity: (variantId: string, newQuantity: number) => void;
    clearCart: () => void;
    getItemQuantity: (variantId: string) => number;
};

// 2. --- Tạo Context ---
export const GuestCartContext = createContext<GuestCartContextType | null>(null);

// 3. --- Tạo Provider Component ---
export function GuestCartProvider({ children }: { children: React.ReactNode }) {

    const [items, setItems] = useState<CartItems>(initializeCart);
    
    useEffect(() => {
        localStorage.setItem("guest_cart", JSON.stringify(items));
    }, [items]);

    // Thêm sản phẩm vào giỏ hoặc tăng số lượng nếu đã tồn tại
    const addToCart = (variantId: string, quantityToAdd = 1) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.variant_id === variantId);
            if (existingItem) {
                // Nếu sản phẩm đã có, cập nhật số lượng
                return prevItems.map((item) =>
                    item.variant_id === variantId
                        ? { ...item, quantity: item.quantity + quantityToAdd }
                        : item
                );
            }
            // Nếu sản phẩm chưa có, thêm mới vào giỏ
            return [...prevItems, { variant_id: variantId, quantity: quantityToAdd }];
        });
    };

    // Xóa hoàn toàn một sản phẩm khỏi giỏ
    const removeFromCart = (variantId: string) => {
        setItems((prevItems) =>
            prevItems.filter((item) => item.variant_id !== variantId)
        );
    };

    // Cập nhật số lượng của một sản phẩm
    const updateItemQuantity = (variantId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(variantId);
            return;
        }
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.variant_id === variantId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    // Xóa tất cả sản phẩm trong giỏ
    const clearCart = () => {
        setItems([]);
    };

    // Lấy số lượng của một sản phẩm cụ thể
    const getItemQuantity = (variantId: string): number => {
        const item = items.find(i => i.variant_id === variantId);
        return item ? item.quantity : 0;
    };

    const removeMultipleItems = (variantIds: string[]) => {
        setItems((prevItems) =>
            prevItems.filter((item) => !variantIds.includes(item.variant_id))
        );
    };

    return (
        <GuestCartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                removeMultipleItems,
                updateItemQuantity,
                clearCart,
                getItemQuantity,
            }}
        >
            {children}
        </GuestCartContext.Provider>
    );
}