// import speakeasy from "speakeasy";
// import {
//     getTempSecret,
//     removeTempSecret,
// } from "@/lib/auth/temp2faStore";

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
//     // Verify Admin via Strapi
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
//             error: meData.error || "Unauthorized",
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
//     // Get Temporary Secret
//     //--------------------------------------------------

//     const temp = getTempSecret(user.id);

//     if (!temp) {

//         return res.status(400).json({
//             error: "QR code expired. Please generate a new one.",
//         });

//     }

//     //--------------------------------------------------
//     // Verify OTP
//     //--------------------------------------------------

//     const verified = speakeasy.totp.verify({

//         secret: temp.secret,

//         encoding: "base32",

//         token: code,

//         window: 1,

//     });

//     if (!verified) {

//         return res.status(400).json({
//             error: "Invalid verification code.",
//         });

//     }

//     //--------------------------------------------------
//     // Save to Strapi
//     //--------------------------------------------------

//     const updateResponse = await fetch(

//         `${process.env.STRAPI_URL}api/users/${user.id}`,

//         {

//             method: "PUT",

//             headers: {

//                 Authorization: `Bearer ${process.env.STRAPI_ADMIN_AUTH_TOKEN}`,

//                 "Content-Type": "application/json",

//             },

//             body: JSON.stringify({

//                 twoFactorEnabled: true,

//                 twoFactorSecret: temp.secret,

//             }),

//         }

//     );

//     if (!updateResponse.ok) {

//         const error = await updateResponse.text();

//         console.error(error);

//         return res.status(500).json({
//             error: "Unable to enable 2FA.",
//         });

//     }

//     //--------------------------------------------------
//     // Cleanup
//     //--------------------------------------------------

//     removeTempSecret(user.id);

//     //--------------------------------------------------
//     // Success
//     //--------------------------------------------------

//     return res.status(200).json({

//         success: true,

//         message: "2FA enabled successfully.",

//     });

// }




import {
    verifyToken,
    encryptSecret,
} from "@/lib/auth/twoFactor";

import {
    getTempSecret,
    removeTempSecret,
} from "@/lib/auth/temp2faStore";

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
    // Verify Admin via Strapi
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
            error: meData.error || "Unauthorized",
        });

    }

    const user = meData.user;

    //--------------------------------------------------
    // Read Code
    //--------------------------------------------------

    const { code } = req.body;

    if (!code) {

        return res.status(400).json({
            error: "Verification code is required.",
        });

    }

    //--------------------------------------------------
    // Get Temporary Secret
    //--------------------------------------------------

    const temp = getTempSecret(user.id);

    if (!temp) {

        return res.status(400).json({
            error: "QR code expired. Please generate a new one.",
        });

    }

    //--------------------------------------------------
    // Verify OTP
    //--------------------------------------------------

    const verified = verifyToken(
        temp.secret,
        code
    );

    if (!verified) {

        return res.status(400).json({
            error: "Invalid verification code.",
        });

    }

    //--------------------------------------------------
    // Save Encrypted Secret to Strapi
    //--------------------------------------------------

    const updateResponse = await fetch(

        `${process.env.STRAPI_URL}api/users/${user.id}`,

        {

            method: "PUT",

            headers: {

                Authorization: `Bearer ${process.env.STRAPI_ADMIN_AUTH_TOKEN}`,

                "Content-Type": "application/json",

            },

            body: JSON.stringify({

                twoFactorEnabled: true,

                twoFactorSecret: encryptSecret(
                    temp.secret
                ),

            }),

        }

    );

    if (!updateResponse.ok) {

        const error = await updateResponse.text();

        console.error(error);

        return res.status(500).json({
            error: "Unable to enable 2FA.",
        });

    }

    //--------------------------------------------------
    // Cleanup
    //--------------------------------------------------

    removeTempSecret(user.id);

    //--------------------------------------------------
    // Success
    //--------------------------------------------------

    return res.status(200).json({

        success: true,

        message: "2FA enabled successfully.",

    });

}