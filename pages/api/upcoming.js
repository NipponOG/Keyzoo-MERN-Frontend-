// export default async function handler(req, res) {
//     try {
//         const response = await fetch("https://api.igdb.com/v4/games", {
//             method: "POST",
//             headers: {
//                 "Client-ID": process.env.NEXT_PUBLIC_IGDB_CLIENT_ID,
//                 "Authorization": `Bearer ${process.env.NEXT_PUBLIC_IGDB_ACCESS_TOKEN}`,
//                 "Accept": "application/json",
//             },
//             body: `
//         fields name, first_release_date, cover.url, platforms.name;
//         where first_release_date > ${Math.floor(Date.now() / 1000)};
//         sort first_release_date asc;
//         limit 15;
//       `,
//         });

//         if (!response.ok) {
//             const error = await response.text();
//             return res.status(response.status).json({ error });
//         }

//         const data = await response.json();
//         res.status(200).json(data);
//     } catch (error) {
//         console.error("Error fetching from IGDB:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// }


// // page/api/upcoming.js

// export default async function handler(req, res) {
//     try {
//         // From current date to end of month
//         const now = new Date();
//         const startOfPeriod = Math.floor(now.getTime() / 1000); // From now
//         const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
//         const endOfPeriod = Math.floor(lastDayOfMonth.getTime() / 1000);

//         const response = await fetch("https://api.igdb.com/v4/games", {
//             method: "POST",
//             headers: {
//                 "Client-ID": process.env.NEXT_PUBLIC_IGDB_CLIENT_ID,
//                 "Authorization": `Bearer ${process.env.NEXT_PUBLIC_IGDB_ACCESS_TOKEN}`,
//                 "Accept": "application/json",
//             },
//             body: `
//         fields name, first_release_date, cover.url, platforms.name;
//         where first_release_date >= ${startOfPeriod} 
//           & first_release_date <= ${endOfPeriod};
//         sort first_release_date asc;
//         limit 250;
//       `,
//         });

//         if (!response.ok) {
//             const error = await response.text();
//             return res.status(response.status).json({ error });
//         }

//         const data = await response.json();
//         res.status(200).json(data);
//     } catch (error) {
//         console.error("Error fetching from IGDB:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// }





// export default async function handler(req, res) {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = 50;
//         const offset = (page - 1) * limit;

//         const now = new Date();
//         const startOfPeriod = Math.floor(now.getTime() / 1000);
//         const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
//         const endOfPeriod = Math.floor(lastDayOfMonth.getTime() / 1000);

//         const response = await fetch("https://api.igdb.com/v4/games", {
//             method: "POST",
//             headers: {
//                 "Client-ID": process.env.NEXT_PUBLIC_IGDB_CLIENT_ID,
//                 "Authorization": `Bearer ${process.env.NEXT_PUBLIC_IGDB_ACCESS_TOKEN}`,
//                 "Accept": "application/json",
//             },
//             body: `
//         fields name, first_release_date, cover.url, platforms.name;
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

//         const data = await response.json();
//         res.status(200).json({ data, page, limit });
//     } catch (error) {
//         console.error("Error fetching from IGDB:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// }





// export default async function handler(req, res) {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = 50;
//         const offset = (page - 1) * limit;

//         const now = new Date();
//         const startOfPeriod = Math.floor(now.getTime() / 1000);
//         const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
//         const endOfPeriod = Math.floor(lastDayOfMonth.getTime() / 1000);

//         // ------------------------------
//         // 1️⃣ Request total count
//         // ------------------------------
//         const countRes = await fetch("https://api.igdb.com/v4/games/count", {
//             method: "POST",
//             headers: {
//                 "Client-ID": process.env.NEXT_PUBLIC_IGDB_CLIENT_ID,
//                 "Authorization": `Bearer ${process.env.NEXT_PUBLIC_IGDB_ACCESS_TOKEN}`,
//                 "Accept": "application/json",
//             },
//             body: `
//         where first_release_date >= ${startOfPeriod}
//           & first_release_date <= ${endOfPeriod};
//       `,
//         });

