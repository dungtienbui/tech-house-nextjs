export default function PaginationSkeleton() {
    return (
        <div className="w-full flex flex-row justify-center items-center gap-3">
            <div className="relative shimmer rounded-md h-10 w-10 bg-gray-300"></div>
            <div className="relative shimmer flex flex-row gap-1">
                <div className="rounded-l-md h-10 w-10 bg-gray-300"></div>
                <div className="h-10 w-10 bg-gray-300"></div>
                <div className="rounded-r-md h-10 w-10 bg-gray-300"></div>
            </div>
            <div className="relative shimmer rounded-md h-10 w-10 bg-gray-300"></div>
        </div>
    );
}