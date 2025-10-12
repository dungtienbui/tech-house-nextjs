import { auth, signOut } from "@/auth";
import { ClipboardList, MapPin, QrCode, Apple, Store } from "lucide-react";
import NavMenu from "./nav-menu";

export default async function UserSideBar() {
    const session = await auth();

    // console.log("session: ", session);

    return (
        < aside className="lg:col-span-1 space-y-6" >
            {/* Thông tin người dùng */}
            <div className="bg-white p-4 rounded-lg shadow-sm" >
                <h3>Xin chào: <b className="text-lg">{session?.user.name}</b></h3>
                {/* {
                    session?.user.phone && <h4 className="font-bold">{session?.user.phone}</h4>
                } */}
            </div >

            {/* Menu điều hướng */}
            <NavMenu />

            {/* Nút đăng xuất */}
            <div >
                <button
                    className="w-full text-center p-3 border border-red-500 text-red-500 rounded-md font-semibold hover:bg-red-50 transition-colors"
                    onClick={async () => {
                        "use server"
                        await signOut({ redirectTo: "/" });
                    }}
                >
                    Đăng Xuất
                </button>
            </div>

            {/* Box tích điểm & tải app */}
            <div className="bg-white p-4 rounded-lg shadow-sm text-center border border-yellow-300" >
                <p className="text-sm">Tổng điểm tích lũy: <span className="font-bold text-lg">8.970 điểm</span></p>
                <div className="flex items-center justify-center my-4 space-x-4">
                    <div>
                        <p className="font-bold">Tải app 👑 Quà Tặng VIP</p>
                        <p className="text-xs text-gray-500 mt-1">Tích & sử dụng điểm cho khách hàng thân thiết.</p>
                    </div>
                    <div className="p-1 border rounded-md">
                        <QrCode size={60} />
                    </div>
                </div>
                <div className="flex justify-center space-x-2">
                    <a href="#" className="bg-black text-white px-3 py-2 rounded-md flex items-center space-x-2">
                        <Apple size={24} />
                        <div>
                            <p className="font-semibold leading-tight">App Store</p>
                        </div>
                    </a>
                    <a href="#" className="bg-black text-white px-3 py-2 rounded-md flex items-center space-x-2">
                        <Store size={24} />
                        <div>
                            <p className="font-semibold leading-tight">Google Play</p>
                        </div>
                    </a>
                </div>
            </div>
        </aside >
    )

}