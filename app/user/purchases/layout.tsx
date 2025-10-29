import StatusTabs from "@/ui/app/user/purchases/status-tabs";
import { Suspense } from "react";

export default function PurchasesLayout(
    { children }: { children: React.ReactNode }
) {
    return (
        <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                {/* Tiêu đề và khoảng thời gian */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Đơn hàng đã mua</h1>
                    <div className="text-sm text-gray-600">
                        <span>Từ 09/10/2024 - 09/10/2025</span>
                        <a href="#" className="text-blue-600 ml-4 font-semibold">Thay đổi</a>
                    </div>
                </div>

                {/* Tabs trạng thái đơn hàng */}
                <Suspense>
                    <StatusTabs />
                </Suspense>

                {/* Danh sách đơn hàng */}
                {children}
            </div>
        </div>
    );
}