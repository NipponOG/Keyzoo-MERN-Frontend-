export default async function handler(req, res) {
    try {
        const [productsRes, giftCardsRes] = await Promise.all([
            fetch(
                `${process.env.STRAPI_URL}api/products?populate=*&pagination[pageSize]=1000`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
                    },
                }
            ),
            fetch(
                `${process.env.STRAPI_URL}api/gift-cards?populate=*&pagination[pageSize]=1000`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
                    },
                }
            ),
        ]);

        const products = await productsRes.json();
        const giftCards = await giftCardsRes.json();

        const items = [
            ...(products.data || []).map(item => ({
                ...item,
                collection: "product",
            })),
            ...(giftCards.data || []).map(item => ({
                ...item,
                collection: "gift-card",
            })),
        ];

        res.status(200).json(items);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Failed to load products",
        });
    }
}