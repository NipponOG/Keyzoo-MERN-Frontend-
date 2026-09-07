// utils/recentlyViewed.js
// export function addRecentlyViewed(item) {
//     if (typeof window === 'undefined') return;

//     const STORAGE_KEY = 'recently_viewed';
//     const MAX_ITEMS = 15;

//     const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

//     // Remove duplicate
//     const filtered = existing.filter(p => p.id !== item.id);

//     // Add to top
//     const updated = [item, ...filtered].slice(0, MAX_ITEMS);

//     localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
// }


// utils/recentlyViewed.js

const STORAGE_KEY = "recently_viewed";
const MAX_ITEMS = 15;
const EXPIRY_DAYS = 7;
const EXPIRY_MS = EXPIRY_DAYS * 24 * 60 * 60 * 1000;

/**
 * Add item to recently viewed
 */
export function addRecentlyViewed(item) {
    if (typeof window === "undefined") return;

    const now = Date.now();

    const existing = getRecentlyViewedRaw();

    // Remove same product if already exists
    const filtered = existing.filter(p => p.id !== item.id);

    const updated = [
        {
            ...item,
            _viewedAt: now, // 👈 timestamp
        },
        ...filtered,
    ].slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Get cleaned recently viewed list
 */
export function getRecentlyViewed() {
    if (typeof window === "undefined") return [];

    const now = Date.now();

    const cleaned = getRecentlyViewedRaw().filter(item => {
        // ❌ expired
        if (!item._viewedAt || now - item._viewedAt > EXPIRY_MS) {
            return false;
        }

        // ❌ product deleted or unavailable
        if (item.available === false) {
            return false;
        }

        return true;
    });

    // Save cleaned list back
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));

    return cleaned;
}

/**
 * Internal helper (raw fetch)
 */
function getRecentlyViewedRaw() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

/**
 * Optional manual clear
 */
export function clearRecentlyViewed() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
}
