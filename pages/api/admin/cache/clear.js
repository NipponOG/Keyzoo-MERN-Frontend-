import redis from "@/lib/redis";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed",
        });
    }

    try {
        await redis.flushdb();

        return res.status(200).json({
            success: true,
            message: "Full Redis cache cleared successfully",
        });
    } catch (error) {
        console.error("Redis flush error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to clear Redis cache",
        });
    }
}