export async function getReloadlyToken() {
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

    if (!data.access_token) {
        throw new Error("Failed to get Reloadly token");
    }

    return data.access_token;
}