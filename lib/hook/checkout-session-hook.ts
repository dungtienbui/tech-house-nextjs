"use client";

import { useState, useEffect } from "react";

export function useCheckoutSession() {
    const [sessionId, setSessionId] = useState<string | null>(null);

    // Khi mount, lấy sessionId từ LocalStorage
    useEffect(() => {
        const stored = localStorage.getItem("checkoutSessionId");
        if (stored) setSessionId(stored);
    }, []);

    // Lưu sessionId vào LocalStorage
    const saveSessionId = (id: string) => {
        localStorage.setItem("checkoutSessionId", id);
        setSessionId(id);
    };

    // Xoá sessionId nếu cần
    const clearSessionId = () => {
        localStorage.removeItem("checkoutSessionId");
        setSessionId(null);
    };

    return { sessionId, saveSessionId, clearSessionId };
}
