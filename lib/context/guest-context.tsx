"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface GuestInfo {
    name: string;
    phone: string;
    email: string;
    address: string;
}

interface GuestContextType {
    readonly guestInfo: GuestInfo;
    setGuestInfo: (info: Partial<GuestInfo>) => void;
    saveGuestInfo: () => void;
    clearGuestInfo: () => void;
    isGuestInfoValid: () => boolean;
    getGuestInfoError: () => string | null;
}

const DEFAULT_GUEST: GuestInfo = {
    name: "",
    phone: "",
    email: "",
    address: "",
};

const GuestContext = createContext<GuestContextType | null>(null);

export function GuestProvider({ children }: { children: React.ReactNode }) {
    const [guestInfo, setGuestInfoState] = useState<GuestInfo>(DEFAULT_GUEST);

    // Load từ localStorage khi khởi tạo
    useEffect(() => {
        try {
            const saved = localStorage.getItem("guestInfo");
            if (saved) setGuestInfoState(JSON.parse(saved));
        } catch {
            console.warn("Không đọc được guestInfo từ localStorage");
        }
    }, []);

    // Hàm cập nhật thông tin trong state
    function setGuestInfo(info: Partial<GuestInfo>) {
        setGuestInfoState((prev) => ({ ...prev, ...info }));
    }

    // Hàm lưu vào localStorage (gọi khi nhấn nút Save)
    function saveGuestInfo() {
        try {
            localStorage.setItem("guestInfo", JSON.stringify(guestInfo));
            console.log("Guest info đã được lưu!");
        } catch {
            console.error("Không lưu được guestInfo vào localStorage");
        }
    }

    // Hàm reset thông tin
    function clearGuestInfo() {
        setGuestInfoState(DEFAULT_GUEST);
        localStorage.removeItem("guestInfo");
    }

    // Kiểm tra hợp lệ
    function isGuestInfoValid(): boolean {
        // Trim các trường để tránh chỉ chứa dấu cách
        const { name, phone, email, address } = guestInfo;
        if (!name.trim() || !phone.trim() || !email.trim() || !address.trim()) {
            return false;
        }

        // Regex kiểm tra email đơn giản
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return false;

        // Regex kiểm tra số điện thoại VN (tùy chỉnh)
        const phoneRegex = /^(0|\+84)(\d{9})$/;
        if (!phoneRegex.test(phone)) return false;

        return true;
    }

    function getGuestInfoError(): string | null {
        const { name, phone, email, address } = guestInfo;

        if (!name.trim()) return "Vui lòng nhập tên";
        if (!phone.trim()) return "Vui lòng nhập số điện thoại";
        if (!email.trim()) return "Vui lòng nhập email";
        if (!address.trim()) return "Vui lòng nhập địa chỉ";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Email không hợp lệ";

        const phoneRegex = /^(0|\+84)(\d{9})$/;
        if (!phoneRegex.test(phone)) return "Số điện thoại không hợp lệ";

        return null; // ✅ Không có lỗi
    }

    return (
        <GuestContext.Provider value={{ guestInfo, setGuestInfo, saveGuestInfo, clearGuestInfo, isGuestInfoValid, getGuestInfoError }}>
            {children}
        </GuestContext.Provider>
    );
}

export function useGuest() {
    const ctx = useContext(GuestContext);
    if (!ctx) throw new Error("useGuest must be used within a GuestProvider");
    return ctx;
}
