"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { CartItem, CartProductInfo, ProductVariantDTO } from "../definations/data-dto";




type CartContextType = {
    readonly cart: CartItem[];
    readonly cartProductInfo: CartProductInfo[];
    readonly loading: boolean;
    addToCart: (variantId: string, quantity?: number, replaceQuantity?: boolean) => void;
    removeFromCart: (variantId: string, quantity?: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartProductInfo, setCartProductInfo] = useState<CartProductInfo[]>([]);
    const [loading, setLoading] = useState(false);

    // 1️⃣ Load cart từ localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem("cart");
            if (saved) {
                setCart(JSON.parse(saved));
            }
        } catch {
            console.warn("Không đọc được cart từ localStorage");
        }
    }, []);

    // 2️⃣ Lưu cart vào localStorage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // 3️⃣ Fetch thông tin sản phẩm khi cart thay đổi
    useEffect(() => {
        if (cart.length === 0) {
            setCartProductInfo([]);
            return;
        }

        setLoading(true);
        const ids = cart.map((item) => item.variant_id);

        fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
        })
            .then((res) => res.json())
            .then((data: ProductVariantDTO[]) => {

                const mappingData: CartProductInfo[] = cart.map((c) => {
                    const exist = data.find(d => d.variant_id === c.variant_id);
                    if (exist) {
                        return {
                            ...exist,
                            quantity: c.quantity,
                        }
                    }

                    return undefined;
                }).filter(f => f !== undefined);

                setCartProductInfo(mappingData);
            })
            .catch((err) => console.error("Lỗi fetch product info:", err))
            .finally(() => setLoading(false));
    }, [cart]);

    // 4️⃣ Các hàm thao tác với cart
    function addToCart(variantId: string, quantity = 1, replaceQuantity = false) {
        setCart((prev) => {
            const existCardItem = prev.find((item) => item.variant_id === variantId);

            if (existCardItem) {
                if (replaceQuantity) {
                    return prev.map((item) =>
                        item.variant_id === variantId
                            ? { ...item, quantity: quantity }
                            : item
                    );
                }

                return prev.map((item) =>
                    item.variant_id === variantId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prev, { variant_id: variantId, quantity }];
        });
    }

    function removeFromCart(variantId: string, quantity?: number) {
        setCart((prev) => {
            const existCardItem = prev.find((item) => item.variant_id === variantId);
            if (!existCardItem) return prev;

            const newQuantity = quantity
                ? Math.max(existCardItem.quantity - quantity, 0)
                : 0;

            if (newQuantity === 0) {
                return prev.filter((item) => item.variant_id !== variantId);
            }

            return prev.map((item) =>
                item.variant_id === variantId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
        });
    }

    function clearCart() {
        setCart([]);
    }

    // function buyNow(variantId: string, quantity = 1) {
    //     addToCart(variantId, quantity, true);
    //     selectCartItem(variantId)
    // }

    return (
        <CartContext.Provider
            value={{
                cart,
                cartProductInfo,
                loading,
                addToCart,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within a CartProvider");
    return ctx;
}