//         const countData = await countRes.json();
//         const totalCount = countData.count || 0;
//         const totalPages = Math.ceil(totalCount / limit);

//         // ------------------------------
//         // 2️⃣ Request paginated games
//         // ------------------------------
//         const response = await fetch("https://api.igdb.com/v4/games", {
//             method: "POST",
//             headers: {
//                 "Client-ID": process.env.NEXT_PUBLIC_IGDB_CLIENT_ID,
//                 "Authorization": `Bearer ${process.env.NEXT_PUBLIC_IGDB_ACCESS_TOKEN}`,
//                 "Accept": "application/json",
//             },
//             body: `
//         fields name, first_release_date, cover.url, platforms.name, involved_companies.company.name, involved_companies.publisher ,involved_companies.developer;
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

//         const data = await response.json();

//         res.status(200).json({
//             data,
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

export default async function handler(req, res) {

    const token = await getIGDBToken();

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 50;
        const offset = (page - 1) * limit;

        const now = new Date();
        const startOfPeriod = Math.floor(now.getTime() / 1000);
        const lastDayOfMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59
        );
        const endOfPeriod = Math.floor(lastDayOfMonth.getTime() / 1000);

        // Count total
        const countRes = await fetch("https://api.igdb.com/v4/games/count", {
            method: "POST",
            headers: {
                "Client-ID": process.env.NEXT_PUBLIC_IGDB_CLIENT_ID,
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_IGDB_ACCESS_TOKEN}`,
                Accept: "application/json",
            },
            body: `
        where first_release_date >= ${startOfPeriod}
          & first_release_date <= ${endOfPeriod};
      `,
        });

        const countData = await countRes.json();
        const totalCount = countData.count || 0;
        const totalPages = Math.ceil(totalCount / limit);

        // Fetch games with company relations
        const response = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                "Client-ID": process.env.IGDB_CLIENT_ID,
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: `
        fields id, name, first_release_date, 
               cover.image_id, 
               platforms.name, 
               involved_companies.company.name,
               involved_companies.publisher,
               involved_companies.developer;
        where first_release_date >= ${startOfPeriod}
          & first_release_date <= ${endOfPeriod};
        sort first_release_date asc;
        limit ${limit};
        offset ${offset};
      `,
        });

        if (!response.ok) {
            const error = await response.text();
            return res.status(response.status).json({ error });
        }

        const rawGames = await response.json();

        // Transform IGDB data to clean format
        const formattedGames = rawGames.map((game) => {
            const coverUrl = game.cover?.image_id
                ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
                // : 'https://res.cloudinary.com/dcgdp1qjr/image/upload/v1765800475/ChatGPT_Image_Dec_15_2025_02_53_00_PM_t9hoyk.png';
                : "/keyzoo-fallback.png";

            const releaseDate = game.first_release_date
                ? new Date(game.first_release_date * 1000).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })
                : "UNKNOWN";

            const developers =
                game.involved_companies
                    ?.filter((c) => c.developer && c.company?.name)
                    .map((c) => c.company.name)
                    .join(", ") || "UNKNOWN";

            const publishers =
                game.involved_companies
                    ?.filter((c) => c.publisher && c.company?.name)
                    .map((c) => c.company.name)
                    .join(", ") || "UNKNOWN";

            return {
                id: game.id,
                name: game.name,
                cover: coverUrl,
                platforms: game.platforms
                    ? game.platforms.map((p) => p.name).join(", ")
                    : "UNKNOWN",
                releaseDate,
                developers,
                publishers,
            };
        });

        res.status(200).json({
            data: formattedGames,
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                limit,
            },
        });
    } catch (error) {
        console.error("Error fetching from IGDB:", error);
        res.status(500).json({ error: "Server error" });
    }
}

