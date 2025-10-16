'use client';

import { useActionState, useEffect } from 'react'; // React 19+
// import { useFormState } from 'react-dom'; // React 18
import { Smartphone, ArrowRight, Hash, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { trackOrderAction } from '@/lib/actions/order-tracking';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

// Component con cho nút bấm để quản lý trạng thái pending
function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-full transition duration-300 ease-in-out flex items-center justify-center gap-2 text-lg disabled:bg-gray-400"
        >
            {pending ? (
                <>
                    <LoaderCircle className="animate-spin" size={20} />
                    ĐANG TÌM KIẾM...
                </>
            ) : (
                <>
                    TIẾP TỤC
                    <ArrowRight size={20} />
                </>
            )}
        </button>
    );
}

export default function TrackOrderPage() {
    const initialState = { message: '', errors: {} };
    const [state, formAction] = useActionState(trackOrderAction, initialState);

    const router = useRouter();

    useEffect(() => {
        if (state && state.success && state.data) {
            const params = new URLSearchParams();
            params.set("id", state.data.id);
            params.set("phone", state.data.phone);
            router.push(`/track-order/order?${params.toString()}`);
        }
    }, [state])

    return (
        <div className="min-h-[70vh] flex items-center justify-center pb-12 px-4">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
                {/* ... Cột trái giữ nguyên ... */}
                <div className="w-full md:w-1/2 bg-sky-100/70 hidden md:flex items-center justify-center p-12">
                    <svg width="250" height="250" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                        <g transform="translate(100 100)">
                            <path d="M62.5,-35.3C73.9,-9.2,71.2,21.8,56.7,42.5C42.2,63.2,15.9,73.6,-9.7,73.9C-35.3,74.2,-60.1,64.4,-70.7,45.4C-81.3,26.4,-77.7,-1.8,-66,-25.1C-54.3,-48.4,-34.4,-66.8,-11.9,-69.1C10.6,-71.4,31.2,-57.5,62.5,-35.3Z" fill="#bae6fd"></path>
                            <rect x="-60" y="-70" width="120" height="140" rx="15" fill="white" stroke="#60a5fa" strokeWidth="4"></rect>
                            <line x1="-40" y1="-50" x2="40" y2="-50" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round"></line>
                            <line x1="-40" y1="-30" x2="40" y2="-30" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round"></line>
                            <line x1="-40" y1="-10" x2="20" y2="-10" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round"></line>
                            <circle cx="0" cy="50" r="10" fill="#38bdf8"></circle>
                        </g>
                    </svg>
                </div>

                {/* --- CỘT PHẢI: FORM TRA CỨU --- */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="w-full max-w-sm mx-auto">
                        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
                            Tra cứu thông tin đơn hàng
                        </h1>

                        {/* Sử dụng action cho form */}
                        <form action={formAction} className="space-y-4">
                            <div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <Hash className="text-gray-400" size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        name="orderId"
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                                        placeholder="Nhập mã đơn hàng"
                                    />
                                </div>
                                {state.errors?.orderId &&
                                    state.errors.orderId.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>

                            <div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <Smartphone className="text-gray-400" size={20} />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                                        placeholder="Nhập số điện thoại mua hàng"
                                    />
                                </div>
                                {state.errors?.phone &&
                                    state.errors.phone.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>

                            {/* Hiển thị lỗi chung */}
                            {state?.message &&
                                <p
                                    className={clsx(
                                        {
                                            "text-sm text-red-500": !state.success,
                                            "text-sm text-blue-500": state.success,
                                        }
                                    )}
                                >
                                    {state.message}
                                </p>}

                            <SubmitButton />
                        </form>

                        <div className="flex flex-row items-center gap-2 px-2 my-5">
                            <div className="flex-1 border-t border-gray-200"></div>
                            <div className="text-sm text-gray-500">Hoặc</div>
                            <div className="flex-1 border-t border-gray-200"></div>
                        </div>

                        <div className="w-full text-center">
                            <span>
                                <span>Bạn đã có tài khoản? </span>
                                <Link href="/signin" className="text-blue-500 font-bold hover:underline">
                                    Đăng nhập
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}