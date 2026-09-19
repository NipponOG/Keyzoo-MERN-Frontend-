import { useEffect, useState } from 'react';
import Link from 'next/link';
import useCurrency from '@/hook/useCurrency';
import HoverCard from '@/components/HoverCard';
import Skeleton from 'react-loading-skeleton';
import OptimizedImage from "@/components/Image/OptimizedImage";
import { HugeiconsIcon } from '@hugeicons/react';
import { MultiplicationSignSquareIcon } from '@hugeicons/core-free-icons';

export default function BeastSelling() {

    const { symbol } = useCurrency();
    const [products, setProducts] = useState([]);
    const [notified, setNotified] = useState({});
    const [showAllModal, setShowAllModal] = useState(false);

    useEffect(() => {
        async function getProducts() {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL;

                const res = await fetch(
                    `${API_URL}/products/best-selling`,
                    {
                        cache: 'no-store',
                    }
                );

                if (!res.ok) {
                    throw new Error(
                        'Failed to fetch best selling products'
                    );
                }

                const data = await res.json();

                setProducts(data?.data || []);
            } catch (error) {
                console.error(
                    'Failed to fetch products:',
                    error
                );

                setProducts([]);
            }
        }

        getProducts();
    }, []);

    if (!products.length) {
        return (
            <section className="my-10">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 ">
                    <Skeleton height={500} borderRadius={16} />
                    <Skeleton height={500} borderRadius={16} />
                    <Skeleton height={500} borderRadius={16} />
                    <Skeleton height={500} borderRadius={16} />
                    <Skeleton height={500} borderRadius={16} />
                    <Skeleton height={500} borderRadius={16} />
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="my-10">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Best Selling Games</h2>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4  ">
                    {products.slice(0, 6).map((item) => {

                        return (
                            <div key={item._id} className='mb-2 mt-2'>
                                {item.available ? (<Link
                                    href={`/product/${item.slug}`}
                                    // className="block p-1 rounded-lg hover:shadow-md transition bg-white dark:bg-[#1a1a1a] relative max-w-[260px] mx-auto"
                                    className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative min-w-[200px] mx-auto shadow-sm dark:shadow-none hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">

                                        <OptimizedImage
                                            src={item.image || "/images/placeholder.png"}
                                            alt={item.title || "Product"}
                                            fill
                                            sizes="(max-width: 374px) 50vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 16vw"
                                            className="object-cover object-center"
                                        />

                                        {/* Platform badge */}
                                        {item.platform && (
                                            <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded uppercase">
                                                {item.platform}
                                            </span>
                                        )}

                                        {/* Discount ribbon */}
                                        {item.price && item.discountPrice < item.price && (
                                            <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
                                                -{Math.round(
                                                    ((item.price - item.discountPrice) / item.price) * 100
                                                )}%
                                            </span>
                                        )}

                                    </div>
                                    <div className='bg-gray-100 dark:bg-black/30 backdrop-blur-sm px-1 py-1 rounded-b-md h-[120px]'>
                                        <HoverCard title={item.title}>
                                            <h3 className="text-sm font-semibold line-clamp-2 px-1.5 mt-1 text-black">{item.title}</h3>
                                        </HoverCard>
                                        <h3 className="text-sm font-semibold text-[#0076CE] px-1.5 mt-0.5">{item.region}</h3>
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
                                        <OptimizedImage
                                            src={item.image || "/images/placeholder.png"}
                                            alt={item.title || "Product"}
                                            fill
                                            sizes="(max-width: 374px) 50vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 16vw"
                                            className="object-cover object-center grayscale opacity-60"
                                        />

                                        {/* 🔥 Bottom overlay container */}
                                        <div className="absolute bottom-3 left-0 w-full flex justify-center px-3">

                                            <button onClick={() => handleNotify(item)} disabled={notified[item._id]} className="flex items-center justify-center gap-2 w-full max-w-[85%] bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold py-2.5 rounded-md hover:bg-white/20 transition shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer">
                                                {notified[item._id] ? "✔ Notified" : "🔔 Notify me"}
                                            </button>

                                        </div>

                                        {/* Platform badge */}
                                        {item.platform && (
                                            <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded uppercase">
                                                {item.platform}
                                            </span>
                                        )}

                                        {/* Discount ribbon */}
                                        {item.price && item.discountPrice < item.price && (
                                            <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
                                                -{Math.round(
                                                    ((item.price - item.discountPrice) / item.price) * 100
                                                )}%
                                            </span>
                                        )}

                                    </div>
                                    <div className='bg-gray-100 dark:bg-black/30 backdrop-blur-sm px-1 py-1 rounded-b-md h-[120px]'>
                                        <HoverCard title={item.title}>
                                            <h3 className="text-sm font-semibold line-clamp-2 px-1.5 mt-1 text-black">{item.title}</h3>
                                        </HoverCard>
                                        <h3 className="text-sm font-semibold text-[#0076CE] px-1.5 mt-0.5">{item.region}</h3>
                                        <p className="text-lg text-[#cc0000] font-bold dark:text-gray-300 px-1.5 mt-1 mb-1.5">
                                            Sold Out
                                        </p>
                                    </div>
                                </div>)}
                            </div>
                        );
                    })}
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

                {products.length > 6 && (
                    <div className="flex justify-center mt-8">
                        <button
                            type="button"
                            onClick={() => setShowAllModal(true)}
                            className="
                px-6
                py-2.5
                rounded-full
                bg-neutral-800
                text-white
                hover:bg-neutral-700
                transition-all
                duration-300
                cursor-pointer
            "
                        >
                            Show All
                        </button>
                    </div>
                )}

            </section>

            {showAllModal && (
                <div
                    className="
            fixed
            inset-0
            z-[100]
            bg-black/80
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
        "
                    onClick={() => setShowAllModal(false)}
                >
                    <div
                        className="
                relative
                w-full
                max-w-[1500px]
                max-h-[90vh]
                bg-[#111]
                rounded-2xl
                border
                border-white/10
                shadow-2xl
                overflow-hidden
            "
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* HEADER */}
                        <div
                            className="
                    sticky
                    top-0
                    z-20
                    flex
                    items-center
                    justify-between
                    px-6
                    py-4
                    bg-[#111]/95
                    backdrop-blur-md
                    border-b
                    border-white/10
                "
                        >
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white">
                                    Best Selling Games
                                </h2>

                                <p className="text-sm text-gray-400 mt-1">
                                    Showing up to 30 best selling games
                                </p>
                            </div>

                            {/* CLOSE */}
                            <button
                                type="button"
                                onClick={() => setShowAllModal(false)}
                                className="
                        w-10
                        h-10
                        rounded-full
                        bg-white/10
                        hover:bg-white/20
                        text-white
                        flex
                        items-center
                        justify-center
                        text-xl
                        transition
                        cursor-pointer
                    "
                                aria-label="Close"
                            >
                                <HugeiconsIcon icon={MultiplicationSignSquareIcon} size={32} />
                            </button>
                        </div>


                        {/* PRODUCTS */}
                        <div className="overflow-y-auto max-h-[calc(90vh-90px)] p-6">

                            <div
                                className="
                        grid
                        grid-cols-2
                        sm:grid-cols-3
                        md:grid-cols-4
                        lg:grid-cols-5
                        xl:grid-cols-6
                        gap-4
                    "
                            >
                                {products.slice(0, 30).map((item) => {

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
                                        <div
                                            key={`modal-${item.id}`}
                                            className="mb-2"
                                        >

                                            {item.available ? (
                                                <Link
                                                    href={`/product/${item.slug}`}
                                                    onClick={() =>
                                                        setShowAllModal(false)
                                                    }
                                                    className="
                                            block
                                            p-1
                                            rounded-lg
                                            bg-white
                                            dark:bg-[#1a1a1a]
                                            relative
                                            shadow-sm
                                            hover:shadow-lg
                                            transition-transform
                                            duration-300
                                            hover:-translate-y-1
                                        "
                                                >

                                                    <div className="
                                            relative
                                            w-full
                                            aspect-[3/5]
                                            mb-1.5
                                            rounded-md
                                            overflow-hidden
                                        ">

                                                        <ProductCardImage
                                                            imgUrl={imgUrl}
                                                            blurUrl={blurUrl}
                                                            available={item.Available}
                                                            title={item.title}
                                                        />

                                                        {item.platform && (
                                                            <span className="
                                                    absolute
                                                    top-2
                                                    left-2
                                                    bg-black/80
                                                    text-white
                                                    text-[10px]
                                                    px-2
                                                    py-0.5
                                                    rounded
                                                    uppercase
                                                ">
                                                                {item.platform}
                                                            </span>
                                                        )}

                                                        {item.price && item.discountPrice < item.price && (
                                                            <span className="
                                                        absolute
                                                        top-2
                                                        right-2
                                                        bg-red-600
                                                        text-white
                                                        text-[10px]
                                                        px-2
                                                        py-0.5
                                                        rounded
                                                    ">
                                                                -{Math.round(
                                                                    ((item.price - item.discountPrice) / item.price) * 100
                                                                )}%
                                                            </span>
                                                        )}
                                                    </div>


                                                    <div className="
                                            bg-gray-100
                                            dark:bg-black/30
                                            backdrop-blur-sm
                                            px-1
                                            py-1
                                            rounded-b-md
                                            h-[120px]
                                        ">

                                                        <HoverCard title={item.title}>
                                                            <h3 className="
                                                    text-sm
                                                    font-semibold
                                                    line-clamp-2
                                                    px-1.5
                                                    mt-1
                                                    text-black
                                                ">
                                                                {item.title}
                                                            </h3>
                                                        </HoverCard>

                                                        <h3 className="
                                                text-sm
                                                font-semibold
                                                text-[#0076CE]
                                                px-1.5
                                                mt-0.5
                                            ">
                                                            {item.region}
                                                        </h3>

                                                        <p className="
                                                text-lg
                                                text-gray-600
                                                dark:text-gray-300
                                                px-1.5
                                                mt-1
                                                mb-1.5
                                            ">
                                                            {symbol}{" "}
                                                            {Number(
                                                                item.discountPrice
                                                            ).toFixed(2)}
                                                        </p>

                                                    </div>

                                                </Link>
                                            ) : (

                                                <div
                                                    className="
                                            block
                                            p-1
                                            rounded-lg
                                            bg-white
                                            dark:bg-[#1a1a1a]
                                            relative
                                            shadow-sm
                                            cursor-not-allowed
                                        "
                                                >

                                                    <div className="
                                            relative
                                            w-full
                                            aspect-[3/5]
                                            mb-1.5
                                            rounded-md
                                            overflow-hidden
                                        ">

                                                        <ProductCardImage
                                                            imgUrl={imgUrl}
                                                            blurUrl={blurUrl}
                                                            title={item.title}
                                                            available={item.Available}
                                                        />

                                                        {/* Notify */}
                                                        <div className="
                                                absolute
                                                bottom-3
                                                left-0
                                                w-full
                                                flex
                                                justify-center
                                                px-3
                                            ">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleNotify(item)
                                                                }
                                                                disabled={notified[item.id]}
                                                                className="
                                                        flex
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        w-full
                                                        bg-white/10
                                                        backdrop-blur-md
                                                        border
                                                        border-white/20
                                                        text-white
                                                        text-sm
                                                        font-semibold
                                                        py-2.5
                                                        rounded-md
                                                        hover:bg-white/20
                                                        transition
                                                    "
                                                            >
                                                                {notified[item.id]
                                                                    ? "✔ Notified"
                                                                    : "🔔 Notify me"}
                                                            </button>
                                                        </div>

                                                    </div>

                                                    <div className="
                                            bg-gray-100
                                            dark:bg-black/30
                                            backdrop-blur-sm
                                            px-1
                                            py-1
                                            rounded-b-md
                                            h-[120px]
                                        ">

                                                        <HoverCard title={item.title}>
                                                            <h3 className="
                                                    text-sm
                                                    font-semibold
                                                    line-clamp-2
                                                    px-1.5
                                                    mt-1
                                                    text-black
                                                ">
                                                                {item.title}
                                                            </h3>
                                                        </HoverCard>

                                                        <h3 className="
                                                text-sm
                                                font-semibold
                                                text-[#0076CE]
                                                px-1.5
                                                mt-0.5
                                            ">
                                                            {item.region}
                                                        </h3>

                                                        <p className="
                                                text-lg
                                                text-[#cc0000]
                                                font-bold
                                                dark:text-gray-300
                                                px-1.5
                                                mt-1
                                                mb-1.5
                                            ">
                                                            Sold Out
                                                        </p>

                                                    </div>

                                                </div>
                                            )}

                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}