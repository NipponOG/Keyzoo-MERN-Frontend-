import { useMemo, useState } from "react";
import { FiUpload, FiX, FiFileText, FiClipboard, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/getStrapiMedia";
import adminFetch from "@/lib/adminFetch";

export default function UploadKeysModal({
    product,
    onClose,
    onUpload,
}) {

    const [text, setText] = useState("");
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const stats = useMemo(() => {

        const lines = text.split("\n");

        const cleaned = lines
            .map(v => v.trim())
            .filter(Boolean);

        const unique = [...new Set(cleaned)];

        return {

            keys: unique,

            total: cleaned.length,

            valid: unique.length,

            duplicates: cleaned.length - unique.length,

            empty: lines.filter(v => !v.trim()).length,

        };

    }, [text]);

    const readTextFile = (file) => {

        const reader = new FileReader();

        reader.onload = (e) => {

            const content = e.target.result;

            setText((prev) => {

                if (!prev.trim()) return content;

                return prev + "\n" + content;

            });

        };

        reader.readAsText(file);

    };

    const handleFile = (e) => {

        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.name.endsWith(".txt")) {

            alert("Only TXT files allowed.");

            return;

        }

        readTextFile(file);

    };

    const handleDrop = (e) => {

        e.preventDefault();

        setDragging(false);

        const file = e.dataTransfer.files?.[0];

        if (!file) return;

        if (!file.name.endsWith(".txt")) {

            alert("Only TXT files allowed.");

            return;

        }

        readTextFile(file);

    };

    // const handleUpload = async (keys) => {
    //     const res = await fetch("/api/admin/upload-keys", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             type: product.inventoryType,
    //             productId: product.id,
    //             keys,
    //         }),
    //     });

    //     const data = await res.json();

    //     if (data.success) {

    //         alert(
    //             `${data.uploaded} keys uploaded\n${data.duplicates} duplicates skipped`
    //         );

    //         onClose();

    //         // Refresh inventory list here
    //     }
    // };

    // const handleUpload = async (keys) => {

    //     try {

    //         setUploading(true);

    //         const res = await adminFetch("/api/admin/upload-keys", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 type: product.inventoryType,
    //                 productId: product.id,
    //                 type: product.type,
    //                 keys,
    //             }),
    //         });

    //         const data = await res.json();

    //         if (!res.ok) {
    //             throw new Error(data.error || "Upload failed");
    //         }

    //         alert(
    //             `${data.uploaded} keys uploaded\n${data.duplicates} duplicates skipped`
    //         );

    //         onClose();

    //     } catch (err) {

    //         alert(err.message);

    //     } finally {

    //         setUploading(false);

    //     }

    // };

    const handleUpload = async (keys) => {

        try {

            setUploading(true);

            const data = await adminFetch("/api/admin/upload-keys", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: product.inventoryType,
                    productId: product.id,
                    keys,
                }),
            });

            alert(
                `${data.uploaded} keys uploaded\n${data.duplicates} duplicates skipped`
            );

            onClose();

        } catch (err) {

            alert(err.message);

        } finally {

            setUploading(false);

        }

    };

    return (

        <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">

            {/* <div className="w-full max-w-3xl rounded-2xl border border-[#2b2b2b] bg-[#171717] shadow-2xl"> */}
            <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl border border-[#2b2b2b] bg-[#171717] shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-[#2b2b2b] px-6 py-5">

                    <div>

                        <h2 className="text-xl font-semibold text-white">
                            Upload Product Keys
                        </h2>

                        <p className="text-sm text-gray-400 mt-1">
                            Paste one key per line.
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="h-10 w-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-400"
                    >
                        <FiX size={20} />
                    </button>

                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    {/* Product */}

                    <div className="px-6 pt-6">

                        <div className="rounded-xl border border-[#2b2b2b] bg-[#1b1b1b] p-5">

                            <div className="flex gap-5">

                                <Image
                                    src={getStrapiMedia(product.image?.url)}
                                    alt={product.title}
                                    width={85}
                                    height={115}
                                    className="rounded-lg object-cover flex-shrink-0"
                                />

                                <div className="flex-1">

                                    <p className="text-gray-400 text-sm">
                                        Selected Product
                                    </p>

                                    <h3 className="mt-1 text-lg font-semibold text-white line-clamp-2">
                                        {product.title}
                                    </h3>

                                    <div className="mt-4 flex flex-wrap gap-2">

                                        {(product.region || product.card_region) && (
                                            <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs text-blue-400 uppercase">
                                                {product.region || product.card_region}
                                            </span>
                                        )}

                                        {product.workPlatform && (
                                            <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs text-green-400 uppercase">
                                                {product.workPlatform}
                                            </span>
                                        )}

                                        {product.item && (
                                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">
                                                {product.item}
                                            </span>
                                        )}

                                    </div>

                                    <p className="mt-4 text-xs text-gray-500">
                                        Product ID: {product.documentId || product.id}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Textarea */}

                    <div className="px-6 py-6 space-y-5">

                        <input
                            id="txt-upload"
                            type="file"
                            accept=".txt"
                            className="hidden"
                            onChange={handleFile}
                        />

                        <div
                            onDragOver={(e) => {

                                e.preventDefault();

                                setDragging(true);

                            }}

                            onDragLeave={() => setDragging(false)}

                            onDrop={handleDrop}

                            onClick={() =>
                                document.getElementById("txt-upload").click()
                            }

                            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${dragging ? "border-indigo-500 bg-indigo-500/10" : "border-[#313131] bg-[#1b1b1b] hover:border-indigo-400"}`}>

                            <FiFileText
                                className="mx-auto mb-4 text-indigo-400"
                                size={34}
                            />

                            <p className="font-medium text-white">

                                Drag & Drop TXT File

                            </p>

                            <p className="mt-2 text-sm text-gray-500">

                                or click to browse

                            </p>

                        </div>

                        <div>

                            <label className="flex items-center gap-2 text-sm text-gray-300 mb-3">

                                <FiClipboard />

                                Paste Keys

                            </label>

                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="AAAAA-BBBBB-CCCCC-DDDDD"
                                className="w-full min-h-[220px] rounded-xl border border-[#2b2b2b] bg-[#111111] p-4 text-xl text-white outline-none focus:border-indigo-500 resize-none"
                            />

                        </div>

                    </div>

                    {stats.valid > 0 && (

                        <div className="rounded-xl border border-[#2b2b2b] bg-[#111111] p-4 mb-2.5">

                            <p className="text-sm text-gray-400 mb-3">
                                Preview
                            </p>

                            <div className="space-y-2 max-h-56 overflow-y-auto">

                                {stats.keys.slice(0, 8).map((key, index) => (

                                    <div
                                        key={index}
                                        className="rounded-md bg-[#1c1c1c] px-3 py-2 font-mono text-sm text-green-400"
                                    >
                                        {key}
                                    </div>

                                ))}

                                {stats.keys.length > 8 && (

                                    <p className="text-center text-xs text-gray-500 pt-2">

                                        + {stats.keys.length - 8} more keys...

                                    </p>

                                )}

                            </div>

                        </div>

                    )}

                    {/* Footer */}

                    <div className="border-t border-[#2b2b2b]">

                        <div className="grid grid-cols-4 border-b border-[#2b2b2b]">

                            <div className="p-5">

                                <p className="text-xs text-gray-500">
                                    Keys Found
                                </p>

                                <h2 className="mt-2 text-2xl font-bold text-white">
                                    {stats.total}
                                </h2>

                            </div>

                            <div className="p-5 border-l border-[#2b2b2b]">

                                <p className="text-xs text-gray-500">
                                    Valid
                                </p>

                                <h2 className="mt-2 text-2xl font-bold text-green-400">
                                    {stats.valid}
                                </h2>

                            </div>

                            <div className="p-5 border-l border-[#2b2b2b]">

                                <p className="text-xs text-gray-500">
                                    Duplicate
                                </p>

                                <h2 className="mt-2 text-2xl font-bold text-yellow-400">
                                    {stats.duplicates}
                                </h2>

                            </div>

                            <div className="p-5 border-l border-[#2b2b2b]">

                                <p className="text-xs text-gray-500">
                                    Empty Lines
                                </p>

                                <h2 className="mt-2 text-2xl font-bold text-red-400">
                                    {stats.empty}
                                </h2>

                            </div>

                        </div>

                        <div className="flex items-center justify-between px-6 py-5">

                            <div>

                                <p className="text-sm text-gray-400">

                                    {stats.valid > 0 ? (

                                        <span className="flex items-center gap-2 text-green-400">

                                            <FiCheckCircle />

                                            Ready to upload

                                        </span>

                                    ) : (

                                        <span className="flex items-center gap-2 text-yellow-400">

                                            <FiAlertCircle />

                                            Paste keys to continue

                                        </span>

                                    )}

                                </p>

                            </div>

                            <div className="flex gap-3">

                                <button
                                    onClick={onClose}
                                    className="rounded-lg bg-[#2b2b2b] px-6 py-3 text-white hover:bg-[#353535]"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => handleUpload(stats.keys)}
                                    disabled={!stats.valid || uploading}
                                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-500 disabled:opacity-40"
                                >
                                    <FiUpload />

                                    {uploading ? "Uploading..." : `Upload ${stats.valid} Keys`}

                                </button>

                            </div>

                        </div>

                    </div>
                </div>
            </div>

        </div>

    );

}