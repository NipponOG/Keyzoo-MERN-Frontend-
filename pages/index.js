import ProductCarousel from '@/components/ProductCarousel';
import PlatformSlider from '@/components/PlatformSlider';
import DiscoverByPrice from '@/components/DiscoverByPrice';
import NewsletterSection from '@/components/NewsletterSection';
import BeastSelling from '@/components/BeastSelling';
import ProductGiftCardCarousel from '@/components/ProductGiftCardCarousel';
import HomeBanner from '@/components/HomeBanner';
import RecentlyViewed from '@/components/RecentlyViewed';
import AdBannerSection from '@/components/AdBannerSection';
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Head from 'next/head';
import { fetchFromStrapi } from "@/lib/strapi";

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
        <AdBannerSection />
        <ProductGiftCardCarousel />
        <div className='flex justify-center items-center'><DiscoverByPrice /></div>
        <NewsletterSection />
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default HomeHero;
