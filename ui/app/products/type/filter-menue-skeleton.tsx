import { Funnel } from "lucide-react";

export default function FilterMenuSkeleton() {
    return (
        <div
            className="relative w-full"
        >
            <div className="flex flex-row gap-3">
                <button
                    type="button"
                    className="relative shimmer bg-gray-100 py-2 px-3 border rounded-lg"
                >
                    <Funnel className="inline" />
                    <p className="inline pl-1">
                        Lọc
                    </p>
                </button>
                <div className="block w-[100px] bg-gray-100 rounded-xl"></div>
                <div className="block w-[100px] bg-gray-100 rounded-xl"></div>
                <div className="block w-[100px] bg-gray-100 rounded-xl"></div>
            </div>

        </div>
    )
}