import { CheckCircle, Home, Package, Truck, XCircle } from "lucide-react";

export default function OrderStatusStepper({ status }: { status: string }) {
    // Mảng các bước hiển thị trên thanh tiến trình
    const steps = [
        { id: 'pending', name: 'Đã đặt hàng', icon: <Package size={24} /> },
        { id: 'confirmed', name: 'Đã xác nhận', icon: <CheckCircle size={24} /> },
        { id: 'shipping', name: 'Đang vận chuyển', icon: <Truck size={24} /> },
        { id: 'delivered', name: 'Đã giao hàng', icon: <Home size={24} /> },
    ];

    // --- XỬ LÝ TRƯỜNG HỢP ĐẶC BIỆT: ĐƠN HÀNG BỊ HỦY ---
    if (status === 'cancelled') {
        return (
            <div className="w-full bg-white p-6 rounded-lg shadow-sm mb-6 flex flex-col items-center justify-center gap-3 border-l-4 border-red-500">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-100 text-red-500">
                    <XCircle size={40} />
                </div>
                <p className="font-bold text-red-600 text-lg">Đơn hàng đã bị hủy</p>
            </div>
        );
    }

    // --- XỬ LÝ THANH TIẾN TRÌNH BÌNH THƯỜNG ---

    // Coi 'completed' là bước cuối cùng, tương đương 'delivered'
    const effectiveStatus = status === 'completed' ? 'delivered' : status;

    // Tìm vị trí của bước hiện tại
    const currentStepIndex = steps.findIndex(step => step.id === effectiveStatus);

    return (
        <div className="w-full bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex justify-between items-center">
                {steps.map((step, index) => {
                    const isCompleted = currentStepIndex >= 0 && index < currentStepIndex;
                    const isActive = index === currentStepIndex;

                    return (
                        <div key={step.id} className="flex flex-col items-center flex-1">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
                                ${isCompleted ? 'bg-green-500 text-white' : ''}
                                ${isActive ? 'bg-sky-500 text-white animate-pulse' : ''}
                                ${!isCompleted && !isActive ? 'bg-gray-200 text-gray-500' : ''}
                            `}>
                                {step.icon}
                            </div>
                            <p className={`mt-2 text-sm text-center font-medium transition-colors ${isActive ? 'font-bold text-sky-600' : 'text-gray-600'}`}>
                                {step.name}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}