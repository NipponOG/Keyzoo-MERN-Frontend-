// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import { fetchFromStrapi } from '@/lib/strapi';

// const FullScreenSlider = () => {
//   const [banner, setBanner] = useState(null);

//   useEffect(() => {
//     async function getBanner() {
//       try {
//         const res = await fetchFromStrapi('/hero-banners?populate=image');
//         const first = res.data?.[0];
//         if (first) setBanner(first);
//       } catch (err) {
//         console.error('Failed to fetch banner:', err);
//       }
//     }

//     getBanner();
//   }, []);

//   if (!banner || !banner.image) return null;

//   const imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL}${banner.image.url}`;

//   return (
//     <section className="relative h-[80vh] w-full overflow-hidden">
//       <Image
//         src={imageUrl}
//         alt={banner.title || 'Banner'}
//         fill
//         className="object-cover"
//         priority
//       />
//       <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white text-center px-4">
//         <h1 className="text-4xl md:text-6xl font-bold">{banner.title}</h1>
//         {banner.subtitle && (
//           <p className="text-lg md:text-2xl mt-4">{banner.subtitle}</p>
//         )}
//       </div>
//     </section>
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

import { fetchFromStrapi } from '@/lib/strapi';

const FullScreenSlider = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    async function getBanners() {
      try {
        const res = await fetchFromStrapi('/hero-banners?populate=image');
        const data = res.data || [];
        setBanners(data);
      } catch (err) {
        console.error('Failed to fetch banners:', err);
      }
    }

    getBanners();
  }, []);

  if (!banners.length) return null;

  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="w-full h-full"
      >
        {banners.map((banner) => {
          const imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL}${banner.image?.url}`;

          return (
            <SwiperSlide key={banner.id}>
              <div className="relative w-full h-[80vh]">
                <Image
                  src={imageUrl}
                  alt={banner.title || 'Banner'}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center px-4">
                  <h1 className="text-4xl md:text-6xl font-bold">{banner.title}</h1>
                  {banner.subtitle && (
                    <p className="text-lg md:text-2xl mt-4">{banner.subtitle}</p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default FullScreenSlider;
