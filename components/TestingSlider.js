import { useEffect, useState } from "react";
import { fetchFromStrapi } from "@/lib/strapi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import useCurrency from "@/hook/useCurrency";

export default function TestingSlider() {
    const { symbol } = useCurrency();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function getData() {
            try {
                const [
                    ps,
                    xbox,
                    spotify,
                    roblox,
                    binance,
                    steam,
                ] = await Promise.all([
                    fetchFromStrapi("api/play-station-gift-cards?populate=*"),
                    fetchFromStrapi("api/xbox-gift-cards?populate=*"),
                    fetchFromStrapi("api/spotify-gift-cards?populate=*"),
                    fetchFromStrapi("api/roblox-gift-cards?populate=*"),
                    fetchFromStrapi("api/binance-gift-cards?populate=*"),
                    fetchFromStrapi("api/steam-gift-cards?populate=*"),
                ]);

                setProducts([
                    ...(ps.data || []).map((i) => ({ ...i, type: "psn" })),
                    ...(xbox.data || []).map((i) => ({ ...i, type: "xbox" })),
                    ...(spotify.data || []).map((i) => ({ ...i, type: "spotify" })),
                    ...(roblox.data || []).map((i) => ({ ...i, type: "roblox" })),
                    ...(binance.data || []).map((i) => ({ ...i, type: "binance" })),
                    ...(steam.data || []).map((i) => ({ ...i, type: "steam" })),
                ]);
            } catch (e) {
                console.error(e);
            }
        }

        getData();
    }, []);

    const getStrapiMedia = (url) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        return `${process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL}${url}`;
    };

    return (
        <section className="relative my-12">
            <h2 className="text-xl font-bold mb-4 text-white">
                Best Selling Gift Cards
            </h2>

            {/* ===== Driffle Edge Fades ===== */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10" />

            {/* ===== Arrow Styling ===== */}
            <style>{`
        .swiper {
          overflow: visible;
        }

        .swiper-button-prev,
        .swiper-button-next {
          width: 44px;
          height: 44px;
          border-radius: 9999px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(6px);
          color: white;
          top: 50%;
          transform: translateY(-50%);
          transition: all .25s ease;
          z-index: 20;
        }

        .swiper-button-prev { left: 32px; }
        .swiper-button-next { right: 32px; }

        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background: rgba(0,0,0,0.9);
          transform: translateY(-50%) scale(1.08);
        }

        @media (max-width: 768px) {
          .swiper-button-prev,
          .swiper-button-next {
            display: none;
          }
        }

        .group .swiper-button-prev,
        .group .swiper-button-next {
          opacity: 0;
        }

        .group:hover .swiper-button-prev,
        .group:hover .swiper-button-next {
          opacity: 1;
        }
      `}</style>

            <div className="relative group px-28">
                <Swiper
                    modules={[Navigation]}
                    navigation
                    spaceBetween={16}
                    slidesPerView={1}
                    breakpoints={{
                        320: { slidesPerView: 1.3 },
                        640: { slidesPerView: 2.2 },
                        768: { slidesPerView: 3.2 },
                        1024: { slidesPerView: 4.2 },
                        1280: { slidesPerView: 5.2 },
                    }}
                >
                    {products.map((item) => {
                        const imgUrl = getStrapiMedia(item.image?.url);

                        return (
                            <SwiperSlide key={item.id}>
                                <Link
                                    href={`/store/category/gift-card/${item.type}/${item.slug}`}
                                    className="
                    block bg-white dark:bg-[#1a1a1a]
                    rounded-xl overflow-hidden
                    shadow-[0_6px_20px_rgba(0,0,0,0.25)]
                    hover:shadow-[0_14px_35px_rgba(0,0,0,0.45)]
                    transition-all duration-300
                    hover:-translate-y-1
                  "
                                >
                                    <div className="relative aspect-[3/5]">
                                        <Image
                                            src={imgUrl}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="p-3">
                                        <h3 className="text-sm font-semibold line-clamp-2 text-black">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-blue-600 mt-1">
                                            {item.card_region}
                                        </p>
                                        <p className="text-sm font-bold mt-2">
                                            {symbol} {Number(item.discountPrice).toFixed(2)}
                                        </p>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>

            <div className="flex justify-center mt-10">
                <Link
                    href="/store/collection/gift-card"
                    className="px-6 py-2 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition"
                >
                    Show All
                </Link>
            </div>
        </section>
    );
}
