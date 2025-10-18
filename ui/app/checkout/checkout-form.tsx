'use client';

import { useFormStatus } from 'react-dom';
import { CartItems } from "@/lib/definations/data-dto";
import clsx from "clsx";
import { ChevronDown, ChevronsUp, LoaderCircle } from "lucide-react";
import { completeCheckoutAction } from '@/lib/actions/checkout';
import { useActionState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useCart } from '@/lib/hook/use-cart-hook';


interface props {
    checkoutItems: CartItems;
    checkoutId: string;
}

// Component cho nút bấm để tách logic `useFormStatus`
function SubmitButton() {
    // Hook này phải được dùng trong component con của <form>
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className={clsx(
                "text-white w-full md:w-[400px] py-3 flex flex-row gap-5 justify-center items-center rounded-2xl shadow",
                {
                    "bg-sky-500 hover:bg-sky-400 active:bg-blue-500": !pending,
                    "bg-gray-500 opacity-70 cursor-not-allowed": pending,
                }
            )}
        >
            {!pending && <ChevronsUp className="rotate-90 animate-bounce" />}
            <div>{pending ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG'}</div>
            {pending && <LoaderCircle className="animate-spin" />}
            {!pending && <ChevronsUp className="-rotate-90 animate-bounce" />}
        </button>
    );
}

export default function CheckoutForm({ checkoutId, checkoutItems }: props) {
    const PAYMENTMETHOD = [
        {
            id: "online-banking",
            name: "Chuyển khoản ngân hàng"
        },
        {
            id: "cod",
            name: "Thanh toán khi nhận hàng"
        },
    ]

    const initialState = { message: '', errors: {} };

    const completeCheckoutActionWithData = completeCheckoutAction.bind(null, checkoutId, checkoutItems);

    const [state, dispatch] = useActionState(completeCheckoutActionWithData, initialState);

    const { removeMultipleItems } = useCart();

    useEffect(() => {
        if (!!state.sussess) {
            removeMultipleItems(checkoutItems.map(i => i.variant_id));
            redirect("/user");
        }
    }, [state])

    return (
        <form
            action={dispatch}
            className="w-full lg:w-[900px] xl:w-[1000px] bg-white p-6 rounded-xl shadow flex flex-col gap-4"
        >
            <div className="text-lg font-bold">
                Thông tin khách hàng:
            </div>

            {/* Các input giờ đây không cần `value` và `onChange` */}
            <input
                name="name"
                placeholder="Tên"
                defaultValue={state.fields?.name?.toString()}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            {state?.errors?.name && state.errors.name.map((err, i) => (
                <p key={i} className="text-sm text-red-500">{err}</p>
            ))}

            <input
                name="phone"
                placeholder="Số điện thoại"
                defaultValue={state.fields?.phone?.toString()}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            {state?.errors?.phone && state.errors.phone.map((err, i) => (
                <p key={i} className="text-sm text-red-500">{err}</p>
            ))}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <input
                        name="province"
                        placeholder="Tỉnh/ Thành phố"
                        defaultValue={state.fields?.address.province?.toString()}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                </div>
                <div>
                    <input
                        name="ward"
                        placeholder="Phường/ Xã"
                        defaultValue={state.fields?.address.ward?.toString()}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                </div>
            </div>

            <input
                name="street"
                placeholder="Số Nhà, Tên Đường*"
                defaultValue={state.fields?.address.street?.toString()}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            {state?.errors?.address && state.errors.address.map((err, i) => (
                <p key={i} className="text-sm text-red-500">{err}</p>
            ))}

            <div className="text-lg font-bold">Phương thức thanh toán:</div>
            <div className="relative w-full">
                <select
                    key={state.fields?.paymentMethod?.toString() || 'cod'}
                    name="paymentMethod"
                    className="appearance-none w-full border border-gray-300 rounded-md p-2 pr-10 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    defaultValue={state.fields?.paymentMethod?.toString() ?? "cod"}
                >
                    {PAYMENTMETHOD.map((item) => {
                        return (<option key={item.id} value={item.id}>{item.name}</option>);
                    })}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            <div className="mt-5 flex flex-row gap-3 justify-start items-start">
                <input name="policy" className="mt-1" type="checkbox" id="policy" defaultChecked={state.fields?.policy?.toString() === "on"} />
                <label htmlFor="policy">Tôi đồng ý với Chính sách xử lý dữ liệu cá nhân của TechHouse</label>
            </div>
            {state?.errors?.policy && state.errors.policy.map((err, i) => (
                <p key={i} className="text-sm text-red-500">{err}</p>
            ))}

            {/* Hiển thị lỗi chung từ server */}
            {state?.message &&
                <p
                    className={clsx(
                        {
                            "text-sm text-red-500": !state?.sussess,
                            "text-sm text-blue-500": state?.sussess,
                        }
                    )}
                >
                    {state.message}
                </p>}

            <div className="w-full px-3 mt-5 flex flex-col items-center gap-3">
                <SubmitButton />
            </div>
        </form >
    );
}