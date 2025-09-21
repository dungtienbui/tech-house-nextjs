import clsx from "clsx";

const tabs: {
    id: "description" | "specs" | "reviews";
    label: string;
}[] = [
        { id: "description", label: "MÔ TẢ" },
        { id: "specs", label: "THÔNG SỐ KĨ THUẬT" },
        { id: "reviews", label: "ĐÁNH GIÁ" },
    ];


export function ProductInformationSkeleton() {
    return (
        <div className="flex flex-col gap-1 sm:gap-2 md:gap-5">
            <div className="w-full">
                <div className="flex flex-row justify-center gap-10 items-stretch">
                    <div className="hidden md:block flex-1" />
                    {tabs.map((tab) => {
                        return (
                            <div
                                key={tab.id}
                                className={clsx(
                                    "uppercase min-w-fit",
                                    "text-gray-500 text-center",
                                    {
                                        "flex-1 sm:flex-2": tab.id === "specs",
                                        "flex-1": tab.id !== "specs",
                                    },
                                )}
                            >
                                {tab.label}
                            </div>
                        )
                    })}
                    <div className="hidden sm:block flex-1" />
                </div>
                <div className="w-full h-0 border-t border-gray-300" />
            </div>
            <div className="px-5 lg:px-15 xl:px-32">
                <div className="relative shimmer w-full min-h-24 rounded-xl p-5 md:p-10 bg-gray-300"></div>
            </div>
        </div>
    );
}
