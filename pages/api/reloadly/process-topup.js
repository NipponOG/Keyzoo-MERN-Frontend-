import { getReloadlyToken } from "@/lib/reloadly/getToken";

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed",
        });
    }

    const {
        orderId,
        phone,
        country,
        operatorId,
        operatorName,
        amount,
        paymentStatus = "PENDING",
        rechargeStatus = "PENDING"
    } = req.body;

    const verify = await fetch(
        `https://sandbox.cashfree.com/pg/orders/${orderId}`,
        {
            headers: {
                "x-client-id": process.env.CASHFREE_APP_ID,
                "x-client-secret": process.env.CASHFREE_SECRET_KEY,
                "x-api-version": "2023-08-01",
            },
        }
    );

    const verifyData = await verify.json();

    if (!verify.ok) {
        return res.status(400).json({
            error: "Unable to verify payment",
            details: verifyData,
        });
    }

    if (verifyData.order_status !== "PAID") {
        return res.status(400).json({
            error: "Payment not completed",
            details: verifyData,
        });
    }

    // const {
    //     phone,
    //     countryCode,
    //     operatorId,
    //     amount,
    //     orderId,
    // } = req.body;

    try {

        const token = await getReloadlyToken();

        const reloadlyResponse = await fetch(
            "https://topups-sandbox.reloadly.com/topups",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    operatorId,
                    amount,
                    useLocalAmount: true,
                    recipientPhone: {
                        countryCode: country,
                        number: phone,
                    },
                }),
            }
        );

        const reloadlyData = await reloadlyResponse.json();

        if (!reloadlyResponse.ok) {

            console.error("Reloadly Error:", reloadlyData);

            return res.status(400).json({
                error: "Reloadly topup failed",
                details: reloadlyData,
            });
        }

        return res.status(200).json(reloadlyData);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Topup failed",
        });

    }
}