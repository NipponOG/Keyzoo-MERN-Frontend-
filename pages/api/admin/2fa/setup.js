// if you use old qr code generation method, you can use this code instead of the bellow code

// import QRCode from "qrcode";
// import { generateSecret } from "@/lib/auth/twoFactor";
// import { setTempSecret } from "@/lib/auth/temp2faStore";

// export default async function handler(req, res) {

//     if (req.method !== "GET") {

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
//     // Already Enabled?
//     //--------------------------------------------------

//     if (user.twoFactorEnabled) {

//         return res.status(400).json({
//             error: "2FA already enabled.",
//         });

//     }

//     //--------------------------------------------------
//     // Generate Secret
//     //--------------------------------------------------

//     const secret = generateSecret(user.email);

//     setTempSecret(
//         user.id,
//         secret.base32
//     );

//     //--------------------------------------------------
//     // Generate QR Code
//     //--------------------------------------------------

//     // const qrCode = await QRCode.toDataURL(
//     //     secret.otpauth_url
//     // );

//     const qrCode = await QRCode.toDataURL(
//         secret.otpauth_url,
//         {
//             errorCorrectionLevel: "H",
//             margin: 2,
//             width: 320,
//             color: {
//                 dark: "#6366F1",
//                 light: "#FFFFFF",
//             },
//         }
//     );

//     //--------------------------------------------------
//     // Success
//     //--------------------------------------------------

//     return res.status(200).json({

//         success: true,
//         qrCode,
//         expiresIn: 10 * 60,

//     });

// }


import { generateSecret } from "@/lib/auth/twoFactor";
import { setTempSecret } from "@/lib/auth/temp2faStore";

export default async function handler(req, res) {

    if (req.method !== "GET") {
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
    // Verify Admin
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
    // Already enabled?
    //--------------------------------------------------

    if (user.twoFactorEnabled) {
        return res.status(400).json({
            error: "2FA already enabled.",
        });
    }

    //--------------------------------------------------
    // Generate Secret
    //--------------------------------------------------

    const secret = generateSecret(user.email);

    setTempSecret(
        user.id,
        secret.base32
    );

    //--------------------------------------------------
    // Success
    //--------------------------------------------------

    return res.status(200).json({

        success: true,

        otpAuthUrl: secret.otpauth_url,

        expiresIn: 10 * 60,

    });

}