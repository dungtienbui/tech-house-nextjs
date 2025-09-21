'use client'

import clsx from "clsx";
import { Funnel, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface props {
    sections: {
        title: string;
        inputName: string;
        options: {
            id: string;
            value: string;
            label: string;
            checked?: boolean;
        }[]
    }[]
}

export default function FilterMenuClientComponent({ sections }: props) {

    const pathname = usePathname();

    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setIsOpen(prev => !prev);
    };

    // Khi mở menu, kiểm tra và cuộn menu lên top viewport height
    useEffect(() => {
        if (isOpen && menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();

            const viewportHeight = window.innerHeight;

            if (rect.top < viewportHeight) {
                const scrollAmount = rect.top - 150;
                window.scrollBy({ top: scrollAmount, behavior: "smooth" });
            }
        }
    }, [isOpen]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (menuRef.current && !menuRef.current.contains(target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const checkedOptions = sections.flatMap((section) => {
        return section.options.filter(option => option.checked === true);
    });

    return (
        <div
            className="relative w-full"
            ref={menuRef}
        >
            <div className="flex flex-row justify-start items-center gap-3">
                <button
                    type="button"
                    className={clsx(
                        "border rounded-lg py-2 px-3",
                        {
                            "text-blue-500 border-blue-300": isOpen || checkedOptions
                            .length > 0,
                            "text-black border-black": !isOpen,
                        }
                    )}
                    onClick={toggleMenu}
                    onBlur={() => {
                        setIsOpen(false);
                    }}
                >
                    <Funnel className="inline" />
                    <p className="inline pl-1">
                        Lọc
                    </p>
                </button>
                <div className="flex-1 flex flex-row gap-2 overflow-x-scroll py-3">
                    {checkedOptions.map((checkedOption) => {
                        return (
                            <div key={checkedOption.id} className="px-3 py-2 border border-gray-300 rounded-full">{checkedOption.label}</div>
                        );
                    })}
                </div>
            </div>

            {
                isOpen && (
                    <div
                        className="right-0 sm:right-auto sm:w-[400px] md:w-[600px] absolute z-30 top-11 left-0 py-5 px-2 rounded-lg border border-gray-300 bg-white shadow-xl"
                    >
                        <form id="filter-form">
                            {
                                sections.map((section) => {
                                    return (
                                        <fieldset
                                            key={section.inputName}
                                            className="flex flex-row flex-wrap gap-2 py-1 px-3 mb-5"
                                        >
                                            <legend className="font-bold">{section.title}</legend>
                                            {
                                                section.options.map((option) => {
                                                    return (
                                                        <label
                                                            key={option.value}
                                                            htmlFor={option.id}
                                                            className={clsx(
                                                                "border border-gray-300 rounded-full px-3 py-2 flex flex-row justify-center items-center gap-1 cursor-pointer",
                                                                "has-[input:checked]:border-blue-500 has-[input:checked]:text-blue-500"
                                                            )}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                id={option.id}
                                                                name={section.inputName}
                                                                value={option.value}
                                                                className="appearance-none"
                                                                defaultChecked={option.checked}
                                                            />

                                                            <span>{option.label}</span>
                                                        </label>
                                                    )
                                                })
                                            }
                                        </fieldset>
                                    )
                                })
                            }

                        </form>
                        <div className="flex flex-row justify-center items-center gap-5">
                            <button
                                onClick={(e) => {
                                    toggleMenu();
                                    e.preventDefault();
                                    const form = document.getElementById("filter-form") as HTMLFormElement | null;
                                    form?.requestSubmit();
                                }}
                                form="filter-form"
                                type="submit"
                                className="px-5 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-800"
                            >
                                Xem kết quả
                            </button>

                            <Link
                                href={pathname}
                                onClick={toggleMenu}
                                type="button"
                                className="px-5 py-2 rounded-md bg-red-500 text-white hover:bg-red-400 active:bg-red-800"
                            >
                                Bỏ lọc
                            </Link>
                        </div>
                        <button onClick={toggleMenu} className="absolute top-2 right-2 border border-red-500 rounded-lg p-1">
                            <X color="red" className="w-5 h-5" />
                        </button>
                    </div>
                )
            }
        </div>
    )
}