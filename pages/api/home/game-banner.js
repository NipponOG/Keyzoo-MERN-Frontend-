import redis from "@/lib/redis";
import { fetchFromStrapi } from "@/lib/strapi";

export default async function handler(req, res) {
    const cacheKey = "homepage:gamebanner";

    try {
        // CHECK CACHE
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            console.log("✅ GameBanner cache HIT");

            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log("❌ GameBanner cache MISS");

        // FETCH FROM STRAPI
        const gameBannerRes = await fetchFromStrapi(
            "api/game-banners?populate=image"
        );

        const data = gameBannerRes?.data || [];

        // SAVE CACHE
        await redis.set(
            cacheKey,
            JSON.stringify(data),
            "EX",
            1800
        );

        return res.status(200).json(data);

    } catch (err) {
        console.error("GameBanner cache error:", err);

        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
}