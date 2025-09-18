import Link from "next/link";

export default function HeaderLogo() {
    return (
        <div className="flex-1 flex justify-start items-center">
            <Link href="/" className="text-3xl font-bold text-white">TechHouse</Link>
        </div>
    );
}