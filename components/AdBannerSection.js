import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoClose, IoPlay, IoArrowForward } from "react-icons/io5";
import Skeleton from "react-loading-skeleton";
import OptimizedImage from "@/components/Image/OptimizedImage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

function useAdBanners() {
    const [ads, setAds] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | ready | error

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                const res = await fetch(`${API_URL}/home/ad-banners`, {
                    cache: "no-store",
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error(`Failed to fetch ad banners (${res.status})`);

                const json = await res.json();
                setAds(Array.isArray(json?.data) ? json.data : []);
                setStatus("ready");
            } catch (error) {
                if (error.name === "AbortError") return;
                console.error("Failed to fetch ad banners:", error);
                setStatus("error");
            }
        })();

        return () => controller.abort();
    }, []);

    return { ads, status };
}

/* -------------------------------------------------------------------------- */
/*  Loading skeleton (matches the real layout so nothing jumps)               */
/* -------------------------------------------------------------------------- */

function BannerSkeleton() {
    return (
        <section
            aria-hidden="true"
            className="mb-6 grid overflow-hidden rounded-3xl border border-white/10 md:grid-cols-2"
        >
            <div className="min-h-[320px] sm:min-h-[420px] md:min-h-[640px]">
                <Skeleton height="100%" borderRadius={0} containerClassName="block h-full" className="!h-full" />
            </div>

            <div className="flex flex-col items-center justify-center gap-5 p-6 sm:p-10">
                <Skeleton height={70} width={200} />
                <div className="w-full max-w-md">
                    <Skeleton count={4} height={16} className="mb-1" />
                </div>
                <div className="w-full max-w-md">
                    <Skeleton height={200} borderRadius={16} />
                </div>
                <Skeleton height={48} width={180} borderRadius={12} />
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*  Trailer thumbnail + modal                                                 */
/* -------------------------------------------------------------------------- */

function TrailerThumbnail({ videoId, onPlay }) {
    // maxresdefault doesn't exist for every video, so fall back to hqdefault
    const [src, setSrc] = useState(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`);
    const fallback = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    return (
        <button
            type="button"
            onClick={() => onPlay(videoId)}
            aria-label="Play trailer"
            className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10
                       transition-shadow duration-300 hover:ring-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt=""
                loading="lazy"
                onError={() => src !== fallback && setSrc(fallback)}
                onLoad={(e) => {
                    // YouTube returns a 120px grey placeholder instead of a 404 for missing maxres images
                    if (e.currentTarget.naturalWidth <= 120 && src !== fallback) setSrc(fallback);
                }}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 transition-colors group-hover:from-black/60" />

            <div className="absolute inset-0 flex items-center justify-center">
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-black shadow-2xl transition-transform duration-300 group-hover:scale-110">
                    <span className="absolute inset-0 animate-ping rounded-full bg-white/40 [animation-duration:2.2s]" />
                    <IoPlay className="relative ml-1 text-2xl" />
                </span>
            </div>

            <span className="absolute bottom-3 left-4 text-xs font-semibold uppercase tracking-widest text-white/90">
                Watch trailer
            </span>
        </button>
    );
}

function TrailerModal({ videoId, onClose }) {
    const closeRef = useRef(null);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden"; // lock page scroll behind the modal
        closeRef.current?.focus();

        const onKeyDown = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [onClose]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Game trailer"
            onClick={onClose}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        >
            <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
                <button
                    ref={closeRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Close trailer"
                    className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full
                               bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                    <IoClose className="text-2xl" />
                </button>

                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
                    <iframe
                        key={videoId}
                        className="h-full w-full"
                        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                        title="Game trailer"
                        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                    />
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Single banner                                                             */
/* -------------------------------------------------------------------------- */

function Banner({ ad, index, onPlayTrailer }) {
    const reversed = index % 2 === 1; // alternate image side on desktop
    const slug = ad.product?.slug;
    const altText = ad.product?.name || "Featured game";

    return (
        <section
            className="group/banner relative mb-6 grid overflow-hidden rounded-3xl border border-white/10
                       bg-[#18181c] shadow-xl shadow-black/30 md:grid-cols-2"
        >
            {/* ---------- Image side ---------- */}
            <div
                className={`relative min-h-[320px] overflow-hidden sm:min-h-[420px] md:min-h-[640px] ${
                    reversed ? "md:order-2" : ""
                }`}
            >
                {ad.image && (
                    <OptimizedImage
                        src={ad.image}
                        alt={altText}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        priority={index === 0}
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover/banner:scale-105"
                    />
                )}

                {/* blend the image into the content panel */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f23] via-transparent to-black/20 md:hidden" />
                <div
                    className={`absolute inset-0 hidden md:block ${
                        reversed
                            ? "bg-gradient-to-l from-transparent via-transparent to-[#1f1f23]/90"
                            : "bg-gradient-to-r from-transparent via-transparent to-[#1f1f23]/90"
                    }`}
                />
            </div>

            {/* ---------- Content side ---------- */}
            <div className="relative flex items-center justify-center overflow-hidden bg-[#1f1f23] p-6 sm:p-10">
                {/* soft blurred glow derived from the banner image */}
                {ad.image && (
                    <div
                        aria-hidden="true"
                        style={{ backgroundImage: `url(${ad.image})` }}
                        className="pointer-events-none absolute inset-0 scale-150 bg-cover bg-center opacity-[0.12] blur-3xl"
                    />
                )}

                <div className="relative flex w-full max-w-md flex-col items-center text-center">
                    {ad.logo && (
                        <Image
                            src={ad.logo}
                            alt={`${altText} logo`}
                            width={220}
                            height={110}
                            className="mb-6 h-auto max-h-[110px] w-auto max-w-[220px] object-contain drop-shadow-lg"
                        />
                    )}

                    {ad.description && (
                        <p className="mb-7 line-clamp-5 text-sm leading-relaxed text-gray-300 sm:text-base">
                            {ad.description}
                        </p>
                    )}

                    {ad.youtubeVideoId && (
                        <div className="mb-7 w-full">
                            <TrailerThumbnail videoId={ad.youtubeVideoId} onPlay={onPlayTrailer} />
                        </div>
                    )}

                    {slug && (
                        <Link
                            href={`/product/${slug}`}
                            className="group/cta inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6D28D9]
                                       px-7 py-3 font-semibold text-white shadow-lg shadow-[#6D28D9]/30 transition-all duration-300
                                       hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#6D28D9]/50
                                       focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            Take It Now!
                            <IoArrowForward className="transition-transform duration-300 group-hover/cta:translate-x-1" />
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function AdBannerSection() {
    const { ads, status } = useAdBanners();
    const [activeVideo, setActiveVideo] = useState(null);

    const openTrailer = useCallback((id) => setActiveVideo(id), []);
    const closeTrailer = useCallback(() => setActiveVideo(null), []);

    if (status === "loading") return <BannerSkeleton />;
    if (status === "error" || !ads.length) return null; // never leave a skeleton hanging

    return (
        <>
            {ads.map((ad, index) => (
                <Banner key={ad.id ?? index} ad={ad} index={index} onPlayTrailer={openTrailer} />
            ))}

            {/* single modal for the whole section (previously one was rendered per banner) */}
            {activeVideo && <TrailerModal videoId={activeVideo} onClose={closeTrailer} />}
        </>
    );
}