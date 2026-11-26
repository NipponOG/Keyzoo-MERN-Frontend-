import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { Bell, BellRing, ChevronDown, Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { getStrapiMedia } from "@/lib/getStrapiMedia";
import useCurrency from "@/hook/useCurrency";
import ProductCardImage from "@/components/ProductCardImage";
import HoverCard from "@/components/HoverCard";

/* -------------------------------------------------------------------------- */
/*  Config                                                                     */
/* -------------------------------------------------------------------------- */

const PLATFORM = "xbox";
const PAGE_LIMIT = 50;
const ALL = "ALL REGIONS";
const TOP_REGIONS = ["Poland", "United States", "United Kingdom"];
const CACHE_TTL = 60_000; // reuse a region's results for 60s (instant when switching back)
const SKELETON_COUNT = 12;
const CARD_IMAGE_WIDTH = 480; // tiles are ~220px wide, 1600px was 3x more than needed

// NOTE: this banner is hot-linked from another company's CDN. Download it and
// serve it from your own storage/Cloudinary so it can't disappear or get blocked.
const HERO_SRC =
    "https://res.cloudinary.com/dblttl9bh/image/upload/v1767511454/Xbox_Gift_Cards_Instant_Digital_Delivery_1_13fdcc7175.png";
const HERO_BLUR =
    "https://res.cloudinary.com/dblttl9bh/image/upload/e_blur:1000,q_1,w_50/v1767511454/Xbox_Gift_Cards_Instant_Digital_Delivery_1_13fdcc7175.png";

const NOTIFY_KEY = "keyzoo:notify-me";

const FOCUS =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]";

const normalizeRegion = (value) => value?.trim().toUpperCase();
const normalizeRegionUrl = (value) => value?.trim().toLowerCase();

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

async function fetchGiftCards(region, signal) {
    const params = new URLSearchParams({
        platform: PLATFORM,
        page: "1",
        limit: String(PAGE_LIMIT),
    });

    if (region !== ALL) params.set("region", region.toLowerCase());

    const res = await apiFetch(`/gift-cards/store?${params.toString()}`, { signal });
    const data = res?.data || {};

    return {
        items: Array.isArray(data.items) ? data.items : [],
        regions: Array.isArray(data.regions)
            ? data.regions.map((r) => normalizeRegion(r.label || r.value)).filter(Boolean)
            : [],
    };
}

/**
 * Gift cards for a region, with a small in-memory cache:
 *  - revisiting a region shows its cards instantly (and refreshes quietly if stale)
 *  - `prefetch(region)` warms the cache on hover so a click feels immediate
 *  - the region list only ever grows, so the dropdown never shrinks when filtered
 */
function useGiftCards(region, enabled) {
    const cache = useRef(new Map());
    const inflight = useRef(new Set());

    const [state, setState] = useState({ items: [], status: "loading" }); // loading | ready | error
    const [regions, setRegions] = useState([ALL]);
    const [attempt, setAttempt] = useState(0);

    const store = useCallback((key, result) => {
        cache.current.set(key, { items: result.items, at: Date.now() });

        setRegions((prev) => {
            const next = new Set(prev);
            let changed = false;
            for (const r of result.regions) {
                if (!next.has(r)) {
                    next.add(r);
                    changed = true;
                }
            }
            if (!changed) return prev;
            return [ALL, ...[...next].filter((r) => r !== ALL).sort()];
        });
    }, []);

    useEffect(() => {
        if (!enabled) return;

        const hit = cache.current.get(region);
        const fresh = hit && Date.now() - hit.at < CACHE_TTL;

        setState(hit ? { items: hit.items, status: "ready" } : { items: [], status: "loading" });
        if (fresh) return;

        const controller = new AbortController();

        (async () => {
            try {
                const result = await fetchGiftCards(region, controller.signal);
                if (controller.signal.aborted) return;

                store(region, result);
                setState({ items: result.items, status: "ready" });
            } catch (error) {
                if (error.name === "AbortError") return;

                console.error("Failed to fetch PSN gift cards:", {
                    message: error.message,
                    status: error.status,
                    url: error.requestUrl,
                    response: error.responseData,
                });

                // keep showing cached cards if we have them, otherwise show the error state
                if (!hit) setState({ items: [], status: "error" });
            }
        })();

        return () => controller.abort();
    }, [region, enabled, attempt, store]);

    const reload = useCallback(() => {
        cache.current.delete(region);
        setAttempt((n) => n + 1);
    }, [region]);

    const prefetch = useCallback(
        (key) => {
            const hit = cache.current.get(key);
            if ((hit && Date.now() - hit.at < CACHE_TTL) || inflight.current.has(key)) return;

            inflight.current.add(key);
            fetchGiftCards(key)
                .then((result) => store(key, result))
                .catch(() => { })
                .finally(() => inflight.current.delete(key));
        },
        [store]
    );

    return { items: state.items, status: state.status, regions, reload, prefetch };
}

