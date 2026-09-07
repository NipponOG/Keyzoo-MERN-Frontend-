// components/LiveSearch.js
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import debounce from "lodash.debounce";
import Image from "next/image";
import useCurrency from "@/hook/useCurrency";
import { useRouter } from "next/router";
import { getStrapiMedia } from "@/lib/getStrapiMedia";

export default function LiveSearch({ isSearchOpen, setIsSearchOpen }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const { symbol } = useCurrency();
    const router = useRouter();
    // const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleRouteChange = () => {
            setShowResults(false);
            setQuery("");
            setIsSearchOpen(false); // 🟣 Close overlay input
        };

        router.events.on("routeChangeStart", handleRouteChange);
        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, [router]);

    // const fetchResults = debounce(async (q) => {
    //     if (!q) {
    //         setResults([]);
    //         return;
    //     }
    //     const res = await fetch(
    //         `${process.env.NEXT_PUBLIC_STRAPI_URL}api/gift-cards?filters[title][$containsi]=${q}&populate=*`
    //     );
    //     const data = await res.json();
    //     setResults(data.data || []);
    // }, 300);

    // const fetchResults = debounce(async (q) => {
    //     if (!q) {
    //         setResults([]);
    //         return;
    //     }

    //     try {
    //         // Fetch products + gift cards in parallel
    //         const [productRes, giftCardRes, playStationRes] = await Promise.all([
    //             fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}api/products?filters[title][$containsi]=${q}&populate=*`),
    //             fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}api/gift-cards?filters[title][$containsi]=${q}&populate=*`),
    //             fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}api/play-stations?filters[title][$containsi]=${q}&populate=*`)
    //         ]);

    //         const productData = await productRes.json();
    //         const giftCardData = await giftCardRes.json();
    //         const PlayStationData = await playStationRes.json();

    //         // Normalize results with type field
    //         const products = (productData.data || []).map((item) => ({
    //             ...item,
    //             type: "product",
    //         }));

    //         const giftCards = (giftCardData.data || []).map((item) => ({
    //             ...item,
    //             type: "gift-card",
    //         }));

    //         const PlayStations = (PlayStationData.data || []).map((item) => ({
    //             ...item,
    //             type: "store/category/psn", // Adjust type as needed for PlayStations. Maybe this is wrong.
    //         }));

    //         // Merge and set state
    //         setResults([...products, ...giftCards, ...PlayStations]);
    //     }

    //     catch (err) {
    //         console.error("Error fetching search results:", err);
    //         setResults([]);
    //     }

    // }, 300);

    const fetchResults = debounce(async (q) => {

        if (q.length < 3) {
            setResults([]);
            return;
        }

        try {

            const res = await fetch(
                `/api/search/live-search?q=${encodeURIComponent(q)}`
            );

            const data = await res.json();

            setResults(data || []);

        } catch (err) {

            console.error("Error fetching search results:", err);

            setResults([]);
        }

    }, 300);

    useEffect(() => {
        fetchResults(query);
        if (query) {
            setShowResults(true);
        } else {
            setShowResults(false);
        }
        return () => {
            fetchResults.cancel();
        };
    }, [query]);

    // 🟢 Detect clicks outside to close results
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    return (
        <>
            <div ref={searchRef} className={`${isSearchOpen ? 'block' : 'hidden md:block'}`}>
                <input
                    type="text"
                    placeholder="Search for games, gift cards and more"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (query) setShowResults(true);
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none"
                />

                {showResults && (
                    results.length > 0 ? (
                        <ul className="no-scrollbar absolute left-0 right-0 bg-[#1a1a1a] text-white rounded-lg shadow z-50 mt-5 max-h-[calc(100vh-120px)] overflow-hidden overflow-y-auto scrollbar-thin md:max-h-[500px] transition-all duration-300 ease-in-out">
                            {/* <ul className="absolute left-0 right-0 bg-[#161616] text-white rounded-2xl overflow-hidden shadow-2xl z-50 mt-4 max-h-[400px] overflow-y-auto scrollbar-thin border border-white/5 backdrop-blur-xl"> */}

                            {results.map((item) => {

                                // const discountPercent = Math.round(
                                //     100 - (item.price / item.originalPrice) * 100
                                // );

                                // const discountPercent = Math.round(
                                //     ((item.price - item.discountPrice) / item.price) * 100
                                // );

                                const discountPercent =
                                    item.price && item.discountPrice
                                        ? Math.round(
                                            ((item.price - item.discountPrice) /
                                                item.price) *
                                            100
                                        )
                                        : 0;

                                return (
                                    <div className="rounded-4xl" key={item.id}>
                                        {/* <li className="flex gap-4 p-3 border-b border-b-[#2a2a2a] hover:bg-[#212121]"> */}
                                        <li className="border-b border-[#2a2a2a] hover:bg-[#212121] transition-colors duration-200">
                                            <Link
                                                href={`/${item.type}/${item.slug}`}
                                                // className="flex gap-4 w-full"
                                                className="flex items-start gap-4 px-5 py-4 w-full"
                                                onClick={() => {
                                                    setQuery("");   // Clear input
                                                    setResults([]); // Clear results
                                                    setIsSearchOpen(false);
                                                }}
                                            >
                                                {/* Thumbnail */}
                                                <Image
                                                    // src={item.image.url}
                                                    // src={getStrapiMedia(item.image?.url || "/keyzoo-fallback.png")}
                                                    src={item.image?.url ? getStrapiMedia(item.image.url) : "/keyzoo-fallback.png"
                                                    }
                                                    alt={item.title}
                                                    // height={50}
                                                    // width={50}
                                                    // className="w-[72px] h-[102px] object-center rounded"
                                                    width={80}
                                                    height={110}
                                                    className="
                                                w-[80px]
                                                h-[110px]
                                                rounded-md
                                                object-center
                                                flex-shrink-0"
                                                />

                                                {/* Info */}
                                                {/* <div className="flex flex-col flex-1"> */}
                                                <div className="flex flex-col flex-1 min-w-0 pt-1">
                                                    {/* <h3 className="text-s font-semibold mb-2">{item.title}</h3> */}
                                                    <h3 className="text-[17px] font-semibold text-white leading-6 line-clamp-2">
                                                        {item.title}
                                                    </h3>
                                                    {/* <p className="text-s text-blue-400 font-medium mb-0">GLOBAL</p> */}
                                                    <p className="text-[15px] text-[#00A6FF] font-semibold mt-2 uppercase">
                                                        {item.region}
                                                    </p>

                                                    {/* Inline price block */}
                                                    {/* <div className="flex items-center gap-2 mt-5">
                                                    <span className="text-white font-bold"> {symbol} {item.discountPrice}</span>
                                                    <span className="text-gray-400 line-through text-xs"> {symbol} {item.originalPrice}</span>
                                                    <span className="bg-red-600 text-xs text-white font-semibold px-2 py-0.5 rounded">
                                                        ~{discountPercent}% off
                                                    </span>
                                                </div> */}

                                                    <div className="flex items-center gap-3 mt-4 flex-wrap">
                                                        <span className="text-[20px] font-bold text-white leading-none">
                                                            {symbol}
                                                            {item.discountPrice}
                                                        </span>

                                                        <span className="text-gray-500 line-through text-[16px]">
                                                            {symbol}
                                                            {item.price}
                                                        </span>

                                                        <span className="bg-[#ff2d55] text-white text-[14px] font-semibold px-2 py-1 rounded-md leading-none">
                                                            ~{discountPercent}% off
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    </div>
                                );
                            })}
                        </ul>
                    ) : (
                        query && (
                            <ul className="absolute left-0 right-0 bg-[#1a1a1a] text-white rounded-lg shadow z-50 mt-5">
                                <li className="p-4 text-center text-gray-400">
                                    No products found.
                                </li>
                            </ul>
                        )
                    )
                )}
            </div>
        </>
    );
}
