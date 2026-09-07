import redis from "@/lib/redis";
import { fetchFromStrapi } from "@/lib/strapi";

export default async function handler(req, res) {
    const q = req.query.q?.trim();

    if (!q) {
        return res.status(200).json([]);
    }

    const cacheKey = `search:${q.toLowerCase()}`;

    try {

        // CHECK CACHE
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            console.log("✅ Search cache HIT");

            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log("❌ Search cache MISS");

        // FETCH ALL IN PARALLEL
        const [
            productRes,
            giftCardRes,
            playStationRes
        ] = await Promise.all([

            fetchFromStrapi(
                `api/products?filters[title][$containsi]=${q}&populate=*`
            ),

            fetchFromStrapi(
                `api/gift-cards?filters[title][$containsi]=${q}&populate=*`
            ),

            fetchFromStrapi(
                `api/play-stations?filters[title][$containsi]=${q}&populate=*`
            ),
        ]);

        // NORMALIZE
        const products = (productRes.data || []).map((item) => ({
            ...item,
            type: "product",
        }));

        const giftCards = (giftCardRes.data || []).map((item) => ({
            ...item,
            type: "gift-card",
        }));

        const playStations = (playStationRes.data || []).map((item) => ({
            ...item,
            type: "store/category/psn",
        }));

        const mergedResults = [
            ...products,
            ...giftCards,
            ...playStations,
        ];

        // SAVE CACHE
        await redis.set(
            cacheKey,
            JSON.stringify(mergedResults),
            "EX",
            300
        );

        return res.status(200).json(mergedResults);

    } catch (err) {

        console.error("Search error:", err);

        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
}