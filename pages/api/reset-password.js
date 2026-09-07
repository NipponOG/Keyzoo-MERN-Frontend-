export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { code, password, turnstileToken } = req.body;

    if (!code || !password || !turnstileToken) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // 1️⃣ Verify Turnstile
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
            return res.status(400).json({ error: "Security check failed" });
        }

        // 2️⃣ Forward to Strapi
        const strapiRes = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}api/auth/reset-password`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code,        // Token from email
                    password,    // New password
                    passwordConfirmation: password,
                }),
            }
        );

        const data = await strapiRes.json();

        if (!strapiRes.ok) {
            return res.status(400).json({
                error: data?.error?.message || "Failed to reset password",
            });
        }

        // 3️⃣ All good
        return res.status(200).json({ message: "Password reset successful" });

    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}
