'use client';

import { useState, useEffect, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useDebouncedCallback } from "use-debounce";
import RecommendedProductCard from "./recommend-product-card";
import clsx from "clsx";
import { Circle, Search } from "lucide-react";
import { NO_PREVIEW } from "@/lib/definations/data-dto";
import { searchBarAction } from "@/lib/actions/search";
import { useRouter } from "next/navigation";

// Component con để quản lý trạng thái loading
function SearchStatus() {
    const { pending } = useFormStatus();

    if (!pending) return null;

    return (
        <div className="flex justify-center items-center gap-5 py-4">
            <Circle className="w-3 h-3 animate-bounce" color="gray" />
            <Circle className="w-3 h-3 animate-bounce [animation-delay:0.2s]" color="gray" />
            <Circle className="w-3 h-3 animate-bounce [animation-delay:0.4s]" color="gray" />
        </div>
    );
}

export default function SearchBar() {
    const [isOpen, setIsOpen] = useState(false);
    const areaRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null); // Ref cho form

    // 1. Sử dụng useActionState với searchBarAction
    const [state, formAction] = useActionState(searchBarAction, { data: [] });

    // 2. Dùng Debounce để tự động submit form khi người dùng gõ
    const debouncedSearch = useDebouncedCallback(() => {
        // Kích hoạt action của form một cách tự động
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    }, 500); // Đợi 500ms sau khi người dùng ngừng gõ

    // Xử lý click bên ngoài để đóng dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (areaRef.current && !areaRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const router = useRouter();

    const handleClickButton = () => {
        if (!formRef.current) {
            return; // Exit if the form ref isn't attached yet
        }

        // 1. Create a FormData object from the form ref
        const formData = new FormData(formRef.current);

        // 2. Get the specific value you need from the form data
        const queryValue = formData.get('search')?.toString() || ''; // Use the `name` attribute of your input

        // 3. Create the URLSearchParams object
        const params = new URLSearchParams();

        // 4. Set the parameter if the value is not empty
        if (queryValue) {
            params.set('query', queryValue);
            params.set('page', "1");
        }

        // 5. Get the final query string
        const queryString = params.toString(); // This will be "query=someValue" or ""

        // Now you can use this queryString, for example:
        router.push(`/products?${queryString}`);
    };

    return (
        <div ref={areaRef} className="relative w-full min-[800px]:flex-1 flex flex-col items-center order-last min-[800px]:order-none">

            {/* 3. Bọc input và button trong thẻ <form> */}
            <form ref={formRef} action={formAction} className="relative w-full md:w-11/12 flex flex-row">
                <input
                    name="search" // Quan trọng: `name` phải khớp với formData.get('search')
                    onChange={debouncedSearch}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === "Tab") setIsOpen(false);
                        if (e.key === "Enter" || e.key === "Return") {
                            setIsOpen(false);
                            handleClickButton();
                        };

                    }}
                    placeholder="Tìm kiếm sản phẩm..."
                    type="search"
                    autoComplete="off"
                    className="w-full bg-gray-50 h-9 px-3 py-1 rounded-full"
                    defaultValue={state.prevQuery}
                />
                <button
                    type="button"
                    onClick={handleClickButton}
                    className="absolute top-0 bottom-0 right-0 px-4 py-1 bg-yellow-300 rounded-r-full hover:cursor-pointer hover:bg-yellow-200"
                >
                    <Search color="black" />
                </button>
            </form>

            {/* 4. Dropdown hiển thị kết quả */}
            <div className={clsx(
                "absolute p-3 top-11 w-full flex flex-col gap-2 border border-blue-300 ring ring-blue-500 rounded-xl bg-white shadow-2xl overflow-auto",
                { "hidden": !isOpen, "block": isOpen }
            )}>
                {/* 5. Dữ liệu và trạng thái được lấy từ `state` */}
                {state.data && state.data.length > 0 ? (
                    state.data.map((rv) => {
                        const optionStr = [
                            rv.ram ? `${rv.ram}GB` : null,
                            rv.storage ? `${rv.storage}GB` : null,
                            rv.switch_type ? `${rv.switch_type} switch` : null,
                            rv.color_name,
                        ].filter(Boolean).join(" / ");
                        const name = `${rv.brand_name} ${rv.product_name} ${optionStr}`;
                        const href = `/products/${rv.product_type}/${rv.variant_id}`;
                        return (
                            <RecommendedProductCard
                                key={rv.variant_id}
                                name={name}
                                href={href}
                                price={rv.variant_price}
                                preview={{
                                    previewURL: rv.preview_image_url ?? NO_PREVIEW.href,
                                    previewAlt: rv.preview_image_alt ?? NO_PREVIEW.alt,
                                }}
                                callBackOnNavigate={() => setIsOpen(false)}
                            />
                        );
                    })
                ) : (
                    // Hiển thị thông báo khi không có kết quả
                    state.message && <div className="text-center text-sm py-4">{state.message}</div>
                )}

                {/* 6. Hiển thị loading và lỗi */}
                <SearchStatus />
                {state.errors && (
                    <div className="text-center text-red-500 text-sm py-2">
                        {state.errors}
                    </div>
                )}
            </div>
        </div>
    );
}