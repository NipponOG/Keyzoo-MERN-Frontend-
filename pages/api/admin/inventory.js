// @1...i do not know
// export default async function handler(req, res) {
//     try {
//         const productsRes = await fetch(
//             `${process.env.STRAPI_URL}/api/products?populate=gameKeys&pagination[pageSize]=1000`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
//                 },
//             }
//         );

//         const productsData = await productsRes.json();
//         const products = productsData.data || [];

//         let totalKeys = 0;
//         let lowStock = 0;
//         let outOfStock = 0;

//         const alerts = [];

//         products.forEach((product) => {

//             const keys = product.gameKeys || [];

//             const availableKeys = keys.filter(
//                 (k) => k.isAvailable
//             ).length;

//             totalKeys += availableKeys;

//             if (availableKeys === 0) {

//                 outOfStock++;

//                 alerts.push({
//                     id: product.id,
//                     title: product.title,
//                     availableKeys,
//                     status: "out",
//                 });

//             } else if (availableKeys <= 10) {

//                 lowStock++;

//                 alerts.push({
//                     id: product.id,
//                     title: product.title,
//                     availableKeys,
//                     status: "low",
//                 });
//             }
//         });

//         res.status(200).json({
//             totalProducts: products.length,
//             totalKeys,
//             lowStock,
//             outOfStock,
//             alerts,
//         });

//     } catch (err) {
//         console.error(err);

//         res.status(500).json({
//             error: "Inventory fetch failed",
//         });
//     }
// }




// pages/api/admin/inventory.js

// @2...work
// export default async function handler(req, res) {
//     try {

//         const response = await fetch(
//             `${process.env.STRAPI_URL}api/game-keys?populate=product&pagination[pageSize]=5000`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
//                 },
//             },
//             `${process.env.STRAPI_URL}api/game-keys?populate=giftCard&pagination[pageSize]=5000`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
//                 },
//             }
//         );

//         const data = await response.json();

//         const keys = data.data || [];

//         const inventoryMap = {};

//         let totalKeys = 0;

//         keys.forEach((key) => {

//             const product = key.product;

//             if (!product) return;

//             if (!inventoryMap[product.id]) {
//                 inventoryMap[product.id] = {
//                     id: product.id,
//                     title: product.title,
//                     availableKeys: 0,
//                 };
//             }

//             if (key.isAvailable) {

//                 inventoryMap[product.id]
//                     .availableKeys++;

//                 totalKeys++;
//             }

//         });

//         const products =
//             Object.values(inventoryMap);

//         const lowStockProducts =
//             products.filter(
//                 p => p.availableKeys > 0 &&
//                     p.availableKeys <= 10
//             );

//         const outOfStockProducts =
//             products.filter(
//                 p => p.availableKeys === 0
//             );

//         res.status(200).json({
//             totalProducts: products.length,
//             totalKeys,
//             lowStock: lowStockProducts.length,
//             outOfStock:
//                 outOfStockProducts.length,

//             alerts: [
//                 ...outOfStockProducts.map(
//                     p => ({
//                         ...p,
//                         status: "out",
//                     })
//                 ),

//                 ...lowStockProducts.map(
//                     p => ({
//                         ...p,
//                         status: "low",
//                     })
//                 ),
//             ],
//             products,
//         });

//     } catch (error) {

//         console.error(error);

//         res.status(500).json({
//             error: "Inventory failed",
//         });
//     }
// }

// pages/api/admin/inventory.js

// export default async function handler(req, res) {
//     try {

//         const headers = {
//             Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
//         };

//         const [
//             productsRes,
//             giftCardsRes,
//             keysRes,
//         ] = await Promise.all([

//             fetch(
//                 `${process.env.STRAPI_URL}api/products?populate=*&pagination[pageSize]=1000`,
//                 { headers }
//             ),

//             fetch(
//                 `${process.env.STRAPI_URL}api/gift-cards?populate=*&pagination[pageSize]=1000`,
//                 { headers }
//             ),

//             fetch(
//                 `${process.env.STRAPI_URL}api/game-keys?populate=product,giftCard&pagination[pageSize]=10000`,
//                 { headers }
//             ),

