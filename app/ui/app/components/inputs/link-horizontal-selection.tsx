import clsx from "clsx";
import Link from "next/link";

interface props {
    title: string;
    options: {
        id: string;
        name: string;
        value?: string;
        href: string;
    }[];
    defaultOption: {
        id: string;
    };
    icon?: React.ElementType;
}

export default function LinkHorizontalSelection({ title, options, defaultOption, icon }: props) {

    if (options.length === 0) {
        return <></>;
    }

    const Icon = icon;

    return (
        <div className="w-full h-full flex flex-col gap-3">
            <div className="font-bold">{title}</div>
            <div className="w-full flex flex-row flex-wrap justify-start items-start gap-3">
                {
                    options.map((item) => {
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={clsx(
                                    "flex flex-row gap-1 justify-start items-center border border-gray-300 rounded-xl px-3 py-2",
                                    {
                                        "bg-sky-50 border-sky-300": item.id === defaultOption.id,
                                    }
                                )}
                            >
                                {Icon && (
                                    <Icon
                                        size={24}
                                        fill={item.value}
                                        strokeWidth={1}
                                        color="gray"
                                    />
                                )}
                                <p
                                    className={clsx(
                                        "text-sm",
                                        {
                                            "text-blue-500": item.id === defaultOption.id
                                        }
                                    )}
                                >
                                    {item.name}
                                </p>
                            </Link>
                        )
                    })
                }
            </div>
        </div >
    );
}
