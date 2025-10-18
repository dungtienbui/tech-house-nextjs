'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { CartItems } from '../definations/data-dto';
import { fetchCartItemsByUserId } from '../data/fetch-data';
import { deleteCart, deleteItemFormCart, deleteMultipleItemsFormCart, insertItemToCart, InsertMultipleItemsFormCart, updateCartItem } from '../data/insert-data';

/**
 * Hàm trợ giúp để lấy userId từ session.
 * Ném lỗi nếu người dùng chưa đăng nhập.
 */
async function getUserId(): Promise<string> {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        throw new Error("Bạn phải đăng nhập để thực hiện hành động này.");
    }
    return userId;
}

// =================================================================
// == TƯƠNG ỨNG VỚI `items` (Lấy giỏ hàng) ==
// =================================================================
export async function getUserCartAction(): Promise<CartItems> {
    try {
        const userId = await getUserId();

        const cartItems = await fetchCartItemsByUserId(userId);

        return cartItems;
    } catch (error) {
        console.log("error: ", (error as Error).message);
        return [];
    }
}

// =================================================================
// == TƯƠNG ỨNG VỚI `addToCart` ==
// =================================================================
export async function addToCartAction(variantId: string, quantity: number = 1) {
    try {
        const userId = await getUserId();
        const resultInsert = await insertItemToCart(userId, variantId, quantity);

        console.log("resultInsert: ", resultInsert);

        revalidatePath('/cart'); // Làm mới dữ liệu cho trang giỏ hàng
    } catch (error) {
        console.error("addToCartAction Error:", (error as Error).message);
        throw new Error("Không thể thêm vào giỏ hàng.");
    }
}

// =================================================================
// == TƯƠNG ỨNG VỚI `removeFromCart` ==
// =================================================================
export async function removeFromCartAction(variantId: string) {
    try {
        const userId = await getUserId();
        const resultDelete = await deleteItemFormCart(userId, variantId);

        console.log("resultDelete: ", resultDelete);

        revalidatePath('/cart');
    } catch (error) {
        console.error("removeFromCartAction Error:", (error as Error).message);
        throw new Error("Không thể xóa sản phẩm khỏi giỏ hàng.");
    }
}

// =================================================================
// == TƯƠNG ỨNG VỚI `removeMultipleItems` ==
// =================================================================
export async function removeMultipleItemsAction(variantIds: string[]) {
    try {
        if (variantIds.length === 0) return; // Không làm gì nếu mảng rỗng
        const userId = await getUserId();

        const resultDelete = await deleteMultipleItemsFormCart(userId, variantIds);

        console.log("resultDelete: ", resultDelete);

        revalidatePath('/cart');
    } catch (error) {
        console.error("removeMultipleItemsAction Error:", (error as Error).message);
        throw new Error("Không thể xóa các sản phẩm đã chọn.");
    }
}

// =================================================================
// == TƯƠNG ỨNG VỚI `updateItemQuantity` ==
// =================================================================
export async function updateItemQuantityAction(variantId: string, newQuantity: number) {
    // Nếu số lượng mới nhỏ hơn hoặc bằng 0, hãy xóa sản phẩm đó
    if (newQuantity <= 0) {
        return await removeFromCartAction(variantId);
    }

    try {
        const userId = await getUserId();

        const resultUpdate = await updateCartItem(userId, variantId, newQuantity);

        console.log("resultUpdate: ", resultUpdate);

        revalidatePath('/cart');
    } catch (error) {
        console.error("updateItemQuantityAction Error:", (error as Error).message);
        throw new Error("Không thể cập nhật số lượng sản phẩm.");
    }
}

// =================================================================
// == TƯƠNG ỨNG VỚI `clearCart` ==
// =================================================================
export async function clearCartAction() {
    try {
        const userId = await getUserId();

        const resultClear = await deleteCart(userId);

        console.log("resultClear: ", resultClear);

        revalidatePath('/cart');
    } catch (error) {
        console.error("clearCartAction Error:", (error as Error).message);
        throw new Error("Không thể xóa giỏ hàng.");
    }
}


// =================================================================
// == TƯƠNG ỨNG VỚI `mergeCart` ==
// =================================================================
export async function mergeCartAction(guestItems: {
    variantId: string, quantity: number
}[]) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        // Nếu không có session hoặc không có sản phẩm từ guest, không làm gì cả.
        if (!userId || guestItems.length === 0) {
            return { success: false, message: "Không có dữ liệu để hợp nhất." };
        }

        const resultMerge = await InsertMultipleItemsFormCart(userId, guestItems.map(item => ({
            variant_id: item.variantId,
            quantity: item.quantity
        })))

        console.log("resultMerge: ", resultMerge);

        revalidatePath('/cart');

        return { success: true, message: "Hợp nhất giỏ hàng thành công." };

    } catch (error) {
        console.error("mergeCartAction Error:", error);
        return { success: false, message: "Hợp nhất giỏ hàng thất bại." };
    }
}