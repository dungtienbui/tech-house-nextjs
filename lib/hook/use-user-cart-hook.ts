'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCartAction, clearCartAction, getUserCartAction, mergeCartAction, removeFromCartAction, removeMultipleItemsAction, updateItemQuantityAction } from '../actions/cart';
import { CartItems } from '../definations/data-dto';

type SessionStatus = "authenticated" | "loading" | "unauthenticated"

export function useUserCart(status: SessionStatus) {
    const queryClient = useQueryClient();

    // === LẤY DỮ LIỆU GIỎ HÀNG (Sử dụng useQuery) ===
    const { data: items, isLoading } = useQuery({
        queryKey: ['userCart'],
        queryFn: getUserCartAction,
        enabled: status === 'authenticated',
        staleTime: 1000 * 60 * 5,
    });

    // === CÁC HÀNH ĐỘNG THAY ĐỔI GIỎ HÀNG (Sử dụng useMutation) ===

    const { mutate: mutateAddToCart, isPending: isAdding } = useMutation({
        mutationFn: (params: { variantId: string; quantity: number }) =>
            addToCartAction(params.variantId, params.quantity),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userCart'] }),
    });

    const { mutate: mutateRemoveFromCart, isPending: isRemoving } = useMutation({
        mutationFn: (variantId: string) => removeFromCartAction(variantId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userCart'] }),
    });

    const { mutate: mutateRemoveMultiple, isPending: isRemovingMultiple } = useMutation({
        mutationFn: (variantIds: string[]) => removeMultipleItemsAction(variantIds),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userCart'] }),
    });

    const { mutate: mutateUpdateQuantity, isPending: isUpdatingQuantity } = useMutation({
        mutationFn: (params: { variantId: string, newQuantity: number }) =>
            updateItemQuantityAction(params.variantId, params.newQuantity),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userCart'] }),
    });

    const { mutate: mutateClearCart, isPending: isClearing } = useMutation({
        mutationFn: () => clearCartAction(),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userCart'] }),
    });

    const { mutate: mutateMergeCart, isPending: isMerging } = useMutation({
        mutationFn: (param: {
            items: {
                variantId: string, quantity: number
            }[]
        }) => mergeCartAction(param.items),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userCart'] });
        },
    });

    // === TẠO CÁC HÀM BỌC VỚI CHỮ KÝ ĐÚNG ===
    const addToCart = (variantId: string, quantity: number = 1) => {
        mutateAddToCart({ variantId, quantity });
    };

    const updateItemQuantity = (variantId: string, newQuantity: number) => {
        mutateUpdateQuantity({ variantId, newQuantity });
    };

    const mergeCart = (items: CartItems) => {
        const data = items.map(item => ({
            variantId: item.variant_id,
            quantity: item.quantity
        }))
        mutateMergeCart({ items: data });
    }

    // === TRẢ VỀ KẾT QUẢ VỚI API NHẤT QUÁN ===
    return {
        items: items ?? [],
        isLoading: !!isLoading && !!isAdding && !!isClearing && !!isRemoving && !!isRemovingMultiple && !!isUpdatingQuantity && !!isMerging,
        addToCart, // Trả về hàm bọc
        isAdding,
        removeFromCart: mutateRemoveFromCart, // Chữ ký đã khớp, có thể trả về trực tiếp
        isRemoving,
        removeMultipleItems: mutateRemoveMultiple, // Chữ ký đã khớp
        isRemovingMultiple,
        updateItemQuantity, // Trả về hàm bọc
        isUpdatingQuantity,
        clearCart: mutateClearCart, // Chữ ký đã khớp
        isClearing,
        mergeCart
    };
}