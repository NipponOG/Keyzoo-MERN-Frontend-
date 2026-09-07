export default async function handler(req, res) {
    try {
        const response = await fetch(
            "https://auth.reloadly.com/oauth/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_id: process.env.RELOADLY_CLIENT_ID,
                    client_secret: process.env.RELOADLY_CLIENT_SECRET,
                    grant_type: "client_credentials",
                    audience: "https://topups-sandbox.reloadly.com",
                }),
            }
        );

        const data = await response.json();

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to generate token",
        });
    }
}