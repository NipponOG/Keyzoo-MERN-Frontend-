// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Pagination from '@mui/material/Pagination';
// import Stack from '@mui/material/Stack';

// export default function UpcomingGames() {
//     const router = useRouter();
//     const [games, setGames] = useState([]);
//     const [loading, setLoading] = useState(false);

//     // ✅ Read ?page= from the URL, default to 1
//     const page = parseInt(router.query.page) || 1;

//     useEffect(() => {
//         const fetchGames = async () => {
//             if (!page) return;
//             setLoading(true);
//             try {
//                 const res = await fetch(`/api/upcoming?page=${page}`);
//                 const json = await res.json();
//                 const data = json.data || [];

//                 const formatted = data.map((game) => ({
//                     id: game.id,
//                     name: game.name,
//                     cover: game.cover
//                         ? `https:${game.cover.url.replace("t_thumb", "t_cover_big")}`
//                         : "/placeholder.jpg",
//                     platforms: game.platforms
//                         ? game.platforms.map((p) => p.name).join(", ")
//                         : "Unknown",
//                     releaseDate: game.first_release_date
//                         ? new Date(game.first_release_date * 1000).toLocaleDateString()
//                         : "TBA",
//                 }));

//                 setGames(formatted);
//             } catch (err) {
//                 console.error("Error fetching games:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchGames();
//     }, [page]);

//     // ✅ Function to navigate and update URL query
//     const changePage = (newPage) => {
//         router.push(`/upcoming?page=${newPage}`, undefined, { shallow: true });
//     };

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-6 text-white">Upcoming Games</h1>

//             {loading ? (
//                 <p className="text-gray-400 text-center">Loading games...</p>
//             ) : (
//                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                     {games.map((game) => (
//                         <div
//                             key={game.id}
//                             className="bg-gray-900 text-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform"
//                         >
//                             <img
//                                 src={game.cover}
//                                 alt={game.name}
//                                 className="w-full h-48 object-cover"
//                             />
//                             <div className="p-3">
//                                 <h2 className="text-sm font-semibold mb-1 truncate">
//                                     {game.name}
//                                 </h2>
//                                 <p className="text-xs text-gray-400">{game.platforms}</p>
//                                 <p className="text-xs text-blue-400 mt-2">
//                                     {game.releaseDate}
//                                 </p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Pagination */}
//             <div className="flex justify-center items-center gap-4 mt-6">
//                 <button
//                     disabled={page === 1}
//                     onClick={() => changePage(page - 1)}
//                     className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
//                 >
//                     Previous
//                 </button>
//                 <span className="text-gray-300">Page {page}</span>
//                 <button
//                     onClick={() => changePage(page + 1)}
//                     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 >
//                     Next
//                 </button>
//             </div>
//             <Stack spacing={2}>
//                 <Pagination count={10} shape="rounded" color="primary" />
//                 <Pagination count={10} variant="outlined" shape="rounded" color="primary" />
//             </Stack>
//         </div>
//     );
// }






// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Pagination from "@mui/material/Pagination";
// import Stack from "@mui/material/Stack";

// export default function UpcomingGames() {
//     const router = useRouter();
//     const [games, setGames] = useState([]);
//     const [loading, setLoading] = useState(false);

//     // ✅ Read ?page= from URL, default to 1
//     const page = parseInt(router.query.page) || 1;

//     useEffect(() => {
//         const fetchGames = async () => {
//             if (!page) return;
//             setLoading(true);
//             try {
//                 const res = await fetch(`/api/upcoming?page=${page}`);
//                 const json = await res.json();
//                 const data = json.data || [];

//                 const formatted = data.map((game) => ({
//                     id: game.id,
//                     name: game.name,
//                     cover: game.cover
//                         ? `https:${game.cover.url.replace("t_thumb", "t_cover_big")}`
//                         : "/placeholder.jpg",
//                     platforms: game.platforms
//                         ? game.platforms.map((p) => p.name).join(", ")
//                         : "Unknown",
//                     releaseDate: game.first_release_date
//                         ? new Date(game.first_release_date * 1000).toLocaleDateString()
//                         : "TBA",
//                 }));

//                 setGames(formatted);
//             } catch (err) {
//                 console.error("Error fetching games:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchGames();
//     }, [page]);

//     // ✅ Handle MUI Pagination
//     const handlePageChange = (event, value) => {
//         router.push(`/upcoming?page=${value}`, undefined, { shallow: true });
//     };

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-6 text-white">Upcoming Games</h1>

//             {loading ? (
//                 <p className="text-gray-400 text-center">Loading games...</p>
//             ) : (
//                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                     {games.map((game) => (
//                         <div
//                             key={game.id}
//                             className="bg-gray-900 text-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform"
//                         >
//                             <img
//                                 src={game.cover}
//                                 alt={game.name}
//                                 className="w-full h-48 object-cover"
//                             />
//                             <div className="p-3">
//                                 <h2 className="text-sm font-semibold mb-1 truncate">
//                                     {game.name}
//                                 </h2>
//                                 <p className="text-xs text-gray-400">{game.platforms}</p>
//                                 <p className="text-xs text-blue-400 mt-2">{game.releaseDate}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* ✅ Pagination (MUI) */}
//             <div className="flex justify-center mt-8">
//                 <Stack spacing={2}>
//                     <Pagination
//                         count={10} // total pages — make this dynamic if your API supports it
//                         page={page}
//                         onChange={handlePageChange}
//                         shape="rounded"
//                         color="primary"
//                         variant="outlined"
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

export default function UpcomingGames() {
    const router = useRouter();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const page = parseInt(router.query.page) || 1;

    useEffect(() => {
        const fetchGames = async () => {
            if (!page) return;
            setLoading(true);
            try {
                const res = await fetch(`/api/upcoming?page=${page}`);
                const json = await res.json();
                const data = json.data || [];
                const pagination = json.pagination || {};

                setGames(data);
                setTotalPages(pagination.totalPages || 1);
            } catch (err) {
                console.error("Error fetching games:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [page]);

    const handleChangePage = (event, newPage) => {
        router.push(`/upcoming?page=${newPage}`, undefined, { shallow: true });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-white">Upcoming Games</h1>

            {loading ? (
                <p className="text-gray-400 text-center">Loading games...</p>
            ) : games.length === 0 ? (
                <p className="text-gray-400 text-center">No upcoming games found.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {games.map((item) => (
                        <div
                            key={item.id}
                            className="block p-1 rounded-lg bg-white dark:bg-[#1a1a1a] relative shadow-sm hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1"
                        >
                            <div className="relative w-full h-[220px] md:h-[260px] mb-1.5 rounded-md overflow-hidden">
                                <Image
                                    src={item.cover}
                                    alt={item.name}
                                    fill
                                    className="object-center"
                                />
                            </div>

                            <div className="  dark:bg-black/30 backdrop-blur-sm px-2 py-2 rounded-b-md">
                                <h3 className="text-sm font-semibold line-clamp-2 text-black">
                                    {item.name}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">{item.platforms}</p>
                                <p className="text-sm text-blue-400 mt-1">{item.releaseDate}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Main Developers: {item.developers}
                                </p>
                                <p className="text-sm text-gray-500">Publishers: {item.publishers}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-center mt-8">
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


