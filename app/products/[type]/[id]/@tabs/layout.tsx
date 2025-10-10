import { Suspense } from "react";
import TabNavigation from "../../../../../ui/app/products/type/id/tabs/tab-navigation";
import { ProductTabSkeleton } from "@/ui/app/products/type/id/tabs/product-tab-skeleton";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <TabNavigation />
            <div className="px-5 py-5 lg:px-15 xl:px-32">
                <Suspense fallback={<ProductTabSkeleton />}>
                    {children}
                </Suspense>
            </div>
        </div>
    )
}