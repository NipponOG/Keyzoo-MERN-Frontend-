import { useState, useMemo } from "react";
import {
    FiX,
    FiSearch,
    FiCopy,
    FiEye,
    FiEyeOff,
    FiEdit2,
    FiTrash2,
    FiCheck
} from "react-icons/fi";

import Image from "next/image";
import { getStrapiMedia } from "@/lib/getStrapiMedia";
import { useEffect } from "react";
import adminFetch from "@/lib/adminFetch";

export default function ViewKeysModal({
    product,
    keys = [],
    onClose,
    onDelete
}) {

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [visibleKeys, setVisibleKeys] = useState({});


    const [copiedId, setCopiedId] = useState(null);
    const [localKeys, setLocalKeys] = useState(keys);

    const filteredKeys = useMemo(() => {

        return localKeys.filter((key) => {

            const matchSearch =
                key.code.toLowerCase().includes(search.toLowerCase());

            if (filter === "available")
                return key.isAvailable && matchSearch;

            if (filter === "sold")
                return !key.isAvailable && matchSearch;

            return matchSearch;

        });

    }, [localKeys, search, filter]);

    const handleCopy = async (key) => {

        await navigator.clipboard.writeText(key.code);

        setCopiedId(key.id);

        setTimeout(() => {
            setCopiedId(null);
        }, 1500);

    };

    const handleDelete = async (id) => {

        const ok = window.confirm(
            "Delete this activation key?"
        );

        if (!ok) return;

        try {

            const data = await adminFetch("/api/admin/delete-key", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                }),
            });

            if (!data.success) {
                alert("Delete failed");
                return;
            }

            setLocalKeys(prev => {

                const updated = prev.filter(
                    key => key.id !== id
                );

                onDelete?.(updated);

                return updated;

            });

        } catch (err) {

            console.error(err);

            alert(err.message);

        }

    };

    useEffect(() => {
        setLocalKeys(keys);
    }, [keys]);

    // const available =
    //     keys.filter(k => k.isAvailable).length;

    // const sold =
    //     localKeys.length - available;

    const available =
        localKeys.filter(k => k.isAvailable).length;

    const sold =
        localKeys.filter(k => !k.isAvailable).length;

    return (

        <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">

            <div className="w-full max-w-6xl h-[90vh] rounded-2xl border border-[#2b2b2b] bg-[#171717] shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}

                <div className="flex justify-between items-center border-b border-[#2b2b2b] p-6">

                    <div>

                        <h2 className="text-2xl font-semibold text-white">
                            Product Keys
                        </h2>

                        <p className="text-gray-400 text-sm mt-1">
                            Manage all activation keys
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="h-10 w-10 rounded-lg hover:bg-white/10 flex items-center justify-center"
                    >
                        <FiX size={20} />
                    </button>

                </div>

                {/* Product */}

                <div className="border-b border-[#2b2b2b] p-6">

                    <div className="flex gap-5">

                        <Image
                            src={getStrapiMedia(product.image?.url)}
                            alt={product.title}
                            width={90}
                            height={120}
                            className="rounded-lg object-center"
                        />

                        <div className="flex-1">

                            <h3 className="text-xl font-semibold text-white line-clamp-2">

                                {product.title}

                            </h3>

                            <div className="flex flex-wrap gap-2 mt-3">

                                <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 text-xs uppercase">
                                    {product.region || product.card_region}
                                </span>

                                {product.workPlatform && (
                                    <span className="px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-xs uppercase">
                                        {product.workPlatform}
                                    </span>
                                )}

                            </div>

                        </div>

                        {/* Stats */}

                        <div className="flex gap-6">

                            <div className="text-center">

                                <p className="text-gray-500 text-sm">
                                    Available
                                </p>

                                <h3 className="text-3xl text-green-400 font-bold">

                                    {available}

                                </h3>

                            </div>

                            <div className="text-center">

                                <p className="text-gray-500 text-sm">
                                    Sold
                                </p>

                                <h3 className="text-3xl text-red-400 font-bold">

                                    {sold}

                                </h3>

                            </div>

                            <div className="text-center">

                                <p className="text-gray-500 text-sm">
                                    Total
                                </p>

                                <h3 className="text-3xl text-white font-bold">

                                    {localKeys.length}

                                </h3>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Search */}

                <div className="p-6 border-b border-[#2b2b2b] flex gap-4">

                    <div className="relative flex-1">

                        <FiSearch className="absolute left-4 top-4 text-gray-500" />

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search key..."
                            className="w-full rounded-xl bg-[#101010] border border-[#2b2b2b] py-3 pl-11 pr-4 text-white outline-none"
                        />

                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="rounded-xl bg-[#101010] border border-[#2b2b2b] px-4 text-white"
                    >
                        <option value="all">All</option>
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                    </select>

                </div>

                {/* Table */}

                <div className="flex-1 overflow-y-auto">

                    {filteredKeys.map((key) => (

                        <div
                            key={key.id}
                            className="grid grid-cols-[1fr_130px_220px] items-center gap-6 px-6 py-4 border-b border-[#232323]"
                        >

                            {/* Key */}

                            <div className="flex items-center gap-4">

                                <button
                                    onClick={() =>
                                        setVisibleKeys(prev => ({
                                            ...prev,
                                            [key.id]: !prev[key.id],
                                        }))
                                    }
                                    className="text-gray-400 hover:text-white"
                                >
                                    {visibleKeys[key.id] ? (
                                        <FiEyeOff />
                                    ) : (
                                        <FiEye />
                                    )}
                                </button>

                                <span className="font-mono text-sm text-white">

                                    {visibleKeys[key.id]
                                        ? key.code
                                        : "••••••••••••••••••••••"}

                                </span>

                            </div>

                            {/* Status */}

                            <div>

                                {key.isAvailable ? (

                                    <span className="rounded-full bg-green-500/15 text-green-400 px-3 py-1 text-xs">

                                        Available

                                    </span>

                                ) : (

                                    <span className="rounded-full bg-red-500/15 text-red-400 px-3 py-1 text-xs">

                                        Sold

                                    </span>

                                )}

                            </div>

                            {/* Actions */}

                            <div className="flex justify-end gap-2">

                                <button onClick={() => handleCopy(key)} className="h-10 w-10 rounded-lg bg-[#232323] hover:bg-[#303030] flex items-center justify-center">
                                    {copiedId === key.id ? <FiCheck /> : <FiCopy />}
                                </button>

                                <button className="h-10 w-10 rounded-lg bg-[#232323] hover:bg-[#303030] flex items-center justify-center">
                                    <FiEdit2 />
                                </button>

                                <button onClick={() => handleDelete(key.id)} className="h-10 w-10 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 flex items-center justify-center">
                                    <FiTrash2 />
                                </button>

                            </div>

                        </div>

                    ))}

                    {!filteredKeys.length && (

                        <div className="flex h-64 items-center justify-center text-gray-500">

                            No keys found.

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}