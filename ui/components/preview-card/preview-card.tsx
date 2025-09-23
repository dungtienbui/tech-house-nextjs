import Image from "next/image";
import Link from "next/link";

interface props {
  title: string;
  subtitle: string;
  price: string;
  navTo: string;
  image: {
    href: string;
    alt: string;
  }
  isPromoting?: boolean;
}

export default function PreviewCard({ title, subtitle, image, price, navTo, isPromoting }: props) {

  return (
    <Link
      className="group border border-gray-300 hover:shadow-md rounded-xl flex flex-col justify-between items-center px-3 py-3 xl:px-5 overflow-clip relative"
      href={navTo}>
      <div className="flex-1 flex justify-center items-center min-h-40 min-w-40">
        <Image
          src={image.href}
          alt={image.alt}
          width={600}
          height={600}
          className="group-hover:transition-transform group-hover:-translate-y-3 translate-y-0 duration-300"
        />
      </div>
      <div className="w-full">
        <div className="mb-2 group-hover:text-blue-500">
          <div className="mb-2">
            <div className="font-medium text-sm">{title}</div>
            <div className="text-xs">{subtitle}</div>
          </div>
          <div className="text-red-500 font-bold">${price}</div>
        </div>
        <button type="button" className="bg-sky-100 text-blue-500 w-full py-2 rounded-md cursor-pointer border border-sky-100 hover:border-sky-500 duration-500">Buy now</button>
      </div>
    </Link>
  );
}