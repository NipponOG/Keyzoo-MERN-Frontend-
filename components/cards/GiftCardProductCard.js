import Image from 'next/image';
import Link from 'next/link';
import useCurrency from '@/hook/useCurrency';
import HoverCard from '@/components/HoverCard';

export default function GiftCardProductCard({ item }) {
    const { symbol } = useCurrency();

    const getStrapiMedia = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL}${url}`;
    };

    const imgUrl = getStrapiMedia(item.image?.url);

    // SOLD OUT CARD
    if (!item.Available) {
        return (
            <div className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative min-w-[200px] mx-auto shadow-sm cursor-not-allowed">
                <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
                    <Image
                        src={imgUrl}
                        alt={item.title}
                        fill
                        className="object-center grayscale opacity-60"
                    />

                    {item.platform && (
                        <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded uppercase">
                            {item.platform}
                        </span>
                    )}
                </div>

                <div className="bg-gray-100 dark:bg-black/30 px-1 py-1 rounded-b-md h-[120px]">
                    <h3 className="text-md font-semibold line-clamp-2 px-3 mt-1 text-black">
                        {item.title}
                    </h3>
                    <h3 className="text-lg font-semibold text-blue-600 px-3 mt-1">
                        {item.card_region}
                    </h3>
                    <p className="text-lg text-[#cc0000] font-extrabold px-3 mt-2 mb-2">
                        Sold Out
                    </p>
                </div>
            </div>
        );
    }

    // AVAILABLE CARD
    return (
        <Link
            href={`/store/category/gift-card/${item.type}/${item.slug}`}
            className="block p-[5px] rounded-xl bg-white dark:bg-[#1a1a1a] relative min-w-[200px] mx-auto shadow-sm hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1"
        >
            <div className="relative w-full aspect-[3/5] mb-1.5 rounded-md overflow-hidden">
                <Image
                    src={imgUrl}
                    alt={item.title}
                    fill
                    className="object-center transition"
                />

                {item.platform && (
                    <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded uppercase">
                        {item.platform}
                    </span>
                )}

                {item.originalPrice && item.originalPrice > item.price && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
                        -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                    </span>
                )}
            </div>

            <div className="bg-gray-100 dark:bg-black/30 backdrop-blur-sm px-1 py-1 rounded-b-md h-[120px]">
                <HoverCard title={item.title}>
                    <h3 className="text-sm font-semibold line-clamp-2 leading-snug px-1.5 mt-1 text-black">
                        {item.title}
                    </h3>
                </HoverCard>
                <h3 className="text-sm font-semibold text-blue-600 px-1.5 mt-0.5 line-clamp-1">
                    {item.card_region}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 px-1.5 mt-1 mb-1.5">
                    {symbol} {Number(item.discountPrice).toFixed(2)}
                </p>
            </div>
        </Link>
    );
}
