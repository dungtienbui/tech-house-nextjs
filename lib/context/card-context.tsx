"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { ProductVariantInShortDTO } from "../definations/data-dto";

interface CartItem {
    variantId: string;
    quantity: number;
}

interface CartProductInfo extends ProductVariantInShortDTO { }

type CartContextType = {
    readonly cart: CartItem[];
    readonly cartProductInfo: CartProductInfo[]; // thêm để UI render dễ hơn
    readonly loading: boolean;
    readonly priceMap: Map<string, { quantity: number, price: number }>;
    addToCart: (variantId: string, quantity?: number) => void;
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
        const ids = cart.map((item) => item.variantId);

        fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
        })
            .then((res) => res.json())
            .then((data: CartProductInfo[]) => {
                setCartProductInfo(data);
            })
            .catch((err) => console.error("Lỗi fetch product info:", err))
            .finally(() => setLoading(false));
    }, [cart]);

    // 4️⃣ Các hàm thao tác với cart
    function addToCart(variantId: string, quantity = 1) {
        setCart((prev) => {
            const existCardItem = prev.find((item) => item.variantId === variantId);

            if (existCardItem) {
                return prev.map((item) =>
                    item.variantId === variantId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prev, { variantId, quantity }];
        });
    }

    const priceMap = useMemo(() => {
        const map = new Map<string, { quantity: number; price: number }>();

        for (const item of cart) {
            map.set(item.variantId, { quantity: item.quantity, price: 0 });
        }

        for (const info of cartProductInfo) {
            const entry = map.get(info.variant_id);
            if (entry) {
                map.set(info.variant_id, { ...entry, price: info.variant_price });
            }
        }

        return map;
    }, [cart, cartProductInfo]);

    function removeFromCart(variantId: string, quantity?: number) {
        setCart((prev) => {
            const existCardItem = prev.find((item) => item.variantId === variantId);
            if (!existCardItem) return prev;

            const newQuantity = quantity
                ? Math.max(existCardItem.quantity - quantity, 0)
                : 0;

            if (newQuantity === 0) {
                return prev.filter((item) => item.variantId !== variantId);
            }

            return prev.map((item) =>
                item.variantId === variantId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
        });
    }

    function clearCart() {
        setCart([]);
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                cartProductInfo,
                loading,
                addToCart,
                removeFromCart,
                clearCart,
                priceMap
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
