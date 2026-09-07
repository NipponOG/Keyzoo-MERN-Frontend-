import { fetchFromStrapi } from '@/lib/strapi';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import React from 'react';
import { useIsMobile } from '@/hook/useIsMobile';
import Skeleton from 'react-loading-skeleton';
import { getStrapiMedia } from '@/lib/getStrapiMedia';

export default function CategoryGrid() {

  const [categoriesBanner, setCategoriesBanner] = useState([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function getCategoryBanners() {
      try {

        // const res = await fetchFromStrapi('api/category-banners?populate=*');
        // setCategoriesBanner(res.data || []);

        const res = await fetch('/api/home/category-banners');

        const data = await res.json();

        setCategoriesBanner(data || []);

      } catch (err) {
        console.error('Failed to load category banners:', err);
      }
    }

    getCategoryBanners();
  }, []);


  if (!categoriesBanner.length) {
    return (
      // <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Skeleton height={210} borderRadius={16} />
        <Skeleton height={210} borderRadius={16} />
        <Skeleton height={210} borderRadius={16} />
      </div>
      // </SkeletonTheme>
    );
  }


  return (
    <section className="mt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">

        {categoriesBanner.map((item) => {

          // const imgUrl = isMobile
          //   ? getStrapiMedia(item.mobileImage?.url)
          //   : getStrapiMedia(item.desktopImage?.url);

          const imgUrl = getStrapiMedia(
            item.desktopImage?.url,
            {
              width: 1600,
            }
          );

          const blurUrl = getStrapiMedia(
            item.desktopImage?.url,
            {
              blur: true,
            }
          );

          const linkHref = item.subtitle && item.subtitle.trim() !== '' ? item.subtitle : '#';

          return (
            <Link key={item.id} href={linkHref} className="group">
              <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-[210px]">
                <ProductCardImage
                  imgUrl={imgUrl}
                  blurUrl={blurUrl}
                  alt={item.title}
                  fill
                  className="object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  {/* <span className="bg-white text-black text-sm font-semibold px-4 py-1 rounded-full w-fit">
                    {item.button}
                  </span> */}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const ProductCardImage = ({ imgUrl, blurUrl, title, available }) => {

  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* BLUR IMAGE */}
      <Image
        src={blurUrl}
        alt=""
        fill
        className={`
          object-cover scale-110 blur-xl
          transition-opacity duration-500
          ${loaded ? "opacity-0" : "opacity-100"}
        `}
      />

      {/* REAL IMAGE */}
      <Image
        src={imgUrl}
        alt={title}
        fill
        onLoad={() => setLoaded(true)}
        className={`object-center transition-all duration-700 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
          
        `}
      />
    </>
  );
}