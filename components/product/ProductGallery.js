
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { getStrapiMedia } from "@/lib/getStrapiMedia";

export default function ProductGallery({ images = [], title }) {
    if (!Array.isArray(images) || images.length === 0) {
        return null;
    }

    return (
        <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={10}
            slidesPerView={1}
            breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 15 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
            }}
            style={{
                "--swiper-navigation-color": "#ffffff",
                "--swiper-navigation-size": "22px",
            }}
            className="w-full select-none"
        >
            {images.map((img, index) => {
                // Support MongoDB string URLs and Strapi media objects
                const imageUrl = typeof img === "string"
                    ? img
                    : img?.url;

                const src = getStrapiMedia(imageUrl);

                if (!src) return null;

                return (
                    <SwiperSlide key={img?.id ?? src}>
                        <Image
                            src={src}
                            alt={
                                img?.name ||
                                `${title} screenshot ${index + 1}`
                            }
                            width={400}
                            height={300}
                            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
                            className="h-[250px] w-full rounded-xl object-cover"
                        />
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
}
