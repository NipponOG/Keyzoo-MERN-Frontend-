// "use client";

// import { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import Link from "next/link";
// import useCurrency from "@/hook/useCurrency";
// import HoverCard from "@/components/HoverCard";
// import OptimizedImage from "@/components/Image/OptimizedImage";
// import toast from "react-hot-toast";
// import Skeleton from "react-loading-skeleton";

// export default function ProductCarousel() {
//     const { symbol } = useCurrency();

//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [notified, setNotified] = useState({});

//     const handleNotify = async (item) => {
//         try {
//             const user = JSON.parse(localStorage.getItem("user"));
//             const token = localStorage.getItem("jwt");

//             if (!user || !token) {
//                 toast.error("Please login first");
//                 return;
//             }

//             // Stock-alert backend is not migrated yet.
//             // Keep this disabled until the new endpoint is ready.
//             toast.error("Stock alerts are temporarily unavailable.");
//         } catch (error) {
//             console.error("Notify error:", error);
//             toast.error(error.message || "Something went wrong");
//         }
//     };

//     useEffect(() => {
//         async function getProducts() {
//             try {
//                 const API_URL = process.env.NEXT_PUBLIC_API_URL;

//                 const res = await fetch(
//                     `${API_URL}/products/recommended-products`,
//                     {
//                         cache: "no-store",
//                     }
//                 );

//                 if (!res.ok) {
//                     throw new Error("Failed to fetch recommended products");
//                 }

//                 const data = await res.json();

//                 setProducts(data?.data || []);
//             } catch (error) {
//                 console.error(
//                     "Failed to fetch recommended products:",
//                     error
//                 );

//                 setProducts([]);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         getProducts();
//     }, []);

//     if (loading) {
//         return (
//             <section className="my-10">
//                 <h2 className="text-xl font-bold mb-4 dark:text-white">
//                     Recommended For You
//                 </h2>

//                 <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
//                     {Array.from({ length: 6 }).map((_, index) => (
//                         <Skeleton
//                             key={index}
//                             height={500}
//                             borderRadius={16}
//                         />
//                     ))}
//                 </div>
//             </section>
//         );
//     }

//     if (!products.length) {
//         return null;
//     }

//     return (
//         <section className="my-10">
//             <h2 className="text-xl font-bold mb-4 dark:text-white">
//                 Recommended For You
//             </h2>

//             <Swiper
//                 autoplay
//                 spaceBetween={20}
//                 slidesPerView={1}
//                 breakpoints={{
//                     375: {
//                         slidesPerView: 2,
//                     },
//                     768: {
//                         slidesPerView: 3,
//                     },
//                     1024: {
//                         slidesPerView: 6,
//                     },
//                 }}
//             >
//                 {products.map((item) => {
//                     const imageUrl = item.image || "/images/placeholder.png";

//                     const productId = item._id;

//                     if (item.status === "published") {
//                         return (
//                             <SwiperSlide
//                                 key={productId}
//                                 className="mb-2 mt-2"
//                             >
//                                 <Link
//                                     href={`/product/${item.slug}`}
//                                     className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative min-w-[200px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1"
//                                 >
//                                     <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
//                                         <OptimizedImage
//                                             src={imageUrl}
//                                             alt={item.title || "Product"}
//                                             fill
//                                             sizes="(max-width: 374px) 50vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 16vw"
//                                             className="object-center"
//                                         />

//                                         {/* Platform badge */}
//                                         {item.platform && (
//                                             <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded uppercase">
//                                                 {item.platform}
//                                             </span>
//                                         )}

//                                         {/* Discount ribbon */}
//                                         {item.originalPrice &&
//                                             item.originalPrice > item.price && (
//                                                 <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
//                                                     -
//                                                     {Math.round(
//                                                         ((item.originalPrice -
//                                                             item.price) /
//                                                             item.originalPrice) *
//                                                         100
//                                                     )}
//                                                     %
//                                                 </span>
//                                             )}
//                                     </div>

//                                     <div className="bg-gray-100 dark:bg-black/30 backdrop-blur-sm px-1 py-1 rounded-b-md h-[120px]">
//                                         <HoverCard title={item.title}>
//                                             <h3 className="text-sm font-semibold line-clamp-2 px-1.5 mt-1 text-black">
//                                                 {item.title}
//                                             </h3>
//                                         </HoverCard>

//                                         <h3 className="text-sm font-semibold text-blue-600 px-1.5 mt-0.5">
//                                             {item.card_region || item.region}
//                                         </h3>

//                                         <p className="text-lg text-gray-600 dark:text-gray-300 px-1.5 mt-1 mb-1.5">
//                                             {symbol}{" "}
//                                             {Number(
//                                                 item.discountPrice
//                                             ).toFixed(2)}
//                                         </p>
//                                     </div>
//                                 </Link>
//                             </SwiperSlide>
//                         );
//                     }

