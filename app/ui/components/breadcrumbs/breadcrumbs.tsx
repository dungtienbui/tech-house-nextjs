import { clsx } from 'clsx';
import Link from 'next/link';

interface Breadcrumb {
    label: string;
    href: string;
    active?: boolean;
}

export default function Breadcrumbs({
    breadcrumbs,
}: {
    breadcrumbs: Breadcrumb[];
}) {
    return (
        <nav aria-label="Breadcrumb" className="mb-1 sm:mb-4 md:mb-6block">
            <ol className="flex text-sm md:text-base">
                {breadcrumbs.map((breadcrumb, index) => (
                    <li
                        key={breadcrumb.href}
                        aria-current={breadcrumb.active}
                        className={clsx(
                            breadcrumb.active ? 'text-blue-500 font-bold' : 'text-gray-500',
                        )}
                    >
                        <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                        {index < breadcrumbs.length - 1 ? (
                            <span className="mx-2 inline-block">/</span>
                        ) : null}
                    </li>
                ))}
            </ol>
        </nav>
    );
}