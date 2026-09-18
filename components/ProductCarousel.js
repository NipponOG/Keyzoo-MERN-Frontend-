"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";
import useCurrency from "@/hook/useCurrency";
import HoverCard from "@/components/HoverCard";
import OptimizedImage from "@/components/Image/OptimizedImage";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";

export default function ProductCarousel() {
    const { symbol } = useCurrency();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notified, setNotified] = useState({});

    const handleNotify = async (item) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("jwt");

            if (!user || !token) {
                toast.error("Please login first");
                return;
            }

            // Stock-alert backend is not migrated yet.
            // Keep this disabled until the new endpoint is ready.
            toast.error("Stock alerts are temporarily unavailable.");
        } catch (error) {
            console.error("Notify error:", error);
            toast.error(error.message || "Something went wrong");
        }
    };

    useEffect(() => {
        async function getProducts() {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL;

                const res = await fetch(
                    `${API_URL}/products/recommended-products`,
                    {
                        cache: "no-store",
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch recommended products");
                }

                const data = await res.json();

                setProducts(data?.data || []);
            } catch (error) {
                console.error(
                    "Failed to fetch recommended products:",
                    error
                );

                setProducts([]);
            } finally {
                setLoading(false);
            }
        }

        getProducts();
    }, []);

    if (loading) {
        return (
            <section className="my-10">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                    Recommended For You
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            height={500}
                            borderRadius={16}
                        />
                    ))}
                </div>
            </section>
        );
    }

    if (!products.length) {
        return null;
    }

    return (
        <section className="my-10">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
                Recommended For You
            </h2>

            <Swiper
                autoplay
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                    375: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 6,
                    },
                }}
            >
                {products.map((item) => {
                    const imageUrl = item.image || "/images/placeholder.png";

                    const productId = item._id;

                    if (item.status === "published") {
                        return (
                            <SwiperSlide
                                key={productId}
                                className="mb-2 mt-2"
                            >
                                <Link
                                    href={`/product/${item.slug}`}
                                    className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative min-w-[200px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
                                        <OptimizedImage
                                            src={imageUrl}
                                            alt={item.title || "Product"}
                                            fill
                                            sizes="(max-width: 374px) 50vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 16vw"
                                            className="object-cover object-center"
                                        />

                                        {/* Platform badge */}
                                        {item.platform && (
                                            <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded uppercase">
                                                {item.platform}
                                            </span>
                                        )}

                                        {/* Discount ribbon */}
                                        {item.originalPrice &&
                                            item.originalPrice > item.price && (
                                                <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
                                                    -
                                                    {Math.round(
                                                        ((item.originalPrice -
                                                            item.price) /
                                                            item.originalPrice) *
                                                        100
                                                    )}
                                                    %
                                                </span>
                                            )}
                                    </div>

                                    <div className="bg-gray-100 dark:bg-black/30 backdrop-blur-sm px-1 py-1 rounded-b-md h-[120px]">
                                        <HoverCard title={item.title}>
                                            <h3 className="text-sm font-semibold line-clamp-2 px-1.5 mt-1 text-black">
                                                {item.title}
                                            </h3>
                                        </HoverCard>

                                        <h3 className="text-sm font-semibold text-blue-600 px-1.5 mt-0.5">
                                            {item.card_region || item.region}
                                        </h3>

                                        <p className="text-lg text-gray-600 dark:text-gray-300 px-1.5 mt-1 mb-1.5">
                                            {symbol}{" "}
                                            {Number(
                                                item.discountPrice
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        );
                    }

                    return (
                        <SwiperSlide
                            key={productId}
                            className="mb-2 mt-2"
                        >
                            <div className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative min-w-[200px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1 cursor-not-allowed">
                                <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
                                    <OptimizedImage
                                        src={imageUrl}
                                        alt={item.title || "Product"}
                                        fill
                                        sizes="(max-width: 374px) 50vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 16vw"
                                        className="object-cover object-center grayscale opacity-60"
                                    />

                                    {/* Notify button */}
                                    <div className="absolute bottom-3 left-0 w-full flex justify-center px-3">
                                        <button
                                            onClick={() =>
                                                handleNotify(item)
                                            }
                                            disabled={notified[productId]}
                                            className="flex items-center justify-center gap-2 w-full max-w-[85%] bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold py-2.5 rounded-md hover:bg-white/20 transition shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer"
                                        >
                                            {notified[productId]
                                                ? "✔ Notified"
                                                : "🔔 Notify me"}
                                        </button>
                                    </div>

                                    {/* Platform badge */}
                                    {item.platform && (
                                        <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded uppercase">
                                            {item.platform}
                                        </span>
                                    )}

                                    {/* Discount ribbon */}
                                    {item.originalPrice &&
                                        item.originalPrice > item.price && (
                                            <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
                                                -
                                                {Math.round(
                                                    ((item.originalPrice -
                                                        item.price) /
                                                        item.originalPrice) *
                                                    100
                                                )}
                                                %
                                            </span>
                                        )}
                                </div>

                                <div className="bg-gray-100 dark:bg-black/30 backdrop-blur-sm px-1 py-1 rounded-b-md h-[120px]">
                                    <HoverCard title={item.title}>
                                        <h3 className="text-sm font-semibold line-clamp-2 px-1.5 mt-1 text-black">
                                            {item.title}
                                        </h3>
                                    </HoverCard>

                                    <h3 className="text-sm font-semibold text-blue-600 px-1.5 mt-0.5">
                                        {item.card_region || item.region}
                                    </h3>

                                    <p className="text-lg text-[#cc0000] font-bold dark:text-gray-300 px-1.5 mt-1 mb-1.5">
                                        Sold Out
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </section>
    );
}