import redis from "@/lib/redis";
import { fetchFromStrapi } from "@/lib/strapi";

export default async function handler(req, res) {
    const cacheKey = "homepage:categorybanners";

    try {
        // CHECK CACHE
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            console.log("✅ Category banners cache HIT");

            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log("❌ Category banners cache MISS");

        // FETCH FROM STRAPI
        const categoryRes = await fetchFromStrapi(
            "api/category-banners?populate=*"
        );

        const data = categoryRes?.data || [];

        // SAVE CACHE
        await redis.set(
            cacheKey,
            JSON.stringify(data),
            "EX",
            1800
        );

        return res.status(200).json(data);

    } catch (err) {
        console.error("Category banners cache error:", err);

        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
}