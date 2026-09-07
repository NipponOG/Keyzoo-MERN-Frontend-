import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

// const platforms = [
//     {
//         name: '',
//         // img: 'https://steadfast-gem-fdb13b7584.media.strapiapp.com/Rockstar_Games_Logo_caa1722b2e.svg',
//         // img: '/slider-image/Rockstar_Games_Logo_caa1722b2e.svg',
//         img: '/slider-svg/rockstar.svg',
//         bg: '',
//         style: {
//             background: 'linear-gradient(77.76deg, rgb(0, 0, 0) -5.75%, rgb(16, 13, 70) 17.78%, rgb(66, 83, 162) 37.39%, rgb(154, 117, 185) 55.12%, rgb(128, 39, 95) 71.3%, rgb(0, 0, 0) 96.98%)',
//         },
//         className: 'h-[5px] ',
//     },
//     {
//         name: '',
//         // img: 'https://steadfast-gem-fdb13b7584.media.strapiapp.com/ea_082d338eac.svg',
//         // img: '/slider-image/ea_082d338eac.svg',
//         img: '/slider-svg/ea-play.svg',
//         bg: 'bg-[#FF4747]',
//         // className: 'h-[75px]',
//     },
//     {
//         name: '',
//         // img: 'https://steadfast-gem-fdb13b7584.media.strapiapp.com/Steam_icon_logo_svg_325f27f4ae.png',
//         // img: '/slider-image/Steam_icon_logo_svg_325f27f4ae.png',
//         img: '/slider-svg/steam.svg',
//         bg: 'bg-[#0e5d8e]',
//         // className: 'h-[75px]',
//     },
//     {
//         name: '',
//         // img: 'https://steadfast-gem-fdb13b7584.media.strapiapp.com/Xbox_app_logo_3894c51d92.svg',
//         // img: '/slider-image/Xbox_app_logo_3894c51d92.svg',
//         img: '/slider-svg/xbox.svg',
//         bg: 'bg-[#107c10]',
//         // className: 'h-[75px]',
//     },
//     {
//         name: '',
//         // img: 'https://steadfast-gem-fdb13b7584.media.strapiapp.com/playstation_8be52254c2.svg',
//         // img: '/slider-image/playstation_8be52254c2.svg',
//         img: '/slider-svg/psn.svg',
//         bg: 'bg-[#0080FF]',
//         // className: 'h-[75px]',
//     },
//     {
//         name: '',
//         // img: 'https://steadfast-gem-fdb13b7584.media.strapiapp.com/Nintendo_Logo_2016_78bc27d713.png',
//         // img: '/slider-image/Nintendo_Logo_2016_78bc27d713.png',
//         img: '/slider-svg/nintendo.svg',
//         bg: 'bg-red-600',
//         // className: 'h-[75px]',
//     },
//     {
//         name: '',
//         // img: 'https://steadfast-gem-fdb13b7584.media.strapiapp.com/epic_8cfb24ec4b.svg',
//         img: '/slider-image/epic_8cfb24ec4b.svg',
//         // img: '/slider-svg/epic.svg',
//         bg: 'bg-[#1b1775]',
//         // className: 'h-[75px]',
//     },
//     {
//         name: '',
//         // img: 'https://steadfast-gem-fdb13b7584.media.strapiapp.com/platform_e2194d5753.svg',
//         img: '/slider-image/platform_e2194d5753.svg',
//         // img: '/slider-svg/platform.svg',
//         bg: 'bg-[#4e21be]',
//         // className: 'h-[75px]',
//     },

// ];

const platforms = [
    {
        svg: 'rockstar',
        style: {
            background:
                'linear-gradient(77.76deg, rgb(0,0,0) -5.75%, rgb(16,13,70) 17.78%, rgb(66,83,162) 37.39%, rgb(154,117,185) 55.12%, rgb(128,39,95) 71.3%, rgb(0,0,0) 96.98%)',
        },
        logoClass: 'w-[55px] h-[55px]',
    },

    {
        svg: 'ea-play',
        bg: 'bg-[#FF4747]',
        logoClass: 'w-[150px] h-[55px]',
    },

    {
        svg: 'steam',
        bg: 'bg-[#0e5d8e]',
        logoClass: 'w-[160px] h-[55px]',
    },

    {
        svg: 'xbox',
        bg: 'bg-[#107c10]',
        logoClass: 'w-[150px] h-[55px]',
    },

    {
        svg: 'psn',
        bg: 'bg-[#0080FF]',
        logoClass: 'w-[140px] h-[55px]',
    },

    {
        svg: 'nintendo',
        bg: 'bg-red-600',
        logoClass: 'w-[150px] h-[55px]',
    },

    {
        svg: 'epic',
        bg: 'bg-[#1b1775]',
        logoClass: 'w-[90px] h-[90px]',
    },

    {
        svg: 'gogcom',
        bg: 'bg-[#4e21be]',
        logoClass: 'w-[120px] h-[80px]',
    },
];

