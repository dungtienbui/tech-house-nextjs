import PreviewCardSkeleton from "@/ui/components/preview-card/preview-card-skeleton";

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
        </div>
    );
}
