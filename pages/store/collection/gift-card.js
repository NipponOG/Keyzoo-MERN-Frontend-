import { useEffect, useState, useRef } from 'react';
import { fetchFromStrapi } from '@/lib/strapi';
import { useRouter } from "next/router";
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import useCurrency from '@/hook/useCurrency';
import HoverCard from '@/components/HoverCard';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

export default function ProductGiftCardCarousel() {

    const { symbol } = useCurrency();
    const router = useRouter();
    const [products, setProducts] = useState([]);

    // Filter states
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [selectedRegions, setSelectedRegions] = useState([]);
    const [search, setSearch] = useState("");
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(9999);

    const [selectedProductTypes, setSelectedProductTypes] = useState([]);
    const [selectedWorksOn, setSelectedWorksOn] = useState([]);

    // Pagination states
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(1);

    // Filter with performance
    const [platformsState, setPlatforms] = useState([]);
    const [regionsState, setRegions] = useState([]);
    const [productTypesState, setProductTypes] = useState([]);
    const [worksOnState, setWorksOn] = useState([]);

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true); // default open

    const [counts, setCounts] = useState({
        platforms: {},
        regions: {},
        productTypes: {},
        worksOn: {},
    });

    const clearFilters = () => {
        setSelectedPlatforms([]);
        setSelectedRegions([]);
        setSelectedProductTypes([]);
        setSelectedWorksOn([]);
        setSearch("");
        setOnlyAvailable(false);
        setMinPrice(0);
        setMaxPrice(9999);
        setPage(1);
    };

    const isFilterActive =
        selectedPlatforms.length ||
        selectedRegions.length ||
        selectedProductTypes.length ||
        selectedWorksOn.length ||
        search ||
        onlyAvailable ||
        minPrice !== 0 ||
        maxPrice !== 9999;


    // useEffect(() => {
    //     async function getData() {
    //         try {
    //             // Fetch both collections in parallel
    //             const [PlayStationsGiftCardRes, XboxGiftCardRes, SpotifyGiftCardRes, RobloxGiftCardRes] = await Promise.all([
    //                 // fetchFromStrapi('api/products?populate=*'),
    //                 fetchFromStrapi('api/play-station-gift-cards?populate=*'),
    //                 fetchFromStrapi('api/xbox-gift-cards?populate=*'),
    //                 fetchFromStrapi('api/spotify-gift-cards?populate=*'),
    //                 fetchFromStrapi('api/roblox-gift-cards?populate=*')
    //             ]);

    //             // Normalize gift cards
    //             const PlayStationsGiftCard = (PlayStationsGiftCardRes.data || []).map((item) => ({
    //                 ...item,
    //                 type: "psn"
    //             }));

    //             // Normalize gift cards
    //             const XboxGiftCard = (XboxGiftCardRes.data || []).map((item) => ({
    //                 ...item,
    //                 type: 'xbox'
    //             }));

    //             // Normalize gift cards
    //             const SpotifyGiftCard = (SpotifyGiftCardRes.data || []).map((item) => ({
    //                 ...item,
    //                 type: 'spotify'
    //             }));

    //             // Normalize gift cards
    //             const RobloxGiftCard = (RobloxGiftCardRes.data || []).map((item) => ({
    //                 ...item,
    //                 type: 'roblox'
    //             }));

    //             // Merge both collections
    //             setProducts([...PlayStationsGiftCard, ...XboxGiftCard, ...SpotifyGiftCard, ...RobloxGiftCard]);
    //         } catch (error) {
    //             console.error('Failed to fetch items:', error);
    //         }
    //     }

    //     getData();
    // }, []);

    // useEffect(() => {

    //     // const query = {
    //     //     ...(search && { search }),
    //     //     ...(selectedPlatforms.length && { platform: selectedPlatforms }),
    //     //     ...(selectedRegions.length && { region: selectedRegions }),
    //     //     ...(selectedProductTypes.length && { type: selectedProductTypes }),
    //     //     ...(selectedWorksOn.length && { worksOn: selectedWorksOn }),
    //     //     ...(onlyAvailable && { available: true }),
    //     //     ...(minPrice && { min: minPrice }),
    //     //     ...(maxPrice !== 9999 && { max: maxPrice }),
    //     //     page,
    //     // };

    //     const query = {
    //         ...(search && { search }),
    //         ...(selectedPlatforms.length && { platform: selectedPlatforms }),
    //         ...(selectedRegions.length && { region: selectedRegions }),
    //         ...(selectedProductTypes.length && { item_type: selectedProductTypes }),
    //         ...(selectedWorksOn.length && { workPlatform: selectedWorksOn }),
    //         ...(onlyAvailable && { Available: true }),
    //         ...(minPrice && { minPrice }),
    //         ...(maxPrice !== 9999 && { maxPrice }),
    //         page,
    //     };

    //     router.push({
    //         pathname: router.pathname,
    //         query,
    //     }, undefined, { shallow: true });

    // }, [
    //     search,
    //     selectedPlatforms,
    //     selectedRegions,
    //     selectedProductTypes,   // ✅ add
    //     selectedWorksOn,        // ✅ add
    //     onlyAvailable,          // ✅ add
    //     minPrice,
    //     maxPrice,
    //     page,
    // ]);

    // useEffect(() => {
    //     async function getData() {
    //         try {
    //             const [
    //                 PlayStationsGiftCardRes,
    //                 XboxGiftCardRes,
    //                 SpotifyGiftCardRes,
    //                 RobloxGiftCardRes
    //             ] = await Promise.all([
    //                 fetchFromStrapi('api/play-station-gift-cards?populate=*'),
    //                 fetchFromStrapi('api/xbox-gift-cards?populate=*'),
    //                 fetchFromStrapi('api/spotify-gift-cards?populate=*'),
    //                 fetchFromStrapi('api/roblox-gift-cards?populate=*')
    //             ]);

    //             const PlayStationsGiftCard = (PlayStationsGiftCardRes.data || []).map(item => ({
    //                 ...item,
    //                 type: "psn"
    //             }));

    //             const XboxGiftCard = (XboxGiftCardRes.data || []).map(item => ({
    //                 ...item,
    //                 type: "xbox"
    //             }));

    //             const SpotifyGiftCard = (SpotifyGiftCardRes.data || []).map(item => ({
    //                 ...item,
    //                 type: "spotify"
    //             }));

    //             const RobloxGiftCard = (RobloxGiftCardRes.data || []).map(item => ({
    //                 ...item,
    //                 type: "roblox"
    //             }));

    //             const allProducts = [
    //                 ...PlayStationsGiftCard,
    //                 ...XboxGiftCard,
    //                 ...SpotifyGiftCard,
    //                 ...RobloxGiftCard
    //             ];

    //             setProducts(allProducts);
    //             setFilteredProducts(allProducts);

    //         } catch (error) {
    //             console.error('Failed to fetch items:', error);
    //         }
    //     }

    //     getData();
    // }, []);

    // let requestId = 0;

    const requestRef = useRef(0);

    const fetchProducts = async () => {
        const currentRequest = ++requestRef.current;

        setLoading(true);

        try {
            const query = new URLSearchParams();

            // 🔍 Search
            if (search) {
                query.append("filters[title][$containsi]", search);
            }

            // 🎮 Platform
            selectedPlatforms.forEach((p, i) => {
                query.append(`filters[platform][$in][${i}]`, p);
            });

            // 🌍 Region
            selectedRegions.forEach((r, i) => {
                query.append(`filters[card_region][$in][${i}]`, r);
            });

            // 📦 Product Type
            selectedProductTypes.forEach((t, i) => {
                query.append(`filters[item_type][$in][${i}]`, t);
            });

            // 🖥️ Works On
            selectedWorksOn.forEach((w, i) => {
                query.append(`filters[workPlatform][$in][${i}]`, w);
            });

            // 💰 Price
            if (minPrice > 0) {
                query.append("filters[$or][0][discountPrice][$gte]", minPrice);
                query.append("filters[$or][1][price][$gte]", minPrice);
            }

            if (maxPrice < 9999) {
                query.append("filters[$or][0][discountPrice][$lte]", maxPrice);
                query.append("filters[$or][1][price][$lte]", maxPrice);
            }

            // ✅ Available
            if (onlyAvailable) {
                query.append("filters[Available][$eq]", true);
            }

            query.append("populate", "*");
            query.append("pagination[page]", page);
            query.append("pagination[pageSize]", pageSize);

            const res = await fetchFromStrapi(`api/gift-cards?${query.toString()}`);

            // 🚫 Ignore outdated response
            if (currentRequest !== requestRef.current) return;

            if (res?.data) {
                setProducts(res.data);
            }

            if (res?.meta?.pagination) {
                setTotalPages(res.meta.pagination.pageCount);
            }

        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            // 🚫 Only update loading if still latest request
            if (currentRequest === requestRef.current) {
                setLoading(false);
            }
        }
    };

    const fetchCounts = async () => {
        try {
            const query = new URLSearchParams();

            selectedPlatforms.forEach((p, i) => {
                query.append(`platform[${i}]`, p);
            });

            selectedRegions.forEach((r, i) => {
                query.append(`region[${i}]`, r);
            });

            selectedProductTypes.forEach((t, i) => {
                query.append(`item_type[${i}]`, t);
            });

            selectedWorksOn.forEach((w, i) => {
                query.append(`workPlatform[${i}]`, w);
            });

            if (onlyAvailable) {
                query.append("Available", true);
            }

            if (minPrice) query.append("minPrice", minPrice);
            if (maxPrice !== 9999) query.append("maxPrice", maxPrice);

            const res = await fetchFromStrapi(
                `api/gift-cards/counts?${query.toString()}`
            );

            setCounts(res || {});
        } catch (err) {
            console.error("Counts error:", err);
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(delay);
    }, [
        search,
        selectedPlatforms,
        selectedRegions,
        selectedProductTypes,
        selectedWorksOn,
        minPrice,
        maxPrice,
        onlyAvailable,
        page,
    ]);

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

    // useEffect(() => {
    //     if (!router.isReady) return;

    //     fetchProducts();

    // }, [
    //     search,
    //     selectedPlatforms,
    //     selectedRegions,
    //     selectedProductTypes,
    //     selectedWorksOn,
    //     minPrice,
    //     maxPrice,
    //     onlyAvailable,
    //     page,
    // ]);

    // useEffect(() => {
    //     if (!router.isReady) return;

    //     // const { search, platform, region, min, max, type, worksOn, available } = router.query;
    //     // const { item_type, workPlatform, Available, minPrice, maxPrice } = router.query;
    //     const {
    //         search,
    //         platform,
    //         region,
    //         item_type,
    //         workPlatform,
    //         Available,
    //         minPrice,
    //         maxPrice,
    //         page,
    //         // worksOn,
    //     } = router.query;

    //     if (item_type) setSelectedProductTypes(Array.isArray(item_type) ? item_type : [item_type]);
    //     if (workPlatform) setSelectedWorksOn(Array.isArray(workPlatform) ? workPlatform : [workPlatform]);
    //     if (Available) setOnlyAvailable(true);
    //     if (minPrice) setMinPrice(Number(minPrice));
    //     if (maxPrice) setMaxPrice(Number(maxPrice));

    //     // if (type) setSelectedProductTypes(Array.isArray(type) ? type : [type]);
    //     // if (worksOn) setSelectedWorksOn(Array.isArray(worksOn) ? worksOn : [worksOn]);
    //     // if (available) setOnlyAvailable(true);

    //     if (search) setSearch(search);

    //     if (platform) {
    //         setSelectedPlatforms(Array.isArray(platform) ? platform : [platform]);
    //     }

    //     if (region) {
    //         setSelectedRegions(Array.isArray(region) ? region : [region]);
    //     }

    //     // if (min) setMinPrice(Number(min));
    //     // if (max) setMaxPrice(Number(max));

    //     if (router.query.page) {
    //         setPage(Number(router.query.page));
    //     }

    // }, [router.query]);

    useEffect(() => {
        async function fetchFilters() {
            const res = await fetchFromStrapi("api/gift-cards/filters");

            setPlatforms(res.platforms || []);
            setRegions(res.regions || []);
            setProductTypes(res.productTypes || []);
            setWorksOn(res.worksOn || []);
        }

        fetchFilters();
    }, []);

    useEffect(() => {
        // if (page !== 1) setPage(1);

        setPage(1);
    }, [
        search,
        selectedPlatforms,
        selectedRegions,
        selectedProductTypes,
        selectedWorksOn,
        minPrice,
        maxPrice,
        onlyAvailable
    ]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    useEffect(() => {
        const delay = setTimeout(() => {
            const query = {
                ...(search && { search }),
                ...(selectedPlatforms.length && { platform: selectedPlatforms }),
                ...(selectedRegions.length && { region: selectedRegions }),
                ...(selectedProductTypes.length && { item_type: selectedProductTypes }),
                ...(selectedWorksOn.length && { workPlatform: selectedWorksOn }),
                ...(onlyAvailable && { Available: true }),
                ...(minPrice && { minPrice }),
                ...(maxPrice !== 9999 && { maxPrice }),
                page,
            };

            router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
        }, 400);

        return () => clearTimeout(delay);
    }, [
        search,
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
        fetchCounts();
    }, [
        selectedPlatforms,
        selectedRegions,
        selectedProductTypes,
        selectedWorksOn,
        minPrice,
        maxPrice,
        onlyAvailable,
    ]);

    // useEffect(() => {
    //     let temp = [...products];

    //     // 🔍 Search
    //     if (search) {
    //         temp = temp.filter(item =>
    //             item.title.toLowerCase().includes(search.toLowerCase())
    //         );
    //     }

    //     // 🎮 Platform
    //     // 🎮 Platforms (multi)
    //     if (selectedPlatforms.length > 0) {
    //         temp = temp.filter(item => selectedPlatforms.includes(item.type));
    //     }

    //     // 🌍 Region (multi)
    //     if (selectedRegions.length > 0) {
    //         temp = temp.filter(item => selectedRegions.includes(item.card_region));
    //     }

    //     // ✅ Available
    //     if (onlyAvailable) {
    //         temp = temp.filter(item => item.Available);
    //     }

    //     // 📦 Product Type
    //     if (selectedProductTypes.length > 0) {
    //         temp = temp.filter(item => selectedProductTypes.includes(item.item_type));
    //     }

    //     // 🖥️ Works On
    //     if (selectedWorksOn.length > 0) {
    //         temp = temp.filter(item => selectedWorksOn.includes(item.workPlatform));
    //     }

    //     // 💰 Price
    //     temp = temp.filter(item =>
    //         item.discountPrice >= minPrice && item.discountPrice <= maxPrice
    //     );

    //     setFilteredProducts(temp);

    // }, [search, selectedPlatforms, onlyAvailable, minPrice, maxPrice, products, selectedProductTypes, selectedWorksOn, selectedRegions]);



    if (!loading && products.length === 0) {
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

    // const platforms = [...new Set(allProducts.map(p => p.platform).filter(Boolean))];
    // const productTypes = [...new Set(allProducts.map(p => p.item_type).filter(Boolean))];
    // const worksOn = [...new Set(allProducts.map(p => p.workPlatform).filter(Boolean))];
    // const regions = [...new Set(allProducts.map(p => p.card_region).filter(Boolean))];

    const platforms = platformsState;
    const regions = regionsState;
    const productTypes = productTypesState;
    const worksOn = worksOnState;

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

                            products.map((item) => {
                                const getStrapiMedia = (url) => {
                                    if (!url) return '';
                                    if (url.startsWith('http')) return url;
                                    return `${process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL}${url}`;
                                };

                                const imgUrl = getStrapiMedia(item.image?.url);

                                return (
                                    <div key={item.id} className='mb-2 mt-2'>
                                        {item.Available ? (
                                            <Link
                                                href={`/store/category/gift-card/${item.platform}/${item.slug}`}
                                                // className="block p-1 rounded-lg hover:shadow-md transition bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto"
                                                className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1">
                                                <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
                                                    {/* {imageUrl && ( */}
                                                    <Image
                                                        src={imgUrl}
                                                        alt={item.title}
                                                        fill
                                                        className={`object-center transition ${item.Available ? '' : 'grayscale opacity-60'}`}
                                                    />
                                                    {/* )} */}

                                                    {/* Platform badge */}
                                                    {item.platform && (
                                                        <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded uppercase">
                                                            {item.platform}
                                                        </span>
                                                    )}

                                                    {/* Discount ribbon */}
                                                    {item.originalPrice && item.originalPrice > item.price && (
                                                        <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
                                                            -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                                                        </span>
                                                    )}
                                                </div>
                                                <div className='bg-gray-100 dark:bg-black/30 backdrop-blur-sm px-1 py-1 rounded-b-md'>
                                                    <HoverCard title={item.title}>
                                                        <h3 className="text-md font-semibold line-clamp-2 px-3 mt-1 text-black">{item.title}</h3>
                                                    </HoverCard>
                                                    <h3 className="text-lg font-semibold text-blue-600 px-3 mt-1">{item.card_region}</h3>
                                                    <p className="text-lg text-gray-600 dark:text-gray-300 px-3 mt-2 mb-2">
                                                        {symbol} {item.discountPrice}
                                                    </p>
                                                </div>
                                            </Link>
                                        ) : (
                                            <div
                                                // href={`/gift-card/${item.slug}`}
                                                // className="block p-1 rounded-lg hover:shadow-md transition bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto"
                                                className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1 cursor-not-allowed">
                                                <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
                                                    {/* {imageUrl && ( */}
                                                    <Image
                                                        src={imgUrl}
                                                        alt={item.title}
                                                        fill
                                                        className={`object-center transition ${item.Available ? '' : 'grayscale opacity-60'}`}
                                                    />
                                                    {/* )} */}

                                                    {/* Platform badge */}
                                                    {item.platform && (
                                                        <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded uppercase">
                                                            {item.platform}
                                                        </span>
                                                    )}

                                                    {/* Discount ribbon */}
                                                    {item.originalPrice && item.originalPrice > item.price && (
                                                        <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
                                                            -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                                                        </span>
                                                    )}
                                                </div>
                                                <div className='bg-gray-100 dark:bg-black/30 backdrop-blur-sm px-1 py-1 rounded-b-md'>
                                                    <HoverCard title={item.title}>
                                                        <h3 className="text-md font-semibold line-clamp-2 px-3 mt-1 text-black">{item.title}</h3>
                                                    </HoverCard>
                                                    <h3 className="text-lg font-semibold text-blue-600 px-3 mt-1">{item.card_region}</h3>
                                                    <p className="text-lg text-red-800 font-extrabold dark:text-gray-300 px-3 mt-2 mb-2">
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

                    <div className="flex justify-center mt-10 gap-2 flex-wrap">

                        {/* PREV */}
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(prev => prev - 1)}
                            className="px-3 py-2 rounded-lg bg-[#1a1a1f] text-white disabled:opacity-40"
                        >
                            ‹
                        </button>

                        {/* PAGE NUMBERS */}
                        {getPages().map((p, i) =>
                            p === "..." ? (
                                <span key={i} className="px-2 text-gray-500">...</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`px-3 py-2 rounded-lg text-sm transition
                ${p === page
                                            ? "bg-purple-600 text-white"
                                            : "bg-[#1a1a1f] text-gray-300 hover:bg-white/10"
                                        }`}
                                >
                                    {p}
                                </button>
                            )
                        )}

                        {/* NEXT */}
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(prev => prev + 1)}
                            className="px-3 py-2 rounded-lg bg-[#1a1a1f] text-white disabled:opacity-40"
                        >
                            ›
                        </button>

                    </div>

                </div>
            </div>
        </div >

    );

    function FilterSection({ title, items = [], selected = [], onChange, mapKey }) {
        const [search, setSearch] = useState("");

        const filteredItems = items.filter((item) =>
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
                                            {counts?.[mapKey]?.[item] ?? 0}
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

// {/* <div className="px-4 md:px-10 py-8">
//     <section className="my-0">
//         <h2 className="text-xl font-bold mb-4 dark:text-white">Best Selling Gift Cards</h2>

//         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
//             {filteredProducts.map((item) => {
//                 //   const { title, slug, price, coverImage } = item.attributes;

//                 const getStrapiMedia = (url) => {
//                     if (!url) return '';
//                     if (url.startsWith('http')) return url;
//                     return `${process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL}${url}`;
//                 };

//                 const imgUrl = getStrapiMedia(item.image?.url);

//                 return (
//                     <div key={item.id} className='mb-2 mt-2'>
//                         {item.Available ? (<Link
//                             href={`/store/category/gift-card/${item.type}/${item.slug}`}
//                             // className="block p-1 rounded-lg hover:shadow-md transition bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto"
//                             className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1">
//                             <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
//                                 {/* {imageUrl && ( */}
//                                 <Image
//                                     src={imgUrl}
//                                     alt={item.title}
//                                     fill
//                                     className={`object-center transition ${item.Available ? '' : 'grayscale opacity-60'}`}
//                                 />
//                                 {/* )} */}

//                                 {/* Platform badge */}
//                                 {item.platform && (
//                                     <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded uppercase">
//                                         {item.platform}
//                                     </span>
//                                 )}

//                                 {/* Discount ribbon */}
//                                 {item.originalPrice && item.originalPrice > item.price && (
//                                     <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
//                                         -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
//                                     </span>
//                                 )}
//                             </div>
//                             <div className='bg-gray-100 dark:bg-black/30 backdrop-blur-sm px-1 py-1 rounded-b-md'>
//                                 <h3 className="text-md font-semibold line-clamp-2 px-3 mt-1 text-black">{item.title}</h3>
//                                 <h3 className="text-lg font-semibold text-blue-600 px-3 mt-1">{item.card_region}</h3>
//                                 <p className="text-lg text-gray-600 dark:text-gray-300 px-3 mt-2 mb-2">
//                                     {symbol} {item.discountPrice}
//                                 </p>
//                             </div>
//                         </Link>) : (<div
//                             // href={`/gift-card/${item.slug}`}
//                             // className="block p-1 rounded-lg hover:shadow-md transition bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto"
//                             className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1 cursor-not-allowed">
//                             <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
//                                 {/* {imageUrl && ( */}
//                                 <Image
//                                     src={imgUrl}
//                                     alt={item.title}
//                                     fill
//                                     className={`object-center transition ${item.Available ? '' : 'grayscale opacity-60'}`}
//                                 />
//                                 {/* )} */}

//                                 {/* Platform badge */}
//                                 {item.platform && (
//                                     <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded uppercase">
//                                         {item.platform}
//                                     </span>
//                                 )}

//                                 {/* Discount ribbon */}
//                                 {item.originalPrice && item.originalPrice > item.price && (
//                                     <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
//                                         -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
//                                     </span>
//                                 )}
//                             </div>
//                             <div className='bg-gray-100 dark:bg-black/30 backdrop-blur-sm px-1 py-1 rounded-b-md'>
//                                 <h3 className="text-md font-semibold line-clamp-2 px-3 mt-1 text-black">{item.title}</h3>
//                                 <h3 className="text-lg font-semibold text-blue-600 px-3 mt-1">{item.card_region}</h3>
//                                 <p className="text-lg text-red-800 font-extrabold dark:text-gray-300 px-3 mt-2 mb-2">
//                                     Sold Out
//                                 </p>
//                             </div>
//                         </div>)}
//                     </div>
//                 );
//             })}
//         </div>
//         {/* Show All Button */}
//         {/* <div className="flex justify-center mt-8">
//             <Link
//                 href={`/store/collection/gift-card`}
//                 className="px-6 py-2 rounded-full bg-neutral-800 text-white hover:bg-[#1a1a1a] transition"
//             >
//                 Show All
//             </Link>
//         </div> */}
//     </section>
// </div> */}

{/* <Link
    href={`/store/category/gift-card/${item.platform}/${item.slug}`}
    className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1"
>
    {/* ✅ YOUR CARD UI — SAME */}
// <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
//     <Image
//         src={imgUrl}
//         alt={item.title}
//         fill
//         className="object-center"
//     />
// </div>

// <div className='bg-gray-100 dark:bg-black/30 px-1 py-1 rounded-b-md'>
//     <h3 className="text-md font-semibold line-clamp-2 px-3 mt-1 text-black">
//         {item.title}
//     </h3>
//     <h3 className="text-lg font-semibold text-blue-600 px-3 mt-1">
//         {item.card_region}
//     </h3>
//     <p className="text-lg text-gray-600 dark:text-gray-300 px-3 mt-2 mb-2">
//         {symbol} {item.discountPrice}
//     </p>
// </div>
// </Link> */}