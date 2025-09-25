import Breadcrumbs from "@/ui/components/breadcrumbs/breadcrumbs";

export default async function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="pt-44 min-[800px]:pt-36 pb-20 bg-gray-50 w-full px-1 sm:px-4 md:px-6 lg:px-10 flex flex-col gap-3 lg:gap-5">
            {children}
        </div>
    );
}
