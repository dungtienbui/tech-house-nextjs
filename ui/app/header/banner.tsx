import Image from "next/image";

export default function Banner( {imageLink, alt} : {imageLink: string, alt: string} ) {
    return (
        <Image src={imageLink} width={1000} height={200} alt={alt} className="w-full" />
    );

}

// https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ac/8c/ac8cdc4164298c52561dd2232fce2200.png