import { AwardIcon, HandshakeIcon, CreditCardIcon, TruckIcon, HeadsetIcon } from "lucide-react";


export default function ProductPolicyAndShipingInfo() {
    return (
        <div className="flex flex-col md:flex-row justify-start items-stretch gap-10">
            <ProductPolicy />
            <ShipingInfomation />
        </div>
    );
}

function ProductPolicy() {
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
        <div className="flex-1">
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


import { Diamond } from "lucide-react";
import Image from "next/image";

function ShipingInfomation() {

    const shipingInfomation = [
        {
            name: "Chuyển phát nhanh:",
            value: "2 - 4 ngày, miễn phí vận chuyển"
        },
        {
            name: "Vận chuyển nội địa:",
            value: "Lên đến một tuần, $19,00"
        },
        {
            name: "Vận chuyển mặt đất của UPS:",
            value: "4 - 6 ngày, $29,00"
        },
        {
            name: "Xuất khẩu toàn cầu Unishop:",
            value: "3 - 4 ngày, $39,00"
        },
    ];

    return (
        <div className="flex-1">
            <p className="font-bold mb-3 text-lg">Thông tin vận chuyển</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 md:grid-cols-1 lg:grid-cols-2 gap-y-3 ml-5 sm:ml-0">
                {
                    shipingInfomation.map((item) => {
                        return (
                            <div key={item.name} className="lg:flex lg:flex-col">
                                <p className="font-bold inline"><Diamond className="inline sm:hidden w-3 h-3 mr-2" />{item.name}</p>
                                <p className="inline lg:hidden">{" "}</p>
                                <p className="inline xl:pl-5"><Diamond className="hidden w-3 h-3 mr-2 lg:inline" />{item.value}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}