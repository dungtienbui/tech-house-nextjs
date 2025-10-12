import UserSideBar from "@/ui/app/user/user-sidebar";

export default async function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="pt-44 min-[800px]:pt-36 pb-20 bg-gray-50 w-full px-1 sm:px-4 md:px-6 lg:px-10 flex flex-col gap-3 lg:gap-5">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <UserSideBar />
                    {children}
                </div>
            </div>

        </div>
    );
}
