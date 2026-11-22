import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Loader2, Search, X } from "lucide-react";
import useCurrency from "@/hook/useCurrency";

/* -------------------------------------------------------------------------- */
/*  Config + helpers                                                           */
/* -------------------------------------------------------------------------- */

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
const MIN_CHARS = 3;
const DEBOUNCE_MS = 250;
const MAX_RESULTS = 8;
const CACHE_TTL_MS = 60_000;
const CACHE_LIMIT = 50;
const FALLBACK_IMAGE = "/keyzoo-fallback.png";

const IDLE = { status: "idle", results: [] };
const PANEL =
  "absolute left-0 right-0 top-full z-50 mt-2 rounded-lg bg-[#1a1a1a] text-white shadow-lg ring-1 ring-white/5";

// Same routes as the store page. Unknown types keep the old /{type}/{slug} shape.
function getItemHref(item) {
  if (item.type === "gift-card" && item.platform) {
    return `/store/category/gift-card/${item.platform}/${item.slug}`;
  }
  if (item.type === "psn" || item.type === "store/category/product/psn") {
    return `/store/category/product/psn/${item.slug}`;
  }
  if (item.type === "product") return `/product/${item.slug}`;
  return `/${item.type}/${item.slug}`;
}

// In-memory cache: typing, deleting and retyping the same text costs no requests
const searchCache = new Map();

function getCached(term) {
  const hit = searchCache.get(term.toLowerCase());
  return hit && Date.now() - hit.time < CACHE_TTL_MS ? hit.results : null;
}

async function searchProducts(term, signal) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not configured");

  const res = await fetch(`${API_URL}/search/live?q=${encodeURIComponent(term)}`, { signal });
  if (!res.ok) throw new Error("Failed to fetch search results");

  const json = await res.json();
  const results = Array.isArray(json?.data) ? json.data : [];

  searchCache.set(term.toLowerCase(), { results, time: Date.now() });
  if (searchCache.size > CACHE_LIMIT) {
    searchCache.delete(searchCache.keys().next().value);
  }
  return results;
}

