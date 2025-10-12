'use client'

import { signup } from '@/lib/actions/auth'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useActionState } from 'react'

export default function SignupForm() {
    const [state, action, pending] = useActionState(signup, undefined)

    const param = useSearchParams();
    const callbackUrl = param.get('callbackUrl') || '/user';

    return (
        <form
            action={action}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6 border border-gray-100"
        >
            <div className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
                Đăng ký
            </div>

            {/* redirectTo */}
            <input type="hidden" name="redirectTo" value={callbackUrl} />

            {/* Name */}
            <div className="space-y-2">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Họ và tên
                </label>
                <input
                    autoComplete="off"
                    id="name"
                    name="name"
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {state?.errors?.name?.map((err, i) => (
                    <p key={i} className="text-sm text-red-500">{err}</p>
                ))}
            </div>

            {/* Phone */}
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
                    placeholder="0901234567"
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
                    autoComplete="new-password"
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
            <button
                disabled={pending}
                type="submit"
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 transition-all"
            >
                {pending ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>

            {/* Other errors */}
            {state?.errors?.other?.map((err, i) => (
                <p key={i} className="text-sm text-red-500">{err}</p>
            ))}

            {/* Success message */}
            {state?.message && (
                <p className="text-center text-sm text-green-600">
                    {state.message}
                </p>
            )}

            <div className="text-center">
                <span>
                    Bạn đã có tài khoản?{' '}
                    <Link href="/signin" className="font-bold text-blue-600 hover:underline">
                        Đăng nhập
                    </Link>
                </span>
            </div>
        </form>
    )
}
