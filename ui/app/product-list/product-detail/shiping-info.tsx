import { Diamond } from "lucide-react";

export default function ShipingInfomation() {

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
        <div className="w-full">
            <p className="font-bold mb-3 text-lg">Thông tin vận chuyển</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 md:grid-cols-1 lg:grid-cols-2 gap-y-3 ml-5 sm:ml-0">
                {
                    shipingInfomation.map((item) => {
                        return (
                            <div key={item.name} className="lg:flex lg:flex-col">
                                <p className="font-bold inline">{item.name}</p>
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