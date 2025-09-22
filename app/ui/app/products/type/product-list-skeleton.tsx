import PreviewCardSkeleton from "@/app/ui/components/preview-card/preview-card-skeleton";
export default async function ProductListSkeleton() {
    return (
        <div className="flex flex-col justify-start items-center gap-5">
            <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-5"
            >
                {[...Array(15)].map((_, i) => (
                    <PreviewCardSkeleton key={i} />
                ))}

            </div>
            <div className="w-full flex flex-row justify-center items-center gap-3">
                <div className="relative shimmer rounded-md h-10 w-10 bg-gray-300"></div>
                <div className="relative shimmer flex flex-row gap-1">
                    <div className="rounded-l-md h-10 w-10 bg-gray-300"></div>
                    <div className="h-10 w-10 bg-gray-300"></div>
                    <div className="rounded-r-md h-10 w-10 bg-gray-300"></div>
                </div>
                <div className="relative shimmer rounded-md h-10 w-10 bg-gray-300"></div>
            </div>
        </div>
    );
}
