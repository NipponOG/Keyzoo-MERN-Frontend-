// // components/FullScreenSlider.jsx
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// const FullScreenSlider = ({ banners }) => {
//   return (
//     <div className="w-full h-[90vh] relative">
//       <Swiper
//         modules={[Navigation, Pagination, Autoplay]}
//         navigation
//         pagination={{ clickable: true }}
//         autoplay={{ delay: 5000 }}
//         loop
//         className="w-full h-full"
//       >
//         {banners.map((banner) => {
//           const imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL}/${banner.image}`;
//           return (
//             <SwiperSlide key={banner.id}>
//               <div
//                 className="w-full h-full bg-cover bg-center flex flex-col justify-center items-center text-white text-center px-4"
//                 style={{ backgroundImage: `url(${imageUrl})` }}
//               >
//                 <h2 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
//                   {banner.title}
//                 </h2>
//                 <p className="text-lg md:text-2xl mt-4 drop-shadow-md">
//                   {banner.subtitle}
//                 </p>
//               </div>
//             </SwiperSlide>
//           );
//         })}
//       </Swiper>
//     </div>
//   );
// };

// export default FullScreenSlider;


'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const FullScreenSlider = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API}/hero-banners`);
        const json = await res.json();
        const data = json.data || [];
        setBanners(data);
      } catch (err) {
        console.error('Failed to fetch banners:', err);
      }
    }

    fetchBanners();
  }, []);

  return (
    <section className="relative w-full h-[80vh]">
      {banners.length > 0 && (
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="w-full h-full"
        >
          {banners.map((banner) => {
            const imageUrl = banner.image?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_IMAGE}${banner.image.url}`
              : null;

            return (
              <SwiperSlide key={banner.id}>
                <div className="relative w-full h-[80vh]">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={banner.title || 'Banner'}
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                  <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-bold">
                      {banner.title}
                    </h1>
                    {banner.subtitle && (
                      <p className="text-lg md:text-2xl mt-4">
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </section>
  );
};

export default FullScreenSlider;
