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
    try {
        const tokenData = await getToken();

        const response = await fetch(
            "https://topups-sandbox.reloadly.com/countries",
            {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                },
            }
        );

        const countries = await response.json();

        res.status(200).json(countries);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch countries",
        });
    }
}