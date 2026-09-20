import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';
import useCurrency from '@/hook/useCurrency';
import HoverCard from '@/components/HoverCard';
import OptimizedImage from "@/components/Image/OptimizedImage";

export default function ProductGiftCardCarousel() {

    const { symbol } = useCurrency();
    const [products, setProducts] = useState([]);
    const [notified, setNotified] = useState({});

    const handleNotify = () => {
        console.log("Stock notification is not available yet.");
    };

    useEffect(() => {
        async function getGiftCards() {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL;

                const res = await fetch(
                    `${API_URL}/gift-cards/best-selling`,
                    {
                        cache: 'no-store',
                    }
                );

                if (!res.ok) {
                    throw new Error(
                        'Failed to fetch best selling gift cards'
                    );
                }

                const data = await res.json();

                setProducts(data?.data || []);
            } catch (error) {
                console.error(
                    'Failed to fetch best selling gift cards:',
                    error
                );

                setProducts([]);
            }
        }

        getGiftCards();
    }, []);

    return (
        <section className="my-10">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold dark:text-white">Best Selling Gift Cards</h2>  {/* mb-4 */}

                <div className="flex gap-2">
                    <button className="gift-prev w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white transition items-center justify-center flex">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button className="gift-next w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white transition items-center justify-center flex">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Custom Swiper arrows styling */}
            <style>
                {`
                    .swiper-button-prev,
                    .swiper-button-next {
                        color: #ffffff; /* Tailwind's red-400 */
                        background: transparent !important;
                        padding: 12px;
                        border-radius: 9999px;
                        transition: background-color 0.3s;
                    }
                    .swiper-button-prev:hover,
                        .swiper-button-next:hover {
                        background-color: rgba(0, 0, 0, 0.7);
                        color: #ffffff; /* Tailwind's yellow-400 */
                    }
                    .swiper-pagination-bullet {
                        background: #e5e7eb; /* Tailwind's gray-200 */
                        opacity: 1;
                        width: 10px;
                        height: 10px;
                        margin: 0 6px !important;
                        transition: background-color 0.3s, transform 0.3s;
                    }

                    .swiper-pagination-bullet:hover {
                        background: #ffffff; /* Tailwind's red-400 */
                        transform: scale(1.2);
                    }

                    .swiper-pagination-bullet-active {
                        background: #ffffff; /* Tailwind's yellow-400 */
                    }

                    .gift-prev.swiper-button-disabled,
                    .gift-next.swiper-button-disabled {
                        opacity: 0.3;
                        cursor: not-allowed;
                        pointer-events: none;
                    }

                    @media (max-width: 768px) {
                        .gift-prev,
                        .gift-next {
                            display: none;
                        }
                    }

                `}
            </style>

            <Swiper
                modules={[Navigation]}
                autoplay
                spaceBetween={25}
                slidesPerView={1}
                navigation={{
                    prevEl: ".gift-prev",
                    nextEl: ".gift-next",
                }}
                breakpoints={{
                    375: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 6 },
                }}
                id='swiper'
            // className='max-w-[1500px] mx-auto'
            >
                {products.map((item) => {

                    return (

                        <SwiperSlide key={item._id} className="mb-2 mt-2">
                            {item.available ? (<Link
                                href={`/product/${item.slug}`}
                                // className="block p-1 rounded-lg hover:shadow-md transition bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto"
                                className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative min-w-[200px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1"
                            >
                                <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
                                    {/* {imageUrl && ( */}
                                    <OptimizedImage
                                        src={item.image}
                                        alt={item.title || "Gift Card"}
                                        available={item.available}
                                        sizes="(max-width: 374px) 50vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 16vw"
                                        fill
                                        className="object-center"
                                    />
                                    {/* )} */}

                                    {/* Platform badge */}
                                    {item.platform && (
                                        <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded uppercase">
                                            {item.platform}
                                        </span>
                                    )}

                                    {/* Discount ribbon */}
                                    {item.originalPrice && item.originalPrice > item.price && (
                                        <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
                                            -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                                        </span>
                                    )}
                                </div>
                                <div className='bg-gray-100 dark:bg-black/30 backdrop-blur-sm px-1 py-1 rounded-b-md h-[120px]'>
                                    <HoverCard title={item.title}>
                                        <h3 className="text-sm font-semibold line-clamp-2 px-1.5 mt-1 text-black">
                                            {item.title}
                                        </h3>
                                    </HoverCard>
                                    <h3 className="text-sm font-semibold text-blue-600 px-1.5 mt-0.5">{item.card_region}</h3>
                                    <p className="text-lg text-gray-600 dark:text-gray-300 px-1.5 mt-1 mb-1.5">
                                        {symbol} {Number(item.discountPrice).toFixed(2)}
                                    </p>
                                </div>
                            </Link>) : (<div
                                href={`/product/${item.slug}`}
                                // className="block p-1 rounded-lg hover:shadow-md transition bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto"
                                className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative min-w-[200px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1 cursor-not-allowed"
                            >
                                <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">

                                    <OptimizedImage
                                        src={item.image}
                                        alt={item.title || "Gift Card"}
                                        available={item.available}
                                        sizes="(max-width: 374px) 50vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 16vw"
                                        fill
                                        className="object-center grayscale opacity-60"
                                    />

                                    {/* 🔥 Bottom overlay container */}
                                    <div className="absolute bottom-3 left-0 w-full flex justify-center px-3">

                                        <button onClick={() => handleNotify(item)} disabled={notified[item.id]} className="flex items-center justify-center gap-2 w-full max-w-[85%] bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold py-2.5 rounded-md hover:bg-white/20 transition shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer">
                                            {notified[item.id] ? "✔ Notified" : "🔔 Notify me"}
                                        </button>

                                    </div>

                                    {/* Platform badge */}
                                    {item.platform && (
                                        <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded uppercase">
                                            {item.platform}
                                        </span>
                                    )}

                                    {/* Discount ribbon */}
                                    {item.originalPrice && item.originalPrice > item.price && (
                                        <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
                                            -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                                        </span>
                                    )}
                                </div>
                                <div className='bg-gray-100 dark:bg-black/30 backdrop-blur-sm px-1 py-1 rounded-b-md h-[120px]'>
                                    <HoverCard title={item.title}>
                                        <h3 className="text-sm font-semibold line-clamp-2 px-1.5 mt-1 text-black">
                                            {item.title}
                                        </h3>
                                    </HoverCard>
                                    <h3 className="text-sm font-semibold text-blue-600 px-1.5 mt-0.5">{item.card_region}</h3>
                                    <p className="text-lg text-[#cc0000] font-bold dark:text-gray-300 px-1.5 mt-1 mb-1.5">
                                        Sold Out
                                    </p>
                                </div>
                            </div>)}
                        </SwiperSlide>
                    );
                })}
            </Swiper>
            {/* Show All Button */}
            <div className="flex justify-center mt-8">
                <Link
                    href={`/store/collection/gift-card`}
                    className="px-6 py-2 rounded-full bg-neutral-800 text-white hover:bg-[#1a1a1a] transition"
                >
                    Show All
                </Link>
            </div>
        </section>
    );
}
