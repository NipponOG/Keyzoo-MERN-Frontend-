export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, password, username, turnstileToken } = req.body;

    const lowerEmail = email?.toLowerCase() || "";  // Normalize email for consistent checks
    const lowerUsername = username?.toLowerCase() || "";    // Normalize username for consistent checks

    const reservedWords = ["admin", "administrator", "owner", "support"];   // Add more reserved words as needed

    // ✅ Allow your real admin
    const allowedAdminEmails = ["admin@keyzoo.in"]; // List of allowed admin emails (lowercase)

    if (!allowedAdminEmails.includes(lowerEmail)) { // If the email is not in the allowed admin list, perform reserved word checks
        const isReserved =
            reservedWords.some(word => lowerEmail.includes(word)) ||
            reservedWords.some(word => lowerUsername.includes(word));

        if (isReserved) {
            return res.status(400).json({
                error: "This username or email is not allowed",
            });
        }
    }   // if you notice any error just remove the above check and add the email to allowedAdminEmails array. This is just to prevent bots from registering with admin-like emails or usernames.

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
        return res.status(400).json({
            error: "Security check failed",
        });
    }

    // 2️⃣ Forward request to Strapi default register route
    const strapiRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}api/auth/local/register`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, username }),
        }
    );

    const data = await strapiRes.json();

    if (!strapiRes.ok) {
        return res.status(400).json({
            error: data?.error?.message || "Registration failed",
        });
    }

    return res.status(200).json(data);
}
