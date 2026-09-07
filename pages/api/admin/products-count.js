// pages/api/admin/products-count.js
import verifyAdmin from "@/lib/auth/verifyAdmin";

export default async function handler(req, res) {

    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed",
        });
    }

    // 🔒 Verify Admin
    const user = await verifyAdmin(req);

    if (!user) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized",
        });
    }

    try {

        const headers = {
            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        };

        const [productsRes, giftCardsRes] = await Promise.all([

            fetch(
                `${process.env.STRAPI_URL}api/products?pagination[pageSize]=1`,
                { headers }
            ),

            fetch(
                `${process.env.STRAPI_URL}api/gift-cards?pagination[pageSize]=1`,
                { headers }
            ),

        ]);

        const productsData = await productsRes.json();
        const giftCardsData = await giftCardsRes.json();

        if (!productsRes.ok || !giftCardsRes.ok) {
            return res.status(500).json({
                success: false,
                error: "Failed to fetch products",
            });
        }

        return res.status(200).json({
            total:
                (productsData.meta?.pagination?.total || 0) +
                (giftCardsData.meta?.pagination?.total || 0),
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: err.message,
        });

    }

}