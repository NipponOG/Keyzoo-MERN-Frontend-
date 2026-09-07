// pages/index.tsx or components/HomeHero.tsx
// import HeroSlider from '@/components/HeroSlider';
// import PromoBannerGrid from '@/components/PromoBannerGrid';
// import CategoryGrid from '@/components/CategoryGrid';
import ProductCarousel from '@/components/ProductCarousel';
import PlatformSlider from '@/components/PlatformSlider';
import DrifflePlusSection from '@/components/DrifflePlusSection';
import DiscoverByPrice from '@/components/DiscoverByPrice';
import NewsletterSection from '@/components/NewsletterSection';
import BeastSelling from '@/components/BeastSelling';
import ProductGiftCardCarousel from '@/components/ProductGiftCardCarousel';
import PromoBannerOne from '@/components/PromoBannerOne';
import HomeBanner from '@/components/HomeBanner';
import RecentlyViewed from '@/components/RecentlyViewed';
import AdBannerSection from '@/components/AdBannerSection';
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Head from 'next/head';
import { fetchFromStrapi } from "@/lib/strapi";

// export async function getServerSideProps({ }) {

//   const siteSeo = await fetchFromStrapi(
//     `api/site-settings?populate=*`
//   );

//   return {
//     props: {
//       siteSeo: siteSeo?.data?.[0] || null,
//     },
//   };
// }

const HomeHero = ({ siteSeo }) => {
  console.log("siteSeo", siteSeo);

  return (
    <>
      <Head>
        <title>
          Buy Digital Games, Gift Cards & Software Keys | Keyzoo
          {/* {siteSeo?.seo?.metaTitle} */}
        </title>

        <meta
          name="description"
          // content={siteSeo?.seo?.metaDescription}
        />

        <link
          rel="canonical"
          href="https://keyzoo.com"
        />
      </Head>

      {/* Homepage content */}

      <div className="px-4 md:px-10 py-8">
        <HomeBanner />
        <RecentlyViewed />
        <ProductCarousel />
        <PlatformSlider />
        <BeastSelling />
        {/* <DrifflePlusSection/> */}
        <AdBannerSection />
        <ProductGiftCardCarousel />
        {/* <TestingSlider /> */}
        <div className='flex justify-center items-center'><DiscoverByPrice /></div>
        <NewsletterSection />
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default HomeHero;
