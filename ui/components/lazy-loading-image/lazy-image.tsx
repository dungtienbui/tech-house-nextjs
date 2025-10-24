import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

type LazyImageProps = {
    src: string;
    alt: string;
    width: number;
    height: number;
};

export default function LazyImage({ src, alt, width, height }: LazyImageProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative">
            {/* GIF loading hiển thị khi ảnh đang tải */}
            <Image
                src="/image-loading.gif"
                alt="Loading..."
                width={150}
                height={150}
                className={clsx(
                    "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500",
                    {
                        "opacity-0": !isLoading,
                        "opacity-100": isLoading
                    })}
            />

            {/* Ảnh thật */}
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={clsx("transition-opacity duration-500",
                    {
                        "opacity-0": isLoading,
                        "opacity-100": !isLoading
                    })}
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
}
