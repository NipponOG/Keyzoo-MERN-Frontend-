async function getToken() {
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

    return response.json();
}

export default async function handler(req, res) {
    const { phone, country } = req.query;

    if (!phone || !country) {
        return res.status(400).json({
            error: "phone and country are required",
        });
    }

    try {
        const token = await getToken();

        const response = await fetch(
            `https://topups-sandbox.reloadly.com/operators/auto-detect/phone/${phone}/countries/${country}`,
            {
                headers: {
                    Authorization: `Bearer ${token.access_token}`,
                },
            }
        );

        const data = await response.json();

        return res.status(response.status).json(data);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Failed to detect operator",
        });
    }
}