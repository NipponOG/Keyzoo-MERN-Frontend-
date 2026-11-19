// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Pagination from "@mui/material/Pagination";
// import Stack from "@mui/material/Stack";
// import Image from "next/image";

// export default function UpcomingGames() {
//     const router = useRouter();
//     const [games, setGames] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [totalPages, setTotalPages] = useState(1);

//     const page = parseInt(router.query.page) || 1;

//     useEffect(() => {
//         const fetchGames = async () => {
//             if (!page) return;
//             setLoading(true);
//             try {
//                 const res = await fetch(`/api/upcoming?page=${page}`);
//                 const json = await res.json();
//                 const data = json.data || [];
//                 const pagination = json.pagination || {};

//                 setGames(data);
//                 setTotalPages(pagination.totalPages || 1);
//             } catch (err) {
//                 console.error("Error fetching games:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchGames();
//     }, [page]);

//     const handleChangePage = (event, newPage) => {
//         router.push(`/upcoming?page=${newPage}`, undefined, { shallow: true });
//     };

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-6 text-white">Upcoming Games</h1>

//             {loading ? (
//                 <p className="text-gray-400 text-center">Loading games...</p>
//             ) : games.length === 0 ? (
//                 <p className="text-gray-400 text-center">No upcoming games found.</p>
//             ) : (
//                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                     {games.map((item) => (
//                         <div
//                             key={item.id}
//                             className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative shadow-sm hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1"
//                         >
//                             <div className="relative w-full h-[220px] md:h-[260px] mb-1.5 rounded-md overflow-hidden">
//                                 <Image
//                                     src={item.cover}
//                                     alt={item.name}
//                                     fill
//                                     className="object-center"
//                                 />
//                             </div>

//                             <div className="  dark:bg-black/30 backdrop-blur-sm px-2 py-2 rounded-b-md">
//                                 <h3 className="text-sm font-semibold line-clamp-2 text-black">
//                                     {item.name}
//                                 </h3>
//                                 <p className="text-sm text-gray-400 mt-1">{item.platforms}</p>
//                                 <p className="text-sm text-blue-400 mt-1">{item.releaseDate}</p>
//                                 <p className="text-sm text-gray-500 mt-1">
//                                     Main Developers: {item.developers}
//                                 </p>
//                                 <p className="text-sm text-gray-500">Publishers: {item.publishers}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             <div className="flex justify-center mt-8">
//                 <Stack spacing={2}>
//                     <Pagination
//                         count={totalPages}
//                         page={page}
//                         onChange={handleChangePage}
//                         shape="rounded"
//                         variant="outlined"
//                         sx={{
//                             "& .MuiPaginationItem-root": {
//                                 color: "#fff",
//                                 borderColor: "#444",
//                             },
//                             "& .MuiPaginationItem-root.Mui-selected": {
//                                 backgroundColor: "#814DE5",
//                                 color: "#fff",
//                                 borderColor: "#814DE5",
//                             },
//                             "& .MuiPaginationItem-root:hover": {
//                                 backgroundColor: "#6C34D8",
//                                 color: "#fff",
//                             },
//                         }}
//                     />
//                 </Stack>
//             </div>
//         </div>
//     );
// }





import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Image from "next/image";

/* ---------- helpers ---------- */

// platforms can arrive as "PC, PS5" or ["PC", "PS5"]
const toList = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return String(value)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
};

// "2026-03-14" -> { day: "14", month: "Mar", year: "2026" }; falls back to raw text (e.g. "TBA", "Q4 2026")
const parseDate = (value) => {
    if (!value) return { raw: "TBA" };
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return { raw: String(value) };
    return {
        day: d.getDate(),
        month: d.toLocaleString("en-US", { month: "short" }),
        year: d.getFullYear(),
    };
};

/* ---------- card ---------- */

