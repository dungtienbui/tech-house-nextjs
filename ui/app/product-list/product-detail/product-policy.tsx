import { AwardIcon, HandshakeIcon, CreditCardIcon, TruckIcon, HeadsetIcon } from "lucide-react";

export default function ProductPolicy() {
    const productPolicy = [
        {
            name: "Bảo hành miễn phí 1 năm",
            icon: AwardIcon,
        },
        {
            name: "Đảm bảo hoàn tiền 100%",
            icon: HandshakeIcon,
        },
        {
            name: "Phương thức thanh toán an toàn",
            icon: CreditCardIcon,
        },
        {
            name: "Giao hàng miễn phí và giao hàng nhanh",
            icon: TruckIcon,
        },
        {
            name: "Hỗ trợ khách hàng 24/7",
            icon: HeadsetIcon,
        },
    ]

    return (
        <div className="w-full">
            <p className="font-bold mb-3 text-lg">Chính sách sản phẩm</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 md:grid-cols-1 lg:grid-cols-2 gap-y-3">
                {
                    productPolicy.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.name} className="flex flex-row justify-start items-center gap-2 ml-5 sm:ml-0">
                                <Icon color="#008ECC" />
                                <p>{item.name}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}