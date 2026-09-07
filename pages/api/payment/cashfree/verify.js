export default async function handler(req, res) {

    const { orderId } = req.query;

    try {

        const response = await fetch(
            `https://sandbox.cashfree.com/pg/orders/${orderId}`,
            {
                headers: {
                    "x-client-id": process.env.CASHFREE_APP_ID,
                    "x-client-secret": process.env.CASHFREE_SECRET_KEY,
                    "x-api-version": "2023-08-01",
                },
            }
        );

        const data = await response.json();

        return res.status(200).json(data);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Verification failed",
        });
    }
}