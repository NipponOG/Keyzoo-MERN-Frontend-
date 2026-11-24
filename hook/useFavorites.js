
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    useSyncExternalStore,
} from "react";

import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const EMPTY = [];

let cache = [];
let activeJwt = null;
let requestVersion = 0;
let listeners = new Set();

const sameId = (a, b) => String(a) === String(b);

function notify() {
    listeners.forEach((listener) => listener());
}

function subscribe(callback) {
    listeners.add(callback);

    return () => {
        listeners.delete(callback);
    };
}

function read() {
    return cache;
}

function setCache(next) {
    cache = next;
    notify();
}

function normalizeFavorite(item) {
    const price = Number(item.price) || 0;
    const discountPrice = Number(item.discountPrice) || 0;

    return {
        _id: item._id || item.id,
        id: item._id || item.id,

        slug: item.slug || null,
        title: item.title || "",
        image: item.image || "",

        platform: item.platform || null,
        region: item.region || null,

        // Backend price is the original price.
        originalPrice: price,

        // Backend discountPrice is the actual selling price.
        discountPrice: discountPrice > 0 ? discountPrice : price,

        type: item.type || "product",
        item_type: item.item_type || null,

        status: item.status || "unavailable",
        available: item.available === true,

        addedAt: item.addedAt || null,
    };
}

function extractWishlistItems(response) {
    const data = response?.data;

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.items)) {
        return data.items;
    }

    return [];
}

async function loadFavorites(jwt, version) {
    const response = await apiFetch("/wishlist", {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
    });

    if (
        version !== requestVersion ||
        jwt !== activeJwt
    ) {
        return;
    }

    const items = extractWishlistItems(response).map(normalizeFavorite);

    setCache(items);
}

function getItemType(item) {
    if (item.type === "gift-card" || item.type === "gift_card") {
        return "gift-card";
    }

    return "product";
}

async function addFavorite(jwt, item) {
    if (!jwt) {
        throw new Error("Please sign in to save favorites.");
    }

    const itemId = item._id || item.id;

    if (!itemId) {
        throw new Error("Product ID is missing.");
    }

    const itemType = getItemType(item);

    const response = await apiFetch("/wishlist/items", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
            itemId,
            itemType,
        }),
    });

    const items = extractWishlistItems(response).map(normalizeFavorite);

    if (jwt === activeJwt) {
        setCache(items);
    }

    return items;
}

async function removeFavorite(jwt, item) {
    if (!jwt) {
        throw new Error("Please sign in to manage favorites.");
    }

    const itemId = typeof item === "object"
        ? item._id || item.id
        : item;

    if (!itemId) {
        throw new Error("Product ID is missing.");
    }

    const existing = cache.find(
        (favorite) => sameId(favorite._id, itemId)
    );

    const itemType = existing
        ? getItemType(existing)
        : "product";

    const response = await apiFetch(
        `/wishlist/items/${itemType}/${itemId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
    );

    const items = extractWishlistItems(response).map(normalizeFavorite);

    if (jwt === activeJwt) {
        setCache(items);
    }

    return items;
}

/**
 * Product -> favorite snapshot.
 * Used by the product page and WishlistButton.
 */
export function toFavoriteItem(product) {
    const price = Number(product.price) || 0;

    const sale =
        Number(product.discountPrice) > 0
            ? Number(product.discountPrice)
            : price;

    return {
        _id: product._id ?? product.id,
        slug: product.slug ?? null,
        title: product.title ?? "",
        image: product.image ?? "",
        platform: product.platform ?? null,
        region: product.region ?? null,

        price,
        discountPrice: sale,
        originalPrice: price,

        status: product.status || (
            product.available ? "published" : "sold_out"
        ),

        available: product.available === true,

        type: product.type || "product",
        item_type: product.item_type ?? null,
    };
}

export default function useFavorites() {
    const { user, jwt, loading: authLoading } = useAuth();

    const [ready, setReady] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const favorites = useSyncExternalStore(
        subscribe,
        read,
        () => EMPTY
    );

    useEffect(() => {
        if (authLoading) return;

        let cancelled = false;

        async function synchronize() {
            if (!jwt || !user) {
                requestVersion += 1;
                activeJwt = null;
                setCache([]);
                setReady(true);
                setSyncing(false);
                return;
            }

            if (activeJwt !== jwt) {
                requestVersion += 1;
                activeJwt = jwt;
                setCache([]);
                setReady(false);
            }

            const version = requestVersion;

            setSyncing(true);

            try {
                await loadFavorites(jwt, version);
            } catch (error) {
                console.error("Failed to load favorites:", error);

                if (!cancelled && version === requestVersion) {
                    setCache([]);
                }
            } finally {
                if (!cancelled && version === requestVersion) {
                    setReady(true);
                    setSyncing(false);
                }
            }
        }

        synchronize();

        return () => {
            cancelled = true;
        };
    }, [jwt, user, authLoading]);

    const ids = useMemo(
        () => new Set(favorites.map((item) => String(item._id))),
        [favorites]
    );

    const isFavorite = useCallback(
        (id) => id != null && ids.has(String(id)),
        [ids]
    );

    const add = useCallback(
        (item) => addFavorite(jwt, item),
        [jwt]
    );

    const remove = useCallback(
        (id) => removeFavorite(jwt, id),
        [jwt]
    );

    const toggle = useCallback(
        async (item) => {
            const id = item._id || item.id;

            if (isFavorite(id)) {
                await removeFavorite(jwt, id);
                return false;
            }

            await addFavorite(jwt, item);
            return true;
        },
        [jwt, isFavorite]
    );

    const refresh = useCallback(async () => {
        if (!jwt || jwt !== activeJwt) return;

        const version = requestVersion;
        await loadFavorites(jwt, version);
    }, [jwt]);

    return {
        favorites,
        count: favorites.length,
        ready: ready && !authLoading,
        syncing,
        isFavorite,
        add,
        remove,
        toggle,
        refresh,
    };
}
