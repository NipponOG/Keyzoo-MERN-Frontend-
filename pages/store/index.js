import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import Image from 'next/image';
import OptimizedImage from "@/components/Image/OptimizedImage";
import Link from 'next/link';
import useCurrency from '@/hook/useCurrency';
import HoverCard from '@/components/HoverCard';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useRouter } from "next/router";
import ProductCardImage from "@/components/ProductCardImage";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getStrapiMedia } from '@/lib/getStrapiMedia';

export default function index() {

  const { symbol } = useCurrency();
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notified, setNotified] = useState({});

  // FILTER STATES
  const [search, setSearch] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(999999);

  // FILTER OPTIONS
  const [platforms, setPlatforms] = useState([]);
  const [regions, setRegions] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [worksOn, setWorksOn] = useState([]);
  const [filterCounts, setFilterCounts] = useState({});

  const [selectedProductTypes, setSelectedProductTypes] = useState([]);
  const [selectedWorksOn, setSelectedWorksOn] = useState([]);

  const [page, setPage] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleNotify = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("jwt");

    if (!user || !token) {
      toast.error("Please login first");
      return;
    }

    toast.error("Stock alerts are temporarily unavailable.");
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  const [totalPages, setTotalPages] = useState(1);

  const buildQuery = () => {
    const query = new URLSearchParams();

    if (debouncedSearch.trim()) {
      query.set("search", debouncedSearch.trim());
    }

    if (selectedPlatforms.length) {
      query.set("platform", selectedPlatforms.join(","));
    }

    if (selectedRegions.length) {
      query.set("region", selectedRegions.join(","));
    }

    if (selectedProductTypes.length) {
      query.set("productType", selectedProductTypes.join(","));
    }

    if (selectedWorksOn.length) {
      query.set("worksOn", selectedWorksOn.join(","));
    }

    if (onlyAvailable) {
      query.set("available", "true");
    }

    if (minPrice > 0) {
      query.set("minPrice", String(minPrice));
    }

    if (maxPrice < 999999) {
      query.set("maxPrice", String(maxPrice));
    }

    query.set("page", String(page));
    query.set("pageSize", "10");

    return query.toString();
  };

  useEffect(() => {
    setPage(1);
  }, [
    search,
    selectedPlatforms,
    selectedRegions,
    selectedProductTypes,
    selectedWorksOn,
    onlyAvailable,
    minPrice,
    maxPrice,
  ]);

  useEffect(() => {
    let cancelled = false;

    async function getFilterItems() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not configured");
        }

        const response = await fetch(
          `${apiUrl.replace(/\/$/, "")}/store/filter-options`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to fetch filter items"
          );
        }

        if (cancelled) return;

        setPlatforms(result.data.platforms || []);
        setRegions(result.data.regions || []);
        setProductTypes(result.data.productTypes || []);
        setWorksOn(result.data.worksOn || []);
        setFilterCounts(result.data.counts || {});

      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch filter items:", error);
        }
      }
    }

    getFilterItems();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function getData() {
      setLoading(true);

      try {
        const query = buildQuery();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not configured");
        }

        const response = await fetch(
          `${apiUrl.replace(/\/$/, "")}/store?${query}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to fetch store items"
          );
        }

        if (cancelled) return;

        const merged = (result.data || []).map((item) => ({
          ...item,
          Available: item.available ?? item.Available ?? false,
          card_region: item.card_region ?? item.region ?? "",
          work_platform: item.workPlatform ?? item.work_platform ?? "",
          originalPrice: Number(item.price ?? 0),
          price: Number(item.discountPrice ?? item.price ?? 0),
        }));

        setItems(merged);

        setTotalPages(
          Math.max(
            1,
            Number(
              result.totalPages ??
              Math.ceil((result.total ?? merged.length) / 10)
            )
          )
        );

        // setPlatforms([
        //   ...new Set(filterItems.map((item) => item.platform).filter(Boolean)),
        // ]);

        // setRegions([
        //   ...new Set(filterItems.map((item) => item.card_region).filter(Boolean)),
        // ]);

        // setProductTypes([
        //   ...new Set(filterItems.map((item) => item.item_type).filter(Boolean)),
        // ]);

        // setWorksOn([
        //   ...new Set(filterItems.map((item) => item.work_platform).filter(Boolean)),
        // ]);

      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch store items:", error);
          setItems([]);
          setTotalPages(1);
          toast.error("Failed to load store items.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    getData();

    return () => {
      cancelled = true;
    };
  }, [
    debouncedSearch,
    selectedPlatforms,
    selectedRegions,
    selectedProductTypes,
    selectedWorksOn,
    onlyAvailable,
    minPrice,
    maxPrice,
    page,
  ]);

  const clearFilters = () => {
    setSearch("");
    setSelectedPlatforms([]);
    setSelectedRegions([]);
    setSelectedProductTypes([]);
    setSelectedWorksOn([]);
    setOnlyAvailable(false);
    setMinPrice(0);
    setMaxPrice(999999);
  };

  const isFilterActive =
    search ||
    selectedPlatforms.length ||
    selectedRegions.length ||
    selectedProductTypes.length ||
    selectedWorksOn.length ||
    onlyAvailable ||
    minPrice > 0 ||
    maxPrice < 999999;

  const getPages = () => {
    const pages = [];

    if (page > 3) pages.push(1, "...");

    for (let i = page - 2; i <= page + 2; i++) {
      if (i > 0 && i <= totalPages) {
        pages.push(i);
      }
    }

    if (page < totalPages - 2) pages.push("...", totalPages);

    return pages;
  };

  // const getCount = (mapKey, value) => {

  //   return filterItems.filter((x) => {

  //     if (mapKey === "platforms") {
  //       return x.platform === value;
  //     }

  //     if (mapKey === "regions") {
  //       return x.card_region === value;
  //     }

  //     if (mapKey === "productTypes") {
  //       return x.item_type === value;
  //     }

  //     if (mapKey === "worksOn") {
  //       return x.work_platform === value;
  //     }

  //     return false;

  //   }).length;

  // };

  const getCount = (mapKey, value) => {
    return filterCounts[mapKey]?.[value] ?? 0;
  };

  const getItemHref = (item) => {

    // 🎮 PRODUCTS
    if (item.type === "product") {
      return `/product/${item.slug}`;
    }

    // 🎁 GIFT CARDS
    if (item.type === "gift-card") {
      return `/store/category/gift-card/${item.platform}/${item.slug}`;
    }

    // 🕹️ PLAYSTATION
    if (item.type === "store/category/product/psn") {
      return `/store/category/product/psn/${item.slug}`;
    }

    // FALLBACK
    return "#";
  };

  useEffect(() => {

    const query = {};

    // 🔍 SEARCH
    if (debouncedSearch) {
      query.search = debouncedSearch;
    }

    // 🎮 PLATFORM
    if (selectedPlatforms.length) {
      query.platform = selectedPlatforms.join(",");
    }

    // 🌍 REGION
    if (selectedRegions.length) {
      query.region = selectedRegions.join(",");
    }

    // 📦 PRODUCT TYPE
    if (selectedProductTypes.length) {
      query.productType = selectedProductTypes.join(",");
    }

    // 🖥️ WORKS ON
    if (selectedWorksOn.length) {
      query.worksOn = selectedWorksOn.join(",");
    }

    // ✅ AVAILABLE
    if (onlyAvailable) {
      query.available = "true";
    }

    // 💰 PRICE
    if (minPrice > 0) {
      query.minPrice = minPrice;
    }

    if (maxPrice < 999999) {
      query.maxPrice = maxPrice;
    }

    // ✅ ADD THIS
    if (page > 1) {
      query.page = page;
    }

    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true }
    );

  }, [
    debouncedSearch,
    selectedPlatforms,
    selectedRegions,
    selectedProductTypes,
    selectedWorksOn,
    onlyAvailable,
    minPrice,
    maxPrice,
    page,
  ]);

  useEffect(() => {

    if (!router.isReady) return;

    const {
      search,
      platform,
      region,
      productType,
      worksOn,
      available,
      minPrice,
      maxPrice,
      page
    } = router.query;

    if (search) {
      setSearch(search);
    }

    if (platform) {
      setSelectedPlatforms(String(platform).split(","));
    }

    if (region) {
      setSelectedRegions(String(region).split(","));
    }

    if (productType) {
      setSelectedProductTypes(String(productType).split(","));
    }

    if (worksOn) {
      setSelectedWorksOn(String(worksOn).split(","));
    }

    if (available === "true") {
      setOnlyAvailable(true);
    }

    if (minPrice) {
      setMinPrice(Number(minPrice));
    }

    if (maxPrice) {
      setMaxPrice(Number(maxPrice));
    }

    if (page) {
      setPage(Number(page));
    }

  }, [router.isReady]);

  if (!loading && (!items || items.length === 0)) {
    return (
      <section className="my-0 flex items-center justify-center flex-col min-h-screen">
        <Image
          src="/3d/no-data.png"
          alt="No Data"
          width={512}
          height={512}
          className="mb-4">
        </Image>
        {/* <h2 className="text-xl font-bold mb-4 dark:text-white">
          Best Selling Games
        </h2>
        <p className="text-gray-500">No products found in Best Selling.</p> */}
      </section>
    );
  }

  return (
    <div className="px-4 md:px-10 py-8">

      <h2 className="text-xl font-bold mb-6 dark:text-white">
        Best Selling Gift Cards
      </h2>

      {/* 🔥 MAIN LAYOUT */}
      <div className="flex gap-6">

        {/* 🧱 LEFT FILTER SIDEBAR */}
        <div className="hidden lg:block w-[300px] shrink-0">
          <div className="bg-[#121216] border border-white/10 p-5 rounded-2xl backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.03)] sticky top-24">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-semibold text-lg">Filters</h3>

              <button
                onClick={clearFilters}
                disabled={!isFilterActive}
                className={`text-sm cursor-pointer ${isFilterActive ? "text-purple-400 hover:text-purple-300" : "text-gray-500 cursor-not-allowed"}`}>
                Clear All
              </button>
            </div>

            {/* 🔍 MAIN SEARCH */}
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-2">Product Name</p>

              <input
                type="text"
                placeholder="Search for games, gift cards"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1a1a1f] text-white text-sm border border-white/5 focus:border-purple-500 outline-none"
              />

              <div className="mt-3 space-y-2 text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-white">

                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition
        ${selectedRegions.includes("INDIA")
                      ? "bg-purple-500 border-purple-500"
                      : "border-white/20"}
    `}>
                    {selectedRegions.includes("INDIA") && (
                      <span className="text-xs text-white">✓</span>
                    )}
                  </div>

                  <span>Works in India</span>

                  <input
                    type="checkbox"
                    checked={selectedRegions.includes("INDIA")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRegions(["INDIA"]);
                      } else {
                        setSelectedRegions([]);
                      }
                    }}
                    className="hidden"
                  />
                </label>

                <label className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg cursor-pointer transition">

                  <div className="flex items-center gap-2">

                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition
            ${onlyAvailable
                        ? "bg-purple-500 border-purple-500"
                        : "border-white/20"}
        `}>
                      {onlyAvailable && (
                        <span className="text-xs text-white">✓</span>
                      )}
                    </div>

                    <span className="text-white">Exclude out of stock products</span>
                  </div>

                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

            {/* 💰 PRICE */}
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-2">Price Range (₹)</p>

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="0"
                  onChange={(e) =>
                    setMinPrice(e.target.value ? Number(e.target.value) : 0)
                  }
                  className="w-full px-2 py-2 bg-[#1a1a1f] text-white rounded-lg text-sm border border-white/5 focus:border-purple-500 outline-none"
                />
                <input
                  type="number"
                  placeholder="9999"
                  onChange={(e) =>
                    setMaxPrice(e.target.value ? Number(e.target.value) : 9999)
                  }
                  className="w-full px-2 py-2 bg-[#1a1a1f] text-white rounded-lg text-sm border border-white/5 focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <div className="border-t border-white/5 my-5" />

            {/* 🎮 PLATFORM */}
            <FilterSection
              title="Platforms"
              items={platforms}
              selected={selectedPlatforms}
              mapKey="platforms"
              onChange={(value, checked) => {
                setSelectedPlatforms(prev =>
                  checked
                    ? [...prev, value]
                    : prev.filter(v => v !== value)
                );
              }}
            />

            {/* 📦 PRODUCT TYPE */}
            <FilterSection
              title="Product Type"
              items={productTypes}
              selected={selectedProductTypes}
              mapKey="productTypes"
              onChange={(value, checked) => {
                setSelectedProductTypes(prev =>
                  checked
                    ? [...prev, value]
                    : prev.filter(v => v !== value)
                );
              }}
            />

            {/* 🎯 GENRES */}
            <FilterSection
              title="Genres"
              items={["Action", "Adventure", "RPG", "Shooter", "Horror"]}
              onChange={() => { }}
            />

            {/* 🌐 REGION */}
            <FilterSection
              title="Region"
              items={regions}
              selected={selectedRegions}
              mapKey="regions"
              onChange={(value, checked) => {
                setSelectedRegions(prev =>
                  checked
                    ? [...prev, value]
                    : prev.filter(v => v !== value)
                );
              }}
            />

            {/* 🖥️ WORKS ON */}
            <FilterSection
              title="Works On"
              items={worksOn}
              selected={selectedWorksOn}
              mapKey="worksOn"
              onChange={(value, checked) => {
                setSelectedWorksOn(prev =>
                  checked
                    ? [...prev, value]
                    : prev.filter(v => v !== value)
                );
              }}
            />

          </div>
        </div>

        {/* 🧱 RIGHT SIDE (YOUR ORIGINAL GRID — UNTOUCHED) */}
        <div className="flex-1">

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-[#1a1a1f] h-[260px] rounded-lg" />
              ))
            ) : (

              items.map((item) => {

                // const getStrapiMedia = (url) => {
                //   if (!url) return '';
                //   if (url.startsWith('http')) return url;
                //   return `${process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL}${url}`;
                // };

                // const imgUrl = getStrapiMedia(item.image?.url);

                const imageUrl = item.image || "/keyzoo-fallback.png";

                return (
                  <div key={item.id} className='mb-2 mt-2'>
                    {item.available ? (
                      <Link
                        // href={`/product/${item.slug}`}
                        href={getItemHref(item)}
                        // className="block p-1 rounded-lg hover:shadow-md transition bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto"
                        className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative min-w-[200px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1"
                      >
                        <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
                          {/* {imageUrl && ( */}
                          <OptimizedImage
                            src={imageUrl}
                            alt={item.title || "Product image"}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            width={600}
                            height={1000}
                            blur
                            className={`object-center ${item.available ? "" : "grayscale opacity-60"
                              }`}
                          />

                          {/* Platform badge */}
                          {/* {item.platform && (
                            <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded uppercase">
                              {item.platform}
                            </span>
                          )} */}

                          {/* Discount ribbon */}
                          {/* {item.originalPrice && item.originalPrice > item.price && (
                            <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
                              -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                            </span>
                          )} */}
                        </div>
                        <div className='bg-gray-100 dark:bg-black/30 backdrop-blur-sm px-1 py-1 rounded-b-md h-[120px]'>
                          <HoverCard title={item.title}>
                            <h3 className="text-sm font-semibold line-clamp-2 px-1.5 mt-1 text-black">
                              {item.title}
                            </h3>
                          </HoverCard>
                          <h3 className="text-sm font-semibold text-blue-600 px-1.5 mt-0.5">{item.card_region}</h3>
                          <p className="text-lg text-gray-600 dark:text-gray-300 px-1.5 mt-1 mb-1.5">
                            {symbol} {Number(item.discountPrice).toFixed(2)}
                          </p>
                        </div>
                      </Link>
                    ) : (
                      <div
                        // href={`/product/${item.slug}`}
                        // className="block p-1 rounded-lg hover:shadow-md transition bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto"
                        className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative min-w-[200px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1 cursor-not-allowed"
                      >
                        <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
                          <OptimizedImage
                            src={imageUrl}
                            alt={item.title || "Product image"}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            width={600}
                            height={1000}
                            blur
                            className={`object-center ${item.available ? "" : "grayscale opacity-60"
                              }`}
                          />

                          {/* 🔥 Bottom overlay container */}
                          <div className="absolute bottom-3 left-0 w-full flex justify-center px-3">

                            <button onClick={() => handleNotify(item)} disabled={notified[item.id]} className="flex items-center justify-center gap-2 w-full max-w-[85%] bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold py-2.5 rounded-md hover:bg-white/20 transition shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer">
                              {notified[item.id] ? "✔ Notified" : "🔔 Notify me"}
                            </button>

                          </div>

                          {/* Platform badge */}
                          {/* {item.platform && (
                            <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded uppercase">
                              {item.platform}
                            </span>
                          )} */}

                          {/* Discount ribbon */}
                          {/* {item.originalPrice && item.originalPrice > item.price && (
                            <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
                              -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                            </span>
                          )} */}
                        </div>
                        <div className='bg-gray-100 dark:bg-black/30 backdrop-blur-sm px-1 py-1 rounded-b-md h-[120px]'>
                          <HoverCard title={item.title}>
                            <h3 className="text-sm font-semibold line-clamp-2 px-1.5 mt-1 text-black">
                              {item.title}
                            </h3>
                          </HoverCard>
                          <h3 className="text-sm font-semibold text-blue-600 px-1.5 mt-0.5">{item.card_region}</h3>
                          <p className="text-lg text-[#cc0000] font-bold dark:text-gray-300 px-1.5 mt-1 mb-1.5">
                            Sold Out
                          </p>
                        </div>
                      </div>
                    )
                    }
                  </div>
                );
              })

            )}

          </div>

          <Pagination className="mt-10">
            <PaginationContent>

              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();

                    if (page > 1) {
                      setPage((prev) => prev - 1);
                    }
                  }}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-40"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* Page numbers */}
              {getPages().map((p, index) =>
                p === "..." ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <span className="flex h-9 min-w-9 items-center justify-center px-2 text-sm text-[var(--keyzoo-text-muted)]">
                      ...
                    </span>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
                      onClick={(e) => {
                        e.preventDefault();

                        if (p !== page) {
                          setPage(p);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();

                    if (page < totalPages) {
                      setPage((prev) => prev + 1);
                    }
                  }}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-40"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

            </PaginationContent>
          </Pagination>

        </div>
      </div>
    </div >
  );

  function FilterSection({ title, items = [], selected = [], onChange, mapKey }) {

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
      const timeout = setTimeout(() => {
        setDebouncedSearch(search);
      }, 600);

      return () => clearTimeout(timeout);
    }, [search]);
    const [open, setOpen] = useState(true);



    const filteredItems = (items || []).filter((item) =>
      String(item).toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="mb-1">

        {/* HEADER */}
        {/* <details className="group"> */}

        <div onClick={() => setOpen(prev => !prev)} className="flex justify-between items-center cursor-pointer text-white text-sm font-semibold hover:bg-purple-500/10 px-3 py-2.5 rounded-md transition">
          {title}
          <span className="text-gray-400 group-open:rotate-180 transition-transform duration-300">
            <MdOutlineKeyboardArrowDown />
          </span>
        </div>

        {/* CONTENT */}
        {open && (
          <div className="mt-4 space-y-3">

            {/* 🔍 SEARCH */}
            <input
              type="text"
              placeholder={`Search ${title}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#18181c] text-white text-sm border border-white/5 focus:border-purple-500 outline-none"
            />

            {/* LIST */}
            <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1 custom-scroll">

              {filteredItems.map((item, i) => {
                const isChecked = selected.includes(item);

                return (
                  <label
                    key={i}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200
  ${isChecked
                        ? "bg-purple-500/15 border border-purple-500/30"
                        : "hover:bg-purple-500/8 border border-transparent"
                      }
  `}
                  >

                    {/* LEFT */}
                    <div className="flex items-center gap-2">

                      {/* CUSTOM CHECKBOX */}
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition
                                              ${isChecked
                          ? "bg-purple-500 border-purple-500"
                          : "border-white/20"}
                                          `}>
                        {isChecked && (
                          <span className="text-xs text-white">✓</span>
                        )}
                      </div>

                      <span className="text-sm text-white font-medium">
                        {formatLabel(item)}
                      </span>
                    </div>

                    {/* COUNT */}
                    <span className="text-xs text-gray-500">
                      {getCount(mapKey, item)}
                    </span>

                    {/* INPUT (hidden but functional) */}
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => onChange(item, e.target.checked)}
                      className="hidden"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}
        {/* </details> */}
      </div>
    );
  }

  function formatLabel(value) {
    if (!value) return "";

    const str = String(value);

    // Special cases (important for premium feel)
    const special = {
      psn: "PlayStation",
      xbox: "Xbox",
      steam: "Steam",
      spotify: "Spotify",
      roblox: "Roblox",
      binance: "Binance"
    };

    if (special[str.toLowerCase()]) {
      return special[str.toLowerCase()];
    }

    // General capitalize
    return str
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}