import React from 'react'
import HeroSlider from '@/components/HeroSlider';
import PromoBannerGrid from '@/components/PromoBannerGrid';
import CategoryGrid from '@/components/CategoryGrid';
import GameBanner from '@/components/GameBanner';

const HomeBanner = () => {
    return (
        <section className="max-w-full mx-auto px-4 md:px-6 lg:px-0 mt-0">
            {/* Top row: Hero + side banners */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-2">
                    <HeroSlider />
                </div>
                <div className="hidden lg:flex flex-col gap-2">
                    <GameBanner />
                    <CategoryGrid />
                </div>
            </div>

            {/* Bottom row: promo banners */}
            <div className="mt-1.5">
                <PromoBannerGrid />
            </div>
        </section>
    );
}

export default HomeBanner