//         ]);

//         const products =
//             (await productsRes.json()).data || [];

//         const giftCards =
//             (await giftCardsRes.json()).data || [];

//         const keys =
//             (await keysRes.json()).data || [];

//         const inventory = [];

//         const alerts = [];

//         let totalAvailableKeys = 0;
//         let lowStock = 0;
//         let outOfStock = 0;

//         //---------------------------------------------------
//         // PRODUCTS
//         //---------------------------------------------------

//         products.forEach((product) => {

//             const productKeys = keys.filter((key) => {

//                 return (
//                     key.product &&
//                     key.product.id === product.id
//                 );

//             });

//             const availableKeys =
//                 productKeys.filter(k => k.isAvailable).length;

//             const soldKeys =
//                 productKeys.length - availableKeys;

//             const totalKeys =
//                 productKeys.length;

//             totalAvailableKeys += availableKeys;

//             let status = "healthy";

//             if (availableKeys === 0) {

//                 status = "out";
//                 outOfStock++;

//                 alerts.push({
//                     id: product.id,
//                     type: "product",
//                     title: product.title,
//                     availableKeys,
//                     status: "out",
//                 });

//             } else if (availableKeys <= 10) {

//                 status = "low";
//                 lowStock++;

//                 alerts.push({
//                     id: product.id,
//                     type: "product",
//                     title: product.title,
//                     availableKeys,
//                     status: "low",
//                 });

//             }

//             inventory.push({
//                 ...product,

//                 inventoryType: "product",

//                 availableKeys,
//                 soldKeys,
//                 totalKeys,
//                 status,
//             });

//         });

//         //---------------------------------------------------
//         // GIFT CARDS
//         //---------------------------------------------------

//         giftCards.forEach((giftCard) => {

//             const giftCardKeys = keys.filter((key) => {

//                 return (
//                     key.giftCard &&
//                     key.giftCard.id === giftCard.id
//                 );

//             });

//             const availableKeys =
//                 giftCardKeys.filter(k => k.isAvailable).length;

//             const soldKeys =
//                 giftCardKeys.length - availableKeys;

//             const totalKeys =
//                 giftCardKeys.length;

//             totalAvailableKeys += availableKeys;

//             let status = "healthy";

//             if (availableKeys === 0) {

//                 status = "out";
//                 outOfStock++;

//                 alerts.push({
//                     id: giftCard.id,
//                     type: "gift-card",
//                     title: giftCard.title,
//                     availableKeys,
//                     status: "out",
//                 });

//             } else if (availableKeys <= 10) {

//                 status = "low";
//                 lowStock++;

//                 alerts.push({
//                     id: giftCard.id,
//                     type: "gift-card",
//                     title: giftCard.title,
//                     availableKeys,
//                     status: "low",
//                 });

//             }

//             inventory.push({
//                 ...giftCard,

//                 inventoryType: "gift-card",

//                 availableKeys,
//                 soldKeys,
//                 totalKeys,
//                 status,
//             });

//         });

//         //---------------------------------------------------

//         res.status(200).json({

//             totalProducts: inventory.length,

//             totalKeys: totalAvailableKeys,

//             lowStock,

//             outOfStock,

//             alerts,

//             products: inventory,

//         });

//     } catch (err) {

//         console.error(err);

//         res.status(500).json({
//             error: "Inventory fetch failed",
//         });

//     }
// }

import verifyAdmin from "@/lib/auth/verifyAdmin";

