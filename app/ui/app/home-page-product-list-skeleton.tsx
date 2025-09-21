import PreviewCardSkeleton from "../components/preview-card/preview-card-skeleton";

export default async function HomePageProductListSkeleton() {

    return (
        <div className="w-full px-4">
            <div className="mb-3">
                <div className="h-5 max-w-56 bg-gray-300 mb-1 relative shimmer"></div>
                <div className="min-w-60 max-w-1/5 h-0 border border-sky-700"></div>
            </div>
            <div
                className="overflow-x-scroll grid grid-flow-col auto-cols-min gap-2 md:gap-5 pb-3"
            >
                <PreviewCardSkeleton />
                <PreviewCardSkeleton />
                <PreviewCardSkeleton />
                <PreviewCardSkeleton />
                <PreviewCardSkeleton />
                <PreviewCardSkeleton />
            </div>
        </div>
    );
}
