'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean; // Trạng thái đóng/mở
    onClose: () => void; // Hàm để đóng modal
    children: React.ReactNode;
}

export function CustomModal({ isOpen, onClose, children }: ModalProps) {
    const [isClient, setIsClient] = useState(true);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        // Dọn dẹp khi component bị hủy
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Nếu modal đóng hoặc code chưa chạy ở client, không render gì cả
    if (!isOpen || !isClient) {
        return null;
    }

    // Tìm đến "cổng" portal đã tạo ở layout
    const portalRoot = document.getElementById('modal-portal');
    if (!portalRoot) {
        console.error("Phần tử 'modal-portal' không tồn tại.");
        return null;
    }

    // Sử dụng createPortal để "dịch chuyển" modal
    return createPortal(
        (
            // Lớp phủ (Overlay)
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs"
                onClick={onClose} // Nhấn ra ngoài để đóng
            >
                {/* Hộp thoại (Dialog) */}
                <div
                    className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
                    onClick={(e) => e.stopPropagation()} // Ngăn việc nhấn vào modal làm đóng modal
                >
                    {/* Nút đóng (Close Button) */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 rounded-full p-1 text-gray-400 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>

                    {/* Nội dung bên trong modal */}
                    {children}
                </div>
            </div>
        ),
        portalRoot // Đây là nơi modal được "dịch chuyển" đến
    );
}