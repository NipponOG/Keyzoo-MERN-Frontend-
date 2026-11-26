
import { memo } from "react";
import Link from "next/link";
import { Bell, BellRing } from "lucide-react";

import ProductCardImage from "@/components/ProductCardImage";
import HoverCard from "@/components/HoverCard";

const FOCUS =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]";

const TILE =
    "group relative block min-w-0 rounded-2xl border border-white/10 bg-[#1a1a1a] p-1.5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-black/40";

const ProductCard = memo(function ProductCard({
    card,
    symbol,
    notified = false,
    onNotify,
    href,
}) {
    if (!card) return null;

    const { available } = card;

    const content = (
        <>
            {/* Product image */}
            <div className="relative aspect-[3/5] w-full overflow-hidden rounded-xl bg-neutral-900">
                <ProductCardImage
                    imgUrl={card.imgUrl}
                    blurUrl={card.blurUrl}
                    available={available}
                />

                {/* Platform badge */}
                {card.platform && (
                    <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
                        {card.platform}
                    </span>
                )}

                {/* Discount badge */}
                {card.discount > 0 && (
                    <span className="absolute right-2 top-2 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                        -{card.discount}%
                    </span>
                )}

                {/* Sold-out notification */}
                {!available && (
                    <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/85 to-transparent px-3 pb-3 pt-12">
                        <button
                            type="button"
                            onClick={() => onNotify?.(card)}
                            disabled={notified}
                            className={`flex w-full max-w-[90%] cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 disabled:cursor-default disabled:opacity-80 ${FOCUS}`}
                        >
                            {notified ? (
                                <>
                                    <BellRing aria-hidden="true" className="h-4 w-4" />
                                    We'll notify you
                                </>
                            ) : (
                                <>
                                    <Bell aria-hidden="true" className="h-4 w-4" />
                                    Notify me
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Product information */}
            <div className="px-2 pb-2 pt-3">
                <HoverCard title={card.title}>
                    <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-white">
                        {card.title}
                    </h3>
                </HoverCard>

                {card.region && (
                    <span className="mt-2 inline-block rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-blue-400">
                        {card.region}
                    </span>
                )}

                {/* Price */}
                <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
                    {available ? (
                        <>
                            <span className="text-lg font-bold text-white">
                                {symbol} {card.price.toFixed(2)}
                            </span>

                            {card.discount > 0 && (
                                <span className="text-xs text-neutral-500 line-through">
                                    {symbol} {card.original.toFixed(2)}
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="text-lg font-bold text-red-500">
                            Sold out
                        </span>
                    )}
                </div>
            </div>
        </>
    );

    return available && href ? (
        <Link href={href} className={`${TILE} ${FOCUS}`}>
            {content}
        </Link>
    ) : (
        <div className={`${TILE} cursor-default`}>
            {content}
        </div>
    );
});

export default ProductCard;