export default function PlatformSlider() {

    const swiperRef = useRef(null);
    const [loading, setLoading] = useState(true);

    const handleMouseEnter = () => {
        if (swiperRef.current) {
            swiperRef.current.autoplay.stop();

            swiperRef.current.params.speed = 7000;

            swiperRef.current.wrapperEl.style.transitionTimingFunction = 'linear';

            swiperRef.current.autoplay.start();
        }
    };

    const handleMouseLeave = () => {
        if (swiperRef.current) {
            swiperRef.current.autoplay.stop();

            swiperRef.current.params.speed = 2500;

            swiperRef.current.wrapperEl.style.transitionTimingFunction = 'linear';

            swiperRef.current.autoplay.start();
        }
    };

    useEffect(() => {
        // Simulate loading 0.8–1 sec
        const timeout = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timeout);
    }, []);

    // ⭐ Skeleton Loader
    if (loading) {
        return (
            // <SkeletonTheme baseColor="#202020" highlightColor="#444">
                <div className="my-6">
                    {/* <h2 className="text-xl font-bold mb-4 dark:text-white">
                        Explore By Platforms
                    </h2> */}

                    <div className="flex gap-4 overflow-hidden no-scrollbar">
                        {Array(6)
                            .fill(0)
                            .map((_, i) => (
                                <Skeleton
                                    key={i}
                                    height={200}
                                    width={298}
                                    borderRadius={16}
                                    className="rounded-xl"
                                />
                            ))}
                    </div>
                </div>
            // </SkeletonTheme>
        );
    }

    return (
        <div className="my-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Explore By Platforms</h2>
            <Swiper
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="w-full"
                spaceBetween={20}
                slidesPerView={6}
                centeredSlides={false}
                modules={[Autoplay, Pagination, Navigation]}
                autoplay={{
                    delay: 0, // No delay between transitions
                    disableOnInteraction: false,
                }}
                speed={2500} // Smooth continuous speed
                loop={true} // Infinite loop
                allowTouchMove={true}
                freeMode={true} // Enables smooth continuous flow
                grabCursor={true}
                breakpoints={{
                    375: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 6 },
                }}
            >
                {platforms.map((platform, index) => (
                    // <SwiperSlide key={index} className="w-[150px]">
                    //     <div style={platform.style} className={`rounded-xl p-4 ${platform.bg} flex flex-col items-center justify-center h-40 text-white`}>

                    //         {platform.img && (
                    //             <img src={platform.img} alt={platform.name} className={`mb-2 rounded-lg ${platform.className || 'h-[75px]'}`} />
                    //         )}

                    //         {platform.svg && (
                    //             <svg className="h-[75px] w-[75px] mb-2 fill-current text-white">
                    //                 <use href={`/sprite/platform.svg#${platform.svg}`} />
                    //             </svg>
                    //         )}
                    //         <p className="text-sm font-semibold">{platform.name}</p>
                    //     </div>
                    // </SwiperSlide>

                    <SwiperSlide key={index} className="h-auto">
                        <div
                            style={platform.style}
                            className={`
      ${platform.bg}
      h-[150px]
      rounded-2xl
      flex items-center justify-center
      overflow-hidden
      border border-white/10
      transition-all duration-300
      hover:scale-[1.02]
    `}
                        >
                            {/* <img
                                src={platform.img}
                                alt={platform.name}
                                // className="w-auto max-w-[120px] h-[42px] object-contain"
                                className={`object-contain max-h-[55px] ${platform.logoClass || 'w-[140px]'}`}
                                /> */}

                            <svg
                                className={`
                                ${platform.logoClass}
                                fill-current
                                text-white
                                `}
                            >
                                <use href={`/slider-svg/platform.svg#${platform.svg}`} />
                            </svg>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
