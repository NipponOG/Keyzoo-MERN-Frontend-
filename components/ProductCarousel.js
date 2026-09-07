import { useEffect, useState } from 'react';
import { fetchFromStrapi } from '@/lib/strapi';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import useCurrency from '@/hook/useCurrency';
import HoverCard from '@/components/HoverCard';
import toast from "react-hot-toast";
import { getStrapiMedia } from '@/lib/getStrapiMedia';
import ProductCardImage from '@/components/ProductCardImage';
import Skeleton from 'react-loading-skeleton';

export default function ProductCarousel() {

    const { symbol } = useCurrency();
    const [products, setProducts] = useState([]);
    const [notified, setNotified] = useState({});

    const handleNotify = async (item) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("jwt");

            if (!user || !token) {
                toast.error("Please login first");
                return;
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}api/stock-alerts`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        data: {
                            product: item.id,
                        },
                    }),
                }
            );

            const data = await res.json();

            // console.log("API RESPONSE:", data);
            // console.log("USER:", user);
            // console.log("PRODUCT:", item);

            if (!res.ok) {
                throw new Error(data.error?.message || "Already subscribed");
            }

            toast.success("We’ll notify you 🔔");

            setNotified((prev) => ({
                ...prev,
                [item.id]: true,
            }));

        } catch (err) {
            console.error(err);
            toast.error(err.message || "Something went wrong");
        }
    };

    useEffect(() => {
        async function getProducts() {
            try {

                // const res = await fetchFromStrapi('api/products?filters[hideRecomend][$eq]=false&populate=*');
                // setProducts(res.data || []);

                const res = await fetch(
                    '/api/home/recommended-products'
                );

                const data = await res.json();

                setProducts(data || []);

            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        }

        getProducts();
    }, []);

    if (!products.length) {
            return (
                <section className="my-10">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 ">
                        <Skeleton height={500} borderRadius={16} />
                        <Skeleton height={500} borderRadius={16} />
                        <Skeleton height={500} borderRadius={16} />
                        <Skeleton height={500} borderRadius={16} />
                        <Skeleton height={500} borderRadius={16} />
                        <Skeleton height={500} borderRadius={16} />
                    </div>
                </section>
            );
        }

    return (
        <section className="my-10">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Recommended For You</h2>
            <Swiper
                // modules={[Navigation]}
                autoplay
                spaceBetween={20}
                slidesPerView={1}
                // navigation
                breakpoints={{
                    375: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 6 },
                }}
            // className='max-w-[1500px] mx-auto'
            >
                {products.map((item) => {
                    //   const { title, slug, price, coverImage } = item.attributes;

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

                    return (
                        <SwiperSlide key={item.id} className='mb-2 mt-2'>
                            {item.Available ? (<Link
                                href={`/product/${item.slug}`}
                                // className="block p-1 rounded-lg hover:shadow-md transition bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto"
                                className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative min-w-[200px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1"
                            >
                                <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
                                    {/* {imageUrl && ( */}
                                    <ProductCardImage
                                        imgUrl={imgUrl}
                                        blurUrl={blurUrl}
                                        available={item.Available}
                                        // alt={item.title}
                                        // fill
                                        // className="object-center"
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
                                    {/* {imageUrl && ( */}
                                    <ProductCardImage
                                        imgUrl={imgUrl}
                                        blurUrl={blurUrl}
                                        available={item.Available}
                                        // alt={item.title}
                                        // fill
                                        // className={`object-center transition ${item.Available ? '' : 'grayscale opacity-60'}`}
                                    />
                                    {/* )} */}

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
        </section>
    );
}

// const ProductCardImage = ({ imgUrl, blurUrl, title, available }) => {

//     const [loaded, setLoaded] = useState(false);

//     return (
//         <>
//             {/* BLUR IMAGE */}
//             <Image
//                 src={blurUrl}
//                 alt=""
//                 fill
//                 className={`
//           object-cover scale-110 blur-xl
//           transition-opacity duration-500
//           ${loaded ? "opacity-0" : "opacity-100"}
//         `}
//             />

//             {/* REAL IMAGE */}
//             <Image
//                 src={imgUrl}
//                 alt={title}
//                 fill
//                 onLoad={() => setLoaded(true)}
//                 className={`object-center transition-all duration-700 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
          
//         `}
//             />
//         </>
//     );
// }
