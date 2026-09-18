"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";

import OptimizedImage from "@/components/Image/OptimizedImage";
import { useIsMobile } from "@/hook/useIsMobile";

export default function CategoryGrid() {
    const [categoriesBanner, setCategoriesBanner] = useState([]);
    const [loading, setLoading] = useState(true);

    const isMobile = useIsMobile();

    useEffect(() => {
        async function getCategoryBanners() {
            try {
                const API_URL =
                    process.env.NEXT_PUBLIC_API_URL;

                const res = await fetch(
                    `${API_URL}/home/category-banners`,
                    {
                        cache: "no-store",
                    }
                );

                if (!res.ok) {
                    throw new Error(
                        "Failed to fetch category banners"
                    );
                }

                const data = await res.json();

                setCategoriesBanner(
                    data?.data || []
                );
            } catch (error) {
                console.error(
                    "Category banners fetch error:",
                    error
                );

                setCategoriesBanner([]);
            } finally {
                setLoading(false);
            }
        }

        getCategoryBanners();
    }, []);

    // ─────────────────────────────────────────────
    // Loading
    // ─────────────────────────────────────────────

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <Skeleton
                    height={210}
                    borderRadius={16}
                />

                <Skeleton
                    height={210}
                    borderRadius={16}
                />

                <Skeleton
                    height={210}
                    borderRadius={16}
                />
            </div>
        );
    }

    // ─────────────────────────────────────────────
    // Empty
    // ─────────────────────────────────────────────

    if (!categoriesBanner.length) {
        return null;
    }

    return (
        <section className="mt-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {categoriesBanner.map((item) => {
                    if (!item.desktopImage) {
                        return null;
                    }

                    /*
                     * Mobile image is optional.
                     * If there is no mobile image,
                     * use the desktop image.
                     */
                    const imageUrl = isMobile
                        ? item.mobileImage ||
                        item.desktopImage
                        : item.desktopImage;

                    const linkHref =
                        item.link?.trim() || "#";

                    return (
                        <Link
                            key={item._id}
                            href={linkHref}
                            className="group"
                        >
                            <div className="relative h-[210px] overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl">
                                <OptimizedImage
                                    src={imageUrl}
                                    alt={
                                        item.title ||
                                        "Keyzoo category"
                                    }
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                    className="
                                        object-center
                                        transition-transform
                                        duration-300
                                        group-hover:scale-105
                                    "
                                />

                                <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                                    <h3 className="mb-1 text-xl font-bold">
                                        {/* {item.title} */}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}