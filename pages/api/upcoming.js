// import { getIGDBToken } from "@/lib/igdbToken";

// export default async function handler(req, res) {

//     const token = await getIGDBToken();

//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = 50;
//         const offset = (page - 1) * limit;

//         const now = new Date();
//         const startOfPeriod = Math.floor(now.getTime() / 1000);
//         const lastDayOfMonth = new Date(
//             now.getFullYear(),
//             now.getMonth() + 1,
//             0,
//             23,
//             59,
//             59
//         );
//         const endOfPeriod = Math.floor(lastDayOfMonth.getTime() / 1000);

//         // Count total
//         const countRes = await fetch("https://api.igdb.com/v4/games/count", {
//             method: "POST",
//             headers: {
//                 "Client-ID": process.env.NEXT_PUBLIC_IGDB_CLIENT_ID,
//                 Authorization: `Bearer ${process.env.NEXT_PUBLIC_IGDB_ACCESS_TOKEN}`,
//                 Accept: "application/json",
//             },
//             body: `
//         where first_release_date >= ${startOfPeriod}
//           & first_release_date <= ${endOfPeriod};
//       `,
//         });

//         const countData = await countRes.json();
//         const totalCount = countData.count || 0;
//         const totalPages = Math.ceil(totalCount / limit);

//         // Fetch games with company relations
//         const response = await fetch("https://api.igdb.com/v4/games", {
//             method: "POST",
//             headers: {
//                 "Client-ID": process.env.IGDB_CLIENT_ID,
//                 Authorization: `Bearer ${token}`,
//                 Accept: "application/json",
//             },
//             body: `
//         fields id, name, first_release_date, 
//                cover.image_id, 
//                platforms.name, 
//                involved_companies.company.name,
//                involved_companies.publisher,
//                involved_companies.developer;
//         where first_release_date >= ${startOfPeriod}
//           & first_release_date <= ${endOfPeriod};
//         sort first_release_date asc;
//         limit ${limit};
//         offset ${offset};
//       `,
//         });

//         if (!response.ok) {
//             const error = await response.text();
//             return res.status(response.status).json({ error });
//         }

//         const rawGames = await response.json();

//         // Transform IGDB data to clean format
//         const formattedGames = rawGames.map((game) => {
//             const coverUrl = game.cover?.image_id
//                 ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
//                 // : 'https://res.cloudinary.com/dcgdp1qjr/image/upload/v1765800475/ChatGPT_Image_Dec_15_2025_02_53_00_PM_t9hoyk.png';
//                 : "/keyzoo-fallback.png";

//             const releaseDate = game.first_release_date
//                 ? new Date(game.first_release_date * 1000).toLocaleDateString("en-GB", {
//                     day: "2-digit",
//                     month: "short",
//                     year: "numeric",
//                 })
//                 : "UNKNOWN";

//             const developers =
//                 game.involved_companies
//                     ?.filter((c) => c.developer && c.company?.name)
//                     .map((c) => c.company.name)
//                     .join(", ") || "UNKNOWN";

//             const publishers =
//                 game.involved_companies
//                     ?.filter((c) => c.publisher && c.company?.name)
//                     .map((c) => c.company.name)
//                     .join(", ") || "UNKNOWN";

//             return {
//                 id: game.id,
//                 name: game.name,
//                 cover: coverUrl,
//                 platforms: game.platforms
//                     ? game.platforms.map((p) => p.name).join(", ")
//                     : "UNKNOWN",
//                 releaseDate,
//                 developers,
//                 publishers,
//             };
//         });

//         res.status(200).json({
//             data: formattedGames,
//             pagination: {
//                 totalCount,
//                 totalPages,
//                 currentPage: page,
//                 limit,
//             },
//         });
//     } catch (error) {
//         console.error("Error fetching from IGDB:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// }




import { getIGDBToken } from "@/lib/igdbToken";

const IGDB_URL = "https://api.igdb.com/v4";
const LIMIT = 50;
const COVER_URL = "https://images.igdb.com/igdb/image/upload/t_cover_big_2x";
const FALLBACK_COVER = "/keyzoo-fallback.png";

async function igdb(endpoint, body, token) {
    const res = await fetch(`${IGDB_URL}/${endpoint}`, {
        method: "POST",
        headers: {
            "Client-ID": process.env.IGDB_CLIENT_ID,
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        body,
    });

    if (!res.ok) {
        throw new Error(`IGDB /${endpoint} failed (${res.status}): ${await res.text()}`);
    }
    return res.json();
}

const unique = (arr) => [...new Set(arr)];

const companiesWithRole = (involved, role) =>
    unique(
        (involved || [])
            .filter((c) => c[role] && c.company?.name)
            .map((c) => c.company.name)
    ).join(", ") || null;

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const offset = (page - 1) * LIMIT;

        // Use UTC so results don't depend on the server's timezone.
        // Start at the beginning of today so games releasing today are included.
        const now = new Date();
        const start = Math.floor(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000
        );
        const end =
            Math.floor(
                Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1) / 1000
            ) - 1;

        // Single source of truth for the filter, used by both queries.
        // Remove `cover != null` if you want games without covers too.
        const where = `where first_release_date >= ${start} & first_release_date <= ${end} & cover != null;`;

        const token = await getIGDBToken();

        const [countData, rawGames] = await Promise.all([
            igdb("games/count", where, token),
            igdb(
                "games",
                `
                fields id, name, first_release_date,
                       cover.image_id,
                       platforms.name,
                       involved_companies.company.name,
                       involved_companies.publisher,
                       involved_companies.developer;
                ${where}
                sort first_release_date asc;
                limit ${LIMIT};
                offset ${offset};
                `,
                token
            ),
        ]);

        const totalCount = countData.count || 0;
        const totalPages = Math.max(1, Math.ceil(totalCount / LIMIT));

        const data = rawGames.map((game) => ({
            id: game.id,
            name: game.name,
            cover: game.cover?.image_id
                ? `${COVER_URL}/${game.cover.image_id}.jpg`
                : FALLBACK_COVER,
            platforms: unique((game.platforms || []).map((p) => p.name)),
            // ISO string: format it on the client however you like
            releaseDate: game.first_release_date
                ? new Date(game.first_release_date * 1000).toISOString()
                : null,
            developers: companiesWithRole(game.involved_companies, "developer"),
            publishers: companiesWithRole(game.involved_companies, "publisher"),
        }));

        // Upcoming games change slowly, and IGDB is rate limited (~4 req/s).
        res.setHeader(
            "Cache-Control",
            "public, s-maxage=3600, stale-while-revalidate=86400"
        );

        return res.status(200).json({
            data,
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                limit: LIMIT,
            },
        });
    } catch (error) {
        console.error("Error fetching from IGDB:", error);
        return res.status(500).json({ error: "Failed to load upcoming games" });
    }
}