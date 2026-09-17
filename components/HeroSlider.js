'use client';

import { useEffect, useState } from 'react';
import OptimizedImage from "@/components/Image/OptimizedImage";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import Skeleton from 'react-loading-skeleton';

const HeroSlider = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    async function getBanners() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const res = await fetch(`${API_URL}/home/hero`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch hero banners');
        }

        const data = await res.json();

        setBanners(data?.data || []);
      } catch (error) {
        console.error('Hero banners fetch error:', error);
        setBanners([]);
      }
    }

    getBanners();
  }, []);

  if (!banners.length) {
    return (
      <div className="rounded-2xl overflow-hidden">
        <Skeleton height={500} borderRadius={16} />
      </div>
    );
  }

  return (
    <>
      {/* Custom Swiper arrows / pagination styling */}
      <style>{`
        .swiper-button-prev,
        .swiper-button-next {
          color: #ffffff;
          background: transparent !important;
          padding: 12px;
          border-radius: 9999px;
          transition: background-color 0.3s;
        }

        .swiper-button-prev::after,
        .swiper-button-next::after {
          font-size: 30px !important;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .swiper-button-prev,
          .swiper-button-next {
            display: none !important;
          }
        }

        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background-color: rgba(0, 0, 0, 0.7);
          color: #ffffff;
        }

        .swiper-pagination-bullet {
          background: #e5e7eb;
          opacity: 1;
          width: 10px;
          height: 10px;
          margin: 0 6px !important;
          transition:
            background-color 0.3s,
            transform 0.3s;
        }

        .swiper-pagination-bullet:hover {
          background: #ffffff;
          transform: scale(1.2);
        }

        .swiper-pagination-bullet-active {
          background: #ffffff;
        }
      `}</style>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={banners.length > 1}
        pagination={{ clickable: true }}
        navigation
        className="w-full h-full rounded-xl overflow-hidden"
      >
        {banners.map((banner, index) => {
          if (!banner.image) return null;

          return (
            <SwiperSlide key={banner._id}>
              <div className="relative h-[250px] sm:h-[320px] md:h-[400px] lg:h-[500px] w-full">
                <OptimizedImage
                  src={banner.image}
                  alt={banner.title || "Keyzoo banner"}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-center object-center"
                />

                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6">
                  <h2 className="text-4xl md:text-5xl font-extrabold mb-3">
                    {/* {banner.title} */}
                  </h2>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default HeroSlider;