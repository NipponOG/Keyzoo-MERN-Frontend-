export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Method Not Allowed",
        });

    }

    try {

        const {
            email,
            password,
        } = req.body;

        //--------------------------------------------------
        // Login to Strapi
        //--------------------------------------------------

        const loginResponse = await fetch(
            `${process.env.STRAPI_URL}api/auth/local`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    identifier: email,
                    password,
                }),
            }
        );

        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {

            return res.status(401).json({
                error: loginData.error?.message || "Invalid credentials",
            });

        }

        //--------------------------------------------------
        // Verify Admin (Custom Strapi Endpoint)
        //--------------------------------------------------

        const meResponse = await fetch(
            `${process.env.STRAPI_URL}api/admin-auth/me`,
            {
                headers: {
                    Authorization: `Bearer ${loginData.jwt}`,
                },
            }
        );

        const meData = await meResponse.json();

        if (!meResponse.ok || !meData.success) {

            // return res.status(403).json({
            //     error: meData.error || "Unauthorized",
            // });

            return res.status(403).json({
                error: "You do not have permission to access the admin panel.",
            });

        }

        const user = meData.user;

        //--------------------------------------------------
        // Return
        //--------------------------------------------------

        return res.status(200).json({

            success: true,

            jwt: loginData.jwt,

            user,

            requiresSetup: !user.twoFactorEnabled,

            requires2FA: user.twoFactorEnabled,

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: err.message,
        });

    }

}