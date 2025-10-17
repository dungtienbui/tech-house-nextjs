'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Smartphone, Hash } from 'lucide-react';
import Link from 'next/link';
import { trackOrderAction } from '@/lib/actions/order-tracking';
import clsx from 'clsx';
import FindOrderButton from '@/ui/app/track-order/find-order-button';
import OrderDetailClient from '@/ui/components/order/order-detail-client';

export default function TrackOrderPage() {
    const initialState = { message: '', errors: {} };
    const [state, formAction] = useActionState(trackOrderAction, initialState);

    const orderDetailRef = useRef<HTMLDivElement>(null);

    const data = {
        phone: "0353260326",
        orderId: "e7d98fbe-15c4-42e9-abf0-b65c44b635b3",
    }


    useEffect(() => {
        if (state && state.data && orderDetailRef.current) {
            const currY = orderDetailRef.current.getBoundingClientRect().top;
            window.scrollBy({
                top: currY - 150,
                behavior: 'smooth'
            });
        }
    }, [state])

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4">
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
                                        defaultValue={data.orderId}
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
                                        defaultValue={data.phone}
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

                            <FindOrderButton />
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
            {state.success && state.data && (
                <div ref={orderDetailRef} className='mt-10 sm:mt-5'>
                    <OrderDetailClient order={state.data} />
                </div>
            )}
        </div>
    );
}