import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchFromStrapi } from '@/lib/strapi';
import Skeleton from 'react-loading-skeleton';
import { getStrapiMedia } from '@/lib/getStrapiMedia';

const GameBanner = () => {

  const [banners, setBanners] = useState([]);


  useEffect(() => {
    async function fetchPromoBanners() {
      try {

        // const res = await fetchFromStrapi('api/game-banners?populate=image');
        // setBanners(res.data || []);

        const res = await fetch('/api/home/game-banner');

        const data = await res.json();

        setBanners(data || []);

      } catch (err) {
        console.error('Failed to load promo banners:', err);
      }
    }

    fetchPromoBanners();
  }, []);

  //   const linkUrl = attributes.link?.startsWith('http') ? attributes.link : `https://${attributes.link}`;

  if (!banners.length) {
    return (
      // <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <Skeleton height={280} borderRadius={16} />
      // </SkeletonTheme>
    );
  }


  return (
    <div>
      {banners.map((item) => {

        const imgUrl = getStrapiMedia(
          item.image?.url,
          {
            width: 1600,
          }
        );

        const blurUrl = getStrapiMedia(
          item.image?.url,
          {
            blur: true,
          }
        );

        const linkHref = item.subtitle && item.subtitle.trim() !== '' ? item.subtitle : '#';


        return (
          <div className="flex flex-col gap-4.5">
            <Link key={item.id} href="#">
              <div className="relative h-[280px] rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition">
                <ProductCardImage
                  imgUrl={imgUrl}
                  blurUrl={blurUrl}
                  alt={item.title}
                  fill
                  className="object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  {/* <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-semibold px-4 py-1 rounded-full w-fit">
                    {item.button}
                  </span> */}
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default GameBanner;

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