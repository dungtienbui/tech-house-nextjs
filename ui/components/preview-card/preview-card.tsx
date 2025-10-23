import Image from "next/image";
import Link from "next/link";
import BuyNowButton from "./buy-now-button";
import Star from "./star";
import { Circle } from "lucide-react";

interface props {
  variantId: string;
  title: string;
  subtitle: string;
  price: string;
  navTo: string;
  image: {
    href: string;
    alt: string;
  }
  review?: { star: number; count: number }
}

export default function PreviewCard({ title, subtitle, image, price, navTo, variantId, review }: props) {

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
            <div className="font-medium text-sm line-clamp-2 h-10">{title}</div>
            <div className="text-xs">{subtitle}</div>
          </div>
          <div className="text-red-500 font-bold">${price}</div>
          {
            review && (
              <div className="flex flex-row gap-1 justify-start items-center">
                <Star fillPercentage={review.star / 5 * 100} size={15} />
                <div className="text-sm">{parseFloat(String(review.star))}</div>
                <Circle size={5} />
                <div className="text-sm text-gray-500">{review.count} đánh giá</div>
              </div>
            )
          }
        </div>
        <BuyNowButton id={variantId} quantity={1} />
      </div>
    </Link>
  );
}