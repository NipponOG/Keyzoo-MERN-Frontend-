// import { decryptSecret, verifyToken } from "@/lib/auth/twoFactor";

// export default async function handler(req, res) {

//     if (req.method !== "POST") {

//         return res.status(405).json({
//             error: "Method Not Allowed",
//         });

//     }

//     //--------------------------------------------------
//     // Read JWT
//     //--------------------------------------------------

//     const auth = req.headers.authorization;

//     if (!auth?.startsWith("Bearer ")) {

//         return res.status(401).json({
//             error: "Unauthorized",
//         });

//     }

//     //--------------------------------------------------
//     // Verify Admin
//     //--------------------------------------------------

//     const meResponse = await fetch(
//         `${process.env.STRAPI_URL}api/admin-auth/me`,
//         {
//             headers: {
//                 Authorization: auth,
//             },
//         }
//     );

//     const meData = await meResponse.json();

//     if (!meResponse.ok || !meData.success) {

//         return res.status(401).json({
//             error: "Unauthorized",
//         });

//     }

//     const user = meData.user;

//     //--------------------------------------------------
//     // Read Code
//     //--------------------------------------------------

//     const { code } = req.body;

//     if (!code) {

//         return res.status(400).json({
//             error: "Verification code is required.",
//         });

//     }

//     //--------------------------------------------------
//     // 2FA must be enabled
//     //--------------------------------------------------

//     if (!user.twoFactorEnabled) {

//         return res.status(400).json({
//             error: "2FA is not enabled.",
//         });

//     }

//     //--------------------------------------------------
//     // Decrypt Secret
//     //--------------------------------------------------

//     const secret = decryptSecret(
//         user.twoFactorSecret
//     );

//     //--------------------------------------------------
//     // Verify OTP
//     //--------------------------------------------------

//     const verified = verifyToken(
//         secret,
//         code
//     );

//     if (!verified) {

//         return res.status(400).json({
//             error: "Invalid verification code.",
//         });

//     }

//     //--------------------------------------------------
//     // Success
//     //--------------------------------------------------

//     return res.status(200).json({

//         success: true,

//         user,

//     });

// }




// import {
//     decryptSecret,
//     verifyToken,
// } from "@/lib/auth/twoFactor";

// export default async function handler(req, res) {

//     if (req.method !== "POST") {

//         return res.status(405).json({
//             error: "Method Not Allowed",
//         });

//     }

//     //--------------------------------------------------
//     // Read JWT
//     //--------------------------------------------------

//     const auth = req.headers.authorization;

//     if (!auth?.startsWith("Bearer ")) {

//         return res.status(401).json({
//             error: "Unauthorized",
//         });

//     }

//     //--------------------------------------------------
//     // Verify Admin
//     //--------------------------------------------------

//     const meResponse = await fetch(

//         `${process.env.STRAPI_URL}api/admin-auth/me`,

//         {
//             headers: {
//                 Authorization: auth,
//             },
//         }

//     );

//     const meData = await meResponse.json();

//     if (!meResponse.ok || !meData.success) {

//         return res.status(401).json({
//             error: "Unauthorized",
//         });

//     }

//     const user = meData.user;

//     //--------------------------------------------------
//     // Check 2FA
//     //--------------------------------------------------

//     if (
//         !user.twoFactorEnabled ||
//         !user.twoFactorSecret
//     ) {

//         return res.status(400).json({
//             error: "2FA is not enabled.",
//         });

//     }

//     //--------------------------------------------------
//     // Read Code
//     //--------------------------------------------------

//     const { code } = req.body;

//     if (!code) {

//         return res.status(400).json({
//             error: "Verification code is required.",
//         });

//     }

//     //--------------------------------------------------
//     // Decrypt Secret
//     //--------------------------------------------------

//     const secret = decryptSecret(
//         user.twoFactorSecret
//     );

//     //--------------------------------------------------
//     // Verify OTP
//     //--------------------------------------------------

//     const valid = verifyToken(
//         secret,
//         code
//     );

//     if (!valid) {

//         return res.status(400).json({
//             error: "Invalid verification code.",
//         });

//     }

//     //--------------------------------------------------
//     // Success
//     //--------------------------------------------------

//     return res.status(200).json({

//         success: true,

//     });

// }



import {
    decryptSecret,
    verifyToken,
} from "@/lib/auth/twoFactor";

export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Method Not Allowed",
        });

    }

    //--------------------------------------------------
    // Read JWT
    //--------------------------------------------------

    const auth = req.headers.authorization;

    if (!auth?.startsWith("Bearer ")) {

        return res.status(401).json({
            error: "Unauthorized",
        });

    }

    //--------------------------------------------------
    // Read OTP Code
    //--------------------------------------------------

    const { code } = req.body;

    if (!code) {

        return res.status(400).json({
            error: "Verification code is required.",
        });

    }

    //--------------------------------------------------
    // Verify Admin JWT
    //--------------------------------------------------

    const meResponse = await fetch(
        `${process.env.STRAPI_URL}api/admin-auth/me`,
        {
            headers: {
                Authorization: auth,
            },
        }
    );

    const meData = await meResponse.json();

    if (!meResponse.ok || !meData.success) {

        return res.status(401).json({
            error: "Unauthorized",
        });

    }

    //--------------------------------------------------
    // Load Full User (Server Only)
    //--------------------------------------------------

    const userResponse = await fetch(
        `${process.env.STRAPI_URL}api/users/${meData.user.id}?populate=role`,
        {
            headers: {
                Authorization: `Bearer ${process.env.STRAPI_ADMIN_AUTH_TOKEN}`,
            },
        }
    );

    if (!userResponse.ok) {

        return res.status(500).json({
            error: "Unable to load user.",
        });

    }

    const user = await userResponse.json();

    //--------------------------------------------------
    // Check 2FA
    //--------------------------------------------------

    if (
        !user.twoFactorEnabled ||
        !user.twoFactorSecret
    ) {

        return res.status(400).json({
            error: "2FA is not enabled.",
        });

    }

    //--------------------------------------------------
    // Decrypt Secret
    //--------------------------------------------------

    const secret = decryptSecret(
        user.twoFactorSecret
    );

    //--------------------------------------------------
    // Verify OTP
    //--------------------------------------------------

    const valid = verifyToken(
        secret,
        code
    );

    if (!valid) {

        return res.status(400).json({
            error: "Invalid verification code.",
        });

    }

    //--------------------------------------------------
    // Success
    //--------------------------------------------------

    return res.status(200).json({

        success: true,

        user: {

            id: user.id,

            documentId: user.documentId,

            username: user.username,

            email: user.email,

            firstName: user.firstName,

            lastName: user.lastName,

            twoFactorEnabled: user.twoFactorEnabled,

            role: user.role,

        },

    });

}