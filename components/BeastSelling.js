"use client";

import { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import toast from "react-hot-toast";
import useCurrency from "@/hook/useCurrency";
import ProductCard from "@/components/ProductCard";
import Skeleton from "react-loading-skeleton";
import { getStrapiMedia } from "@/lib/getStrapiMedia";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
                const res = await fetch(`${API_URL}/products/best-selling`, {
                    cache: "no-store",
                    signal: controller.signal,
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch best-selling products");
                }

                const data = await res.json();
                setProducts(data?.data || []);
            } catch (error) {
                if (error.name === "AbortError") return;
                console.error("Failed to fetch best-selling products:", error);
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
            Best Selling Games
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

                {products.map((item) => {
                    const original = Number(item.price) || 0;

                    const price =
                        Number(item.discountPrice) > 0
                            ? Number(item.discountPrice)
                            : original;


                    const imageSource = item.image || item.platform_image;

                    const card = {
                        id: item._id,
                        slug: item.slug,
                        title: item.title,
                        platform: item.platform || "",
                        region: item.card_region || item.region || "",
                        available: item.available === true,
                        price,
                        original,
                        discount:
                            original > price && original > 0
                                ? Math.round(((original - price) / original) * 100)
                                : 0,

                        imgUrl: getStrapiMedia(imageSource, {
                            width: 480,
                        }),

                        blurUrl: getStrapiMedia(imageSource, {
                            blur: true,
                        }),
                    };


                    return (
                        <SwiperSlide key={item._id} className="!h-auto py-2">
                            <ProductCard
                                card={card}
                                symbol={symbol}
                                href={`/product/${item.slug}`}
                                notified={Boolean(notified[item._id])}
                                onNotify={() => handleNotify(item)}
                            />
                        </SwiperSlide>
                    );
                })}

            </Swiper>
        </section>
    );
}