/**
 * "Notify me" list for sold-out cards.
 * Stored in this browser only for now.
 * TODO (backend): POST the product id to a stock-alert endpoint from `add`.
 */
function useNotifyList() {
    const [ids, setIds] = useState(() => new Set());
    const idsRef = useRef(ids);

    useEffect(() => {
        try {
            const saved = JSON.parse(window.localStorage.getItem(NOTIFY_KEY) || "[]");
            if (Array.isArray(saved)) {
                idsRef.current = new Set(saved);
                setIds(idsRef.current);
            }
        } catch {
            /* ignore corrupted storage */
        }
    }, []);

    const add = useCallback((id) => {
        if (idsRef.current.has(id)) return false;

        const next = new Set(idsRef.current).add(id);
        idsRef.current = next;
        setIds(next);

        try {
            window.localStorage.setItem(NOTIFY_KEY, JSON.stringify([...next]));
        } catch {
            /* storage blocked: still works for this session */
        }
        return true;
    }, []);

    return [ids, add];
}

/** Everything a tile needs, computed once per fetch instead of on every render. */
function toCard(item) {
    const original = Number(item.price) || 0;
    const price = Number(item.discountPrice) > 0 ? Number(item.discountPrice) : original;
    const imageSource = item.image || item.platform_image;

    return {
        id: item._id,
        slug: item.slug,
        title: item.title,
        platform: item.platform,
        region: normalizeRegion(item.card_region || item.region || ""),
        available: item.available === true,
        price,
        original,
        discount: original > price && original > 0 ? Math.round(((original - price) / original) * 100) : 0,
        imgUrl: getStrapiMedia(imageSource, { width: CARD_IMAGE_WIDTH }),
        blurUrl: getStrapiMedia(imageSource, { blur: true }),
    };
}

/* -------------------------------------------------------------------------- */
/*  Region picker                                                              */
/* -------------------------------------------------------------------------- */

