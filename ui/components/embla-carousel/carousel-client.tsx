'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import styles from './carousel.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EmblaCarouselType } from 'embla-carousel';
import LazyImage from '../lazy-loading-image/lazy-image';



export function CarouselClientComponent({ images }: {
    images: {
        id: string;
        name: string;
        href: string;
    }[]
}) {
    if (images.length === 0) {
        return <EmblaCarousel images={[
            {
                id: "0",
                name: "No image for this product!",
                href: "https://johnsoulsby.com/wp-content/themes/johnsoulsby/assets/img/no-product-image.png"
            }
        ]} />
    }
    return <EmblaCarousel images={images} />
}

function EmblaCarousel({ images }: {
    images: {
        id: string;
        name: string;
        href: string;
    }[]
}) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [])

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    const { selectedSnap, snapCount } = useSelectedSnapDisplay(emblaApi)

    return (
        <div className={styles.embla} ref={emblaRef}>
            <div className={styles.embla__container}>
                {images.map((item) => {
                    return <div key={item.id} className={styles.embla__slide}>
                        <LazyImage src={item.href} alt={item.name} width={1000} height={600} />
                    </div>
                })}
            </div>
            <div className={styles.embla__controls}>
                <button className={styles.embla__button} onClick={scrollPrev}>
                    <ChevronLeft />
                </button>
                <button className={styles.embla__button} onClick={scrollNext}>
                    <ChevronRight />
                </button>
            </div>
            <div className={styles.embla__selectd_snap_display_container}>
                <p className={styles.embla__selectd_snap_display_text}>
                    {selectedSnap + 1} / {snapCount}
                </p>
            </div>
        </div>
    )
}


type UseSelectedSnapDisplayType = {
    selectedSnap: number
    snapCount: number
}

export const useSelectedSnapDisplay = (
    emblaApi: EmblaCarouselType | undefined
): UseSelectedSnapDisplayType => {
    const [selectedSnap, setSelectedSnap] = useState(0)
    const [snapCount, setSnapCount] = useState(0)

    const updateScrollSnapState = useCallback((emblaApi: EmblaCarouselType) => {
        setSnapCount(emblaApi.scrollSnapList().length)
        setSelectedSnap(emblaApi.selectedScrollSnap())
    }, [])

    useEffect(() => {
        if (!emblaApi) return

        updateScrollSnapState(emblaApi)
        emblaApi.on('select', updateScrollSnapState)
        emblaApi.on('reInit', updateScrollSnapState)
    }, [emblaApi, updateScrollSnapState])

    return {
        selectedSnap,
        snapCount
    }
}
