// Shared styles and helpers for the product page components.

export const CARD = "rounded-2xl border bg-[#1a1a1a] text-white border-white/10";

// vertical rhythm + max width for full-width page sections
export const SECTION = "mx-auto mt-4 w-full max-w-[1500px] lg:mt-6";

export const MUTED = "text-gray-500 dark:text-gray-400";

export const LINK = "text-xs font-medium text-blue-600 hover:underline dark:text-[#359dff]";

export const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500";

export function formatPrice(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n.toFixed(2) : "";
}

// Icon from the shared SVG sprite
export function SpriteIcon({ id, className = "h-8 w-8 text-blue-500", fill = true }) {
    return (
        <svg
            className={`${className} ${fill ? "fill-current" : ""}`}
            aria-hidden="true"
            focusable="false"
        >
            <use href={`/sprit/icons.svg#${id}`} />
        </svg>
    );
}