function RegionPicker({ value, options, onSelect }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;

        const close = () => {
            setOpen(false);
            setQuery("");
        };
        const onPointerDown = (e) => {
            if (ref.current && !ref.current.contains(e.target)) close();
        };
        const onKeyDown = (e) => e.key === "Escape" && close();

        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q ? options.filter((r) => r.toLowerCase().includes(q)) : options;
    }, [options, query]);

    const choose = (region) => {
        setOpen(false);
        setQuery("");
        onSelect(region);
    };

    return (
        <div ref={ref} className="relative w-full md:w-[340px]">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-labelledby="region-label"
                className={`flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-[#2a2a2a] px-4 text-sm text-white transition hover:border-white/25 ${FOCUS}`}
            >
                <span className="truncate">{value || "Select region"}</span>
                <ChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 text-white/70 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#222] shadow-2xl shadow-black/50">
                    <div className="relative border-b border-white/10 p-3">
                        <Search
                            aria-hidden="true"
                            className="pointer-events-none absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                        />
                        <input
                            autoFocus
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search region…"
                            aria-label="Search regions"
                            className="w-full rounded-lg bg-[#171717] py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-blue-400/40"
                        />
                    </div>

                    <div role="listbox" aria-label="Regions" className="no-scrollbar max-h-[240px] overflow-y-auto py-1">
                        {filtered.length > 0 ? (
                            filtered.map((region) => (
                                <button
                                    key={region}
                                    type="button"
                                    role="option"
                                    aria-selected={region === value}
                                    onClick={() => choose(region)}
                                    className={`block w-full cursor-pointer px-4 py-2.5 text-left text-sm transition ${region === value
                                            ? "bg-blue-500/15 text-white"
                                            : "text-white/85 hover:bg-white/5"
                                        }`}
                                >
                                    {region}
                                </button>
                            ))
                        ) : (
                            <p className="px-4 py-3 text-sm text-white/50">No region found</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Product tile                                                               */
/* -------------------------------------------------------------------------- */

const TILE =
    "group relative block min-w-0 rounded-2xl border border-white/10 bg-[#1a1a1a] p-1.5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-black/40";

const GiftCardTile = memo(function GiftCardTile({ card, symbol, notified, onNotify }) {
    const { available } = card;

    const content = (
        <>
            <div className="relative aspect-[3/5] w-full overflow-hidden rounded-xl bg-neutral-900">
                <ProductCardImage imgUrl={card.imgUrl} blurUrl={card.blurUrl} available={available} />

                {card.platform && (
                    <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
                        {card.platform}
                    </span>
                )}

                {card.discount > 0 && (
                    <span className="absolute right-2 top-2 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                        -{card.discount}%
                    </span>
                )}

                {!available && (
                    <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/85 to-transparent px-3 pb-3 pt-12">
                        <button
                            type="button"
                            onClick={() => onNotify(card)}
                            disabled={notified}
                            className={`flex w-full max-w-[90%] cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 disabled:cursor-default disabled:opacity-80 ${FOCUS}`}
                        >
                            {notified ? (
                                <>
                                    <BellRing aria-hidden="true" className="h-4 w-4" /> We&apos;ll notify you
                                </>
                            ) : (
                                <>
                                    <Bell aria-hidden="true" className="h-4 w-4" /> Notify me
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

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
                        <span className="text-lg font-bold text-red-500">Sold out</span>
                    )}
                </div>
            </div>
        </>
    );

    return available ? (
        <Link href={`/store/category/gift-card/xbox/${card.slug}`} className={`${TILE} ${FOCUS}`}>
            {content}
        </Link>
    ) : (
        <div className={`${TILE} cursor-default`}>{content}</div>
    );
});

/* -------------------------------------------------------------------------- */
/*  States                                                                     */
/* -------------------------------------------------------------------------- */

const GRID = "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";

function SkeletonGrid() {
    // plain CSS skeleton: no extra library, same proportions as a real tile so nothing jumps
    return (
        <div className={GRID} aria-hidden="true">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-white/5 bg-[#1a1a1a] p-1.5">
                    <div className="aspect-[3/5] rounded-xl bg-neutral-800" />
                    <div className="space-y-2 px-2 pb-2 pt-3">
                        <div className="h-4 w-4/5 rounded bg-neutral-800" />
                        <div className="h-3 w-1/3 rounded bg-neutral-800" />
                        <div className="h-5 w-1/2 rounded bg-neutral-800" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function EmptyState({ region, onShowAll }) {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <Image src="/3d/no-data.png" alt="" width={320} height={320} className="mb-4 h-auto w-64 sm:w-80" />
            <h3 className="text-xl font-bold text-white">No gift cards found</h3>
            <p className="mt-2 max-w-sm text-sm text-neutral-400">
                {region === ALL
                    ? "There are no PlayStation gift cards available right now. Please check back soon."
                    : `We don't have PlayStation gift cards for ${region} right now.`}
            </p>
            {region !== ALL && (
                <button
                    type="button"
                    onClick={onShowAll}
                    className={`mt-6 cursor-pointer rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 ${FOCUS}`}
                >
                    Show all regions
                </button>
            )}
        </div>
    );
}

function ErrorState({ onRetry }) {
    return (
        <div role="alert" className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <h3 className="text-xl font-bold text-white">Something went wrong</h3>
            <p className="mt-2 max-w-sm text-sm text-neutral-400">
                We couldn&apos;t load the gift cards. Check your connection and try again.
            </p>
            <button
                type="button"
                onClick={onRetry}
                className={`mt-6 cursor-pointer rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 ${FOCUS}`}
            >
                Try again
            </button>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PSNGiftCard() {

    const router = useRouter();
    const { symbol } = useCurrency();

    // The URL is the single source of truth for the region (no duplicate state, no extra render)
    const queryRegion = Array.isArray(router.query.region) ? router.query.region[0] : router.query.region;
    const selectedRegion = useMemo(
        () => (queryRegion ? normalizeRegion(queryRegion) : ALL),
        [queryRegion]
    );

    const { items, status, regions, reload, prefetch } = useGiftCards(selectedRegion, router.isReady);
    const [notifiedIds, addNotify] = useNotifyList();

    const cards = useMemo(() => items.map(toCard), [items]);

    // make sure the active region is always listed, even if the API didn't return it
    const regionOptions = useMemo(
        () => (regions.includes(selectedRegion) ? regions : [...regions, selectedRegion]),
        [regions, selectedRegion]
    );

    const selectRegion = useCallback(
        (region) => {
            const { region: _current, ...rest } = router.query;
            const query = region === ALL ? rest : { ...rest, region: normalizeRegionUrl(region) };

            router.push({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false });
        },
        [router]
    );

    const handleNotify = useCallback(
        (card) => {
            if (addNotify(card.id)) toast.success("Done! We'll let you know when it's back in stock.");
        },
        [addNotify]
    );

    const loading = status === "loading" || !router.isReady;
    const regionLabel = selectedRegion === ALL ? "" : ` for ${selectedRegion}`;

    return (
        <>
            <Head>
                <title>{`PlayStation Gift Cards${regionLabel} | Keyzoo`}</title>
                <meta
                    name="description"
                    content="Buy PlayStation (PSN) gift cards for your region. Instant delivery and great prices."
                />
            </Head>

            <div className="px-4 py-6 md:px-10 md:py-8">
                {/* ---------- Hero ---------- */}
                <section className="relative h-[200px] w-full overflow-hidden rounded-2xl sm:h-[300px] lg:h-[450px]">
                    <Image
                        src={HERO_SRC}
                        alt="PlayStation gift cards"
                        fill
                        priority
                        sizes="100vw"
                        placeholder="blur"
                        blurDataURL={HERO_BLUR}
                        className="object-cover"
                    />
                </section>

                {/* ---------- Filters ---------- */}
                <section
                    aria-label="Filter by region"
                    className="mt-6 flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-[#1a1a1a] p-4 md:mt-8 md:flex-row md:items-center md:gap-6 md:p-5"
                >
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 md:w-auto">
                        <span id="region-label" className="whitespace-nowrap text-sm font-medium text-neutral-300 sm:text-base">
                            Get PSN Gift cards for
                        </span>
                        <RegionPicker value={selectedRegion} options={regionOptions} onSelect={selectRegion} />
                    </div>

                    <div aria-hidden="true" className="hidden h-6 w-px bg-white/15 md:block" />

                    <div className="flex min-w-0 items-center gap-3">
                        <span className="shrink-0 text-sm font-medium text-neutral-300 sm:text-base">Top regions</span>

                        <div className="no-scrollbar flex gap-2 overflow-x-auto py-0.5">
                            {TOP_REGIONS.map((region) => {
                                const normalized = normalizeRegion(region);
                                const active = selectedRegion === normalized;

                                return (
                                    <button
                                        key={region}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() => selectRegion(normalized)}
                                        onPointerEnter={() => prefetch(normalized)}
                                        onFocus={() => prefetch(normalized)}
                                        className={`shrink-0 cursor-pointer rounded-full border px-4 py-1.5 text-sm text-white transition ${FOCUS} ${active
                                                ? "border-blue-400/60 bg-blue-500/20"
                                                : "border-white/10 bg-[#262626] hover:bg-[#303030]"
                                            }`}
                                    >
                                        {region}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ---------- Results ---------- */}
                <section className="mt-8" aria-labelledby="results-heading" aria-busy={loading}>
                    <div className="mb-4 flex items-baseline justify-between gap-4">
                        <h2 id="results-heading" className="text-xl font-bold text-white">
                            PlayStation Gift Cards
                        </h2>
                        {!loading && status === "ready" && (
                            <p className="text-sm text-neutral-400" aria-live="polite">
                                {cards.length} {cards.length === 1 ? "card" : "cards"}
                            </p>
                        )}
                    </div>

                    {loading ? (
                        <SkeletonGrid />
                    ) : status === "error" ? (
                        <ErrorState onRetry={reload} />
                    ) : cards.length === 0 ? (
                        <EmptyState region={selectedRegion} onShowAll={() => selectRegion(ALL)} />
                    ) : (
                        <ul className={GRID}>
                            {cards.map((card) => (
                                <li key={card.id} className="min-w-0">
                                    <GiftCardTile
                                        card={card}
                                        symbol={symbol}
                                        notified={notifiedIds.has(card.id)}
                                        onNotify={handleNotify}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </>
    );
}