export default async function handler(req, res) {
    try {
        const {
            amount,
            phone,
            country,
            operatorId,
            operatorName,
        } = req.body;

        const response = await fetch(
            "https://sandbox.cashfree.com/pg/orders",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-client-id": process.env.CASHFREE_APP_ID,
                    "x-client-secret": process.env.CASHFREE_SECRET_KEY,
                    "x-api-version": "2023-08-01",
                },
                body: JSON.stringify({
                    order_amount: amount,
                    order_currency: "INR",

                    order_id: `topup_${Date.now()}`,

                    customer_details: {
                        customer_id: phone,
                        customer_phone: phone.replace(/\D/g, ""),
                        customer_name: "Customer",
                        customer_email: "customer@example.com",
                    },

                    order_meta: {
                        return_url:
                            `${process.env.FRONTEND_URL}/topup/success?order_id={order_id}`,
                    },
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        const orderResponse = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}api/topup-orders`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                },
                body: JSON.stringify({
                    data: {
                        orderId: data.order_id,
                        cashfreeOrderId: data.cf_order_id,
                        phone,
                        country,
                        operatorId,
                        operatorName,
                        amount,
                        currency: "INR",
                        status: "PENDING",
                        paymentStatus: "PENDING",
                        rechargeStatus: "PENDING",
                    },
                }),
            }
        );

        const orderData = await orderResponse.json();

        if (!orderResponse.ok) {
            console.error("Strapi Save Failed:");
            console.error(JSON.stringify(orderData, null, 2));

            return res.status(500).json({
                error: "Failed to save order",
                details: orderData,
            });
        }

        // const data = await response.json();

        console.log("Cashfree Status:", response.status);
        console.log("Cashfree Response:", data);

        res.status(200).json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to create order",
        });
    }
}