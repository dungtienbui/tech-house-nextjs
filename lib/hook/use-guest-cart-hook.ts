'use client'

import { useContext } from "react";
import { GuestCartContext } from "../context/guest-card-context";

// 4. --- Tạo Custom Hook để sử dụng ---
export function useGuestCart() {
    const context = useContext(GuestCartContext);
    if (!context) {
        throw new Error("useGuestCart phải được sử dụng bên trong một GuestCartProvider");
    }
    return context;
}