function Highlight({ text, term }) {
  const i = term ? text.toLowerCase().indexOf(term.toLowerCase()) : -1;
  if (i === -1) return text;

  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent font-bold text-[#a98bff]">
        {text.slice(i, i + term.length)}
      </mark>
      {text.slice(i + term.length)}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Result row                                                                 */
/* -------------------------------------------------------------------------- */

const ResultRow = memo(function ResultRow({ item, id, index, active, symbol, term, onSelect, onHover }) {
  const price = Number(item.price) || 0;
  const discounted = Number(item.discountPrice) > 0 ? Number(item.discountPrice) : price;
  const discount = price > discounted ? Math.round((1 - discounted / price) * 100) : 0;

  return (
    <li
      id={id}
      role="option"
      aria-selected={active}
      onMouseEnter={() => onHover(index)}
      className={`border-b border-[#2a2a2a] transition-colors duration-150 ${
        active ? "bg-[#212121]" : ""
      }`}
    >
      <Link
        href={getItemHref(item)}
        prefetch={false}
        tabIndex={-1}
        onClick={onSelect}
        className="flex w-full items-start gap-4 px-5 py-4"
      >
        <Image
          src={item.image || FALLBACK_IMAGE}
          alt=""
          width={80}
          height={110}
          sizes="80px"
          className="h-[110px] w-[80px] shrink-0 rounded-md object-cover object-center"
        />

        <div className="flex min-w-0 flex-1 flex-col pt-1">
          <h3 className="line-clamp-2 text-[17px] font-semibold leading-6 text-white">
            <Highlight text={item.title || ""} term={term} />
          </h3>

          {item.region && (
            <p className="mt-2 text-[15px] font-semibold uppercase text-[#00A6FF]">{item.region}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-[20px] font-bold leading-none text-white">
              {symbol} {discounted.toFixed(2)}
            </span>

            {discount > 0 && (
              <>
                <span className="text-[16px] text-gray-500 line-through">
                  {symbol} {price.toFixed(2)}
                </span>
                <span className="rounded-md bg-[#ff2d55] px-2 py-1 text-[14px] font-semibold leading-none text-white">
                  ~{discount}% off
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
});

function SkeletonRows() {
  return (
    <div className={`${PANEL} overflow-hidden`} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex animate-pulse gap-4 border-b border-[#2a2a2a] px-5 py-4">
          <div className="h-[110px] w-[80px] shrink-0 rounded-md bg-white/10" />
          <div className="flex-1 space-y-3 pt-1">
            <div className="h-4 w-3/4 rounded bg-white/10" />
            <div className="h-3 w-1/4 rounded bg-white/10" />
            <div className="mt-4 h-5 w-1/3 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Search box                                                                 */
/* -------------------------------------------------------------------------- */

export default function LiveSearch({ setIsSearchOpen, autoFocus = false }) {
  const router = useRouter();
  const { symbol } = useCurrency();
  const uid = useId();

  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const keyboardNav = useRef(false);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(IDLE);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [retryKey, setRetryKey] = useState(0);

  const term = query.trim();
  const listId = `${uid}-list`;
  const optionId = (i) => `${uid}-opt-${i}`;
  const searchHref = `/store?search=${encodeURIComponent(term)}`;

  const visible = useMemo(() => state.results.slice(0, MAX_RESULTS), [state.results]);
  const panelOpen = open && term.length > 0;
  const showList = panelOpen && term.length >= MIN_CHARS && visible.length > 0;

  const closeAndReset = useCallback(() => {
    setOpen(false);
    setQuery("");
    setState(IDLE);
    setActiveIndex(-1);
    setIsSearchOpen?.(false);
  }, [setIsSearchOpen]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Reset after navigating anywhere
  useEffect(() => {
    router.events.on("routeChangeStart", closeAndReset);
    return () => router.events.off("routeChangeStart", closeAndReset);
  }, [router.events, closeAndReset]);

  // Close when clicking or tapping outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Fetch: debounced, cancellable, cached
  useEffect(() => {
    setActiveIndex(-1);

    if (term.length < MIN_CHARS) {
      setState((s) => (s.status === "idle" && s.results.length === 0 ? s : IDLE));
      return;
    }

    const cached = getCached(term);
    if (cached) {
      setState({ status: "done", results: cached });
      return;
    }

    const controller = new AbortController();
    // keep the previous results on screen while the new ones load
    setState((s) => ({ status: "loading", results: s.results }));

    const timer = setTimeout(async () => {
      try {
        const results = await searchProducts(term, controller.signal);
        setState({ status: "done", results });
      } catch (err) {
        if (err.name === "AbortError") return; // a newer query replaced this one
        console.error("Error fetching search results:", err);
        setState({ status: "error", results: [] });
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term, retryKey]);

  // Keep the keyboard-highlighted row visible
  useEffect(() => {
    if (activeIndex < 0 || !keyboardNav.current) return;
    document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const onHover = useCallback((i) => {
    keyboardNav.current = false;
    setActiveIndex(i);
  }, []);

  const onKeyDown = (e) => {
    const count = visible.length;

    switch (e.key) {
      case "ArrowDown":
        if (!count) return;
        e.preventDefault();
        keyboardNav.current = true;
        setOpen(true);
        setActiveIndex((i) => (i + 1) % count);
        break;

      case "ArrowUp":
        if (!count) return;
        e.preventDefault();
        keyboardNav.current = true;
        setOpen(true);
        setActiveIndex((i) => (i <= 0 ? count - 1 : i - 1));
        break;

      case "Escape":
        if (panelOpen) {
          e.stopPropagation(); // close the list first, not the whole mobile overlay
          setOpen(false);
          setActiveIndex(-1);
        } else if (query) {
          setQuery("");
        }
        break;

      default:
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const item = visible[activeIndex];

    if (item) router.push(getItemHref(item));
    else if (term) router.push(searchHref);
  };

  const onBlur = (e) => {
    // Tabbing out closes the list. Pointer clicks are handled above, because
    // some browsers don't focus links on click and relatedTarget would be null.
    const next = e.relatedTarget;
    if (next && !rootRef.current?.contains(next)) setOpen(false);
  };

  const announcement =
    term.length < MIN_CHARS
      ? ""
      : state.status === "loading"
        ? "Searching"
        : state.status === "error"
          ? "Search failed"
          : state.status === "done"
            ? visible.length
              ? `${visible.length} results available`
              : "No results found"
            : "";

  return (
    <div ref={rootRef} onBlur={onBlur} className="relative w-full">
      <form role="search" onSubmit={onSubmit} className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
        />

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label="Search products"
          aria-expanded={panelOpen}
          aria-controls={showList ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={showList && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          inputMode="search"
          enterKeyHint="search"
          placeholder="Search for games, gift cards and more"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => term && setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full rounded-md bg-white py-3 pl-10 pr-16 text-black placeholder-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d3cff]"
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {state.status === "loading" && (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin text-gray-500" />
          )}
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="rounded p-1 text-gray-500 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6d3cff]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </form>

      {panelOpen &&
        (term.length < MIN_CHARS ? (
          <div className={`${PANEL} p-4 text-center text-sm text-gray-400`}>
            Type at least {MIN_CHARS} characters to search.
          </div>
        ) : showList ? (
          <ul
            id={listId}
            role="listbox"
            aria-label="Search results"
            className={`${PANEL} no-scrollbar max-h-[calc(100svh-96px)] overflow-y-auto transition-opacity md:max-h-[500px] ${
              state.status === "loading" ? "opacity-70" : ""
            }`}
          >
            {visible.map((item, i) => (
              <ResultRow
                key={`${item.type}-${item.id}`}
                item={item}
                id={optionId(i)}
                index={i}
                active={i === activeIndex}
                symbol={symbol}
                term={term}
                onSelect={closeAndReset}
                onHover={onHover}
              />
            ))}

            <li role="presentation">
              <Link
                href={searchHref}
                prefetch={false}
                tabIndex={-1}
                onClick={closeAndReset}
                className="block px-5 py-3 text-center text-sm font-semibold text-[#a98bff] transition-colors hover:bg-[#212121]"
              >
                See all results for “{term}”
              </Link>
            </li>
          </ul>
        ) : state.status === "loading" ? (
          <SkeletonRows />
        ) : state.status === "error" ? (
          <div className={`${PANEL} p-4 text-center text-sm text-gray-300`}>
            Couldn’t load results.{" "}
            <button
              type="button"
              onClick={() => setRetryKey((k) => k + 1)}
              className="font-semibold text-[#a98bff] underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        ) : state.status === "done" ? (
          <div className={`${PANEL} p-4 text-center text-gray-400`}>
            No products found for “{term}”.
          </div>
        ) : null)}

      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>
    </div>
  );
}