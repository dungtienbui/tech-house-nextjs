
export default async function ProductsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="pt-44 min-[800px]:pt-36 w-screen">{children}</div>
    );
}
