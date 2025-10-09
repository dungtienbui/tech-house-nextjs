import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col lg:flex-row justify-center gap-10 items-center p-10 mt-20">
            <Image src={"/notfound-image.svg"} alt={"Not found image."} width={500} height={500} />
            <div className="flex flex-col gap-5 items-center">
                <div className="order-last lg:order-first text-3xl text-slate-700 lg:w-[400px] text-wrap text-center">Xin lỗi, chúng tôi không tìm thấy trang mà bạn cần!</div>
                <Link
                    className="px-10 py-3 bg-sky-500 text-white w-fit mb-10 lg:mb-0"
                    href={"/"}
                >
                    TRỞ VỀ TRANG CHỦ
                </Link>
            </div>
        </div>
    );
}