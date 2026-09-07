// import Image from "next/image";
// import { getStrapiMedia } from "@/lib/getStrapiMedia";

// export default function ProductInventoryRow({ product }) {

//     return (
//         <div className="bg-[#1a1a1a] rounded-xl border border-gray-700 p-6 text-white">

//             <div className="flex items-center gap-6">

//                 <Image
//                     src={getStrapiMedia(product.image?.url)}
//                     alt={product.title}
//                     width={120}
//                     height={160}
//                     className="rounded-lg object-cover"
//                 />

//                 <div className="flex-1">

//                     <h3 className="text-lg font-semibold">
//                         {product.title}
//                     </h3>

//                     <p className="text-blue-400">
//                         {product.region || product.card_region}
//                     </p>

//                 </div>

//             </div>

//         </div>
//     );
// }




import Image from "next/image";
import { getStrapiMedia } from "@/lib/getStrapiMedia";
import {
    FiEdit2,
    FiUpload,
    FiEye,
    FiTrash2,
} from "react-icons/fi";

export default function ProductInventoryRow({ product, onUpload, onView }) {

    // const availableKeys = product.availableKeys ?? 10;
    // const soldKeys = product.soldKeys ?? 5;
    // const totalKeys = availableKeys + soldKeys;



    // const progress =
    //     totalKeys === 0
    //         ? 0
    //         : Math.round((availableKeys / totalKeys) * 100);

    // const status =
    //     availableKeys === 0
    //         ? "Out of Stock"
    //         : availableKeys <= 5
    //             ? "Low Stock"
    //             : "Healthy";

    const availableKeys = Number(product.availableKeys || 0);
    const soldKeys = Number(product.soldKeys || 0);
    const totalKeys = Number(product.totalKeys || (availableKeys + soldKeys));

    const progress =
        totalKeys > 0
            ? Math.round((availableKeys / totalKeys) * 100)
            : 0;

    const status =
        product.status ||
        (availableKeys === 0
            ? "Out of Stock"
            : availableKeys <= 5
                ? "Low Stock"
                : "Healthy");

    const statusConfig = {
        healthy: {
            label: "Healthy",
            className: "bg-green-500/15 text-green-400",
        },
        low: {
            label: "Low Stock",
            className: "bg-yellow-500/15 text-yellow-400",
        },
        out: {
            label: "Out of Stock",
            className: "bg-red-500/15 text-red-400",
        },
    };

    const currentStatus =
        statusConfig[status] || statusConfig.out;

    return (
        <div className="rounded-2xl border border-[#2b2b2b] bg-[#1b1b1b] p-6">

            <div className="flex flex-col xl:flex-row gap-8">

                {/* LEFT */}

                {/* <div className="flex gap-5 min-w-[360px]"> */}
                <div className="flex gap-5 basis-[520px] flex-shrink-0">

                    <Image
                        src={getStrapiMedia(product.image?.url)}
                        alt={product.title}
                        width={110}
                        height={150}
                        className="rounded-xl object-center"
                    />

                    <div className="flex flex-col justify-between">

                        <div>

                            <h2 className="text-lg font-semibold leading-7 line-clamp-2">
                                {product.title}
                            </h2>

                            <div className="flex flex-wrap gap-2 mt-3">

                                <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 text-xs uppercase">
                                    {product.region || product.card_region}
                                </span>

                                <span className="px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-xs uppercase">
                                    {product.workPlatform}
                                </span>

                                <span className="px-3 py-1 rounded-full bg-white/10 text-gray-300 text-xs">
                                    {product.item}
                                </span>

                            </div>

                        </div>

                        <p className="text-sm text-gray-500 mt-5">

                            Product ID : {product.documentId || product.id}

                        </p>

                    </div>

                </div>

                {/* CENTER */}

                <div className="flex-1">

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

                        <div>

                            <p className="text-gray-500 text-sm">
                                Available
                            </p>

                            <h2 className="text-3xl font-bold text-green-400 mt-2">
                                {availableKeys}
                            </h2>

                        </div>

                        <div>

                            <p className="text-gray-500 text-sm">
                                Sold
                            </p>

                            <h2 className="text-3xl font-bold text-sky-400 mt-2">
                                {soldKeys}
                            </h2>

                        </div>

                        <div>

                            <p className="text-gray-500 text-sm">
                                Uploaded
                            </p>

                            <h2 className="text-3xl font-bold text-white mt-2">
                                {totalKeys}
                            </h2>

                        </div>

                        <div>

                            <p className="text-gray-500 text-sm">
                                Status
                            </p>

                            <div className="mt-3">

                                {/* {status === "Healthy" && (
                                    <span className="px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-sm">
                                        Healthy
                                    </span>
                                )}

                                {status === "Low Stock" && (
                                    <span className="px-3 py-1 rounded-full bg-yellow-500/15 text-yellow-400 text-sm">
                                        Low Stock
                                    </span>
                                )}

                                {status === "Out of Stock" && (
                                    <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-400 text-sm">
                                        Out of Stock
                                    </span>
                                )} */}

                                {/* <span
                                    className={`px-3 py-1 rounded-full text-sm ${status === "Healthy"
                                        ? "bg-green-500/15 text-green-400"
                                        : status === "Low Stock"
                                            ? "bg-yellow-500/15 text-yellow-400"
                                            : "bg-red-500/15 text-red-400"
                                        }`}
                                >
                                    {status}
                                </span> */}

                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${currentStatus.className}`}
                                >
                                    {currentStatus.label}
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* Progress */}

                    <div className="mt-8">

                        <div className="flex justify-between text-sm text-gray-400 mb-2">

                            <span>Stock Health</span>

                            <span>{progress}%</span>

                        </div>

                        <div className="h-2 rounded-full bg-[#2b2b2b]">

                            <div
                                className="h-2 rounded-full bg-green-500 transition-all"
                                style={{
                                    width: `${progress}%`,
                                }}
                            />

                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="flex xl:flex-col gap-3 xl:min-w-[180px]">

                    <button onClick={onUpload} className="cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm">

                        <FiUpload />

                        Upload Keys

                    </button>

                    <button onClick={onView} className="cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-[#2b2b2b] hover:bg-[#343434] px-4 py-2 text-sm">

                        <FiEye />

                        View Keys

                    </button>

                    <button disabled className="cursor-not-allowed flex items-center justify-center gap-2 rounded-lg bg-[#2b2b2b] hover:bg-[#343434] px-4 py-2 text-sm">

                        <FiEdit2 />

                        Edit

                    </button>

                    <button disabled className="cursor-not-allowed flex items-center justify-center gap-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 px-4 py-2 text-sm">

                        <FiTrash2 />

                        Delete

                    </button>

                </div>

            </div>

        </div>
    );
}