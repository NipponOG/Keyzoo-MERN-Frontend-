import redis from "@/lib/redis";
import { CACHE_TAGS } from "@/lib/cacheTags";

export default async function handler(
    req,
    res
) {
    console.log(
        "Webhook payload:",
        JSON.stringify(req.body, null, 2)
    );

    console.log(
        "Slug:",
        req.body?.entry?.slug
    );

    const secret =
        req.headers["x-cache-secret"];

    if (
        secret !== process.env.CACHE_SECRET
    ) {
        return res.status(401).json({
            error: "Unauthorized",
        });
    }

    const model =
        req.body?.model;

    let keysToDelete = [];

    switch (model) {

        case "hero-banner":
            keysToDelete = [
                ...CACHE_TAGS.homepage,
            ];
            break;

        case "product":

            keysToDelete = [
                ...CACHE_TAGS.products,
                ...CACHE_TAGS.homepage,
                ...CACHE_TAGS.search,
            ];

            const slug = req.body?.entry?.slug;

            if (slug) {
                keysToDelete.push(
                    `product:${slug}`
                );
            }

            break;

        case "category":
            keysToDelete = [
                ...CACHE_TAGS.categories,
                ...CACHE_TAGS.homepage,
            ];
            break;

        case "gift-card":
            keysToDelete = [
                ...CACHE_TAGS.giftcards,
                ...CACHE_TAGS.homepage,
            ];
            break;

        default:
            keysToDelete = [];
    }

    if (keysToDelete.length > 0) {
        console.log("🗑️ Deleting:", keysToDelete);
        await redis.del(...keysToDelete);
    }

    console.log(
        "✅ Invalidated:",
        keysToDelete
    );

    // console.log(
    //     "🗑️ Cache cleared:",
    //     keysToDelete
    // );

    console.log(
        "FULL BODY:",
        JSON.stringify(req.body, null, 2)
    );

    return res.status(200).json({
        success: true,
        deleted: keysToDelete,
    });
}