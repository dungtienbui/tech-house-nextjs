import { GuestInfo, GuestInfoSchema } from "../definations/data-dto";

// Định nghĩa thông tin mặc định
const DEFAULT_GUEST: GuestInfo = {
    name: "",
    phone: "",
    address: {
        province: "",
        ward: "",
        street: ""
    },
};

export function loadGuestInfo(): GuestInfo {
    if (typeof window === 'undefined') {
        return DEFAULT_GUEST;
    }

    try {
        const saved = localStorage.getItem("guestInfo");

        if (saved) {
            const savedValidated = GuestInfoSchema.safeParse(JSON.parse(saved));

            if (savedValidated.success) {
                return savedValidated.data;
            }
        }

    } catch (error) {
        console.warn("Không thể đọc/xác thực thông tin khách hàng từ localStorage.", error);
    }

    return DEFAULT_GUEST;
}

export function saveGuestInfo(info: GuestInfo): boolean {
    const validated = GuestInfoSchema.safeParse(info);

    if (!validated.success) {
        console.error("Dữ liệu khách hàng không hợp lệ theo Schema.");
        return false;
    }

    if (typeof window === 'undefined') {
        return true;
    }

    try {
        localStorage.setItem("guestInfo", JSON.stringify(validated.data));
        return true;
    } catch (e) {
        console.error("Lỗi khi lưu vào localStorage:", (e as Error).message);
        return false;
    }
}

export function clearGuestInfo(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem("guestInfo");
    }
}