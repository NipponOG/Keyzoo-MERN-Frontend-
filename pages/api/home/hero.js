import redis from "@/lib/redis";
import { fetchFromStrapi } from "@/lib/strapi";

export default async function handler(req, res) {
    const cacheKey = "homepage:hero";

    try {
        // CHECK CACHE
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            console.log("✅ Hero cache HIT");

            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log("❌ Hero cache MISS");

        // FETCH FROM STRAPI
        const heroRes = await fetchFromStrapi(
            "api/hero-banners?populate=*"
        );

        const data = heroRes?.data || [];

        // SAVE CACHE
        await redis.set(
            cacheKey,
            JSON.stringify(data),
            "EX",
            1800
        );

        return res.status(200).json(data);

    } catch (err) {
        console.error("Hero cache error:", err);

        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
}