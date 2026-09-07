import verifyAdmin from "@/lib/auth/verifyAdmin";

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    // 🔒 Verify Admin
    const user = await verifyAdmin(req);

    if (!user) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized",
        });
    }

    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ success: false, error: "Order ID required" });
    }

    try {
        const response = await fetch(`${process.env.STRAPI_URL}api/orders/manual-send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-admin-secret": process.env.ADMIN_SECRET, // 🔐 SAFE
            },
            body: JSON.stringify({ orderId }),
        });

        const data = await response.json();

        // return res.status(200).json(data);
        return res.status(response.status).json(data);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });

    }
}