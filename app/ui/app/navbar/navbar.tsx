'use client'
import { useEffect, useState } from 'react';
import NavLinks from './nav-link';
import clsx from 'clsx';

export default function NavBar() {
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
            console.log('window.scrollY: ', window.scrollY);
            setLastScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <div
            className={clsx(
                "fixed top-24 min-[800px]:top-16 left-0 right-0 z-40 bg-white shadow-md transition-transform duration-300",
                show ? "translate-y-0" : "-translate-y-full"
            )}
        >
            <div className="flex flex-row gap-2 px-2 py-1 max-[450px]:pb-2 justify-start md:gap-3 md:pl-20 max-[450px]:overflow-auto">
                <NavLinks />
            </div>
        </div>
    );
}