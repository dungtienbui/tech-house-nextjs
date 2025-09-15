import { AwardIcon, CreditCardIcon, HandshakeIcon, HeadsetIcon, TruckIcon } from "lucide-react";
import { EmblaCarousel } from "../../components/embla-carousel/carousel";
import ProductOptionForm from "./product-option-form";
import ProductPolicy from "./product-policy";
import ShipingInfomation from "./shiping-info";

export default function ProductOverview() {

    const images = [
        {
            id: "1",
            name: "Image1",
            href: "https://cdn.tgdd.vn/Products/Images/42/303812/Slider/iphone-15-slider-3--2--1020x570.png"
        },
        {
            id: "2",
            name: "Image2",
            href: "https://cdn.tgdd.vn/Products/Images/42/331204/Slider/galaxy-a16-5g-1-4251x2375.jpg"
        },
        {
            id: "3",
            name: "Image3",
            href: "https://cdn.tgdd.vn/Products/Images/5698/331493/Slider/vi-vn-mac-mini-m4-16gb-256gb-sld-nw-1.jpg"
        },
        {
            id: "4",
            name: "Image4",
            href: "https://cdn.tgdd.vn/Products/Images/44/335362/Slider/vi-vn-macbook-air-13-inch-m4-16gb-256gb-slider-1.jpg"
        },
    ];



    return (
        <div className="flex flex-row justify-start items-start gap-10">
            <div className="flex-1 flex flex-col gap-5">
                <EmblaCarousel images={images} />
                <ProductPolicy />
            </div>
            <div className="flex-1 flex flex-col gap-10">
                <ProductOptionForm />
                <ShipingInfomation />
            </div>
        </div >
    );
}