export default function PreviewCardSkeleton() {
    return (
        <div
            className="border border-gray-300 rounded-xl flex flex-col justify-between px-3 py-3 xl:px-5 gap-3 overflow-clip"
        >
            <div className="bg-gray-300 w-40 h-40 relative shimmer"></div>
            <div>
                <div className="h-5 w-2/3 bg-gray-300 mb-1"></div>
                <div className="h-3 w-1/3 bg-gray-300"></div>
            </div>
            <div className="h-5 w-2/3 bg-gray-300 mb-1"></div>
            <div className="relative shimmer bg-gray-100 text-gray-500 text-center w-full py-2 rounded-md border border-gray-100">Buy now</div>
        </div>
    );
}