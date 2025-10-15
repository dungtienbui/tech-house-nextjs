'use client';

import { useFormStatus } from 'react-dom';
import clsx from 'clsx';

export function SigninSubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            disabled={pending}
            type="submit"
            className={clsx(
                "w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 transition-all",
            )}
        >
            {pending ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
    );
}