export default async function handler(req, res) {

    const admin = await verifyAdmin(req);

    if (!admin) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized",
        });
    }

    try {

        const headers = {
            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        };

        const [productsRes, giftCardsRes, keysRes] = await Promise.all([

            fetch(
                `${process.env.STRAPI_URL}api/products?populate=*&pagination[pageSize]=1000`,
                { headers }
            ),

            fetch(
                `${process.env.STRAPI_URL}api/gift-cards?populate=*&pagination[pageSize]=1000`,
                { headers }
            ),

            fetch(
                `${process.env.STRAPI_URL}api/game-keys?populate=*`,
                { headers }
            )

        ]);

        // const products = (await productsRes.json()).data || [];
        // const giftCards = (await giftCardsRes.json()).data || [];
        const products = (await productsRes.json()).data || [];
        const giftCards = (await giftCardsRes.json()).data || [];

        // const keysResponse = await keysRes.json();

        // console.log("========== GAME KEYS ==========");
        // console.log("Total:", keysResponse.data?.length);
        // console.log(JSON.stringify(keysResponse.data?.[0], null, 2));

        const keysResponse = await keysRes.json();

        console.log("FULL RESPONSE");
        console.log(JSON.stringify(keysResponse, null, 2));

        const keys = keysResponse.data || [];

        //----------------------------------------
        // Build lookup table
        //----------------------------------------

        const stats = {};

        keys.forEach((key) => {

            let owner = null;
            let type = null;

            if (key.product) {
                owner = key.product.documentId;
                type = "product";
            } else if (key.giftCard) {
                owner = key.giftCard.documentId;
                type = "gift-card";
            } else {
                console.log("NO RELATION");
                return;
            }

            const mapKey = `${type}:${owner}`;

            console.log("MAP KEY:", mapKey);

            if (!stats[mapKey]) {
                stats[mapKey] = {
                    availableKeys: 0,
                    soldKeys: 0,
                    totalKeys: 0,
                };
            }

            stats[mapKey].totalKeys++;

            if (key.isAvailable) {
                stats[mapKey].availableKeys++;
            } else {
                stats[mapKey].soldKeys++;
            }

        });

        console.log("FINAL STATS");
        console.log(stats);

        //----------------------------------------
        // Build inventory
        //----------------------------------------

        const inventory = [];

        let lowStock = 0;
        let outOfStock = 0;
        let totalKeys = 0;

        products.forEach((product) => {

            const lookupKey = `product:${product.documentId}`;

            console.log("================================");
            console.log("PRODUCT:", product.title);
            console.log("DOCUMENT ID:", product.documentId);
            console.log("LOOKUP KEY:", lookupKey);
            console.log("FOUND:", stats[lookupKey]);

            const item = stats[lookupKey] || {
                availableKeys: 0,
                soldKeys: 0,
                totalKeys: 0,
            };

            console.log("ITEM:", item);

            totalKeys += item.availableKeys;

            let status = "healthy";

            if (item.availableKeys === 0) {
                status = "out";
                outOfStock++;
            } else if (item.availableKeys <= 10) {
                status = "low";
                lowStock++;
            }

            inventory.push({
                ...product,
                inventoryType: "product",
                availableKeys: item.availableKeys,
                soldKeys: item.soldKeys,
                totalKeys: item.totalKeys,
                status,
            });

            console.log("PUSHED:", {
                title: product.title,
                availableKeys: item.availableKeys,
                soldKeys: item.soldKeys,
                totalKeys: item.totalKeys,
                status,
            });

        });

        giftCards.forEach((giftCard) => {

            const lookupKey = `gift-card:${giftCard.documentId}`;

            console.log("================================");
            console.log("GIFT CARD:", giftCard.title);
            console.log("DOCUMENT ID:", giftCard.documentId);
            console.log("LOOKUP KEY:", lookupKey);
            console.log("FOUND:", stats[lookupKey]);

            const item =
                stats[`gift-card:${giftCard.documentId}`] || {
                    availableKeys: 0,
                    soldKeys: 0,
                    totalKeys: 0,
                };

            console.log("ITEM:", item);

            totalKeys += item.availableKeys;

            let status = "healthy";

            if (item.availableKeys === 0) {
                status = "out";
                outOfStock++;
            } else if (item.availableKeys <= 10) {
                status = "low";
                lowStock++;
            }

            inventory.push({
                ...giftCard,
                inventoryType: "gift-card",
                ...item,
                status,
            });

        });

        return res.status(200).json({
            totalProducts: inventory.length,
            totalKeys,
            lowStock,
            outOfStock,
            products: inventory,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: err.message,
        });

    }
}