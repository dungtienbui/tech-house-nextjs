'use client'

import { AuthFormState, SigninFormSchema } from '@/lib/definations/data-dto';
import { signIn } from "next-auth/react"
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'; // 👈 1. Import useRouter
import z from 'zod';
import clsx from 'clsx';
import { wait } from '@/lib/utils/funcs';
import { SigninSubmitButton } from './signin-form-submit-button';

export default function SigninForm() {
    const router = useRouter(); // 👈 2. Khởi tạo router
    const [state, setState] = useState<AuthFormState>();

    // Hàm này giờ sẽ là hàm chính xử lý form
    const handleSubmit = async (formData: FormData) => {
        setState(undefined); // Reset state cũ

        // Lấy dữ liệu từ form
        const phone = formData.get('phone');
        const password = formData.get('password');

        // Validate form fields
        const validatedFields = SigninFormSchema.safeParse({ phone, password });

        // Nếu validate thất bại, hiển thị lỗi và dừng lại
        if (!validatedFields.success) {
            setState({
                errors: z.flattenError(validatedFields.error).fieldErrors,
            });
            return;
        }

        try {
            // 4. Gọi signIn với redirect: false
            const result = await signIn("credentials", {
                phone,
                password,
                redirect: false,
            });

            if (result?.ok) {
                // Đăng nhập thành công, tự điều hướng bằng router
                router.push('/user/purchases');
            } else {
                // Đăng nhập thất bại, hiển thị lỗi
                setState({ errors: { other: ["Số điện thoại hoặc mật khẩu không chính xác."] } });
            }

        } catch (error) {
            console.error(error);
            setState({ errors: { other: ["Số điện thoại hoặc mật khẩu không chính xác."] } });
        }
    };

    return (
        // 5. Sử dụng action={handleSubmit}
        <form
            action={handleSubmit}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6 border border-gray-100"
        >
            <div className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
                Đăng nhập
            </div>

            {/* Phone (không cần defaultValue={phone}) */}
            <div className="space-y-2">
                <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Số điện thoại
                </label>
                <input
                    autoComplete="off"
                    id="phone"
                    name="phone"
                    placeholder="098765xxxx"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {state?.errors?.phone?.map((err, i) => (
                    <p key={i} className="text-sm text-red-500">{err}</p>
                ))}
            </div>

            {/* Password */}
            <div className="space-y-2">
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Mật khẩu
                </label>
                <input
                    autoComplete="current-password"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="********"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {state?.errors?.password?.map((err, i) => (
                    <p key={i} className="text-sm text-red-500">{err}</p>
                ))}
            </div>

            {/* Submit */}
            <SigninSubmitButton />

            {/* Other errors */}
            {state?.errors?.other?.map((err, i) => (
                <p key={i} className="text-sm text-red-500">{err}</p>
            ))}

            {/* Chuyển sang đăng ký */}
            <div className="text-center">
                <span>
                    Bạn chưa có tài khoản?{' '}
                    <Link href="/signup" className="font-bold text-blue-600 hover:underline">
                        Đăng ký
                    </Link>
                </span>
            </div>
        </form>
    )
}