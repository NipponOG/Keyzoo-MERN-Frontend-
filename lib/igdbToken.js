let cachedToken = null;
let tokenExpiry = 0;
let fetchingPromise = null;

export async function getIGDBToken(forceRefresh = false) {
    const now = Date.now();

    if (!forceRefresh && cachedToken && now < tokenExpiry) {
        return cachedToken;
    }

    // ✅ If already fetching, wait for same promise
    if (fetchingPromise) {
        return fetchingPromise;
    }

    fetchingPromise = (async () => {
        try {
            // console.log("🔄 Generating new IGDB token...");

            const res = await fetch("https://id.twitch.tv/oauth2/token", {
                method: "POST",
                body: new URLSearchParams({
                    client_id: process.env.IGDB_CLIENT_ID,
                    client_secret: process.env.IGDB_CLIENT_SECRET,
                    grant_type: "client_credentials",
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to fetch IGDB token");
            }

            const data = await res.json();

            cachedToken = data.access_token;
            tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

            return cachedToken;

        } finally {
            fetchingPromise = null;
        }
    })();

    return fetchingPromise;
}