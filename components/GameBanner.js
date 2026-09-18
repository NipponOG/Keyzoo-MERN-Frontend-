"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import OptimizedImage from "@/components/Image/OptimizedImage";
import Skeleton from "react-loading-skeleton";

const GameBanner = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGameBanners() {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL;

                const res = await fetch(
                    `${API_URL}/home/game-banners`,
                    {
                        cache: "no-store",
                    }
                );

                if (!res.ok) {
                    throw new Error(
                        "Failed to fetch game banners"
                    );
                }

                const data = await res.json();

                setBanners(data?.data || []);
            } catch (error) {
                console.error(
                    "Game banners fetch error:",
                    error
                );

                setBanners([]);
            } finally {
                setLoading(false);
            }
        }

        fetchGameBanners();
    }, []);

    // ─────────────────────────────────────────────
    // Loading
    // ─────────────────────────────────────────────

    if (loading) {
        return (
            <div className="overflow-hidden rounded-xl">
                <Skeleton
                    height={280}
                    borderRadius={16}
                />
            </div>
        );
    }

    // ─────────────────────────────────────────────
    // Empty
    // ─────────────────────────────────────────────

    if (!banners.length) {
        return null;
    }

    // ─────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────

    return (
        <div className="flex flex-col gap-4.5">
            {banners.map((banner) => {
                if (!banner.image) {
                    return null;
                }

                const linkHref =
                    banner.link?.trim() || "#";

                return (
                    <Link
                        key={banner._id}
                        href={linkHref}
                    >
                        <div className="group relative h-[280px] overflow-hidden rounded-xl shadow-md transition hover:shadow-xl">
                            <OptimizedImage
                                src={banner.image}
                                alt={
                                    banner.title ||
                                    "Keyzoo game banner"
                                }
                                fill
                                sizes="(max-width: 1024px) 100vw, 33vw"
                                className="
                                    object-center
                                    transition-transform
                                    duration-300
                                    group-hover:scale-105
                                "
                            />

                            <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                                <h3 className="mb-1 text-xl font-bold">
                                    {/* {banner.title} */}
                                </h3>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default GameBanner;