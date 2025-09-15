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
            <div className="grid grid-cols-2 gap-y-3">
                {
                    shipingInfomation.map((item) => {
                        return (
                            <div key={item.name} className="flex flex-col">
                                <p className="font-bold">{item.name}</p>
                                <p className="pl-5">{item.value}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}