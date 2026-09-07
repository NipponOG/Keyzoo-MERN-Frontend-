import { useEffect, useState, useRef } from 'react';
import { fetchFromStrapi } from '@/lib/strapi';
import { getStrapiMedia } from '@/lib/getStrapiMedia';
import Image from 'next/image';
import Link from 'next/link';
import useCurrency from '@/hook/useCurrency';
import { useRouter } from 'next/router';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import ProductCardImage from '@/components/ProductCardImage';
import HoverCard from '@/components/HoverCard';
import toast from "react-hot-toast";

const normalizeRegion = (value) => value?.trim().toUpperCase(); // this will help in changing cases.

export default function BeastSelling() {

    const BASE_QUERY = "api/gift-cards?filters[platform][$eq]=spotify";
    const skeletonCount = typeof window !== "undefined" ? Math.ceil(window.innerHeight / 500) * 6 : 24;

    const { symbol } = useCurrency();
    const [products, setProducts] = useState([]);
    const [regionOpen, setRegionOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [notified, setNotified] = useState({});

    const router = useRouter();
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setRegionOpen(false);
                setSearch("");
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    // Filtered regions based on search input
    const filteredRegions = regions.filter((region) =>
        region.toLowerCase().includes(search.toLowerCase())
    );

    // Handle region selection
    const handleRegionChange = (region) => {
        const normalized = normalizeRegion(region);

        setSelectedRegion(normalized);
        setRegionOpen(false);

        router.push(
            {
                pathname: router.pathname,
                query: { region: normalized },
            },
            undefined,
            { shallow: true }
        );
    };

    const handleNotify = async (item) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("jwt");

            if (!user || !token) {
                toast.error("Please login first");
                return;
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}api/stock-alerts`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        data: {
                            product: item.id,
                        },
                    }),
                }
            );

            const data = await res.json();

            // console.log("API RESPONSE:", data);
            // console.log("USER:", user);
            // console.log("PRODUCT:", item);

            if (!res.ok) {
                throw new Error(data.error?.message || "Already subscribed");
            }

            toast.success("We’ll notify you 🔔");

            setNotified((prev) => ({
                ...prev,
                [item.id]: true,
            }));

        } catch (err) {
            console.error(err);
            toast.error(err.message || "Something went wrong");
        }
    };

    useEffect(() => {

        if (!router.isReady) return;

        const urlRegion = router.query.region;

        if (urlRegion) {

            setSelectedRegion(normalizeRegion(urlRegion));

        } else {

            setSelectedRegion("ALL REGIONS");
        }

    }, [router.isReady, router.query.region]);

    useEffect(() => {
        async function getAllProducts() {
            try {

                setLoading(true);

                const res = await fetchFromStrapi(`${BASE_QUERY}&populate=*`)

                setProducts(res.data || []);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }
        }

        getAllProducts();
    }, []);


    useEffect(() => {
        async function getRegions() {
            try {
                const res = await fetchFromStrapi(
                    `${BASE_QUERY}&fields[0]=card_region&pagination[pageSize]=200`
                );

                const set = new Set();
                res?.data?.forEach(item => {
                    if (item.card_region) {
                        set.add(normalizeRegion(item.card_region));
                    }
                });

                // setRegions(["ALL Regions", ...Array.from(set).sort()]);
                setRegions(["ALL REGIONS", ...Array.from(set).sort()]);

            } catch (err) {

                console.error("Failed to fetch regions", err);

            }
        }

        getRegions();
    }, []);

    useEffect(() => {
        if (normalizeRegion(selectedRegion) === "ALL REGIONS") {
            // reset to all products
            // fetchFromStrapi("api/gift-cards?populate=*&filters[platform][$eq]=psn")
            setLoading(true);
            fetchFromStrapi(`${BASE_QUERY}&populate=*`)
                .then(res => setProducts(res.data || []))
                .finally(() => setLoading(false));
            return;
        }

        async function getFilteredProducts() {

            if (!selectedRegion) return;

            try {
                setLoading(true);

                // const res = await fetchFromStrapi(
                //     `api/gift-cards?populate=*&filters[platform][$eq]=psn&filters[card_region][$eq]=${encodeURIComponent(
                //         normalizeRegion(selectedRegion)
                //     )}`
                // );

                const res = await fetchFromStrapi(
                    `${BASE_QUERY}&populate=*&filters[card_region][$eq]=${encodeURIComponent(
                        normalizeRegion(selectedRegion)
                    )}`
                );

                setProducts(res.data || []);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        getFilteredProducts();

    }, [selectedRegion]);

    // 1️⃣ LOADING FIRST
    if (loading) {
        return (
            <div className="px-4 md:px-10 py-8">
                {/* ===== PSN HERO (IMAGE ONLY) ===== */}
                <section className="relative w-full h-[450px] overflow-hidden rounded-xl mb-10">
                    {/* Background image */}
                    <Skeleton height={450} borderRadius={16} />
                </section>

                {/* ===== SECTION 2: FILTER BAR ===== */}
                <section className="rounded-xl mb-10">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center gap-6">

                        {/* Left side */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <span className="text-lg text-[#ffffff] whitespace-nowrap">
                                <Skeleton width={400} height={60} borderRadius={12} />
                            </span>

                            <Skeleton width={400} height={60} borderRadius={12} />

                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-3 text-sm text-[#ffffff]">
                            <span className="text-lg mr-1"><Skeleton width={400} height={60} borderRadius={12} /></span>
                        </div>

                    </div>
                </section>

                <section className="my-10">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 ">
                        {Array.from({ length: skeletonCount }).map((_, i) => (
                            <Skeleton
                                key={i}
                                height={500}
                                borderRadius={16}
                            />
                        ))}
                    </div>
                </section>

            </div>
        );
    }

    if (!products || products.length === 0) {
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
                        <p className="text-gray-500">No products found in Best Selling.</p>
                    */}
            </section>
        );
    }

    return (
        <div className="px-4 md:px-10 py-8">

            {/* ===== PSN HERO (IMAGE ONLY) ===== */}
            <section className="relative w-full h-[450px] overflow-hidden rounded-xl mb-10">
                {/* Background image */}
                <Image
                    src={"https://res.cloudinary.com/dblttl9bh/image/upload/v1767874168/Gemini_Generated_Image_lpxk5wlpxk5wlpxk_65236b78f2.png"}
                    alt="SPOTIFY Banner"
                    fill
                    priority
                    className={`
                        object-cover scale-110 blur-xl
                        transition-opacity duration-500
                        ${loaded ? "opacity-0" : "opacity-100"}
                    `}
                    placeholder="blur"
                    blurDataURL={"https://res.cloudinary.com/dblttl9bh/image/upload/e_blur:1000,q_1,w_50/v1767874168/Gemini_Generated_Image_lpxk5wlpxk5wlpxk_65236b78f2.png"}
                />
                <Image
                    src={"https://res.cloudinary.com/dblttl9bh/image/upload/v1767874168/Gemini_Generated_Image_lpxk5wlpxk5wlpxk_65236b78f2.png"}
                    blurDataURL={"https://res.cloudinary.com/dblttl9bh/image/upload/e_blur:1000,q_1,w_50/v1767874168/Gemini_Generated_Image_lpxk5wlpxk5wlpxk_65236b78f2.png"}
                    alt="Spotify Banner"
                    fill
                    priority
                    className={`
                        object-cover transition-all duration-700 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
                    `}
                    onLoad={() => setLoaded(true)}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-black/40" />
            </section>

            {/* ===== SECTION 2: FILTER BAR ===== */}
            <section className="rounded-xl mb-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center gap-6">

                    {/* Left side */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <span className="text-lg text-[#ffffff] whitespace-nowrap">
                            Get Spotify Gift cards for
                        </span>

                        {/* <div className="relative min-w-[350px]">
                                        <select className="appearance-none w-full h-[44px] bg-[#3a3a3a] text-white text-sm px-4 pr-10 rounded-lg leading-[44px] outline-none">
                                            <option value="IN">India</option>
                                            <option value="US">United States</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="PL">Poland</option>
                                        </select>
            
                                        {/* Arrow 
                                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/70">
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M6 9l6 6 6-6" />
                                            </svg>
                                        </div>
                                    </div> */}

                        <div ref={dropdownRef} className="relative min-w-[400px]">
                            {/* Trigger */}
                            <button onClick={() => setRegionOpen(!regionOpen)} className="cursor-pointer w-full h-[50px] bg-[#3a3a3a] text-white px-4 rounded-lg flex items-center justify-between border-none outline-none">
                                <span className="text-sm">{selectedRegion || "Select Region"}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${regionOpen ? "rotate-180" : ""
                                        }`}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>

                            {/* Dropdown */}
                            {/* {regionOpen && (
                                            <div
                                                className="absolute z-50 mt-2 w-full bg-[#2a2a2a] rounded-xl shadow-2xl max-h-[260px] overflow-y-auto border border-white/10 no-scrollbar">
                                                {regions.map((region) => (
                                                    <button
                                                        key={region} onClick={() => {
                                                            setSelectedRegion(region);
                                                            setRegionOpen(false);
            
                                                            router.push(
                                                                {
                                                                    pathname: router.pathname,
                                                                    query: region === "ALL Regions" ? {} : { region },
                                                                },
                                                                undefined,
                                                                { shallow: true }
                                                            );
                                                        }}
                                                        className={`w-full text-left px-4 py-3 text-sm hover:bg-[#3a3a3a] transition cursor-pointer ${selectedRegion === region ? "bg-[#3a3a3a] text-white" : "text-white/90"}`}>
                                                        {region}
                                                    </button>
                                                ))}
                                            </div>
                                        )} */}

                            {regionOpen && (
                                <div className="absolute z-50 mt-2 w-full bg-[#2a2a2a] rounded-xl shadow-2xl border border-white/10">

                                    {/* SEARCH INPUT */}
                                    <div className="p-3 border-b border-white/10">
                                        <input
                                            autoFocus
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search region..."
                                            className="w-full bg-[#1f1f1f] text-white text-sm px-3 py-2 rounded-md outline-none"
                                        />
                                    </div>

                                    {/* OPTIONS */}
                                    <div className="max-h-[220px] overflow-y-auto no-scrollbar">
                                        {filteredRegions.length > 0 ? (
                                            filteredRegions.map((region) => (
                                                <button
                                                    key={region}
                                                    onClick={() => {
                                                        handleRegionChange(region);
                                                        setSearch("");
                                                    }}
                                                    className={`w-full text-left px-4 py-3 text-sm transition
                          ${selectedRegion === region
                                                            ? "bg-[#3a3a3a] text-white"
                                                            : "text-white/90 hover:bg-[#3a3a3a]"}
                        `}
                                                >
                                                    {region}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-white/50">
                                                No region found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>


                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-6 bg-white/20" />

                    {/* Right side */}
                    <div className="flex items-center gap-3 text-sm text-[#ffffff]">
                        <span className="text-lg mr-1">Top regions</span>

                        {["Poland", "United States", "United Kingdom"].map((region) => {
                            const normalized = normalizeRegion(region);

                            return (
                                <button key={region} className={`px-4 py-1.5 rounded-full transition text-white ${selectedRegion === normalized ? "bg-[#3a3a3a]" : "bg-[#1f1f1f] hover:bg-[#2a2a2a]"}`}
                                    onClick={() => {
                                        setSelectedRegion(normalized);

                                        router.push(
                                            {
                                                pathname: router.pathname,
                                                query: { region: normalized },
                                            },
                                            undefined,
                                            { shallow: true }
                                        );
                                    }}>
                                    {region}
                                </button>
                            );
                        })}

                    </div>

                </div>
            </section>

            <section className="my-0">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Best Selling Games</h2>

                {/* <div className="grid grid-cols-6 gap-4.5  "> */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {loading ? (
                        Array.from({ length: skeletonCount }).map((_, i) => (
                            <Skeleton
                                key={i}
                                height={500}
                                borderRadius={16}
                            />
                        ))
                    ) : (
                        products.map((item) => {
                            //   const { title, slug, price, coverImage } = item.attributes;

                            const imgUrl = getStrapiMedia(
                                item.image?.url,
                                {
                                    width: 1600,
                                }
                            );

                            const blurUrl = getStrapiMedia(
                                item.image?.url,
                                {
                                    blur: true,
                                }
                            );

                            return (
                                <div key={item.id} className='mb-2 mt-2'>
                                    {item.Available ? (<Link
                                        href={`/store/category/gift-card/spotify/${item.slug}`}
                                        // className="block p-1 rounded-lg hover:shadow-md transition bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto"
                                        className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative min-w-[200px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1"
                                    >
                                        <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
                                            {/* {imageUrl && ( */}
                                            <ProductCardImage
                                                imgUrl={imgUrl}
                                                blurUrl={blurUrl}
                                                available={item.Available}
                                            // alt={item.title}
                                            // fill
                                            // className="object-center"
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
                                    </Link>) : (<div
                                        href={`/product/${item.slug}`}
                                        // className="block p-1 rounded-lg hover:shadow-md transition bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto"
                                        className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative min-w-[200px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1 cursor-not-allowed"
                                    >
                                        <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
                                            {/* {imageUrl && ( */}
                                            <ProductCardImage
                                                imgUrl={imgUrl}
                                                blurUrl={blurUrl}
                                                available={item.Available}
                                            // alt={item.title}
                                            // fill
                                            // className={`object-center transition ${item.Available ? '' : 'grayscale opacity-60'}`}
                                            />
                                            {/* )} */}

                                            {/* 🔥 Bottom overlay container */}
                                            <div className="absolute bottom-3 left-0 w-full flex justify-center px-3">

                                                <button onClick={() => handleNotify(item)} disabled={notified[item.id]} className="flex items-center justify-center gap-2 w-full max-w-[85%] bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold py-2.5 rounded-md hover:bg-white/20 transition shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer">
                                                    {notified[item.id] ? "✔ Notified" : "🔔 Notify me"}
                                                </button>

                                            </div>

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
                                    </div>)}
                                </div>
                            );
                        })
                    )}
                </div>
                {/* Show All Button */}
                {/* <div className="flex justify-center mt-8">
          <Link
            href={`/store/collection/best-selling`}
            className="px-6 py-2 rounded-full bg-neutral-800 text-white hover:bg-[#1a1a1a] transition"
          >
            Show All
          </Link>
        </div> */}
            </section>
        </div>
    );
}
