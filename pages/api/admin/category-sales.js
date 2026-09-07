// pages/api/admin/category-sales.js
// import verifyAdmin from "@/lib/auth/verifyAdmin";

// export default async function handler(req, res) {


//     try {

//         const headers = {
//             Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
//         };

//         const [productsRes, giftCardsRes] = await Promise.all([

//             fetch(
//                 `${process.env.STRAPI_URL}api/products?pagination[pageSize]=1000`,
//                 { headers }
//             ),

//             fetch(
//                 `${process.env.STRAPI_URL}api/gift-cards?pagination[pageSize]=1000`,
//                 { headers }
//             ),
//         ]);

//         const productsData = await productsRes.json();
//         const giftCardsData = await giftCardsRes.json();

//         const products = productsData.data || [];
//         const giftCards = giftCardsData.data || [];

//         const categoryMap = {};

//         products.forEach((product) => {
//             const type = product.item_type || "Other";

//             categoryMap[type] =
//                 (categoryMap[type] || 0) + 1;
//         });

//         categoryMap["GIFT CARD"] =
//             (categoryMap["GIFT CARD"] || 0) +
//             giftCards.length;

//         const total = Object.values(categoryMap)
//             .reduce((sum, count) => sum + count, 0);

//         const result = Object.entries(categoryMap)
//             .map(([name, count]) => ({
//                 name,
//                 value: Math.round((count / total) * 100),
//                 count,
//             }))
//             .sort((a, b) => b.count - a.count);

//         res.status(200).json(result);
//     } catch (err) {
//         console.error(err);

//         res.status(500).json({
//             error: "Failed",
//         });
//     }
// }





// pages/api/admin/category-sales.js

// import verifyAdmin from "@/lib/auth/verifyAdmin";

// export default async function handler(req, res) {

//     console.log(req.headers.authorization);

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

//         const headers = {
//             Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
//         };

//         const [productsRes, giftCardsRes] = await Promise.all([

//             fetch(
//                 `${process.env.STRAPI_URL}api/products?pagination[pageSize]=1000`,
//                 { headers }
//             ),

//             fetch(
//                 `${process.env.STRAPI_URL}api/gift-cards?pagination[pageSize]=1000`,
//                 { headers }
//             ),

//         ]);

//         const productsData = await productsRes.json();
//         const giftCardsData = await giftCardsRes.json();

//         if (!productsRes.ok || !giftCardsRes.ok) {
//             return res.status(500).json({
//                 success: false,
//                 error: "Failed to fetch category data",
//             });
//         }

//         const products = productsData.data || [];
//         const giftCards = giftCardsData.data || [];

//         const categoryMap = {};

//         products.forEach((product) => {

//             const type = product.item_type || "Other";

//             categoryMap[type] =
//                 (categoryMap[type] || 0) + 1;

//         });

//         categoryMap["GIFT CARD"] =
//             (categoryMap["GIFT CARD"] || 0) +
//             giftCards.length;

//         const total = Object.values(categoryMap)
//             .reduce(
//                 (sum, count) => sum + count,
//                 0
//             );

//         const result = Object.entries(categoryMap)
//             .map(([name, count]) => ({
//                 name,
//                 value: Math.round((count / total) * 100),
//                 count,
//             }))
//             .sort((a, b) => b.count - a.count);

//         return res.status(200).json(result);

//     } catch (err) {

//         console.error(err);

//         return res.status(500).json({
//             success: false,
//             error: err.message,
//         });

//     }

// }




import verifyAdmin from "@/lib/auth/verifyAdmin";

export default async function handler(req, res) {

    console.log("========================================");
    console.log("CATEGORY SALES API");
    console.log("========================================");

    console.log("Method:", req.method);
    console.log("Authorization Header:", req.headers.authorization);

    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed",
        });
    }

    console.log("Calling verifyAdmin()...");

    // 🔒 Verify Admin
    const user = await verifyAdmin(req);

    console.log("verifyAdmin returned:");
    console.dir(user, { depth: null });

    if (!user) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized",
        });
    }

    console.log("✅ verifyAdmin SUCCESS");
    console.log("Logged in Admin:", user.email);

    try {

        const headers = {
            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        };

        console.log("Fetching Products...");
        console.log("Fetching Gift Cards...");

        const [productsRes, giftCardsRes] = await Promise.all([

            fetch(
                `${process.env.STRAPI_URL}api/products?pagination[pageSize]=1000`,
                { headers }
            ),

            fetch(
                `${process.env.STRAPI_URL}api/gift-cards?pagination[pageSize]=1000`,
                { headers }
            ),

        ]);

        console.log("Products Status:", productsRes.status);
        console.log("Gift Cards Status:", giftCardsRes.status);

        const productsData = await productsRes.json();
        const giftCardsData = await giftCardsRes.json();

        if (!productsRes.ok || !giftCardsRes.ok) {

            console.log(productsData);
            console.log(giftCardsData);

            return res.status(500).json({
                success: false,
                error: "Failed to fetch category data",
            });
        }

        const products = productsData.data || [];
        const giftCards = giftCardsData.data || [];

        console.log("Products:", products.length);
        console.log("Gift Cards:", giftCards.length);

        const categoryMap = {};

        products.forEach((product) => {

            const type = product.item_type || "Other";

            categoryMap[type] =
                (categoryMap[type] || 0) + 1;

        });

        categoryMap["GIFT CARD"] =
            (categoryMap["GIFT CARD"] || 0) +
            giftCards.length;

        const total = Object.values(categoryMap)
            .reduce(
                (sum, count) => sum + count,
                0
            );

        const result = Object.entries(categoryMap)
            .map(([name, count]) => ({
                name,
                value: Math.round((count / total) * 100),
                count,
            }))
            .sort((a, b) => b.count - a.count);

        return res.status(200).json(result);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: err.message,
        });

    }

}