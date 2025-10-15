'use client';

import { useSession } from 'next-auth/react';
import { useGuestCart } from './use-guest-cart-hook';
import { useUserCart } from './use-user-cart-hook';
import { CartItems } from '../definations/data-dto';
import { useEffect } from 'react';

// (Tùy chọn nhưng khuyến khích) Định nghĩa một kiểu trả về chung
// để đảm bảo hook luôn trả về một "shape" nhất quán.
type CartHookReturn = {
    readonly items: CartItems;
    readonly numOfItems: number;
    readonly isLoading: boolean;
    addToCart: (variantId: string, quantity?: number) => void;
    removeFromCart: (variantId: string) => void;
    removeMultipleItems: (variantIds: string[]) => void;
    updateItemQuantity: (variantId: string, newQuantity: number) => void;
    clearCart: () => void;
    getItemQuantity: (variantId: string) => number;
};

export function useCart(): CartHookReturn {
    const { data: session, status } = useSession();

    // useEffect(() => {
    //     console.log("Session status1: ", status);
    // }, [status]);


    // console.log("Session status2: ", status);

    // 1. --- Khởi tạo các hook con ---
    // Hook cho người dùng đã đăng nhập (sẽ không fetch nếu chưa authenticated)
    const userCart = useUserCart(status);
    // Hook cho khách (luôn sẵn sàng)
    const guestCart = useGuestCart();


    // 2. --- Xử lý trạng thái Loading ---
    // Khi session đang được kiểm tra, trả về trạng thái chờ an toàn.
    if (status === 'loading') {
        return {
            items: [],
            numOfItems: 0,
            isLoading: true,
            // Cung cấp các hàm rỗng để tránh lỗi "is not a function" ở UI
            addToCart: () => { },
            removeFromCart: () => { },
            removeMultipleItems: () => { },
            updateItemQuantity: () => { },
            clearCart: () => { },
            getItemQuantity: () => 0,
        };
    }

    // 3. --- Xử lý trạng thái Authenticated ---
    // Nếu người dùng đã đăng nhập, trả về logic từ useUserCart.
    if (status === 'authenticated') {
        return {
            items: userCart.items,
            numOfItems: userCart.items.length,
            isLoading: userCart.isLoading,
            addToCart: userCart.addToCart,
            removeFromCart: userCart.removeFromCart,
            removeMultipleItems: userCart.removeMultipleItems,
            updateItemQuantity: userCart.updateItemQuantity,
            clearCart: userCart.clearCart,
            // getItemQuantity là logic phía client, ta có thể tự tính toán
            getItemQuantity: (variantId: string) => {
                const item = userCart.items.find(i => i.variant_id === variantId);
                return item ? item.quantity : 0;
            },
        };
    }

    // 4. --- Mặc định là Guest ---
    // Nếu không loading và không authenticated, người dùng là khách.
    return {
        items: guestCart.items,
        numOfItems: guestCart.items.length,
        isLoading: false, // localStorage không có trạng thái loading
        addToCart: guestCart.addToCart,
        removeFromCart: guestCart.removeFromCart,
        removeMultipleItems: guestCart.removeMultipleItems,
        updateItemQuantity: guestCart.updateItemQuantity,
        clearCart: guestCart.clearCart,
        getItemQuantity: guestCart.getItemQuantity,
    };
}