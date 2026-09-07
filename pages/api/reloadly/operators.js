async function getToken() {
    const auth = await fetch(
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

    return auth.json();
}

export default async function handler(req, res) {

    const { country } = req.query;

    try {

        const token = await getToken();

        const response = await fetch(
            `https://topups-sandbox.reloadly.com/operators/countries/${country}`,
            {
                headers: {
                    Authorization: `Bearer ${token.access_token}`,
                },
            }
        );

        const data = await response.json();

        return res.status(200).json(data);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Failed to load operators",
        });
    }
}