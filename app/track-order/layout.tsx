export default async function TrackOrderLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="pt-40 min-[800px]:pt-32 w-screen">
            {children}
        </div>
    );
}
