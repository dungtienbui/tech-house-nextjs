import FindPuschaseForm from "@/ui/app/user/purchase/find-purchase-form";
import Breadcrumbs from "@/ui/components/breadcrumbs/breadcrumbs";
import Image from "next/image";

export default function Purchase() {
    return (
        <div>
            <Breadcrumbs breadcrumbs={[
                {
                    label: "Trang chủ",
                    href: "/",
                    active: false
                },
                {
                    label: "Khách hàng",
                    href: `/user/purchase`,
                    active: true
                },
            ]} />
            <div className="flex flex-col md:flex-row gap-5 justify-center items-center">
                <Image className="order-last md:order-none" src={"https://cdn.tgdd.vn/2022/10/banner/TGDD-540x270.png"} width={540} height={270} alt={"Checkout image background"} />
                <FindPuschaseForm />
            </div>
        </div>
    );
}