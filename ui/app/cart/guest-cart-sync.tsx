// components/GuestCartSync.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUserCart } from '@/lib/hook/use-user-cart-hook';
import { useGuestCart } from '@/lib/hook/use-guest-cart-hook';

export function GuestCartSync() {
    const { status } = useSession();
    const queryClient = useQueryClient();

    // Dùng useRef để đảm bảo việc merge chỉ xảy ra MỘT LẦN duy nhất
    const hasSynced = useRef(false);

    const { mergeCart } = useUserCart(status);
    const { items, clearCart } = useGuestCart();

    useEffect(() => {

        // Chỉ chạy khi:
        // 1. User vừa đăng nhập thành công (status === 'authenticated')
        // 2. Việc hợp nhất chưa từng được thực hiện trong phiên này (hasSynced.current === false)
        if (status === 'authenticated' && !hasSynced.current) {

            try {
                hasSynced.current = true;

                console.log("Phát hiện giỏ hàng của khách, bắt đầu hợp nhất...");

                mergeCart(items);
                clearCart();

            } catch (error) {
                console.error("Lỗi khi hợp nhất giỏ hàng:", error);
            }
        } else if (status === 'unauthenticated') {
            // Reset lại cờ khi người dùng logout, để sẵn sàng cho lần đăng nhập sau
            hasSynced.current = false;

        }
    }, [status, queryClient, mergeCart, clearCart, items]);

    // Component này không render ra bất cứ thứ gì trên giao diện
    return null;
}