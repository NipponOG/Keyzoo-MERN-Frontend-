import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { MdClose, MdFilterList, MdOutlineKeyboardArrowDown } from "react-icons/md";
import useCurrency from "@/hook/useCurrency";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ProductCard from "@/components/ProductCard";

/* -------------------------------------------------------------------------- */
/*  Config                                                                     */
/* -------------------------------------------------------------------------- */

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
const PAGE_SIZE = 10;
const DEBOUNCE_MS = 400;
const CACHE_TTL_MS = 60_000;
const CACHE_LIMIT = 40;
const FALLBACK_IMAGE = "/keyzoo-fallback.png";
const ELLIPSIS = "ellipsis";

const EMPTY_FILTERS = {
  search: "",
  platforms: [],
  regions: [],
  productTypes: [],
  worksOn: [],
  onlyAvailable: false,
  minPrice: "", // "" means "no limit"
  maxPrice: "",
};

// filter field -> query-string / API parameter
const LIST_PARAMS = {
  platforms: "platform",
  regions: "region",
  productTypes: "productType",
  worksOn: "worksOn",
};

const LIST_SECTIONS = [
  { field: "platforms", title: "Platforms" },
  { field: "productTypes", title: "Product Type" },
  { field: "regions", title: "Region" },
  { field: "worksOn", title: "Works On" },
];

const INPUT_CLS = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-purple-500 dark:border-white/5 dark:bg-[#1a1a1f] dark:text-white dark:placeholder:text-gray-500";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const first = (v) => (Array.isArray(v) ? v[0] : v);
const parseList = (v) => (v ? String(first(v)).split(",").filter(Boolean) : []);
const toPrice = (v) => {
  const n = Number(first(v));
  return Number.isFinite(n) && n > 0 ? String(n) : "";
};
const parsePage = (v) => {
  const n = Math.floor(Number(first(v)));
  return Number.isFinite(n) && n > 0 ? n : 1;
};

function filtersFromQuery(q) {
  return {
    search: q.search ? String(first(q.search)) : "",
    platforms: parseList(q.platform),
    regions: parseList(q.region),
    productTypes: parseList(q.productType),
    worksOn: parseList(q.worksOn),
    onlyAvailable: first(q.available) === "true",
    minPrice: toPrice(q.minPrice),
    maxPrice: toPrice(q.maxPrice),
  };
}

// Used for both the page URL and the API request so they never drift apart
function toParams(filters, page) {
  const p = new URLSearchParams();
  const search = filters.search.trim();

  if (search) p.set("search", search);
  for (const [field, param] of Object.entries(LIST_PARAMS)) {
    if (filters[field].length) p.set(param, filters[field].join(","));
  }
  if (filters.onlyAvailable) p.set("available", "true");
  if (filters.minPrice) p.set("minPrice", filters.minPrice);
  if (filters.maxPrice) p.set("maxPrice", filters.maxPrice);
  if (page > 1) p.set("page", String(page));

  return p;
}

function toApiQuery(filters, page) {
  const p = toParams(filters, page);
  p.set("page", String(page));
  p.set("pageSize", String(PAGE_SIZE));
  return p.toString();
}

function hasActiveFilters(f) {
  return Boolean(
    f.search.trim() ||
    f.platforms.length ||
    f.regions.length ||
    f.productTypes.length ||
    f.worksOn.length ||
    f.onlyAvailable ||
    f.minPrice ||
    f.maxPrice
  );
}

const SPECIAL_LABELS = {
  psn: "PlayStation",
  xbox: "Xbox",
  steam: "Steam",
  spotify: "Spotify",
  roblox: "Roblox",
  binance: "Binance",
};

function formatLabel(value) {
  if (!value) return "";
  const str = String(value);
  const special = SPECIAL_LABELS[str.toLowerCase()];
  if (special) return special;
  // keep short codes such as USA / UK / EU as they are
  if (str.length <= 3 && str === str.toUpperCase()) return str;
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function getItemHref(item) {
  switch (item.type) {
    case "gift-card":
      return `/store/category/gift-card/${item.platform}/${item.slug}`;
    case "psn":
    case "store/category/product/psn":
      return `/store/category/product/psn/${item.slug}`;
    default:
      return `/product/${item.slug}`;
  }
}

function normalizeItem(item) {
  const original = Number(item.price ?? 0) || 0;
  const price = Number(item.discountPrice ?? item.price ?? 0) || 0;

  return {
    id: item.id ?? item._id,
    slug: item.slug,
    type: item.type,
    platform: item.platform,
    title: item.title,

    available: Boolean(item.available ?? item.Available),
    region: item.card_region ?? item.region ?? "",

    price,
    original,

    discount:
      original > price && original > 0
        ? Math.round(((original - price) / original) * 100)
        : 0,

    imgUrl: item.image || FALLBACK_IMAGE,
    blurUrl: "",
  };
}

function getPageItems(page, total) {
  const pages = [
    ...new Set([1, total, ...[-2, -1, 0, 1, 2].map((d) => page + d)]),
  ]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const out = [];
  pages.forEach((p, i) => {
    const prev = pages[i - 1];
    if (prev && p - prev === 2) out.push(prev + 1); // a single gap is just a number
    else if (prev && p - prev > 2) out.push(ELLIPSIS);
    out.push(p);
  });
  return out;
}

const runWhenIdle = (fn) =>
  typeof window.requestIdleCallback === "function"
    ? window.requestIdleCallback(fn, { timeout: 2000 })
    : setTimeout(fn, 300);

function handleNotify() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("jwt");
    if (!user || !token) {
      toast.error("Please login first");
      return;
    }
  } catch {
    toast.error("Please login first");
    return;
  }
  toast.error("Stock alerts are temporarily unavailable.");
}

