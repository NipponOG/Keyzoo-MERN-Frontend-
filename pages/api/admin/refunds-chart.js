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

        const response = await fetch(
            `${process.env.STRAPI_URL}api/orders?pagination[pageSize]=5000`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        const orders = data.data || [];

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const refundMap = {};

        months.forEach(month => {
            refundMap[month] = 0;
        });

        orders.forEach(order => {

            // count refunded orders only
            if (order.paymentStatus !== "refunded") return;

            const date = new Date(order.createdAt);
            const month = months[date.getMonth()];

            refundMap[month] += Number(
                order.totalAmount || 0
            );
        });

        const chartData = months.map(month => ({
            month,
            refunds: refundMap[month],
        }));

        return res.status(200).json(chartData);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: "Failed",
        });

    }
}