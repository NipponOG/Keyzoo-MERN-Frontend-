import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { IoPlay } from "react-icons/io5";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import OptimizedImage from "@/components/Image/OptimizedImage";

export default function AdBannerSection() {

    const router = useRouter();
    const [ads, setAds] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);

    useEffect(() => {
        async function fetchAds() {
            try {
                const API_URL =
                    process.env.NEXT_PUBLIC_API_URL;

                const res = await fetch(
                    `${API_URL}/home/ad-banners`,
                    {
                        cache: "no-store",
                    }
                );

                if (!res.ok) {
                    throw new Error(
                        "Failed to fetch ad banners"
                    );
                }

                const data = await res.json();

                setAds(data?.data || []);
            } catch (error) {
                console.error(
                    "Failed to fetch ad banners:",
                    error
                );

                setAds([]);
            }
        }

        fetchAds();
    }, []);

    if (!ads.length) {
        return (

            <section className="w-full flex flex-col md:flex-row rounded-3xl overflow-hidden mb-6 gap-0">

                {/* LEFT IMAGE SKELETON */}
                <div className="w-full md:w-1/2">
                    <Skeleton
                        height={750}
                        borderRadius={0}
                    />
                </div>

                {/* RIGHT CONTENT SKELETON */}
                <div className="w-full md:w-1/2 p-6 sm:p-10">

                    <Skeleton
                        height={80}
                        width={220}
                        className="mb-6"
                    />

                    <Skeleton
                        count={4}
                        height={20}
                        className="mb-2"
                    />

                    <div className="mt-6">
                        <Skeleton
                            height={220}
                            borderRadius={16}
                        />
                    </div>

                    <div className="mt-6">
                        <Skeleton
                            height={50}
                            width={180}
                            borderRadius={12}
                        />
                    </div>

                </div>

            </section>
        );
    }

    return (
        <>
            {ads.map((ad, index) => {

                const imgUrl = ad.image || null;

                const blurUrl = ad.image || null;

                const logoUrl = ad.logo || null;

                const youtubeVideoId = ad.youtubeVideoId;

                const trailerPreview = youtubeVideoId
                    ? `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`
                    : imgUrl;

                return (
                    <section
                        key={index}
                        className="w-full flex flex-col md:flex-row rounded-3xl overflow-hidden bg-[#18181c] mb-6"
                    >

                        {/* LEFT IMAGE */}
                        <div className="w-full md:w-1/2 relative min-h-[350px] md:min-h-[750px]">

                            <OptimizedImage
                                src={ad.image}
                                alt="Banner"
                                fill
                                className="object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                        </div>

                        {/* RIGHT CONTENT */}
                        <div className="w-full md:w-1/2 flex items-center justify-center bg-[#1f1f23] p-6 sm:p-10">

                            <div className="max-w-md w-full text-center">

                                {/* TITLE */}
                                {/* <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"> */}

                                <Image
                                    src={ad.logo}
                                    alt="Logo"
                                    width={200}
                                    height={100}
                                    className="mx-auto mb-6"
                                />

                                {/* </h2> */}

                                {/* DESCRIPTION */}
                                <p className="text-gray-400 text-sm sm:text-base mb-6">
                                    {ad.description}
                                </p>

                                {/* 🎬 TRAILER (VIDEO PREVIEW) */}
                                {youtubeVideoId && (
                                    <div className="flex justify-center mb-6">
                                        <button
                                            type="button"
                                            onClick={() => setActiveVideo(youtubeVideoId)}
                                            className="
                relative
                w-full
                max-w-md
                aspect-video
                rounded-xl
                overflow-hidden
                group
                cursor-pointer
                bg-black
                text-left
            "
                                            aria-label="Play trailer"
                                        >
                                            <Image
                                                src={trailerPreview}
                                                alt="Game trailer"
                                                fill
                                                className="
                    object-cover
                    group-hover:scale-105
                    transition-transform
                    duration-500
                "
                                            />

                                            {/* Dark overlay */}
                                            <div className="
                absolute
                inset-0
                bg-black/35
                group-hover:bg-black/50
                transition
            " />

                                            {/* Play button */}
                                            <div className="
                absolute
                inset-0
                flex
                items-center
                justify-center
            ">
                                                <div className="
                    w-16
                    h-16
                    rounded-full
                    bg-white/95
                    text-black
                    flex
                    items-center
                    justify-center
                    shadow-2xl
                    group-hover:scale-110
                    transition-transform
                ">
                                                    <IoPlay className="text-2xl ml-1" />
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                )}

                                {activeVideo && (
                                    <div
                                        className="
            fixed
            inset-0
            z-[100]
            bg-black/90
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
        "
                                        onClick={() => setActiveVideo(null)}
                                    >
                                        <div
                                            className="relative w-full max-w-5xl"
                                            onClick={(e) => e.stopPropagation()}
                                        >

                                            {/* Close */}
                                            <button
                                                type="button"
                                                onClick={() => setActiveVideo(null)}
                                                className="
                    absolute
                    -top-12
                    right-0
                    z-10
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    hover:bg-white/20
                    text-white
                    transition
                "
                                                aria-label="Close trailer"
                                            >
                                                <IoMdCloseCircleOutline className="text-3xl" />
                                            </button>

                                            {/* YouTube Player */}
                                            <div className="
                relative
                w-full
                aspect-video
                overflow-hidden
                rounded-2xl
                bg-black
                shadow-2xl
            ">
                                                <iframe
                                                    key={activeVideo}
                                                    className="w-full h-full"
                                                    src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                                                    title="Game Trailer"
                                                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                                    allowFullScreen
                                                    referrerPolicy="strict-origin-when-cross-origin"
                                                />
                                            </div>

                                        </div>
                                    </div>
                                )}

                                {/* CTA */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => router.push(`/product/${ad.product?.slug}`)}
                                        className="px-6 py-3 rounded-lg bg-[#6D28D9] hover:bg-[#5530a0] transition text-white font-medium cursor-pointer"
                                    >
                                        Take It Now!
                                    </button>
                                </div>

                            </div>

                        </div>

                    </section>
                );
            })}
        </>
    );
}