import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation } from 'swiper/modules';

import GiftCardProductCard from '@/components/cards/GiftCardProductCard';
import useRecentlyViewed from '@/hook/useRecentlyViewed';

export default function RecentlyViewed() {
    
    const items = useRecentlyViewed();

    if (!items.length) return null;

    return (
        <section className="my-12">
            <h2 className="text-xl font-bold mb-3 dark:text-white">
                Recently Viewed
            </h2>

            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={1.3}
                breakpoints={{
                    640: { slidesPerView: 2.5 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 6 },
                }}
            >
                {items.map(item => (
                    <SwiperSlide key={item.id}>
                        <GiftCardProductCard item={item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
