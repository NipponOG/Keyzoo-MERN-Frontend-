import { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { ChevronDown, Heart, ShoppingCart } from "lucide-react";
import useCurrency from "@/hook/useCurrency";
import useFavorites from "@/hook/useFavorites";
import { addToCart } from "@/store/cartSlice";
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const FALLBACK_IMAGE = "/keyzoo-fallback.png";

const FOCUS =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500";

const toNumber = (v) => {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};

const getPricing = (item) => {
    const current = toNumber(item.discountPrice ?? item.price);
    const original = toNumber(item.originalPrice);
    const discount =
        current !== null && original !== null && original > current
            ? Math.round(((original - current) / original) * 100)
            : 0;
    return { current, discount };
};

const isAvailable = (item) => item.status === "published";

const SORTS = {
    recent: { label: "Recently added", fn: (a, b) => new Date(b.addedAt) - new Date(a.addedAt) },
    "price-asc": { label: "Price: low to high", fn: (a, b) => (getPricing(a).current ?? 0) - (getPricing(b).current ?? 0) },
    "price-desc": { label: "Price: high to low", fn: (a, b) => (getPricing(b).current ?? 0) - (getPricing(a).current ?? 0) },
    discount: { label: "Biggest discount", fn: (a, b) => getPricing(b).discount - getPricing(a).discount },
    name: { label: "Name: A to Z", fn: (a, b) => String(a.title).localeCompare(String(b.title)) },
};

const GRID = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

function EmptyState({ title, text, action }) {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-rose-500/10">
                <Heart className="h-11 w-11 text-rose-500" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="mt-2 max-w-sm text-gray-500 dark:text-neutral-400">{text}</p>
            {action}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function FavoritesPage() {
    const dispatch = useDispatch();
    const { symbol } = useCurrency();

    // Same store the heart button on the product page writes to.
    // BACKEND LATER: swap the internals of `useFavorites`, this page doesn't change.
    const { favorites, ready, add, remove } = useFavorites();
    const loading = !ready;

    const [platform, setPlatform] = useState("All");
    const [sort, setSort] = useState("recent");

    const platforms = useMemo(
        () => ["All", ...new Set(favorites.map((f) => f.platform).filter(Boolean))],
        [favorites]
    );

    // If the selected platform no longer exists (last item removed), fall back to All
    useEffect(() => {
        if (!platforms.includes(platform)) setPlatform("All");
    }, [platforms, platform]);

    const visible = useMemo(() => {
        const list = platform === "All" ? favorites : favorites.filter((f) => f.platform === platform);
        return [...list].sort(SORTS[sort].fn);
    }, [favorites, platform, sort]);

    const availableVisible = useMemo(() => visible.filter(isAvailable), [visible]);

    /* ---- actions ------------------------------------------------------------ */

    const handleRemove = useCallback(
        (item) => {
            const index = favorites.findIndex((f) => f._id === item._id);
            remove(item._id);

            toast((t) => (
                <span className="flex items-center gap-3 text-sm">
                    Removed from favorites
                    <button
                        type="button"
                        onClick={() => {
                            add(item, index); // puts it back in its old position, keeping its original "added" date
                            toast.dismiss(t.id);
                        }}
                        className="cursor-pointer font-semibold text-purple-500 underline"
                    >
                        Undo
                    </button>
                </span>
            ));
        },
        [favorites, add, remove]
    );

    // Same payload shape the product page sends to the cart
    const pushToCart = useCallback(
        (item) =>
            dispatch(
                addToCart({
                    id: item._id,
                    type: item.type,
                    title: item.title,
                    item_type_game: item.item_type,
                    price: getPricing(item).current ?? 0,
                    region: item.region,
                    image: item.image || FALLBACK_IMAGE,
                })
            ),
        [dispatch]
    );

    const handleAddToCart = useCallback(
        (item) => {
            if (!isAvailable(item)) return;
            pushToCart(item);
            toast.success(`${item.title} added to cart`);
        },
        [pushToCart]
    );

    const handleAddAll = () => {
        if (availableVisible.length === 0) return;
        availableVisible.forEach(pushToCart);
        toast.success(
            `${availableVisible.length} ${availableVisible.length === 1 ? "item" : "items"} added to cart`
        );
    };

    /* ---- render --------------------------------------------------------------- */

    const header = (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10">
                    <Heart className="h-6 w-6 fill-rose-500 text-rose-500" aria-hidden="true" />
                </span>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">My favorites</h1>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-neutral-400">
                        {loading
                            ? "Loading your collection…"
                            : `${favorites.length} saved ${favorites.length === 1 ? "item" : "items"}`}
                    </p>
                </div>
            </div>

            {!loading && favorites.length > 0 && (
                <button
                    type="button"
                    onClick={handleAddAll}
                    disabled={availableVisible.length === 0}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#6d3cff] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5a2ee6] disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS}`}
                >
                    <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                    Add all to cart ({availableVisible.length})
                </button>
            )}
        </div>
    );

    let body;

    if (loading) {
        body = (
            <div className={GRID} aria-busy="true">
                {Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        );
    } else if (favorites.length === 0) {
        body = (
            <EmptyState
                title="No favorites yet"
                text="Tap the heart on any product to save it here and keep track of the things you love."
                action={
                    <Link
                        href="/"
                        className={`mt-8 inline-flex items-center justify-center rounded-xl bg-[#6d3cff] px-6 py-3 font-semibold text-white transition hover:bg-[#5a2ee6] ${FOCUS}`}
                    >
                        Browse the store
                    </Link>
                }
            />
        );
    } else {
        body = (
            <>
                {/* toolbar */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div
                        role="group"
                        aria-label="Filter by platform"
                        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
                    >
                        {platforms.map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPlatform(p)}
                                aria-pressed={platform === p}
                                className={`shrink-0 cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition ${FOCUS} ${platform === p
                                        ? "border-[#6d3cff] bg-[#6d3cff] text-white"
                                        : "border-gray-200 bg-white text-gray-700 hover:border-purple-400 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-purple-500"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-52">
                        <label htmlFor="sort" className="sr-only">
                            Sort favorites
                        </label>
                        <select
                            id="sort"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 dark:border-white/10 dark:bg-neutral-800 dark:text-white"
                        >
                            {Object.entries(SORTS).map(([key, { label }]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-neutral-400"
                            aria-hidden="true"
                        />
                    </div>
                </div>

                {/* grid: the shared ProductCard, with the favorite + add-to-cart actions switched on */}
                <ul className={GRID}>
                    {visible.map((item) => (
                        <li key={item._id}>
                            <ProductCard
                                item={item}
                                symbol={symbol}
                                available={isAvailable(item)}
                                isFavorite
                                onToggleFavorite={handleRemove}
                                onAddToCart={handleAddToCart}
                            />
                        </li>
                    ))}
                </ul>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>My favorites | Keyzoo</title>
                <meta name="robots" content="noindex" />
            </Head>

            <main className="mx-auto w-full max-w-7xl px-4 py-8 text-gray-900 dark:text-white sm:px-6 lg:px-8">
                {header}
                {body}
            </main>
        </>
    );
}