function GameCard({ item }) {
    const platforms = toList(item.platforms);
    const date = parseDate(item.releaseDate);

    return (
        <article className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#17171f] transition-colors duration-200 hover:border-[#814DE5]/60 focus-within:border-[#814DE5]">
            {/* cover */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0f0f14]">
                {item.cover ? (
                    <Image
                        src={item.cover}
                        alt={item.name}
                        fill
                        sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-500">
                        No cover available
                    </div>
                )}

                {/* bottom fade so the date badge and title stay readable */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#17171f] to-transparent" />

                {/* release date badge */}
                <div className="absolute left-3 top-3 min-w-[52px] rounded-lg bg-[#814DE5] px-2.5 py-1.5 text-center text-white shadow-lg">
                    {date.raw ? (
                        <span className="block text-xs font-semibold leading-tight">
                            {date.raw}
                        </span>
                    ) : (
                        <>
                            <span className="block text-lg font-bold leading-none">
                                {date.day}
                            </span>
                            <span className="block text-xs font-medium leading-tight">
                                {date.month} {date.year}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* details */}
            <div className="flex flex-1 flex-col gap-3 p-3.5">
                <h3
                    className="line-clamp-2 text-base font-semibold leading-snug text-white"
                    title={item.name}
                >
                    {item.name}
                </h3>

                {platforms.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5">
                        {platforms.slice(0, 4).map((p) => (
                            <li
                                key={p}
                                className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-gray-200"
                            >
                                {p}
                            </li>
                        ))}
                        {platforms.length > 4 && (
                            <li className="rounded-md px-1 py-0.5 text-xs text-gray-400">
                                +{platforms.length - 4}
                            </li>
                        )}
                    </ul>
                )}

                <dl className="mt-auto space-y-1.5 border-t border-white/10 pt-3 text-xs">
                    <div>
                        <dt className="text-gray-500">Developer</dt>
                        <dd className="line-clamp-1 text-gray-200" title={item.developers}>
                            {item.developers || "Unknown"}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-gray-500">Publisher</dt>
                        <dd className="line-clamp-1 text-gray-200" title={item.publishers}>
                            {item.publishers || "Unknown"}
                        </dd>
                    </div>
                </dl>
            </div>
        </article>
    );
}

function CardSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#17171f]">
            <div className="aspect-[3/4] animate-pulse bg-white/5 motion-reduce:animate-none" />
            <div className="space-y-3 p-3.5">
                <div className="h-4 w-4/5 animate-pulse rounded bg-white/10 motion-reduce:animate-none" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-white/5 motion-reduce:animate-none" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-white/5 motion-reduce:animate-none" />
            </div>
        </div>
    );
}

/* ---------- page ---------- */

export default function UpcomingGames() {
    const router = useRouter();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    const page = parseInt(router.query.page) || 1;

    useEffect(() => {
        if (!router.isReady) return;

        const controller = new AbortController();

        const fetchGames = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/upcoming?page=${page}`, {
                    signal: controller.signal,
                });
                const json = await res.json();
                setGames(json.data || []);
                setTotalPages(json.pagination?.totalPages || 1);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Error fetching games:", err);
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchGames();
        return () => controller.abort();
    }, [page, router.isReady]);

    const handleChangePage = (event, newPage) => {
        router.push(`/upcoming?page=${newPage}`, undefined, { shallow: true });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const gridClasses =
        "grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5";

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-bold text-white">Upcoming Games</h1>

            {loading ? (
                <div className={gridClasses} aria-busy="true">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            ) : games.length === 0 ? (
                <p className="py-16 text-center text-gray-400">
                    No upcoming games found.
                </p>
            ) : (
                <div className={gridClasses}>
                    {games.map((item) => (
                        <GameCard key={item.id} item={item} />
                    ))}
                </div>
            )}

            <div className="mt-8 flex justify-center">
                <Stack spacing={2}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handleChangePage}
                        shape="rounded"
                        variant="outlined"
                        sx={{
                            "& .MuiPaginationItem-root": {
                                color: "#fff",
                                borderColor: "#444",
                            },
                            "& .MuiPaginationItem-root.Mui-selected": {
                                backgroundColor: "#814DE5",
                                color: "#fff",
                                borderColor: "#814DE5",
                            },
                            "& .MuiPaginationItem-root:hover": {
                                backgroundColor: "#6C34D8",
                                color: "#fff",
                            },
                        }}
                    />
                </Stack>
            </div>
        </div>
    );
}