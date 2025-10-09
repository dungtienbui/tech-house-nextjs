import { fetchVariantImages } from '@/lib/data/fetch-data';
import { CarouselClientComponent } from './carousel-client';



export async function Carousel({ id }: {
    id: string;
}) {

    const images = await fetchVariantImages(id);

    const carouselImages = images.map((image) => ({
        id: image.image_id,
        name: image.image_alt ? image.image_alt : image.image_caption,
        href: image.image_url
    }));

    return (
        <>
            <CarouselClientComponent images={carouselImages} />
        </>
    );
}
