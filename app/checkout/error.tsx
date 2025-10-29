'use client'
import Image from "next/image";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {

    const errorMessage = error.message;
    return (
        <div className="flex flex-col lg:flex-row justify-center gap-10 items-center">
            <Image src={"/error-image.svg"} alt={"Not found image."} width={500} height={500} className="rounded-full" />
            <div className="flex flex-col gap-5 items-center">
                <div className="order-last lg:order-first text-3xl text-red-700 lg:w-[400px] text-wrap text-center">{errorMessage}</div>
                <div className="flex lg:flex-row flex-col gap-5 items-stretch">
                    <button
                        className="px-10 py-3 bg-sky-500 text-white mb-10 lg:mb-0 cursor-pointer"
                        onClick={
                            () => reset()
                        }
                    >
                        THỬ LẠI
                    </button>

                    <Link
                        className="px-10 py-3 bg-sky-500 text-white w-fit mb-10 lg:mb-0"
                        href={"/"}
                    >
                        TRỞ VỀ TRANG CHỦ
                    </Link>
                </div>
            </div>
        </div>
    );
}