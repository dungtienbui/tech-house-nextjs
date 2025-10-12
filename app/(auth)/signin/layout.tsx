
export default async function SignInLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="pt-44 min-[800px]:pt-36 w-screen flex flex-col items-center">{children}</div>
    );
}
