// pages/api/admin/dashboard

// export default async function handler(req, res) {
//     try {
//         const [ordersRes, productsRes] = await Promise.all([
//             fetch(
//                 "http://localhost:1337/api/orders?pagination[pageSize]=1000",
//                 {
//                     headers: {
//                         Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
//                     },
//                 }
//             ),

//             fetch(
//                 "http://localhost:1337/api/products?pagination[pageSize]=1",
//                 {
//                     headers: {
//                         Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
//                     },
//                 }
//             ),
//         ]);

//         const ordersData = await ordersRes.json();
//         const productsData = await productsRes.json();

//         console.log("ORDERS DATA:");
//         console.log(JSON.stringify(ordersData, null, 2));

//         console.log("PRODUCTS DATA:");
//         console.log(JSON.stringify(productsData, null, 2));

//         const orders = ordersData.data || [];

//         console.log("TOTAL ORDERS:", orders.length);

//         if (orders.length > 0) {
//             console.log(
//                 "FIRST ORDER:",
//                 JSON.stringify(orders[0], null, 2)
//             );
//         }

//         const today = new Date().toDateString();

//         const salesToday = orders
//             .filter(
//                 (o) =>
//                     o.paymentStatus === "paid" &&
//                     new Date(o.createdAt).toDateString() === today
//             )
//             .reduce(
//                 (sum, o) => sum + (o.totalAmount || 0),
//                 0
//             );

//         const sevenDaysAgo = new Date();
//         sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//         const sales7Days = orders
//             .filter(
//                 (o) =>
//                     o.paymentStatus === "paid" &&
//                     new Date(o.createdAt) >= sevenDaysAgo
//             )
//             .reduce(
//                 (sum, o) => sum + (o.totalAmount || 0),
//                 0
//             );

//         const totalRevenue = orders
//             .filter((o) => o.paymentStatus === "paid")
//             .reduce(
//                 (sum, o) => sum + (o.totalAmount || 0),
//                 0
//             );

//         const activeOffers =
//             productsData.meta?.pagination?.total || 0;

//         res.status(200).json({
//             salesToday,
//             sales7Days,
//             totalRevenue,
//             activeOffers,
//             totalOrders: orders.length,
//             pendingOrders: orders.filter(
//                 (o) => o.deliveryStatus === "pending"
//             ).length,
//             completedOrders: orders.filter(
//                 (o) => o.deliveryStatus === "completed"
//             ).length,
//             partialOrders: orders.filter(
//                 (o) => o.deliveryStatus === "partial"
//             ).length,
//             manualOrders: orders.filter(
//                 (o) => o.manualDeliveryRequired
//             ).length,
//         });
//     } catch (error) {
//         console.error(error);

//         res.status(500).json({
//             error: "Dashboard fetch failed",
//         });
//     }
// }

// pages/api/admin/dashboard.js

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

        const headers = {
            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        };

        const [ordersRes, productsRes] = await Promise.all([

            fetch(
                `${process.env.STRAPI_URL}api/orders?pagination[pageSize]=1000`,
                { headers }
            ),

            fetch(
                `${process.env.STRAPI_URL}api/products?pagination[pageSize]=1`,
                { headers }
            ),

        ]);

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        if (!ordersRes.ok || !productsRes.ok) {
            return res.status(500).json({
                success: false,
                error: "Failed to fetch dashboard data",
            });
        }

        const orders = ordersData.data || [];

        const today = new Date().toDateString();

        const salesToday = orders
            .filter(
                order =>
                    order.paymentStatus === "paid" &&
                    new Date(order.createdAt).toDateString() === today
            )
            .reduce(
                (sum, order) =>
                    sum + Number(order.totalAmount || 0),
                0
            );

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const sales7Days = orders
            .filter(
                order =>
                    order.paymentStatus === "paid" &&
                    new Date(order.createdAt) >= sevenDaysAgo
            )
            .reduce(
                (sum, order) =>
                    sum + Number(order.totalAmount || 0),
                0
            );

        const totalRevenue = orders
            .filter(order => order.paymentStatus === "paid")
            .reduce(
                (sum, order) =>
                    sum + Number(order.totalAmount || 0),
                0
            );

        const activeOffers =
            productsData.meta?.pagination?.total || 0;

        return res.status(200).json({

            salesToday,

            sales7Days,

            totalRevenue,

            activeOffers,

            totalOrders: orders.length,

            pendingOrders: orders.filter(
                order => order.deliveryStatus === "pending"
            ).length,

            completedOrders: orders.filter(
                order => order.deliveryStatus === "completed"
            ).length,

            partialOrders: orders.filter(
                order => order.deliveryStatus === "partial"
            ).length,

            manualOrders: orders.filter(
                order => order.manualDeliveryRequired
            ).length,

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: err.message,
        });

    }

}