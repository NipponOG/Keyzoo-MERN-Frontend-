import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";
import { IoStarHalfSharp, IoStarSharp } from "react-icons/io5";
import { FaNoteSticky } from "react-icons/fa6";
import { FaGlobeAmericas, FaMemory } from 'react-icons/fa';
import { SlCheck } from "react-icons/sl";
import { LuLaptopMinimalCheck } from "react-icons/lu";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { MdOutlineAddShoppingCart, MdSupportAgent, MdVerified, MdSdStorage } from "react-icons/md";
import { AiFillThunderbolt } from "react-icons/ai";
import { GiProcessor } from "react-icons/gi";
import { BsFillLaptopFill, BsPciCardSound } from "react-icons/bs";
import { PiGraphicsCard } from "react-icons/pi";
import { fetchFromStrapi } from "@/lib/strapi";
import useCurrency from "@/hook/useCurrency";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper/modules"; // ✅ import Navigation
import "swiper/css/navigation"; // ✅ import navigation styles
import ErrorPage from "next/error";


export async function getServerSideProps({ params }) {
    const { slug } = params;

    const res = await fetchFromStrapi(`api/gift-cards?filters[slug][$eq]=${slug}&populate=*`);
    // const res = await fetchFromStrapi(`api/products?filters[slug][$eq]=${slug}&populate=*`);
    const product = res.data[0] || null;
    // const variations = product?.variations || [];

    return {
        props: {
            product,
        },
    };
}

