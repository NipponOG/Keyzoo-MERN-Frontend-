export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { identifier, password, turnstileToken } = req.body;

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

        // 2️⃣ Forward login details to normal Strapi login route
        const strapiRes = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}api/auth/local`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            }
        );

        const data = await strapiRes.json();

        if (!strapiRes.ok) {
            return res.status(400).json({ error: data.error?.message || "Login failed" });
        }

        // 3️⃣ Return JWT safely
        return res.status(200).json({
            jwt: data.jwt,
            user: data.user,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
