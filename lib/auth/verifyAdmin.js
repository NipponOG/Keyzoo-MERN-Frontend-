// lib/auth/verifyAdmin

// export default async function verifyAdmin(req) {
//     try {
//         // const authHeader = req.headers.authorization;

//         const authHeader = req.headers.authorization || req.headers.Authorization;

//         if (!authHeader?.startsWith("Bearer ")) {
//             return null;
//         }

//         const token = authHeader.replace("Bearer ", "");

//         // Get logged-in user from JWT
//         const meRes = await fetch(
//             `${process.env.STRAPI_URL}api/users/me`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );

//         console.log("ME STATUS:", meRes.status);

//         if (!meRes.ok) {
//             console.log(await meRes.text());
//             return null;
//         }

//         const me = await meRes.json();

//         console.log("ME:", me);

//         // Fetch full user (including role) using server API token
//         const userRes = await fetch(
//             `${process.env.STRAPI_URL}api/users/${me.id}?populate=role`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.STRAPI_ADMIN_AUTH_TOKEN}`,
//                 },
//             }
//         );

//         console.log("USER STATUS:", userRes.status);

//         if (!userRes.ok) {
//             console.log(await userRes.text());
//             return null;
//         }

//         const user = await userRes.json();

//         console.log("FULL USER:", user);

//         if (user.role?.name !== "Admin") {
//             return null;
//         }

//         return user;

//     } catch (err) {
//         console.error(err);
//         return null;
//     }
// }


// export default async function verifyAdmin(req) {

//     try {

//         const authHeader =
//             req.headers.authorization ||
//             req.headers.Authorization;

//         console.log("========================================");
//         console.log("verifyAdmin()");
//         console.log("========================================");

//         console.log("Authorization:", authHeader);

//         if (!authHeader?.startsWith("Bearer ")) {

//             console.log("❌ Missing Bearer token");

//             return null;

//         }

//         console.log("Calling Strapi /api/admin-auth/me");

//         const meResponse = await fetch(
//             `${process.env.STRAPI_URL}api/admin-auth/me`,
//             {
//                 headers: {
//                     Authorization: authHeader,
//                 },
//             }
//         );

//         console.log("Status:", meResponse.status);

//         const text = await meResponse.text();

//         console.log("Response:");
//         console.log(text);

//         if (!meResponse.ok) {

//             console.log("❌ Strapi rejected request");

//             return null;

//         }

//         const data = JSON.parse(text);

//         console.log("Parsed Response:");
//         console.dir(data, { depth: null });

//         return data.user;

//     } catch (err) {

//         console.error(err);

//         return null;

//     }

// }

export default async function verifyAdmin(req) {

    try {

        const authHeader =
            req.headers.authorization ||
            req.headers.Authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return null;
        }

        const response = await fetch(
            `${process.env.STRAPI_URL}api/admin-auth/me`,
            {
                headers: {
                    Authorization: authHeader,
                },
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (!data.success) {
            return null;
        }

        return data.user;

    } catch (err) {

        console.error("verifyAdmin:", err);

        return null;

    }

}