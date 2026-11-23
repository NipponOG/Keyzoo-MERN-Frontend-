import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";

/**
 * Shared favorites (wishlist) store.
 *
 * - One store for the whole app: the heart on a product page and the Favorites
 *   page always agree, and no provider or Redux wiring is needed.
 * - Persisted in localStorage and synced across tabs.
 * - SSR safe: the server (and the first client render) sees an empty list, then
 *   the saved list appears after hydration.
 *
 * BACKEND LATER: every change goes through `commit()` below. When the API is
 * ready, call it from `add` / `remove` there (and load the list from the API on
 * login, using localStorage as the guest fallback).
 */

const STORAGE_KEY = "keyzoo:favorites";
const EMPTY = [];

let cache = null; // loaded lazily on the client
const listeners = new Set();

const sameId = (a, b) => String(a) === String(b);

function read() {
    if (typeof window === "undefined") return EMPTY;
    if (cache) return cache;

    try {
        const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
        cache = Array.isArray(parsed) ? parsed.filter((i) => i && i._id != null) : [];
    } catch {
        cache = [];
    }
    return cache;
}

function commit(next) {
    cache = next;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        /* storage full or blocked: the in-memory list still works for this session */
    }
    listeners.forEach((l) => l());
}

function subscribe(callback) {
    listeners.add(callback);

    const onStorage = (e) => {
        if (e.key === STORAGE_KEY || e.key === null) {
            cache = null; // another tab changed it: re-read
            callback();
        }
    };
    window.addEventListener("storage", onStorage);

    return () => {
        listeners.delete(callback);
        window.removeEventListener("storage", onStorage);
    };
}

/* -------------------------------------------------------------------------- */
/*  Actions                                                                    */
/* -------------------------------------------------------------------------- */

const SNAPSHOT_FIELDS = [
    "slug",
    "title",
    "image",
    "platform",
    "region",
    "discountPrice",
    "originalPrice",
    "status",
    "type",
    "item_type",
];

export const favoritesActions = {
    /** Add an item. `index` (optional) restores it to a specific position, e.g. for Undo. */
    add(item, index) {
        const current = read();
        if (current.some((f) => sameId(f._id, item._id))) return;

        const entry = { ...item, addedAt: item.addedAt ?? new Date().toISOString() };
        const next = [...current];
        next.splice(index == null ? 0 : Math.min(index, next.length), 0, entry);
        commit(next);
    },

    remove(id) {
        const current = read();
        if (!current.some((f) => sameId(f._id, id))) return;
        commit(current.filter((f) => !sameId(f._id, id)));
    },

    /** Returns true if the item is now a favorite. */
    toggle(item) {
        const exists = read().some((f) => sameId(f._id, item._id));
        if (exists) favoritesActions.remove(item._id);
        else favoritesActions.add(item);
        return !exists;
    },

    /** Keep a saved item's price / stock / title current when its product page is viewed again. */
    refresh(item) {
        const current = read();
        const index = current.findIndex((f) => sameId(f._id, item._id));
        if (index === -1) return;

        const saved = current[index];
        const changed = SNAPSHOT_FIELDS.some((k) => (saved[k] ?? null) !== (item[k] ?? null));
        if (!changed) return;

        const next = [...current];
        next[index] = { ...saved, ...item, addedAt: saved.addedAt };
        commit(next);
    },
};

/* -------------------------------------------------------------------------- */
/*  Product -> favorite snapshot                                               */
/* -------------------------------------------------------------------------- */

/**
 * The shape the Favorites page / ProductCard read. `discountPrice` is the price
 * actually charged, `originalPrice` the undiscounted one.
 */
export function toFavoriteItem(product) {
    const price = Number(product.price) || 0;
    const sale = Number(product.discountPrice) > 0 ? Number(product.discountPrice) : price;

    return {
        _id: product._id ?? product.id ?? product.slug,
        slug: product.slug ?? null,
        title: product.title ?? "",
        image: product.image ?? "",
        platform: product.platform ?? null,
        region: product.region ?? null,
        discountPrice: sale,
        originalPrice: price,
        status: product.available ? "published" : "sold_out",
        type: product.type ?? null,
        item_type: product.item_type ?? null,
    };
}

/* -------------------------------------------------------------------------- */
/*  Hook                                                                       */
/* -------------------------------------------------------------------------- */

export default function useFavorites() {
    const favorites = useSyncExternalStore(subscribe, read, () => EMPTY);

    // false during SSR + first client render, so pages can show a skeleton instead of a flash of "empty"
    const [ready, setReady] = useState(false);
    useEffect(() => setReady(true), []);

    const ids = useMemo(() => new Set(favorites.map((f) => String(f._id))), [favorites]);
    const isFavorite = useCallback((id) => id != null && ids.has(String(id)), [ids]);

    return {
        favorites,
        count: favorites.length,
        ready,
        isFavorite,
        ...favoritesActions,
    };
}