import redis from "@/lib/redis";
import { fetchFromStrapi } from "@/lib/strapi";

export default async function handler(req, res) {
    const cacheKey = "homepage:adbanner";

    try {
        // CHECK CACHE
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            console.log("✅ AdBanner cache HIT");

            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log("❌ AdBanner cache MISS");

        // FETCH FROM STRAPI
        const adsRes = await fetchFromStrapi(
            "api/ad-banner-sections?populate=*"
        );

        const data = adsRes?.data || [];

        // SAVE CACHE
        await redis.set(
            cacheKey,
            JSON.stringify(data),
            "EX",
            1800
        );

        return res.status(200).json(data);

    } catch (err) {
        console.error("AdBanner cache error:", err);

        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
}