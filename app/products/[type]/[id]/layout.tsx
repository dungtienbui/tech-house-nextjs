
export default function ProductDetailLayout(
    { children, tabs }: { children: React.ReactNode, tabs: React.ReactNode }
) {
    return (
        <div>
            {children}
            {tabs}
        </div>
    );
}