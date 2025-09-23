import { fetchImagesOfVariantById } from '@/lib/data/fetch-data';
import { ProductDetailCarouselClientComponent } from './carousel-client';



export async function ProductDetailCarousel({ id }: { id: string }) {
    const images = await fetchImagesOfVariantById(id);


    const carouselImages = images.map((image) => ({
        id: image.image_id,
        name: image.image_alt ? image.image_alt : image.image_caption,
        href: image.image_url
    }));

    return <>
        <ProductDetailCarouselClientComponent images={carouselImages} />
    </>
}
