import { auth } from "@/auth";
import { fetchUserById } from "@/lib/data/fetch-data";
import { Address } from "@/lib/definations/data-dto";
import AddressForm from "@/ui/app/user/profile/address-form";
import { notFound } from "next/navigation";

export default async function UserProfilePage() {

    const session = await auth();

    if (!session?.user.id) {
        notFound();
    }

    const user = await fetchUserById(session.user.id);

    if (!user) {
        notFound();
    }

    const address: Address = {
        province: user.province ?? "",
        ward: user.ward ?? "",
        street: user.street ?? ""
    }

    return (
        <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                {/* Tiêu đề và khoảng thời gian */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Thông tin khách hàng</h1>
                </div>

                {/* Thông tin khách hàng */}
                <div className="space-y-4">
                    <div>
                        <h3 className="font-bold">Thông tin cá nhân</h3>
                        <p>{user.name}</p>
                        <p>{user.phone}</p>
                    </div>
                    <AddressForm address={address} />
                </div>
            </div>
        </div>
    );
}