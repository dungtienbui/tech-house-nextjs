import { EmblaCarousel } from "../../components/embla-carousel/carousel";
import ProductOptionForm from "./product-option-form";
import { notFound } from "next/navigation";

interface props {
    id: string;
}

export default function ProductOverview({ id }: props) {

    const product = products.find(item => item.id === id);
    
    if (!product) {
        notFound();
    }
    
    const productVariantsParam = productVariants.filter(item => item.productId === product.productId)

    const imgTmp = [product.featuredImage].concat(product.image.filter(item => item.id !== product.featuredImage.id));

    const images = imgTmp.map((item) => {
        const imageName = `This is an image of ${product.name} product of ${product.brand} brand added in ${item.dateAdded.toLocaleString()}`;
        return {
            id: item.id,
            name: imageName,
            href: item.link
        }
    });

    return (
        <div className="flex flex-col md:flex-row justify-start items-stretch gap-10">
            <div className="flex-1">
                <EmblaCarousel images={images} />
            </div>
            <div className="flex-1">
                <ProductOptionForm product={product} productVariants={productVariantsParam} />
            </div>
        </div >
    );
}