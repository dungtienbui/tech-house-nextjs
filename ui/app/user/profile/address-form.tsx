'use client';

import { updateAddressAction } from '@/lib/actions/form';
import { Address, AddressFormState } from '@/lib/definations/data-dto';
import clsx from 'clsx';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';


export default function AddressForm(
    {
        address,
    }: {
        address: Address,
    }
) {
    const initialState: AddressFormState = {};
    const [state, formAction] = useActionState(updateAddressAction, initialState);

    const [isReadOnly, setReadOnly] = useState(true);

    return (
        <div>
            <div className="flex justify-between items-center">
                <h3 className="font-bold">Địa chỉ nhận hàng mặc định</h3>
                <div className="text-sm text-gray-600">
                    <button
                        className={clsx(
                            "ml-4 font-semibold hover:cursor-pointer",
                            {
                                "text-blue-500": isReadOnly,
                            }
                        )}
                        onClick={() => setReadOnly(prev => !prev)}
                    >
                        {isReadOnly ? "Chỉnh sửa" : "Huỷ bỏ"}
                    </button>
                </div>
            </div>
            <form action={formAction} className="flex flex-col gap-y-3 py-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Tỉnh/ Thành phố */}
                    <div>
                        <input
                            readOnly={isReadOnly}
                            type="text"
                            name="province"
                            placeholder="Tỉnh/ Thành phố"
                            defaultValue={address.province}
                            className={`w-full rounded-md border px-4 py-3 transition-colors ${state?.errors?.province ? 'border-red-500' : 'border-gray-300'
                                } focus:border-sky-500 focus:outline-none`}
                        />
                        {state?.errors?.province?.map((err, i) => (
                            <p key={i} className="text-sm text-red-500">{err}</p>
                        ))}
                    </div>

                    {/* Phường/ Xã */}
                    <div>
                        <input
                            readOnly={isReadOnly}
                            type="text"
                            name="ward"
                            placeholder="Phường/ Xã"
                            defaultValue={address.street}
                            className={`w-full rounded-md border px-4 py-3 transition-colors ${state?.errors?.ward ? 'border-red-500' : 'border-gray-300'
                                } focus:border-sky-500 focus:outline-none`}
                        />
                        {state?.errors?.ward?.map((err, i) => (
                            <p key={i} className="text-sm text-red-500">{err}</p>
                        ))}
                    </div>
                </div>

                <div>
                    <input
                        readOnly={isReadOnly}
                        type="text"
                        name="street"
                        placeholder="Số Nhà, Tên Đường*"
                        defaultValue={address.ward}
                        className={`w-full rounded-md border px-4 py-3 transition-colors ${state?.errors?.street ? 'border-red-500' : 'border-gray-300'
                            } focus:border-sky-500 focus:outline-none`}
                    />
                    {state?.errors?.street?.map((err, i) => (
                        <p key={i} className="text-sm text-red-500">{err}</p>
                    ))}
                </div>

                {!isReadOnly && <SubmitButton />}


                {/* Hiển thị thông báo chung của form */}
                {state?.errors?.other?.map((err, i) => (
                    <p key={i} className="text-sm text-red-500">{err}</p>
                ))}
                {state?.message && (
                    <p className="mt-2 text-sm text-blue-600">
                        {state.message}
                    </p>
                )}

            </form>
        </div>

    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-fit rounded-md bg-sky-500 px-4 py-3 text-base font-semibold text-white shadow-md transition-transform duration-200 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:bg-sky-400"
        >
            {pending ? 'ĐANG CẬP NHẬT...' : 'CẬP NHẬT'}
        </button>
    );
}
