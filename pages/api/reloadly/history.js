export default async function handler(req, res) {
    const orders = await fetchFromStrapi(
        "api/topup-orders?sort=createdAt:desc"
    );

    return res.status(200).json(
        orders.data || []
    );
}