/* -------------------------------------------------------------------------- */
/*  Data layer: small in-memory cache so repeat visits and the next page are   */
/*  instant                                                                    */
/* -------------------------------------------------------------------------- */

const storeCache = new Map();
let filterOptionsCache = null;

async function fetchJson(path, signal) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not configured");

  const res = await fetch(`${API_URL}${path}`, { signal });
  const json = await res.json().catch(() => ({}));

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Request failed");
  }
  return json;
}

async function loadStore(apiQuery, signal) {
  const hit = storeCache.get(apiQuery);
  if (hit && Date.now() - hit.time < CACHE_TTL_MS) return hit.data;

  const json = await fetchJson(`/store?${apiQuery}`, signal);
  const rows = json.data || [];
  const total = Number(json.total ?? rows.length);

  const data = {
    items: rows.map(normalizeItem),
    total,
    totalPages: Math.max(1, Number(json.totalPages ?? Math.ceil(total / PAGE_SIZE))),
  };

  storeCache.set(apiQuery, { data, time: Date.now() });
  if (storeCache.size > CACHE_LIMIT) {
    storeCache.delete(storeCache.keys().next().value);
  }
  return data;
}

async function loadFilterOptions(signal) {
  if (filterOptionsCache) return filterOptionsCache;

  const { data = {} } = await fetchJson("/store/filter-options", signal);
  filterOptionsCache = {
    platforms: data.platforms || [],
    regions: data.regions || [],
    productTypes: data.productTypes || [],
    worksOn: data.worksOn || [],
    counts: data.counts || {},
  };
  return filterOptionsCache;
}

/* -------------------------------------------------------------------------- */
/*  Small UI pieces (module level, so they keep their state between renders)   */
/* -------------------------------------------------------------------------- */

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function OptionRow({ checked, onChange, label, count }) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2 transition-colors ${checked
        ? "border-purple-500/30 bg-purple-500/15"
        : "border-transparent hover:bg-purple-500/10"
        }`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition peer-focus-visible:ring-2 peer-focus-visible:ring-purple-400 ${checked ? "border-purple-500 bg-purple-500" : "border-white/20"
            }`}
        >
          {checked && <CheckIcon />}
        </span>
        <span className="truncate text-sm font-medium text-white">{label}</span>
      </span>
      {count != null && <span className="text-xs text-gray-500">{count}</span>}
    </label>
  );
}

