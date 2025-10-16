'use client';

import { useMutation } from '@tanstack/react-query';
import { CartItems } from '../definations/data-dto';
import { createCheckoutSession } from '../actions/checkout';

/**
 * Custom hook để quản lý việc tạo checkout session.
 */
export function useCreateCheckoutSession() {
    // 1. Lấy ra các trạng thái quan trọng từ useMutation
    const {
        mutate: createSession,
        mutateAsync: createSessionAsync,
        isPending,
        error,
        data
    } = useMutation({
        mutationFn: (items: CartItems) => createCheckoutSession(items),

    });

    return {
        createSession,
        createSessionAsync,
        isPending,
        error,
        data,
    };
}