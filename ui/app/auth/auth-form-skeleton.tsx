export default function AuthFormSkeleton({ type }: { type: "signin" | "signup" }) {

    return (
        <div
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6 border border-gray-100"
        >
            <div className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
                Đăng nhập
            </div>

            {/* Phone */}
            <div className="space-y-2">
                <div
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Số điện thoại
                </div>
                <div
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Password */}
            <div className="space-y-2">
                <div
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Mật khẩu
                </div>
                <div
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Submit */}
            <div
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 transition-all"
            >
            </div>

            {/* Chuyển sang đăng ký */}
            <div className="text-center">
                <span>
                    Bạn chưa có tài khoản?{' '}
                    <span
                        className="font-bold text-blue-600 hover:underline"
                    >
                        Đăng ký
                    </span>
                </span>
            </div>
        </div>
    )
}
