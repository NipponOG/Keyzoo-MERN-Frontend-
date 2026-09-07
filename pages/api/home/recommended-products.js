import redis from "@/lib/redis";
import { fetchFromStrapi } from "@/lib/strapi";

export default async function handler(req, res) {
    const cacheKey = "homepage:recommendedproducts";

    try {
        // CHECK CACHE
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            console.log("✅ Recommended products cache HIT");

            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log("❌ Recommended products cache MISS");

        // FETCH FROM STRAPI
        const productsRes = await fetchFromStrapi(
            "api/products?filters[hideRecomend][$eq]=false&populate=*"
        );

        const data = productsRes?.data || [];

        // SAVE CACHE
        await redis.set(
            cacheKey,
            JSON.stringify(data),
            "EX",
            600
        );

        return res.status(200).json(data);

    } catch (err) {
        console.error("Recommended products cache error:", err);

        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
}