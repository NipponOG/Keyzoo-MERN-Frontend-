import { useEffect, useState } from 'react';
import { fetchFromStrapi } from '@/lib/strapi';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import Link from 'next/link';
import useCurrency from '@/hook/useCurrency';
import HoverCard from '@/components/HoverCard';
import Skeleton from 'react-loading-skeleton';
import { getStrapiMedia } from '@/lib/getStrapiMedia';
import ProductCardImage from '@/components/ProductCardImage';
import { HugeiconsIcon } from '@hugeicons/react';
import { MultiplicationSignSquareIcon } from '@hugeicons/core-free-icons';

export default function BeastSelling() {

    const { symbol } = useCurrency();
    const [products, setProducts] = useState([]);
    const [notified, setNotified] = useState({});
    const [showAllModal, setShowAllModal] = useState(false);

    useEffect(() => {
        async function getProducts() {
            try {

                // const res = await fetchFromStrapi('api/products?filters[isBestSeller][$eq]=true&populate=*');
                // setProducts(res.data || []);

                const res = await fetch(
                    '/api/home/best-selling'
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
        <>
            <section className="my-10">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Best Selling Games</h2>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4  ">
                    {products.slice(0, 6).map((item) => {
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
                            <div key={item.id} className='mb-2 mt-2'>
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
                                            title={item.title}
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
                                            <h3 className="text-sm font-semibold line-clamp-2 px-1.5 mt-1 text-black">{item.title}</h3>
                                        </HoverCard>
                                        <h3 className="text-sm font-semibold text-[#0076CE] px-1.5 mt-0.5">{item.card_region}</h3>
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
                                            blurSrc={blurUrl}
                                            title={item.title}
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
                                            <h3 className="text-sm font-semibold line-clamp-2 px-1.5 mt-1 text-black">{item.title}</h3>
                                        </HoverCard>
                                        <h3 className="text-sm font-semibold text-[#0076CE] px-1.5 mt-0.5">{item.card_region}</h3>
                                        <p className="text-lg text-[#cc0000] font-bold dark:text-gray-300 px-1.5 mt-1 mb-1.5">
                                            Sold Out
                                        </p>
                                    </div>
                                </div>)}
                            </div>
                        );
                    })}
                </div>

                {/* Show All Button */}
                {/* <div className="flex justify-center mt-8">
                <Link
                    href={`/store/collection/best-selling`}
                    className="px-6 py-2 rounded-full bg-neutral-800 text-white hover:bg-[#1a1a1a] transition"
                >
                    Show All
                </Link>
            </div> */}

                {products.length > 6 && (
                    <div className="flex justify-center mt-8">
                        <button
                            type="button"
                            onClick={() => setShowAllModal(true)}
                            className="
                px-6
                py-2.5
                rounded-full
                bg-neutral-800
                text-white
                hover:bg-neutral-700
                transition-all
                duration-300
                cursor-pointer
            "
                        >
                            Show All
                        </button>
                    </div>
                )}

            </section>

            {showAllModal && (
                <div
                    className="
            fixed
            inset-0
            z-[100]
            bg-black/80
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
        "
                    onClick={() => setShowAllModal(false)}
                >
                    <div
                        className="
                relative
                w-full
                max-w-[1500px]
                max-h-[90vh]
                bg-[#111]
                rounded-2xl
                border
                border-white/10
                shadow-2xl
                overflow-hidden
            "
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* HEADER */}
                        <div
                            className="
                    sticky
                    top-0
                    z-20
                    flex
                    items-center
                    justify-between
                    px-6
                    py-4
                    bg-[#111]/95
                    backdrop-blur-md
                    border-b
                    border-white/10
                "
                        >
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white">
                                    Best Selling Games
                                </h2>

                                <p className="text-sm text-gray-400 mt-1">
                                    Showing up to 30 best selling games
                                </p>
                            </div>

                            {/* CLOSE */}
                            <button
                                type="button"
                                onClick={() => setShowAllModal(false)}
                                className="
                        w-10
                        h-10
                        rounded-full
                        bg-white/10
                        hover:bg-white/20
                        text-white
                        flex
                        items-center
                        justify-center
                        text-xl
                        transition
                        cursor-pointer
                    "
                                aria-label="Close"
                            >
                                <HugeiconsIcon icon={MultiplicationSignSquareIcon} size={32}/>
                            </button>
                        </div>


                        {/* PRODUCTS */}
                        <div className="overflow-y-auto max-h-[calc(90vh-90px)] p-6">

                            <div
                                className="
                        grid
                        grid-cols-2
                        sm:grid-cols-3
                        md:grid-cols-4
                        lg:grid-cols-5
                        xl:grid-cols-6
                        gap-4
                    "
                            >
                                {products.slice(0, 30).map((item) => {

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
                                        <div
                                            key={`modal-${item.id}`}
                                            className="mb-2"
                                        >

                                            {item.Available ? (
                                                <Link
                                                    href={`/product/${item.slug}`}
                                                    onClick={() =>
                                                        setShowAllModal(false)
                                                    }
                                                    className="
                                            block
                                            p-1
                                            rounded-lg
                                            bg-white
                                            dark:bg-[#1a1a1a]
                                            relative
                                            shadow-sm
                                            hover:shadow-lg
                                            transition-transform
                                            duration-300
                                            hover:-translate-y-1
                                        "
                                                >

                                                    <div className="
                                            relative
                                            w-full
                                            aspect-[3/5]
                                            mb-1.5
                                            rounded-md
                                            overflow-hidden
                                        ">

                                                        <ProductCardImage
                                                            imgUrl={imgUrl}
                                                            blurUrl={blurUrl}
                                                            available={item.Available}
                                                            title={item.title}
                                                        />

                                                        {item.platform && (
                                                            <span className="
                                                    absolute
                                                    top-2
                                                    left-2
                                                    bg-black/80
                                                    text-white
                                                    text-[10px]
                                                    px-2
                                                    py-0.5
                                                    rounded
                                                    uppercase
                                                ">
                                                                {item.platform}
                                                            </span>
                                                        )}

                                                        {item.originalPrice &&
                                                            item.originalPrice > item.price && (
                                                                <span className="
                                                        absolute
                                                        top-2
                                                        right-2
                                                        bg-red-600
                                                        text-white
                                                        text-[10px]
                                                        px-2
                                                        py-0.5
                                                        rounded
                                                    ">
                                                                    -
                                                                    {Math.round(
                                                                        ((item.originalPrice - item.price) /
                                                                            item.originalPrice) *
                                                                        100
                                                                    )}
                                                                    %
                                                                </span>
                                                            )}
                                                    </div>


                                                    <div className="
                                            bg-gray-100
                                            dark:bg-black/30
                                            backdrop-blur-sm
                                            px-1
                                            py-1
                                            rounded-b-md
                                            h-[120px]
                                        ">

                                                        <HoverCard title={item.title}>
                                                            <h3 className="
                                                    text-sm
                                                    font-semibold
                                                    line-clamp-2
                                                    px-1.5
                                                    mt-1
                                                    text-black
                                                ">
                                                                {item.title}
                                                            </h3>
                                                        </HoverCard>

                                                        <h3 className="
                                                text-sm
                                                font-semibold
                                                text-[#0076CE]
                                                px-1.5
                                                mt-0.5
                                            ">
                                                            {item.card_region}
                                                        </h3>

                                                        <p className="
                                                text-lg
                                                text-gray-600
                                                dark:text-gray-300
                                                px-1.5
                                                mt-1
                                                mb-1.5
                                            ">
                                                            {symbol}{" "}
                                                            {Number(
                                                                item.discountPrice
                                                            ).toFixed(2)}
                                                        </p>

                                                    </div>

                                                </Link>
                                            ) : (

                                                <div
                                                    className="
                                            block
                                            p-1
                                            rounded-lg
                                            bg-white
                                            dark:bg-[#1a1a1a]
                                            relative
                                            shadow-sm
                                            cursor-not-allowed
                                        "
                                                >

                                                    <div className="
                                            relative
                                            w-full
                                            aspect-[3/5]
                                            mb-1.5
                                            rounded-md
                                            overflow-hidden
                                        ">

                                                        <ProductCardImage
                                                            imgUrl={imgUrl}
                                                            blurUrl={blurUrl}
                                                            title={item.title}
                                                            available={item.Available}
                                                        />

                                                        {/* Notify */}
                                                        <div className="
                                                absolute
                                                bottom-3
                                                left-0
                                                w-full
                                                flex
                                                justify-center
                                                px-3
                                            ">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleNotify(item)
                                                                }
                                                                disabled={notified[item.id]}
                                                                className="
                                                        flex
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        w-full
                                                        bg-white/10
                                                        backdrop-blur-md
                                                        border
                                                        border-white/20
                                                        text-white
                                                        text-sm
                                                        font-semibold
                                                        py-2.5
                                                        rounded-md
                                                        hover:bg-white/20
                                                        transition
                                                    "
                                                            >
                                                                {notified[item.id]
                                                                    ? "✔ Notified"
                                                                    : "🔔 Notify me"}
                                                            </button>
                                                        </div>

                                                    </div>

                                                    <div className="
                                            bg-gray-100
                                            dark:bg-black/30
                                            backdrop-blur-sm
                                            px-1
                                            py-1
                                            rounded-b-md
                                            h-[120px]
                                        ">

                                                        <HoverCard title={item.title}>
                                                            <h3 className="
                                                    text-sm
                                                    font-semibold
                                                    line-clamp-2
                                                    px-1.5
                                                    mt-1
                                                    text-black
                                                ">
                                                                {item.title}
                                                            </h3>
                                                        </HoverCard>

                                                        <h3 className="
                                                text-sm
                                                font-semibold
                                                text-[#0076CE]
                                                px-1.5
                                                mt-0.5
                                            ">
                                                            {item.card_region}
                                                        </h3>

                                                        <p className="
                                                text-lg
                                                text-[#cc0000]
                                                font-bold
                                                dark:text-gray-300
                                                px-1.5
                                                mt-1
                                                mb-1.5
                                            ">
                                                            Sold Out
                                                        </p>

                                                    </div>

                                                </div>
                                            )}

                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}












// import { fetchFromStrapi } from "@/lib/strapi";
// import Image from "next/image";
// import Link from "next/link";

// export async function getServerSideProps() {
//     const res = await fetchFromStrapi(
//         "api/best-sellings?populate[products][populate]=*"
//     );

//     // Strapi response may be empty if you don’t have a Best Selling entry
//     const bestSeller = res?.data?.[0] || null;
//     const products = bestSeller?.products || [];

//     return {
//         props: {
//             products,
//         },
//     };
// }


// const getStrapiMedia = (url) => {
//     if (!url) return "";
//     if (url.startsWith("http")) return url;
//     return `${process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL}${url}`;
// };

// export default function BestSelling({ products }) {
//     if (!products || products.length === 0) {
//         return (
//             <section className="my-10">
//                 <h2 className="text-xl font-bold mb-4 dark:text-white">
//                     Best Selling Games
//                 </h2>
//                 <p className="text-gray-500">No products found in Best Selling.</p>
//             </section>
//         );
//     }

//     return (
//         <section className="my-10">
//             <h2 className="text-xl font-bold mb-4 dark:text-white">
//                 Best Selling Games
//             </h2>

//             <div className="grid grid-cols-6 gap-4">
//                 {products.map((item) => {
//                     const attrs = item.attributes;
//                     const imgUrl = attrs?.image?.data?.attributes?.url
//                         ? `${process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL}${attrs.image.data.attributes.url}`
//                         : "/placeholder.png";

//                     return (
//                         <div key={item.id} className="mb-2 mt-2">
//                             <Link
//                                 href={`/product/${attrs.slug}`}
//                                 className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1"
//                             >
//                                 <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
//                                     <Image
//                                         src={imgUrl}
//                                         alt={attrs.title}
//                                         fill
//                                         className="object-center"
//                                     />
//                                 </div>
//                                 <div className="bg-gray-100 dark:bg-black/30 px-1 py-1 rounded-b-md">
//                                     <h3 className="text-sm font-semibold line-clamp-2 px-3 mt-1 text-black">
//                                         {attrs.title}
//                                     </h3>
//                                     <h3 className="text-sm font-semibold text-blue-600 px-3 mt-1">
//                                         {attrs.card_region}
//                                     </h3>
//                                     <p className="text-sm text-gray-600 dark:text-gray-300 px-3 mt-2 mb-2">
//                                         ${attrs.price}
//                                     </p>
//                                 </div>
//                             </Link>
//                         </div>
//                     );
//                 })}
//             </div>
//         </section>
//     );
// }