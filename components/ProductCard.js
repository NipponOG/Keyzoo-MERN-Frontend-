"use client";

// components/ProductCard.jsx
// Your carousel card, extracted so it can be reused (carousel, favorites, lists...).
// Optional props: onNotify, onToggleFavorite + isFavorite, onAddToCart.

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import HoverCard from "@/components/HoverCard";
import OptimizedImage from "@/components/Image/OptimizedImage";

export const IMAGE_SIZES =
    "(max-width: 639px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, (max-width: 1535px) 20vw, 16vw";

/* ---------- helpers ---------- */

const toNumber = (v) => {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};

const getInitials = (title = "") =>
    title
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

const FOCUS =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500";

/* ---------- card ---------- */

export default function ProductCard({
    item,
    symbol = "",
    available = item.status === "published",
    notified = false,
    onNotify,
    onToggleFavorite,
    isFavorite = true,
    onAddToCart,
}) {
    const imageUrl = item.image || "/images/placeholder.png";
    const region = item.card_region || item.region;

    // Shown price is discountPrice (falls back to price); originalPrice is the "was" price.
    const current = toNumber(item.discountPrice ?? item.price);
    const original = toNumber(item.originalPrice);
    const discount =
        current !== null && original !== null && original > current
            ? Math.round(((original - current) / original) * 100)
            : 0;

    // No cover image but an `accent` gradient provided (e.g. demo data): show a gradient with initials.
    const useGradient = !item.image && Boolean(item.accent);

    const cardClasses = [
        "flex h-full w-full flex-col p-1 rounded-lg relative bg-white dark:bg-[#1a1a1a] shadow-sm dark:shadow-none",
        available
            ? "hover:shadow-lg transition duration-300 transform hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none"
            : "cursor-not-allowed",
    ].join(" ");

    const content = (
        <>
            <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
                {useGradient ? (
                    <div
                        className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${item.accent} ${available ? "" : "grayscale opacity-60"
                            }`}
                    >
                        <span className="select-none text-5xl font-black tracking-tight text-white/80">
                            {getInitials(item.title)}
                        </span>
                    </div>
                ) : (
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
                )}

                {/* Platform badge */}
                {item.platform && (
                    <span className="absolute top-2 left-2 max-w-[55%] truncate rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white">
                        {item.platform}
                    </span>
                )}

                {/* Discount ribbon (moves down when the favorite button is shown) */}
                {discount > 0 && (
                    <span
                        aria-label={`${discount}% off`}
                        className={`absolute right-2 rounded-md bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white shadow-md ${onToggleFavorite ? "top-12" : "top-2"
                            }`}
                    >
                        -{discount}%
                    </span>
                )}

                {/* Notify button (sold out only) */}
                {!available && onNotify && (
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

    return (
        <div className={cardClasses}>
            {/* The link wraps only the content. Buttons below sit outside it, because
                a button inside a link is invalid HTML and would also trigger navigation. */}
            {available ? (
                <Link
                    href={`/product/${item.slug}`}
                    className={`flex flex-1 flex-col rounded-lg ${FOCUS}`}
                >
                    {content}
                </Link>
            ) : (
                <div className="flex flex-1 flex-col">{content}</div>
            )}

            {/* Favorite toggle */}
            {onToggleFavorite && (
                <button
                    type="button"
                    onClick={() => onToggleFavorite(item)}
                    aria-pressed={isFavorite}
                    aria-label={
                        isFavorite
                            ? `Remove ${item.title} from favorites`
                            : `Add ${item.title} to favorites`
                    }
                    className={`absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/55 backdrop-blur-sm transition hover:scale-110 hover:bg-black/75 motion-reduce:hover:scale-100 ${FOCUS} ${isFavorite ? "text-rose-500" : "text-white"
                        }`}
                >
                    <Heart
                        className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                        aria-hidden="true"
                    />
                </button>
            )}

            {/* Add to cart */}
            {onAddToCart && (
                <div className="px-1 pb-1 pt-2">
                    <button
                        type="button"
                        onClick={() => onAddToCart(item)}
                        disabled={!available}
                        className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#6d3cff] py-2.5 text-sm font-semibold text-white transition hover:bg-[#5a2ee6] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-white/10 dark:disabled:text-neutral-500 ${FOCUS}`}
                    >
                        <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                        {available ? "Add to cart" : "Unavailable"}
                    </button>
                </div>
            )}
        </div>
    );
}

export function ProductCardSkeleton() {
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