'use client'

import { useRouter } from "next/navigation"

export default function GoBackButton() {

    const router = useRouter();

    const handleClick = () => {
        router.back();
    }
    return (
        <button className="text-blue-500 font-bold" onClick={handleClick} type="button">{"< Trở về"}</button>
    )
}