export default function ProductPage({ product }) {

    // Destructure minimum and recommended requirements safely and languages also...
    const minimumRequirements = product?.minimumRequirement || {};
    const recommendedRequirements = product?.recommendedRequirement || {};
    const Audio = product?.audio_language || {};
    const Interface = product?.interface_language || {};
    const Subtitles = product?.subtitles_language || {};
    const Tags = product?.game_tag_seo || [];
    const relatedProducts = product?.relatedProducts || [];

    // Destructure variations safely
    // const [selectedVariation, setSelectedVariation] = useState(
    //     variations?.length > 0 ? variations[0] : null
    // );

    const [ageimage, setAgeimage] = useState(); // Default to true

    // // Option 1: Show based on environment variable
    // useEffect(() => {
    //     // You can set this in your environment variables
    //     setAgeimage(process.env.NEXT_PUBLIC_SHOW_AGEIMAGE === 'true');
    // }, []);

    const dispatch = useDispatch();
    const router = useRouter();
    const [selectedSlug, setSelectedSlug] = useState(router.query.slug);

    // update selectedSlug when slug changes in URL
    useEffect(() => {
        if (router.query.slug) {
            setSelectedSlug(router.query.slug);
        }
    }, [router.query.slug]);

    const handleAddToCart = () => {
        dispatch(addToCart({
            id: product.id,
            title: product.title,
            region: product.region,
            // gift_tag: product.item,
            item_type_gift: product.item_type,
            price: product.discountPrice,
            image: imgUrl,
            // add more if you want
        }));
        toast.success("Added to cart!");
    };

    const { symbol } = useCurrency();

    // if (!product) return <div>Product not found.</div>;
    useEffect(() => {
        if (!product) {
            router.replace("/404"); // redirects to your custom 404 page
        }
    }, [product, router]);

    if (!product) return null;

    // const { attributes } = product;
    // const imageUrl = attributes?.image?.data?.attributes?.url
    //   ? `${process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL}${attributes.image.data.attributes.url}`
    //   : null;

    const getStrapiMedia = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL}${url}`;
    };

    const imgUrl = getStrapiMedia(product.image?.url);
    const age = getStrapiMedia(product.age?.url);
    const platform = getStrapiMedia(product.platform_image?.url);

    // const discountPercent = Math.round(
    //   100 - (product.price / product.discountPrice) * 100
    // );

    const discountPercent = Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
    );


    return (
        <div className="min-h-screen p-4 lg:p-6">
            <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-[260px_1fr_380px] gap-4 lg:gap-6 xl:gap-8">


                {/* Left: Cover Image - Fixed width for laptop and up */}
                <div className="w-full md:w-[260px] flex justify-center mx-auto">
                    <div className="relative w-full md:w-[260px]">
                        <Image
                            // src="http://localhost:1337/uploads/2f398399_fe1a_4364_8943_56f1ccb5b735_8df12031c6.webp"
                            src={imgUrl}
                            width={260}
                            height={260}
                            alt={product.title}
                            className="rounded-lg w-full h-auto"
                            layout="responsive"
                        />

                        {/* this is for sold or not sold for this */}
                        {/* <span className="absolute bottom-15 right-2 bg-black/80 text-white text-[15px] px-2 py-0.5 rounded-lg uppercase"> */}
                        {product.stock_stetus && (<span className="absolute top-2 right-2 bg-black/80 text-white text-[15px] px-2 py-0.5 rounded-lg capitalize">
                            {product.stock_stetus}
                        </span>)}
                    </div>
                </div>

                {/* Middle: Game Info - Flex column */}
                <div className="flex flex-col gap-2 mx-auto xl:mx-0">   {/* mx-auto is the problem we need to fix it leater */}
                    <h1 className="text-lg lg:text-xl font-semibold dark:text-white text-justify tracking-tighter">
                        {product.title}
                    </h1>

                    {/* Tags + Ratings */}
                    <div className="flex flex-wrap items-center gap-2 text-sm mt-2.5">
                        <span className="bg-[#ff7f6a] px-2.5 py-1 rounded font-medium text-white">{product.item_type}</span>
                        <span className="bg-[#2a2a2a] px-2.5 py-1 rounded font-medium text-white">{product.item}</span>
                        <div className="flex items-center gap-2 text-yellow-400 ml-0 sm:ml-2">
                            <span className="w-[1px] h-[30px] bg-[#ffffff1a]"></span>
                            <span className="flex items-center">
                                <IoStarSharp className="text-xl" />
                                <IoStarSharp className="text-xl" />
                                <IoStarSharp className="text-xl" />
                                <IoStarSharp className="text-xl" />
                                {/* <IoStarHalfSharp className="text-xl" /> */}
                                {/* <IoMdStar className="text-2xl"/>
                                    <IoMdStar className="text-2xl"/>
                                    <IoMdStar className="text-2xl"/>
                                    <IoMdStar className="text-2xl"/> 
                                */}
                            </span>
                            <span className="text-white">69 Ratings</span>
                            {/* ⭐⭐⭐⭐⭐ <span className="text-white">69 Ratings</span> */}
                        </div>
                    </div>

                    {/* Feature Grid - 2 columns on laptop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mt-4 lg:mt-6">
                        {/* India Activation */}
                        <div className="flex items-start gap-3">
                            {/* <div className="bg-white dark:bg-[#1a1a1a] p-3 rounded-xl text-white"> */}
                            <div className="h-[56px] w-[56px] border border-[#e7e7e7] bg-white dark:bg-amber-500 rounded-xl flex items-center justify-center">
                                {/* <SlCheck className="text-xl text-[#1cc54c]" /> */}
                                <Image src={'/tick.svg'} height={26} width={26} />
                            </div>
                            <div>
                                <p className="text-xs lg:text-sm">
                                    Can be activated in <strong>India</strong>
                                </p>
                                <a href="#" className="text-[#359dff] text-xs">Check Restrictions</a>
                            </div>
                        </div>

                        {/* Region */}
                        <div className="flex items-start gap-3">
                            {/* <div className="bg-white dark:bg-[#1a1a1a] p-3 rounded-xl text-white"> */}
                            <div className="h-[56px] w-[56px] border border-[#e7e7e7] bg-white dark:bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                                {/* <FaGlobeAmericas className="text-xl text-[#359dff]" /> */}
                                <Image src={'/glob.svg'} height={26} width={26} />
                            </div>
                            <div>
                                <p className="text-xs lg:text-sm">
                                    Region: <strong>{product.region}</strong>
                                </p>
                                <a href="#" className="text-[#359dff] text-xs">Check Region</a>
                            </div>
                        </div>

                        {/* Platform */}
                        <div className="flex items-start gap-3">
                            {/* <div className="bg-[#2a2a2a] dark:bg-[#1a1a1a] p-3 rounded-xl text-white"> */}
                            <div className="h-[56px] w-[56px] border border-[#e7e7e7] bg-white dark:bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" fill="none">
                                    <rect width="32" height="32" rx="8" fill="#FAA41A" />
                                    <path d="M25.8815 18.6765H22.0481L21.4404 14.8549L19.1939 18.6497H18.7739C18.5188 18.2104 18.4179 17.5673 18.4179 17.1735C18.4179 16.5206 18.4648 15.8841 18.4648 15.0556C18.4648 13.9568 18.1418 13.367 17.28 13.1598V13.1273C19.1131 12.8724 19.9444 11.6595 19.9444 9.95193C19.9444 7.52591 18.3306 7 16.2156 7H10.525L8.12012 18.3882H11.1442L12.0193 14.2444H14.0294C15.1019 14.2444 15.5402 14.7691 15.5402 15.7732C15.5402 16.537 15.4606 17.1417 15.4606 17.7298C15.4606 17.9477 15.51 18.4535 15.6568 18.6497C15.6553 18.6497 17.8426 20.9562 17.8426 20.9562L15.9622 25L19.9844 22.6102L22.9816 24.9127L22.4221 21.0977L25.8815 18.6765ZM14.9332 12.1124H12.5296L13.1054 9.36687H15.3417C16.1379 9.36687 16.9661 9.57399 16.9661 10.5484C16.9661 11.7766 16.0228 12.1124 14.9332 12.1124Z" fill="black" />
                                    <path d="M20.0264 21.9386L17.225 23.6018L18.5072 20.848L16.948 19.2058H19.512L21.1338 16.4658L21.573 19.233H24.1166L21.8235 20.8376L22.2332 23.6353L20.0264 21.9386Z" fill="white" />
                                </svg> */}
                                <Image src={platform} height={26} width={26} />
                            </div>
                            <div>
                                <p className="text-xs lg:text-sm">
                                    Platform: <strong>Rockstar Games</strong>
                                </p>
                                <a href="#" className="text-[#359dff] text-xs">Activation Guide</a>
                            </div>
                        </div>

                        {/* Operating System */}
                        <div className="flex items-start gap-3">
                            <div className="h-[56px] w-[56px] border border-[#e7e7e7] bg-white dark:bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                                {/* <LuLaptopMinimalCheck className="text-xl text-[#359dff]" /> */}
                                <Image src={'/system.svg'} height={26} width={26} />
                            </div>
                            <div>
                                <p className="text-xs lg:text-sm">
                                    Works on: <strong>{product.workPlatform}</strong>
                                </p>
                                <a href="#" className="text-[#359dff] text-xs">System Requirements</a>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-neutral-800 mt-3 lg:mt-4"></div>

                    {relatedProducts.length > 0 && (<div className="mt-4 lg:mt-6">
                        <h3 className="text-xs lg:text-sm text-white/60 mb-2">Edition:</h3>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Option 1 */}
                            {relatedProducts?.map((product) => (
                                <label key={product.slug} className="w-full sm:w-[200px] cursor-pointer select-none">
                                    <input
                                        type="radio"
                                        name="edition"
                                        value={product.slug}
                                        className="peer sr-only"
                                        // checked={router.query.slug === product.slug}
                                        // onChange={() => router.push(`/gift-card/${product.slug}`)}
                                        checked={selectedSlug === product.slug}
                                        onChange={() => {
                                            setSelectedSlug(product.slug);
                                            router.push(`/gift-card/${product.slug}`);
                                        }}
                                    // defaultChecked
                                    />
                                    <div className="p-3 rounded-xl border border-[#2e2e2e] bg-[#1a1a1a] peer-checked:border-purple-500">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-white">{product.var_title}</span>
                                            {/* <div className="w-4 h-4 rounded-full border-2 border-white/60 peer-checked:border-purple-500"></div> */}
                                        </div>
                                        <div className="mt-1 text-sm text-white/50">from {symbol}{product.discountPrice}</div>
                                    </div>
                                </label>
                            ))}

                            {/* Option 2 */}
                            {/*
                                <label className="w-full sm:w-[200px] cursor-pointer">
                                    <input
                                        type="radio"
                                        name="edition"
                                        value="standard"
                                        className="peer sr-only"
                                    />
                                    <div className="p-3 rounded-xl border border-[#2e2e2e] bg-[#1a1a1a] peer-checked:border-purple-500">
                                        <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-white">Standard</span>
                                                <div className="w-4 h-4 rounded-full border-2 border-white/60 peer-checked:border-purple-500"></div>
                                        </div>
                                    <div className="mt-1 text-xs text-white/50">from ₹1,092.34</div>
                                    </div>
                                </label> 
                            */}
                        </div>
                    </div>)}
                </div>

                {/* Right: Pricing Box - Shows on xl screens or as last column on lg */}
                {/* <div className="w-full md:w-[380px] bg-[#111111] rounded-2xl p-4 space-y-4 text-white"> */}
                <div className="w-full max-w-md mx-auto bg-gradient-to-br from-[#111] to-[#1a1a1a] p-4 rounded-2xl shadow-lg border border-neutral-800 mt-6">
                    {/* Featured Offer */}
                    <div>
                        <p className="text-xs text-white/70 uppercase font-medium mb-1">Featured Offer</p>
                        <p className="text-xl lg:text-2xl font-bold">{symbol} {Number(product.discountPrice).toFixed(2)}</p>
                        <div className="flex items-center gap-2 text-xs lg:text-sm text-white/60">
                            {/* <span className="line-through">{symbol} {product.price}</span> */}
                            {/* <span className="text-green-400 font-semibold">~ {discountPercent}% off</span> */}
                        </div>
                    </div>

                    {/* Buy with Plus */}
                    <div className="bg-gradient-to-r from-[#2f1c4d] to-[#1d0e3e] rounded-lg p-3 mt-2.5">
                        <p className="text-xs lg:text-sm text-white/70">
                            Buy with <span className="text-purple-400 font-semibold">plus</span>
                        </p>
                        <p className="text-lg lg:text-xl font-bold">{product.plusprice}</p>
                    </div>

                    {/* Price note */}
                    <p className="text-xs text-white/40 mt-2">PRICE NOT FINAL</p>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-4">
                        {/* Cart icon-only button */}
                        {product.Available ? (<button onClick={handleAddToCart} className="cursor-pointer bg-neutral-800 p-2 lg:p-3 rounded-lg text-white flex items-center justify-center">
                            <MdOutlineAddShoppingCart className="text-xl lg:text-2xl" />
                        </button>) :
                        (<button disabled className="cursor-not-allowed bg-gray-400 p-2 lg:p-3 rounded-lg text-white flex items-center justify-center">
                            <MdOutlineAddShoppingCart className="text-xl lg:text-2xl" />
                        </button>)}

                        {/* Buy Now full-width button */}
                        {product.Available ? (<button className="cursor-pointer flex items-center justify-center gap-2 bg-[#814DE5] hover:bg-[#6C34D8] transition-colors text-white px-3 lg:px-4 py-2 lg:py-3 rounded-lg w-full font-semibold text-sm lg:text-base">
                            <RiShoppingBag3Fill className="text-xl lg:text-2xl" />
                            Buy now
                        </button>) : (
                        <button disabled className="cursor-not-allowed flex items-center justify-center gap-2 bg-gray-400 text-white px-3 lg:px-4 py-2 lg:py-3 rounded-lg w-full font-semibold text-sm lg:text-base">
                            <RiShoppingBag3Fill className="text-xl lg:text-2xl" />
                            Sold Out
                        </button>)}
                    </div>

                    {/* Explore Plus */}
                    <div className="bg-[#1e1e1e] rounded-xl p-3 flex items-center gap-2 mt-5 mb-5">
                        <div className="border border-purple-600 px-2 py-0.5 rounded text-purple-400 text-xs lg:text-sm font-medium">plus</div>
                        <p className="text-xs lg:text-sm text-white font-medium">Explore Plus Benefits</p>
                    </div>

                    {/* Feature Boxes */}
                    <div className="grid grid-cols-3 gap-0 mt-3">
                        {/* Instant Delivery */}
                        <div className="bg-neutral-800 px-3 py-2 lg:py-3 rounded-l-lg flex items-center justify-start gap-2">
                            <div className="">
                                <AiFillThunderbolt className="text-lg lg:text-xl text-yellow-500" />
                            </div>
                            <span className="text-xs lg:text-sm text-white">Instant Delivery</span>
                        </div>

                        {/* 24/7 Support */}
                        <div className="bg-neutral-800 px-3 py-2 lg:py-3 flex items-center justify-start gap-2">
                            <div className="">
                                <MdSupportAgent className="text-xl lg:text-3xl text-[#1cc54c]" />
                            </div>
                            <span className="text-xs lg:text-sm text-white">24/7 Support</span>
                        </div>

                        {/* Verified Sellers */}
                        <div className="bg-neutral-800 px-3 py-2 lg:py-3 rounded-r-lg flex items-center justify-start gap-2">
                            <div className="">
                                <MdVerified className="text-xl lg:text-3xl text-[#359dff]" />
                            </div>
                            <span className="text-xs lg:text-sm text-white">Verified Sellers</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Gallery */}
            {product.gallery && (<div className="bg-[#1a1a1a] p-3 lg:p-4 rounded-xl mt-4 lg:mt-6 text-xs lg:text-sm border border-[#2a2a2a] max-w-[1500px] mx-auto">
                {/* <div className="flex flex-col lg:flex-row flex-wrap gap-2 xl:gap-5"> */}
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 15 },
                        1024: { slidesPerView: 4, spaceBetween: 20 },
                    }}
                    navigation={true} // ✅ enable navigation
                    modules={[Navigation]} // ✅ include navigation module
                    className="w-full"
                >
                    {product?.gallery?.map((img, index) => (
                        <SwiperSlide key={index} className="flex justify-center">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL}${img.url}`}
                                alt={img.name || `Gallery image ${index + 1}`}
                                width={400}
                                height={300}
                                lazzyy="true"
                                className="rounded-xl object-cover cursor-pointer hover:opacity-90 transition h-[250px] w-[400px]"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>


                {/* Custom Swiper arrows styling */}
                <style>{`
          .swiper-button-prev,
          .swiper-button-next {
            color: #ffffff; /* Tailwind's red-400 */
            background: transparent !important;
            padding: 12px;
            border-radius: 9999px;
            transition: background-color 0.3s;
          }
          .swiper-button-prev:hover,
          .swiper-button-next:hover {
            background-color: rgba(0, 0, 0, 0.7);
            color: #ffffff; /* Tailwind's yellow-400 */
          }
          `}</style>
                {/* </div> */}
            </div>)}


            {/* Important Notice */}
            {product.notice && (<><div className="bg-[#1a1a1a] text-orange-500 p-3 lg:p-4 rounded-xl mt-4 lg:mt-6 text-xs lg:text-sm border border-[#2a2a2a] max-w-[1500px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-1 lg:gap-2 xl:gap-5">
                    <div className="font-semibold text-orange-500 text-sm lg:text-base xl:text-lg">
                        {product.notice}
                    </div>
                    {/* <div className="font-semibold text-orange-500 text-sm lg:text-base xl:text-lg">
                            Works only on PC. Activate the code on Rockstar Games Launcher.
                        </div> 
                    */}
                </div>
            </div>
            </>)}

            {/* Product Description */}
            <div className="bg-[#1a1a1a] p-3 lg:p-4 rounded-xl mt-4 lg:mt-6 text-xs lg:text-sm border border-[#2a2a2a] max-w-[1500px] mx-auto">
                <h2 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4 dark:text-white">Product description</h2>
                {/* <div className="font-semibold mb-5 text-lg">{product.title}</div> */}

                <div className="flex items-center gap-2 mb-5.5">
                    <span className="text-gray-400 text-[14px]">System :</span>
                    <span className="bg-[#2f2f2f] text-white px-2 lg:px-3 py-1.5 rounded-[20px] text-[14px] font-medium cursor-pointer">{product.workPlatform}</span>
                </div>

                {Tags.gametag_1 && (<div className="flex gap-3.5">
                    {Tags.gametag_1 && (<div className="rounded-2xl bg-[#2a2a2a] hover:bg-[#333] transition-all h-[35px] w-[100px] flex items-center justify-center">{Tags.gametag_1}</div>)}
                    {Tags.gametag_2 && (<div className="rounded-2xl bg-[#2a2a2a] hover:bg-[#333] transition-all h-[35px] w-[100px] flex items-center justify-center">{Tags.gametag_2}</div>)}
                    {Tags.gametag_3 && (<div className="rounded-2xl bg-[#2a2a2a] hover:bg-[#333] transition-all h-[35px] w-[100px] flex items-center justify-center">{Tags.gametag_3}</div>)}
                    {Tags.gametag_4 && (<div className="rounded-2xl bg-[#2a2a2a] hover:bg-[#333] transition-all h-[35px] w-[100px] flex items-center justify-center">{Tags.gametag_4}</div>)}
                    {Tags.gametag_5 && (<div className="rounded-2xl bg-[#2a2a2a] hover:bg-[#333] transition-all h-[35px] w-[100px] flex items-center justify-center">{Tags.gametag_5}</div>)}
                    {Tags.gametag_6 && (<div className="rounded-2xl bg-[#2a2a2a] hover:bg-[#333] transition-all h-[35px] w-[100px] flex items-center justify-center">{Tags.gametag_6}</div>)}
                    {Tags.gametag_7 && (<div className="rounded-2xl bg-[#2a2a2a] hover:bg-[#333] transition-all h-[35px] w-[100px] flex items-center justify-center">{Tags.gametag_7}</div>)}
                    {Tags.gametag_8 && (<div className="rounded-2xl bg-[#2a2a2a] hover:bg-[#333] transition-all h-[35px] w-[100px] flex items-center justify-center">{Tags.gametag_8}</div>)}
                    {Tags.gametag_9 && (<div className="rounded-2xl bg-[#2a2a2a] hover:bg-[#333] transition-all h-[35px] w-[100px] flex items-center justify-center">{Tags.gametag_9}</div>)}
                    {Tags.gametag_10 && (<div className="rounded-2xl bg-[#2a2a2a] hover:bg-[#333] transition-all h-[35px] w-[100px] flex items-center justify-center">{Tags.gametag_10}</div>)}
                    {Tags.gametag_11 && (<div className="rounded-2xl bg-[#2a2a2a] hover:bg-[#333] transition-all h-[35px] w-[100px] flex items-center justify-center">{Tags.gametag_11}</div>)}
                    {Tags.gametag_12 && (<div className="rounded-2xl bg-[#2a2a2a] hover:bg-[#333] transition-all h-[35px] w-[100px] flex items-center justify-center">{Tags.gametag_12}</div>)}
                    {Tags.gametag_13 && (<div className="rounded-2xl bg-[#2a2a2a] hover:bg-[#333] transition-all h-[35px] w-[100px] flex items-center justify-center">{Tags.gametag_13}</div>)}
                    {Tags.gametag_14 && (<div className="rounded-2xl bg-[#2a2a2a] hover:bg-[#333] transition-all h-[35px] w-[100px] flex items-center justify-center">{Tags.gametag_14}</div>)}
                    {Tags.gametag_15 && (<div className="rounded-2xl bg-[#2a2a2a] hover:bg-[#333] transition-all h-[35px] w-[100px] flex items-center justify-center">{Tags.gametag_15}</div>)}
                </div>)}

                {/* <div className="mt-5"><p className="text-[0.875rem] text-[#bfbfbf] leading-[20px] text-justify">{product.description}</p></div> */}
                {product.description && (<><div className="mt-5 text-md font-bold"></div>

                    <div className="mt-2 text-[0.875rem] leading-[20px] text-justify">  {/* text-[#bfbfbf] */}
                        <div className="justify-center">
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="font-semibold mb-5 text-lg" {...props} />,    //importent but if you add h2 on heading description
                                    h2: ({ node, ...props }) => <h2 className="text-md font-bold mt-6 mb-2" {...props} />,    //importent but if you add h2 on heading description
                                    strong: ({ node, ...props }) => <strong className="text-md font-bold text-white" {...props} />,    //importent but if you add h2 on heading description
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-0 ml-8 mb-5" {...props} />,   //importent
                                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,   //importent
                                    p: ({ node, ...props }) => <p className="mb-2 leading-relaxed text-[#bfbfbf]" {...props} />,   //importent
                                }}
                            >
                                {product?.description}
                            </ReactMarkdown>
                        </div>
                    </div>
                </>)}

                {product.descriptionkey && (<><div className="mt-5 text-md font-bold">Key Features</div>

                    <div className="mt-2 text-[0.875rem] text-[#bfbfbf] leading-[20px] text-justify">
                        <div className="ml-8 justify-center">
                            <ReactMarkdown
                                components={{
                                    h2: ({ node, ...props }) => <h2 className="text-md font-bold mt-6 mb-2" {...props} />,    //importent but if you add h2 on heading description
                                    strong: ({ node, ...props }) => <strong className="text-md font-bold text-white" {...props} />,    //importent but if you add h2 on heading description
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-0" {...props} />,   //importent
                                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,   //importent
                                    p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,   //importent
                                }}
                            >
                                {product?.descriptionkey}
                            </ReactMarkdown>
                        </div>
                    </div>
                </>)}

                {product?.editiondescription && (<div>
                    <div className="mt-5 text-md font-bold">Premium Edition Features</div>

                    <div className="mt-2 text-[0.875rem] text-[#bfbfbf] leading-[20px] text-justify">
                        <div className="ml-8 justify-center">
                            <ReactMarkdown
                                components={{
                                    h2: ({ node, ...props }) => <h2 className="text-md font-bold mt-6 mb-2" {...props} />,    //importent but if you add h2 on heading description
                                    strong: ({ node, ...props }) => <strong className="text-md font-bold text-white" {...props} />,    //importent but if you add h2 on heading description
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-0" {...props} />,   //importent
                                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,   //importent
                                    p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,   //importent
                                }}
                            >
                                {product?.editiondescription}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>)}


            </div>

            {/* System Requirements */} {/* if you want to show only fix the spelling */}
            {product.worrkPlatform && (<div className="bg-[#1a1a1a] text-white p-4 lg:p-6 rounded-xl mt-4 lg:mt-6 border border-[#2a2a2a] text-xs lg:text-sm space-y-3 lg:space-y-4 max-w-[1500px] mx-auto">
                {/* System Tag */}
                <div className="flex items-center gap-2 mb-5.5">
                    <span className="text-gray-400 text-[14px]">System :</span>
                    <span className="bg-[#2f2f2f] text-white px-2 lg:px-3 py-1.5 rounded-[20px] text-[14px] font-medium cursor-pointer">{product.workPlatform}</span>
                </div>

                {/* Title */}
                <h2 className="font-semibold text-base lg:text-lg">Minimum System Requirements</h2>

                {/* Grid of specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {/* OS */}
                    <div className="flex items-start gap-2 lg:gap-3 max-w-[400px]">
                        <span className="text-blue-500 text-base lg:text-lg"><BsFillLaptopFill size={20} className="lg:w-6 lg:h-6" /></span>
                        <div>
                            <p className="text-gray-400 font-medium">OS:</p>
                            <p className="text-white text-justify mt-2">
                                {minimumRequirements.os}
                            </p>
                        </div>
                    </div>

                    {/* Processor */}
                    <div className="flex items-start gap-2 lg:gap-3 max-w-[400px] tracking-tight">
                        <span className="text-blue-500 text-base lg:text-lg"><GiProcessor size={20} className="lg:w-6 lg:h-6" /></span>
                        <div>
                            <p className="text-gray-400 font-medium">Processor:</p>
                            <p className="text-white text-justify mt-2">
                                {minimumRequirements.processor}
                            </p>
                        </div>
                    </div>

                    {/* Memory */}
                    <div className="flex items-start gap-2 lg:gap-3 max-w-[400px] tracking-tight">
                        <span className="text-blue-500 text-base lg:text-lg"><FaMemory size={20} className="lg:w-6 lg:h-6" /></span>
                        <div>
                            <p className="text-gray-400 font-medium">Memory:</p>
                            <p className="text-white text-justify mt-2">{minimumRequirements.memory}</p>
                        </div>
                    </div>

                    {/* Graphics */}
                    <div className="flex items-start gap-2 lg:gap-3 max-w-[400px] tracking-tight">
                        <span className="text-blue-500 text-base lg:text-lg"><PiGraphicsCard size={20} className="lg:w-6 lg:h-6" /></span>
                        <div>
                            <p className="text-gray-400 font-medium">Graphics:</p>
                            <p className="text-white text-justify mt-2">{minimumRequirements.graphics}</p>
                        </div>
                    </div>

                    {/* Storage */}
                    <div className="flex items-start gap-2 lg:gap-3 max-w-[400px] tracking-tight">
                        <span className="text-blue-500 text-base lg:text-lg"><MdSdStorage size={20} className="lg:w-6 lg:h-6" /></span>
                        <div>
                            <p className="text-gray-400 font-medium">Storage:</p>
                            <p className="text-white text-justify mt-2">{minimumRequirements.storage}</p>
                        </div>
                    </div>

                    {/* Sound Card */}
                    {minimumRequirements.sound && (<div className="flex items-start gap-2 lg:gap-3 max-w-[400px] tracking-tight">
                        <span className="text-blue-500 text-base lg:text-lg"><BsPciCardSound size={20} className="lg:w-6 lg:h-6" /></span>
                        <div>
                            <p className="text-gray-400 font-medium">Sound Card:</p>
                            <p className="text-white text-justify mt-2">{minimumRequirements.sound}</p>
                        </div>
                    </div>)}

                    {/* Additional Notes */}
                    {minimumRequirements.additional_notes && (<div className="flex items-start gap-2 lg:gap-3 max-w-[400px] tracking-tight">
                        <span className="text-blue-500 text-base lg:text-lg"><FaNoteSticky size={20} className="lg:w-6 lg:h-6" /></span>
                        <div>
                            <p className="text-gray-400 font-medium">Additional Notes:</p>
                            <p className="text-white text-justify mt-2">{minimumRequirements.additional_notes}</p>
                        </div>
                    </div>)}
                </div>

                <div>
                    <h2 className="font-semibold text-base lg:text-lg mt-8 lg:mt-10">Recomended System Requirements</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-4 lg:mt-5 mb-4 lg:mb-5">
                        {/* OS */}
                        <div className="flex items-start gap-2 lg:gap-3 max-w-[400px]">
                            <span className="text-blue-500 text-base lg:text-lg"><BsFillLaptopFill size={20} className="lg:w-6 lg:h-6" /></span>
                            <div>
                                <p className="text-gray-400 font-medium">OS:</p>
                                <p className="text-white text-justify mt-2">
                                    {recommendedRequirements.os}
                                </p>
                            </div>
                        </div>

                        {/* Processor */}
                        <div className="flex items-start gap-2 lg:gap-3 max-w-[400px] tracking-tight">
                            <span className="text-blue-500 text-base lg:text-lg"><GiProcessor size={20} className="lg:w-6 lg:h-6" /></span>
                            <div>
                                <p className="text-gray-400 font-medium">Processor:</p>
                                <p className="text-white text-justify mt-2">
                                    {recommendedRequirements.processor}
                                </p>
                            </div>
                        </div>

                        {/* Memory */}
                        <div className="flex items-start gap-2 lg:gap-3 max-w-[400px] tracking-tight">
                            <span className="text-blue-500 text-base lg:text-lg"><FaMemory size={20} className="lg:w-6 lg:h-6" /></span>
                            <div>
                                <p className="text-gray-400 font-medium">Memory:</p>
                                <p className="text-white text-justify mt-2">{recommendedRequirements.memory}</p>
                            </div>
                        </div>

                        {/* Graphics */}
                        <div className="flex items-start gap-2 lg:gap-3 max-w-[400px] tracking-tight">
                            <span className="text-blue-500 text-base lg:text-lg"><PiGraphicsCard size={20} className="lg:w-6 lg:h-6" /></span>
                            <div>
                                <p className="text-gray-400 font-medium">Graphics:</p>
                                <p className="text-white text-justify mt-2">{recommendedRequirements.graphics}</p>
                            </div>
                        </div>

                        {/* Storage */}
                        <div className="flex items-start gap-2 lg:gap-3 max-w-[400px] tracking-tight">
                            <span className="text-blue-500 text-base lg:text-lg"><MdSdStorage size={20} className="lg:w-6 lg:h-6" /></span>
                            <div>
                                <p className="text-gray-400 font-medium">Storage:</p>
                                <p className="text-white text-justify mt-2">{recommendedRequirements.storage}</p>
                            </div>
                        </div>

                        {/* Sound Card */}

                        {recommendedRequirements.sound && (<div className="flex items-start gap-2 lg:gap-3 max-w-[400px] tracking-tight">
                            <span className="text-blue-500 text-base lg:text-lg"><BsPciCardSound size={20} className="lg:w-6 lg:h-6" /></span>
                            <div>
                                <p className="text-gray-400 font-medium">Sound Card:</p>
                                <p className="text-white text-justify mt-2">{recommendedRequirements.sound}</p>
                            </div>
                        </div>)}

                        {/* Additional Notes */}
                        {recommendedRequirements.additional_notes && (<div className="flex items-start gap-2 lg:gap-3 max-w-[400px] tracking-tight">
                            <span className="text-blue-500 text-base lg:text-lg"><FaNoteSticky size={20} className="lg:w-6 lg:h-6" /></span>
                            <div>
                                <p className="text-gray-400 font-medium">Additional Notes:</p>
                                <p className="text-white text-justify mt-2">{recommendedRequirements.additional_notes}</p>
                            </div>
                        </div>)}

                    </div>
                </div>
            </div>)}

            {/* Other details */}
            {product.releaseDate && (<div className="bg-[#1a1a1a] text-white p-4 lg:p-6 rounded-xl mt-4 lg:mt-8 border border-[#2a2a2a] text-xs lg:text-sm space-y-3 lg:space-y-4 max-w-[1500px] mx-auto">
                {/* Section Title */}
                {/* <h2 className="text-sm lg:text-base font-semibold">Other details</h2> */}

                {/* Grid for metadata */}
                {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6"> */}
                <div className="flex  justify-around md:grid-cols-4 gap-4 lg:gap-6">
                    <div>
                        <p className="text-gray-400 mb-1">Publishers</p>
                        <p className="text-white">{product.publisher}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 mb-1">Developers</p>
                        <p className="text-white">{product.developer}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 mb-1">Release date</p>
                        <p className="text-white">{product.releaseDate}</p>
                    </div>
                    {ageimage && (<div>
                        <p className="text-gray-400 mb-1">Age rating</p>
                        <Image width={6} height={6} src={age} alt="18+" className="w-8 h-8" />
                    </div>)}
                </div>

                {/* Divider */}
                {/* {product?.language && ( */}
                <>
                    {/* <hr className="border-[#333]" /> */}

                    {/* Languages */}
                    {/* Languages - Only render if language data exists */}
                    {/* <h2 className="text-sm lg:text-base font-semibold">Languages Support</h2> */}
                    {/* <div> */}



                    {Interface.interface && (
                        <>
                            <div>
                                <p className="text-white">
                                    <div className="text-gray-400 mb-1 text-[16px]">Interface : </div>{Interface.interface}
                                </p>
                            </div>

                            <hr className="border-[#333]" />
                        </>
                    )}
                    {Audio.audio && (
                        <>
                            <div>
                                <p className="text-white">
                                    <div className="text-gray-400 mb-1 text-[16px]">Full Audio : </div>{Audio.audio}
                                </p>
                            </div>

                            <hr className="border-[#333]" />
                        </>
                    )}
                    {Subtitles.subtitles && (
                        <>
                            <div>
                                <p className="text-white">
                                    <div className="text-gray-400 mb-1 text-[16px]">Subtitles : </div>{Subtitles.subtitles}
                                </p>
                            </div>
                        </>
                    )}

                    {/* </div> */}
                </>
                {/* )} */}
            </div>)}
        </div>
    );
}