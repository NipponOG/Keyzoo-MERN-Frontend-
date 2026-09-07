export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, turnstileToken } = req.body;

    if (!email || !turnstileToken) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // 1️⃣ Verify Cloudflare Turnstile
        const tsRes = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    secret: process.env.TURNSTILE_SECRET_KEY,
                    response: turnstileToken,
                }),
            }
        );

        const tsData = await tsRes.json();

        if (!tsData.success) {
            return res.status(400).json({
                error: "Security check failed",
            });
        }

        // 2️⃣ Forward request to Strapi
        const strapiRes = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}api/auth/forgot-password`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            }
        );

        const strapiData = await strapiRes.json();

        if (!strapiRes.ok) {
            return res.status(400).json({
                error: strapiData?.error?.message || "Failed to send reset email",
            });
        }

        // 3️⃣ OK Response
        return res.status(200).json({
            message: "Password reset email sent successfully",
        });

    } catch (err) {
        return res.status(500).json({
            error: "Server error, please try again later",
        });
    }
}
