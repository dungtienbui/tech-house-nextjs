"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { GuestInfo, GuestInfoSchema } from "../definations/data-dto";
import z from "zod";

interface GuestContextType {
    readonly guestInfo: GuestInfo;
    setGuestInfo: (info: Partial<GuestInfo>) => void;
    saveGuestInfo: () => void;
    clearGuestInfo: () => void;
    isGuestInfoValid: () => boolean;
    getGuestInfoError: () => {
        name?: string[] | undefined;
        phone?: string[] | undefined;
        address?: string[] | undefined;
    } | null;
}

const DEFAULT_GUEST: GuestInfo = {
    name: "",
    phone: "",
    address: {
        province: "",
        ward: "",
        street: ""
    },
};

const GuestContext = createContext<GuestContextType | null>(null);

export function GuestProvider({ children }: { children: React.ReactNode }) {
    const [guestInfo, setGuestInfoState] = useState<GuestInfo>(DEFAULT_GUEST);

    // Load từ localStorage khi khởi tạo
    useEffect(() => {
        try {
            const saved = localStorage.getItem("guestInfo");

            if (!saved) {
                return;
            }

            const savedValidated = GuestInfoSchema.safeParse(JSON.parse(saved));

            if (savedValidated.success) {
                setGuestInfoState(savedValidated.data);
            }

        } catch (e) {
            console.log("error: ", (e as Error).message);
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
        } catch (e) {
            console.log("error: ", (e as Error).message);
        }
    }

    // Hàm reset thông tin
    function clearGuestInfo() {
        setGuestInfoState(DEFAULT_GUEST);
        localStorage.removeItem("guestInfo");
    }

    // Kiểm tra hợp lệ
    function isGuestInfoValid(): boolean {

        const infoValidated = GuestInfoSchema.safeParse(guestInfo);

        return infoValidated.success;
    }

    function getGuestInfoError() {
        const infoValidated = GuestInfoSchema.safeParse(guestInfo);

        if (!infoValidated.success) {
            return z.flattenError(infoValidated.error).fieldErrors
        }

        return null; // Không có lỗi
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
