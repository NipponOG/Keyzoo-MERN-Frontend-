// pages/api/admin/upload-keys.js

import verifyAdmin from "@/lib/auth/verifyAdmin";

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
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

        const { productId, type, keys } = req.body;

        const uploaded = [];
        const duplicates = [];

        for (const code of keys) {

            // Check duplicate
            const existing = await fetch(
                `${process.env.STRAPI_URL}api/game-keys?filters[code][$eq]=${encodeURIComponent(code)}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.INVENTORY_API_TOKEN}`,
                    },
                }
            );

            const existingData = await existing.json();

            if (existingData.data.length) {
                duplicates.push(code);
                continue;
            }
            console.log({
                productId,
                type,
            });
            const payload = {
                data: {
                    code,
                    isAvailable: true,
                },
            };

            if (type === "product") {
                payload.data.product = productId;
            } else {
                payload.data.giftCard = productId;
            }

            const createRes = await fetch(
                `${process.env.STRAPI_URL}api/game-keys`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.INVENTORY_API_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const createData = await createRes.json();

            console.log(createData);

            if (!createRes.ok) {
                console.log("CREATE FAILED");
                console.log(createData);
                continue;
            }

            uploaded.push(code);
        }

        return res.status(200).json({
            success: true,
            uploaded: uploaded.length,
            duplicates: duplicates.length,
            duplicateKeys: duplicates,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: err.message,
        });

    }

}