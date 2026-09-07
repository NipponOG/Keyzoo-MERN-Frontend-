// pages/api/admin/orders
// import verifyAdmin from "@/lib/auth/verifyAdmin";

// export default async function handler(req, res) {
//     console.log("🔥 API HIT");

//     if (req.method !== "GET") {
//         return res.status(405).json({
//             success: false,
//             error: "Method not allowed",
//         });
//     }

//     // 🔒 Verify Admin
//     const user = await verifyAdmin(req);

//     if (!user) {
//         return res.status(401).json({
//             success: false,
//             error: "Unauthorized",
//         });
//     }

//     try {

//         const response = await fetch(
//             `${process.env.STRAPI_URL}api/orders`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
//                 },
//             }
//         );

//         const data = await response.json();

//         if (!response.ok) {
//             return res.status(response.status).json(data);
//         }

//         return res.status(200).json(data);

//     } catch (err) {

//         console.error(err);

//         return res.status(500).json({
//             success: false,
//             error: "Failed",
//         });

//     }

// }





// pages/api/admin/orders.js

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

        const {
            page = 1,
            pageSize = 10,
            search = "",
            status = "",
        } = req.query;

        const params = new URLSearchParams();

        params.append("pagination[page]", page);
        params.append("pagination[pageSize]", pageSize);

        if (search) {
            params.append(
                "filters[orderNumber][$containsi]",
                search
            );
        }

        if (status === "manual") {

            params.append(
                "filters[manualDeliveryRequired][$eq]",
                "true"
            );

        } else if (status) {

            params.append(
                "filters[deliveryStatus][$eq]",
                status
            );

        }

        const response = await fetch(
            `${process.env.STRAPI_URL}api/orders?${params.toString()}`,
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

        return res.status(200).json(data);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: err.message,
        });

    }

}