//                     return (
//                         <SwiperSlide
//                             key={productId}
//                             className="mb-2 mt-2"
//                         >
//                             <div className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative min-w-[200px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1 cursor-not-allowed">
//                                 <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
//                                     <OptimizedImage
//                                         src={imageUrl}
//                                         alt={item.title || "Product"}
//                                         fill
//                                         sizes="(max-width: 374px) 50vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 16vw"
//                                         className="object-center grayscale opacity-60"
//                                     />

//                                     {/* Notify button */}
//                                     <div className="absolute bottom-3 left-0 w-full flex justify-center px-3">
//                                         <button
//                                             onClick={() =>
//                                                 handleNotify(item)
//                                             }
//                                             disabled={notified[productId]}
//                                             className="flex items-center justify-center gap-2 w-full max-w-[85%] bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold py-2.5 rounded-md hover:bg-white/20 transition shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer"
//                                         >
//                                             {notified[productId]
//                                                 ? "✔ Notified"
//                                                 : "🔔 Notify me"}
//                                         </button>
//                                     </div>

//                                     {/* Platform badge */}
//                                     {item.platform && (
//                                         <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded uppercase">
//                                             {item.platform}
//                                         </span>
//                                     )}

//                                     {/* Discount ribbon */}
//                                     {item.originalPrice &&
//                                         item.originalPrice > item.price && (
//                                             <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
//                                                 -
//                                                 {Math.round(
//                                                     ((item.originalPrice -
//                                                         item.price) /
//                                                         item.originalPrice) *
//                                                     100
//                                                 )}
//                                                 %
//                                             </span>
//                                         )}
//                                 </div>

//                                 <div className="bg-gray-100 dark:bg-black/30 backdrop-blur-sm px-1 py-1 rounded-b-md h-[120px]">
//                                     <HoverCard title={item.title}>
//                                         <h3 className="text-sm font-semibold line-clamp-2 px-1.5 mt-1 text-black">
//                                             {item.title}
//                                         </h3>
//                                     </HoverCard>

//                                     <h3 className="text-sm font-semibold text-blue-600 px-1.5 mt-0.5">
//                                         {item.card_region || item.region}
//                                     </h3>

//                                     <p className="text-lg text-[#cc0000] font-bold dark:text-gray-300 px-1.5 mt-1 mb-1.5">
//                                         Sold Out
//                                     </p>
//                                 </div>
//                             </div>
//                         </SwiperSlide>
//                     );
//                 })}
//             </Swiper>
//         </section>
//     );
// }





"use client";

import { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Link from "next/link";
import toast from "react-hot-toast";
import useCurrency from "@/hook/useCurrency";
import HoverCard from "@/components/HoverCard";
import OptimizedImage from "@/components/Image/OptimizedImage";
import Skeleton from "react-loading-skeleton";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const IMAGE_SIZES = "(max-width: 639px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, (max-width: 1535px) 20vw, 16vw";

/* ---------- helpers ---------- */

const toNumber = (v) => {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};

/* ---------- card (same layout as before, one component for both states) ---------- */

function ProductCard({ item, symbol, available, notified, onNotify }) {
    const imageUrl = item.image || "/images/placeholder.png";
    const region = item.card_region || item.region;

    // Shown price is discountPrice (falls back to price); originalPrice is the "was" price.
    const current = toNumber(item.discountPrice ?? item.price);
    const original = toNumber(item.originalPrice);
    const discount =
        current !== null && original !== null && original > current
            ? Math.round(((original - current) / original) * 100)
            : 0;

    const cardClasses = [
        "flex h-full w-full flex-col p-1 rounded-lg relative bg-white dark:bg-[#1a1a1a] shadow-sm dark:shadow-none",
        available
            ? "hover:shadow-lg transition duration-300 transform hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none"
            : "cursor-not-allowed",
    ].join(" ");

    const content = (
        <>
            <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
                <OptimizedImage
                    src={imageUrl}
                    alt={item.title || "Product"}
                    fill
                    sizes={IMAGE_SIZES}
                    className={
                        available
                            ? "object-center"
                            : "object-center grayscale opacity-60"
                    }
                />

                {/* Platform badge */}
                {item.platform && (
                    <span className="absolute top-2 left-2 max-w-[55%] truncate rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white">
                        {item.platform}
                    </span>
                )}

                {/* Discount ribbon */}
                {discount > 0 && (
                    <span
                        aria-label={`${discount}% off`}
                        className="absolute top-2 right-2 rounded-md bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white shadow-md"
                    >
                        -{discount}%
                    </span>
                )}

                {/* Notify button (sold out only) */}
                {!available && (
                    <div className="absolute bottom-3 left-0 flex w-full justify-center px-3">
                        <button
                            type="button"
                            onClick={() => onNotify(item)}
                            disabled={notified}
                            className="flex w-full max-w-[90%] cursor-pointer items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 py-2 text-xs font-semibold text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-default disabled:opacity-70 sm:py-2.5 sm:text-sm"
                        >
                            {notified ? "✔ Notified" : "🔔 Notify me"}
                        </button>
                    </div>
                )}
            </div>

            {/* flex-1 + min-h instead of a fixed height, so text never clips and cards stay equal height */}
            <div className="flex flex-1 min-h-[120px] flex-col gap-1 rounded-b-md bg-gray-100 px-2 py-2 backdrop-blur-sm dark:bg-black/30">
                <HoverCard title={item.title}>
                    <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-gray-900 dark:text-white">
                        {item.title}
                    </h3>
                </HoverCard>

                {region && (
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 sm:text-sm">
                        {region}
                    </p>
                )}

                <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-1">
                    {available ? (
                        <>
                            {current !== null && (
                                <span className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">
                                    {symbol} {current.toFixed(2)}
                                </span>
                            )}
                            {discount > 0 && (
                                <s className="text-xs text-gray-500 sm:text-sm">
                                    {symbol} {original.toFixed(2)}
                                </s>
                            )}
                        </>
                    ) : (
                        <span className="text-base font-bold text-[#cc0000] sm:text-lg">
                            Sold Out
                        </span>
                    )}
                </div>
            </div>
        </>
    );

    return available ? (
        <Link href={`/product/${item.slug}`} className={cardClasses}>
            {content}
        </Link>
    ) : (
        <div className={cardClasses}>{content}</div>
    );
}

function CardSkeleton() {
    return (
        <div className="rounded-lg bg-white p-1 dark:bg-[#1a1a1a]">
            <div className="mb-1.5 aspect-[3/5] w-full animate-pulse rounded-md bg-gray-200 dark:bg-white/10 motion-reduce:animate-none" />
            <div className="min-h-[120px] space-y-2 rounded-b-md bg-gray-100 p-2 dark:bg-black/30">
                <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-white/10 motion-reduce:animate-none" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-white/10 motion-reduce:animate-none" />
                <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-white/10 motion-reduce:animate-none" />
            </div>
        </div>
    );
}

/* ---------- carousel ---------- */

export default function ProductCarousel() {
    const { symbol } = useCurrency();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notified, setNotified] = useState({});

    const handleNotify = useCallback(async (item) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("jwt");

            if (!user || !token) {
                toast.error("Please login first");
                return;
            }

            // Stock-alert backend is not migrated yet.
            // Keep this disabled until the new endpoint is ready.
            // When it is, call it here and then:
            // setNotified((prev) => ({ ...prev, [item._id]: true }));
            toast.error("Stock alerts are temporarily unavailable.");
        } catch (error) {
            console.error("Notify error:", error);
            toast.error(error.message || "Something went wrong");
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        async function getProducts() {
            try {
                const res = await fetch(`${API_URL}/products/recommended-products`, {
                    cache: "no-store",
                    signal: controller.signal,
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch recommended products");
                }

                const data = await res.json();
                setProducts(data?.data || []);
            } catch (error) {
                if (error.name === "AbortError") return;
                console.error("Failed to fetch recommended products:", error);
                setProducts([]);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        getProducts();
        return () => controller.abort();
    }, []);

    const heading = (
        <h2 className="mb-4 text-lg font-bold dark:text-white sm:text-xl">
            Recommended For You
        </h2>
    );

    if (loading) {
        return (
            <section className="my-10" aria-busy="true">
                {heading}
                {/* same column counts as the Swiper breakpoints below */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            height={500}
                            borderRadius={16}
                        />
                    ))}
                </div>
            </section>
        );
    }

    if (!products.length) return null;

    return (
        <section className="my-10">
            {heading}

            <Swiper
                modules={[Autoplay]}
                autoplay={{
                    delay: 4000,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: false,
                }}
                rewind
                spaceBetween={12}
                slidesPerView={2}
                breakpoints={{
                    640: { slidesPerView: 3, spaceBetween: 16 },
                    1024: { slidesPerView: 4, spaceBetween: 20 },
                    1280: { slidesPerView: 5, spaceBetween: 20 },
                    1536: { slidesPerView: 6, spaceBetween: 20 },
                }}
            >
                {products.map((item) => (
                    <SwiperSlide key={item._id} className="!h-auto py-2">
                        <ProductCard
                            item={item}
                            symbol={symbol}
                            available={item.status === "published"}
                            notified={Boolean(notified[item._id])}
                            onNotify={handleNotify}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}