const FilterSection = memo(function FilterSection({ title, field, items, selected, counts, onToggle }) {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const panelId = useId();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        String(item).toLowerCase().includes(q) || formatLabel(item).toLowerCase().includes(q)
    );
  }, [items, query]);

  if (!items.length) return null;

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold transition hover:bg-purple-500/10 text-white"
      >
        {title}
        <MdOutlineKeyboardArrowDown
          className={`text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div id={panelId} className="mt-3 space-y-3">
          {items.length > 6 && (
            <input
              type="search"
              placeholder={`Search ${title.toLowerCase()}`}
              aria-label={`Search ${title}`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={INPUT_CLS}
            />
          )}

          <div className="custom-scroll max-h-[180px] space-y-1 overflow-y-auto pr-1">
            {visible.map((item) => (
              <OptionRow
                key={item}
                checked={selected.includes(item)}
                onChange={(checked) => onToggle(field, item, checked)}
                label={formatLabel(item)}
                count={counts?.[field]?.[item]}
              />
            ))}
            {visible.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-500">Nothing matches “{query}”.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

const FiltersBody = memo(function FiltersBody({
  filters,
  inputs,
  onInput,
  onToggle,
  onAvailable,
  onClear,
  isActive,
  options,
}) {
  const uid = useId();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <button
          type="button"
          onClick={onClear}
          disabled={!isActive}
          className={`text-sm ${isActive
            ? "cursor-pointer text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
            : "cursor-not-allowed text-gray-400 dark:text-gray-500"
            }`}
        >
          Clear all
        </button>
      </div>

      <div className="mb-6">
        <label htmlFor={`${uid}-search`} className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
          Product name
        </label>
        <input
          id={`${uid}-search`}
          type="search"
          placeholder="Search for games, gift cards"
          value={inputs.search}
          onChange={(e) => onInput("search", e.target.value)}
          className={INPUT_CLS}
        />

        <div className="mt-3 space-y-1">
          <OptionRow
            label="Works in India"
            checked={filters.regions.includes("INDIA")}
            onChange={(checked) => onToggle("regions", "INDIA", checked)}
          />
          <OptionRow
            label="Exclude out of stock products"
            checked={filters.onlyAvailable}
            onChange={onAvailable}
          />
        </div>
      </div>

      <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-white/10" />

      <div className="mb-6">
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Price range (₹)</p>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            aria-label="Minimum price"
            value={inputs.min}
            onChange={(e) => onInput("min", e.target.value)}
            className={INPUT_CLS}
          />
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            aria-label="Maximum price"
            value={inputs.max}
            onChange={(e) => onInput("max", e.target.value)}
            className={INPUT_CLS}
          />
        </div>
      </div>

      <div className="my-5 border-t border-gray-200 dark:border-white/5" />

      {LIST_SECTIONS.map(({ field, title }) => (
        <FilterSection
          key={field}
          title={title}
          field={field}
          items={options[field] || []}
          selected={filters[field]}
          counts={options.counts}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
});

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg bg-gray-200 p-1 dark:bg-[#1a1a1f]">
      <div className="mb-1.5 aspect-[3/5] w-full rounded-md bg-gray-300/60 dark:bg-white/5" />
      <div className="h-[120px] rounded-md bg-gray-300/40 dark:bg-white/[0.03]" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function StorePage() {
  const router = useRouter();
  const { symbol } = useCurrency();

  // `ready` flips once the URL has been read, so we never fetch with empty
  // filters first and then fetch again with the real ones.
  const [ready, setReady] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);

  // Text fields are typed into locally and committed to `filters` after a pause
  const [searchInput, setSearchInput] = useState("");
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");

  const [options, setOptions] = useState(filterOptionsCache);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtersRef = useRef(filters);
  filtersRef.current = filters;
  const pageRef = useRef(page);
  pageRef.current = page;
  const ownWrites = useRef(new Set()); // URLs this page wrote itself

  /* ---- filter actions (all stable, so memoized children don't re-render) -- */

  const applyFilters = useCallback((patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  }, []);

  const toggleListValue = useCallback(
    (field, value, checked) => {
      const current = filtersRef.current[field];
      const next = checked
        ? current.includes(value)
          ? current
          : [...current, value]
        : current.filter((v) => v !== value);
      applyFilters({ [field]: next });
    },
    [applyFilters]
  );

  const setOnlyAvailable = useCallback(
    (value) => applyFilters({ onlyAvailable: value }),
    [applyFilters]
  );

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
    setSearchInput("");
    setMinInput("");
    setMaxInput("");
  }, []);

  const onInput = useCallback((name, value) => {
    if (name === "search") setSearchInput(value);
    else if (name === "min") setMinInput(value);
    else setMaxInput(value);
  }, []);

  const goToPage = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ---- 1. read the URL (first load, and external changes such as the
          header search or Back/Forward) ------------------------------------- */

  useEffect(() => {
    if (!router.isReady) return;

    const qs = (router.asPath.split("?")[1] || "").split("#")[0];

    if (ready) {
      // our own router.replace landing, or a URL that already matches the state
      if (ownWrites.current.delete(qs)) return;
      if (qs === toParams(filtersRef.current, pageRef.current).toString()) return;
    }

    const next = filtersFromQuery(router.query);
    setFilters(next);
    setSearchInput(next.search);
    setMinInput(next.minPrice);
    setMaxInput(next.maxPrice);
    setPage(parsePage(router.query.page));
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.asPath]);

  /* ---- 2. commit text inputs after the user stops typing ------------------ */

  useEffect(() => {
    if (!ready) return;

    const timer = setTimeout(() => {
      const next = {
        search: searchInput.trim(),
        minPrice: toPrice(minInput),
        maxPrice: toPrice(maxInput),
      };
      const cur = filtersRef.current;
      if (
        next.search !== cur.search ||
        next.minPrice !== cur.minPrice ||
        next.maxPrice !== cur.maxPrice
      ) {
        applyFilters(next);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchInput, minInput, maxInput, ready, applyFilters]);

  /* ---- 3. keep the URL in sync (replace, so Back still leaves the page) --- */

  useEffect(() => {
    if (!ready) return;

    const params = toParams(filters, page);
    const current = (router.asPath.split("?")[1] || "").split("#")[0];
    if (params.toString() === current) return;

    ownWrites.current.add(params.toString());
    router.replace(
      { pathname: router.pathname, query: Object.fromEntries(params) },
      undefined,
      { shallow: true, scroll: false }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page, ready]);

  /* ---- 4. filter options (fetched once per session) ----------------------- */

  useEffect(() => {
    if (filterOptionsCache) return;

    const controller = new AbortController();
    loadFilterOptions(controller.signal)
      .then(setOptions)
      .catch((err) => {
        if (err.name !== "AbortError") console.error("Failed to fetch filter items:", err);
      });
    return () => controller.abort();
  }, []);

  /* ---- 5. products -------------------------------------------------------- */

  useEffect(() => {
    if (!ready) return;

    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await loadStore(toApiQuery(filters, page), controller.signal);
        if (controller.signal.aborted) return;

        setResult(data);

        // warm the cache for "next page" while the browser is idle
        if (page < data.totalPages) {
          const nextQuery = toApiQuery(filters, page + 1);
          runWhenIdle(() => loadStore(nextQuery).catch(() => { }));
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Failed to fetch store items:", err);
        setError(err.message || "Failed to load store items.");
        toast.error("Failed to load store items.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [ready, filters, page, reloadKey]);

  // A deep link to a page that no longer exists falls back to the last page
  useEffect(() => {
    if (result && result.items.length === 0 && page > result.totalPages) {
      setPage(result.totalPages);
    }
  }, [result, page]);

  /* ---- mobile drawer: lock scroll + close on Escape ----------------------- */

  useEffect(() => {
    if (!filtersOpen) return;

    const onKey = (e) => e.key === "Escape" && setFiltersOpen(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [filtersOpen]);

  /* ---- derived ------------------------------------------------------------ */

  const isActive = useMemo(() => hasActiveFilters(filters), [filters]);
  const inputs = useMemo(
    () => ({ search: searchInput, min: minInput, max: maxInput }),
    [searchInput, minInput, maxInput]
  );
  const safeOptions = options || { platforms: [], regions: [], productTypes: [], worksOn: [], counts: {} };

  const chips = useMemo(() => {
    const out = [];

    if (filters.search) {
      out.push({
        key: "search",
        label: `Search: ${filters.search}`,
        remove: () => {
          setSearchInput("");
          applyFilters({ search: "" });
        },
      });
    }

    for (const { field } of LIST_SECTIONS) {
      for (const value of filters[field]) {
        out.push({
          key: `${field}:${value}`,
          label: formatLabel(value),
          remove: () => toggleListValue(field, value, false),
        });
      }
    }

    if (filters.onlyAvailable) {
      out.push({ key: "available", label: "In stock only", remove: () => setOnlyAvailable(false) });
    }

    if (filters.minPrice || filters.maxPrice) {
      const { minPrice: lo, maxPrice: hi } = filters;
      out.push({
        key: "price",
        label: lo && hi ? `₹${lo} – ₹${hi}` : lo ? `₹${lo}+` : `Up to ₹${hi}`,
        remove: () => {
          setMinInput("");
          setMaxInput("");
          applyFilters({ minPrice: "", maxPrice: "" });
        },
      });
    }

    return out;
  }, [filters, applyFilters, toggleListValue, setOnlyAvailable]);

  const items = result?.items ?? [];
  const totalPages = result?.totalPages ?? 1;
  const pageItems = useMemo(() => getPageItems(page, totalPages), [page, totalPages]);

  const showSkeleton = !error && items.length === 0 && (loading || !ready);
  const showEmpty = !error && !loading && ready && result && items.length === 0;

  const filtersBody = (
    <FiltersBody
      filters={filters}
      inputs={inputs}
      onInput={onInput}
      onToggle={toggleListValue}
      onAvailable={setOnlyAvailable}
      onClear={clearFilters}
      isActive={isActive || Boolean(searchInput || minInput || maxInput)}
      options={safeOptions}
    />
  );

  /* ---- render ------------------------------------------------------------- */

  return (
    <div className="px-4 py-8 md:px-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Best Selling Gift Cards</h1>
          {result && (
            <p aria-live="polite" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {result.total.toLocaleString()} {result.total === 1 ? "result" : "results"}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 lg:hidden dark:border-white/10 dark:bg-[#121216] dark:text-white"
        >
          <MdFilterList aria-hidden="true" />
          Filters
          {chips.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-600 px-1 text-xs text-white">
              {chips.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-[300px] shrink-0 lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-white/10 bg-[#161616] p-5 shadow-sm">
            {filtersBody}
          </div>
        </aside>

        {/* Results */}
        <div className="min-w-0 flex-1">
          {chips.length > 0 && (
            <ul className="mb-4 flex flex-wrap gap-2" aria-label="Active filters">
              {chips.map((chip) => (
                <li key={chip.key}>
                  <button
                    type="button"
                    onClick={chip.remove}
                    aria-label={`Remove filter ${chip.label}`}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-700 transition hover:bg-purple-500/20 dark:text-purple-200"
                  >
                    {chip.label}
                    <MdClose aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="mb-4 text-gray-700 dark:text-gray-300">We couldn’t load the store right now.</p>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="cursor-pointer rounded-full bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
              >
                Try again
              </button>
            </div>
          )}

          {showEmpty && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Image
                src="/3d/no-data.png"
                alt=""
                width={320}
                height={320}
                className="mb-4 h-auto w-64"
              />
              <p className="text-white">No products match your filters.</p>
              {isActive && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 cursor-pointer rounded-full border border-purple-500/40 px-6 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-500/10 dark:text-purple-300"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {(showSkeleton || items.length > 0) && !error && (
            <div
              aria-busy={loading}
              className={`grid grid-cols-2 gap-4 transition-opacity duration-200 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${loading && items.length > 0 ? "opacity-60" : "opacity-100"
                }`}
            >
              {showSkeleton
                ? Array.from({ length: PAGE_SIZE }, (_, i) => <CardSkeleton key={i} />)
                : items.map((item) => (
                  <ProductCard
                    key={item.id}
                    card={item}
                    symbol={symbol}
                    href={getItemHref(item)}
                    onNotify={handleNotify}
                  />
                ))}
            </div>
          )}

          {result && totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent className="flex-wrap justify-center">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={page === 1}
                    tabIndex={page === 1 ? -1 : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) goToPage(page - 1);
                    }}
                    className={page === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
                  />
                </PaginationItem>

                {pageItems.map((p, i) =>
                  p === ELLIPSIS ? (
                    <PaginationItem key={`gap-${i}`}>
                      <span
                        aria-hidden="true"
                        className="flex h-9 min-w-9 items-center justify-center px-2 text-sm text-[var(--keyzoo-text-muted)]"
                      >
                        …
                      </span>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === page}
                        onClick={(e) => {
                          e.preventDefault();
                          if (p !== page) goToPage(p);
                        }}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={page === totalPages}
                    tabIndex={page === totalPages ? -1 : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) goToPage(page + 1);
                    }}
                    className={
                      page === totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-black/60" onClick={() => setFiltersOpen(false)} />

          <div className="absolute inset-y-0 left-0 flex w-[min(92vw,360px)] flex-col bg-white shadow-xl dark:bg-[#121216]">
            <div className="flex items-center justify-end border-b border-gray-200 px-3 py-2 dark:border-white/10">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="cursor-pointer rounded-md p-2 text-xl text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
              >
                <MdClose />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">{filtersBody}</div>

            <div className="border-t border-gray-200 p-4 dark:border-white/10">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="w-full cursor-pointer rounded-full bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
              >
                {result ? `Show ${result.total.toLocaleString()} results` : "Show results"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}