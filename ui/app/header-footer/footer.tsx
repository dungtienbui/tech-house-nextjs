import { PhoneCall } from "lucide-react";

export default function Footer() {
    return (
        <div className="w-full bg-sky-500 text-white flex flex-col pt-5 lg:pt-10 relative overflow-clip">
            <div className="flex flex-col-reverse p-10 min-[800px]:p-15 min-[800px]:flex-row gap-15 flex-1 mb-20 z-1">
                <div className="flex-1 self-start flex flex-col justify-center items-center">
                    <div className="flex flex-col justify-start gap-3">
                        <div className="font-bold">Tổng đài hỗ trợ</div>
                        <div className="flex flex-row items-center gap-1 group/1">
                            <PhoneCall className="w-10" />
                            <div className="text-left">
                                <div>Gọi mua:</div>
                                <div>1900 232 4xx (8:00 - 21:30)</div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <PhoneCall className="w-10" />
                            <div className="text-left">
                                <div>Bảo hành:</div>
                                <div>1900 232 4xx (8:00 - 21:30)</div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <PhoneCall className="w-10" />
                            <div className="text-left">
                                <div>Khiếu nại:</div>
                                <div>1900 232 4xx (8:00 - 21:30)</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-2 flex flex-col min-[450px]:flex-row justify-start items-stretch gap-10">
                    <div>
                        <div className="mb-5">
                            <div className="font-bold mb-2">
                                Danh mục sản phẩm
                            </div>
                            <div className="max-w-[500px] min-w-[200px] h-0 border border-white"></div>
                        </div>
                        <div className="pl-5">
                            <ul className="list-disc flex flex-col gap-4">
                                <li className="hover:font-bold">Điện thoại</li>
                                <li className="hover:font-bold">Laptop</li>
                                <li className="hover:font-bold">Tablet</li>
                                <li className="hover:font-bold">Tai nghe</li>
                                <li className="hover:font-bold">Bàn phím</li>
                                <li className="hover:font-bold">Sạc dự phòng</li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <div className="mb-5">
                            <div className="font-bold mb-2">
                                Các thông tin khác
                            </div>
                            <div className="max-w-[500px] min-w-[200px] h-0 border border-white"></div>
                        </div>
                        <div className="pl-5">
                            <ul className="list-disc flex flex-col gap-4">
                                <li className="hover:font-bold">Giới thiệu công ty</li>
                                <li className="hover:font-bold">Chính sách bảo hành</li>
                                <li className="hover:font-bold">Góp ý, khiếu nại</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="font-bold italic text-sm py-5 text-center z-1">
                © 2025 All rights reserved. Reliance Retail Ltd.
            </div>
            <div className="absolute w-full h-full max-lg:hidden lg:rotate-x-180 xl:rotate-x-0 z-0">
                <div className="absolute -top-20 -right-20 h-100 w-100 bg-cyan-200 rounded-full" />
                <div className="absolute -top-23 -right-25 h-110 w-110 bg-none border border-amber-100 rounded-full" />
                <div className="absolute -top-30 -right-35 h-130 w-130 bg-none border border-b-emerald-300 rounded-full" />
            </div>
        </div>
    );
}