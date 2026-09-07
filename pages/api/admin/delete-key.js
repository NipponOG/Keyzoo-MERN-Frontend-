// pages/api/admin/delete-key.js

import verifyAdmin from "@/lib/auth/verifyAdmin";

export default async function handler(req, res) {

    if (req.method !== "DELETE") {
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

        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Key ID is required",
            });
        }

        const response = await fetch(
            `${process.env.STRAPI_URL}api/game-keys/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${process.env.INVENTORY_API_TOKEN}`,
                },
            }
        );

        if (response.ok) {
            return res.status(200).json({
                success: true,
            });
        }

        let error = {};

        try {
            error = await response.json();
        } catch (_) {
            error = {
                success: false,
                error: "Delete failed",
            };
        }

        return res.status(response.status).json(error);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: err.message,
        });

    }

}