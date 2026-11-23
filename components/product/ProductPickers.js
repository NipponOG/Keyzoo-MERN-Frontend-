import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import RegionFlag from "@/components/RegionFlag";
import HoverCard from "@/components/HoverCard";
import { CARD, FOCUS, SECTION, formatPrice } from "./shared";

/* -------------------------------------------------------------------------- */
/*  Region selector                                                            */
/*  options: [{ region, slug, disabled }]                                      */
/* -------------------------------------------------------------------------- */

export function RegionSelector({ currentRegion, options, onSelect }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const listId = useId();

    const close = useCallback(() => {
        setOpen(false);
        setQuery("");
    }, []);

    // Close on outside click / tap and on Escape
    useEffect(() => {
        if (!open) return;

        const onPointerDown = (e) => {
            if (!rootRef.current?.contains(e.target)) close();
        };
        const onKey = (e) => {
            if (e.key === "Escape") {
                close();
                triggerRef.current?.focus();
            }
        };

        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open, close]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q ? options.filter((o) => o.region.toLowerCase().includes(q)) : options;
    }, [options, query]);

    return (
        <div
            id="region-selector"
            className={`${CARD} mt-2 flex scroll-mt-28 flex-col gap-3 p-5 sm:flex-row sm:items-center sm:gap-5`}
        >
            <h3 className="text-sm font-semibold">Available region</h3>

            <div ref={rootRef} className="relative w-full sm:w-[340px]">
                <button
                    ref={triggerRef}
                    type="button"
                    onClick={() => (open ? close() : setOpen(true))}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-controls={open ? listId : undefined}
                    className={`flex h-[54px] w-full items-center justify-between rounded-xl border bg-[#111]/5 px-5 transition-all duration-300 hover:border-purple-500/40 border-white/10 ${FOCUS}`}
                >
                    <span className="flex items-center gap-3">
                        <RegionFlag region={currentRegion} />
                        <span>{currentRegion}</span>
                    </span>
                    <svg
                        className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-hidden="true"
                    >
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </button>

                {open && (
                    <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#171717] shadow-2xl dark:border-white/10 dark:bg-[#171717]">
                        {options.length > 6 && (
                            <div className="border-b border-white/10 p-3">
                                <input
                                    autoFocus
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search region…"
                                    aria-label="Search regions"
                                    className="w-full rounded-md bg-gray-100 px-3 py-2 text-sm outline-none dark:bg-[#1f1f1f]"
                                />
                            </div>
                        )}

                        <div
                            id={listId}
                            role="listbox"
                            aria-label="Regions"
                            className="no-scrollbar max-h-[220px] overflow-y-auto"
                        >
                            {filtered.length > 0 ? (
                                filtered.map((o) => {
                                    const selected = o.region === currentRegion;
                                    return (
                                        <button
                                            key={o.region}
                                            type="button"
                                            role="option"
                                            aria-selected={selected}
                                            disabled={o.disabled}
                                            onClick={() => {
                                                close();
                                                if (!selected) onSelect(o);
                                            }}
                                            className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm uppercase transition disabled:cursor-not-allowed disabled:opacity-40 ${selected
                                                    ? "bg-[#6b3bfc] text-white"
                                                    : "hover:bg-white/5"
                                                }`}
                                        >
                                            <RegionFlag region={o.region} />
                                            <span className="min-w-0 flex-1">
                                                {o.region}
                                                {o.disabled && (
                                                    <span className="block text-[11px] normal-case opacity-70">
                                                        Not available for this edition
                                                    </span>
                                                )}
                                            </span>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="px-4 py-3 text-sm text-gray-500 dark:text-white/50">
                                    No region found
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Edition picker                                                             */
/*  editions: [{ slug, var_title, available, price, discountPrice }]           */
/* -------------------------------------------------------------------------- */

export function EditionPicker({ editions, currentTitle, symbol, onSelect, onPrefetch }) {
    const labelId = useId();

    return (
        <div className={`${CARD} ${SECTION} p-5`}>
            <h3 id={labelId} className="mb-4 text-sm font-semibold">
                Available editions
            </h3>

            <div role="radiogroup" aria-labelledby={labelId} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {editions.map((edition) => {
                    const isCurrent = edition.var_title === currentTitle;
                    const price = edition.discountPrice ?? edition.price;

                    return (
                        <label
                            key={edition.slug}
                            onMouseEnter={() => edition.available && onPrefetch(edition.slug)}
                            className={`block w-full select-none sm:w-[180px] ${edition.available ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                                }`}
                        >
                            <input
                                type="radio"
                                name="edition"
                                value={edition.slug}
                                className="peer sr-only"
                                checked={isCurrent}
                                disabled={!edition.available}
                                onFocus={() => edition.available && onPrefetch(edition.slug)}
                                onChange={() => {
                                    if (edition.available && !isCurrent) onSelect(edition.slug);
                                }}
                            />

                            <div
                                className={`flex min-h-[90px] flex-col justify-between rounded-xl border p-4 transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-purple-500 ${!edition.available
                                        ? "border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-[#111] dark:text-white/40"
                                        : isCurrent
                                            ? "scale-[1.02] border-purple-500 bg-white ring-2 ring-purple-500/40 dark:bg-[#1a1a1a]"
                                            : "border-gray-200 bg-white hover:border-purple-400 dark:border-[#2e2e2e] dark:bg-[#1a1a1a]"
                                    }`}
                            >
                                <div className="flex flex-wrap items-center gap-x-2 text-sm font-semibold">
                                    <HoverCard title={edition.var_title}>
                                        <span className="line-clamp-2">{edition.var_title}</span>
                                    </HoverCard>
                                    {isCurrent && edition.available && (
                                        <span className="text-xs text-green-600 dark:text-green-400">(Current)</span>
                                    )}
                                    {!edition.available && (
                                        <span className="text-xs text-red-500 dark:text-red-400">(Out of stock)</span>
                                    )}
                                </div>

                                <div className="mt-1 h-[16px] text-xs text-gray-500 dark:text-white/50">
                                    {edition.available && price != null
                                        ? `from ${symbol} ${formatPrice(price)}`
                                        : "Unavailable"}
                                </div>
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}