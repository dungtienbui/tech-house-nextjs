'use client'
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function NavBarScrolled(
    { children }: {
        children: React.ReactNode
    }
) {
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY && lastScrollY > 50) {
                // đang cuộn xuống
                setShow(false);
            } else {
                // đang cuộn lên
                setShow(true);
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <nav
            className={clsx(
                "fixed top-28 min-[800px]:top-16 left-0 right-0 z-40 bg-white shadow-md transition-transform duration-300",
                show ? "translate-y-0" : "-translate-y-full"
            )}
        >
            {children}
        </nav>
    );
}