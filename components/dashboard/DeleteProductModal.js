"use client";

import { useState } from "react";
import { FiAlertTriangle, FiTrash2, FiX } from "react-icons/fi";
import adminFetch from "@/lib/adminFetch";

export default function DeleteProductModal({
    open,
    product,
    onClose,
    onDeleted,
}) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    if (!open || !product) {
        return null;
    }

    const handleDelete = async () => {
        if (deleting) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            await adminFetch(`/admin/products/${product._id}`, {
                method: "DELETE",
            });

            if (onDeleted) {
                await onDeleted();
            }
        } catch (error) {
            console.error("Delete product error:", error);

            setError(
                error?.message ||
                "Failed to delete product. Please try again."
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111318] shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                            <FiAlertTriangle size={20} />
                        </div>

                        <h2 className="text-lg font-semibold text-white">
                            Delete Product
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={deleting}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-5">
                    <p className="text-sm leading-6 text-gray-300">
                        Are you sure you want to delete this product?
                    </p>

                    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-sm font-medium text-white">
                            {product.title}
                        </p>

                        {product.var_title && (
                            <p className="mt-1 text-sm text-gray-400">
                                Variation: {product.var_title}
                            </p>
                        )}
                    </div>

                    <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                        <p className="text-xs leading-5 text-red-300">
                            This action cannot be undone. All available game
                            keys belonging to this product will also be
                            deleted.
                        </p>
                    </div>

                    {error && (
                        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                            <p className="text-sm leading-5 text-red-300">
                                {error}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={deleting}
                        className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <FiTrash2 size={16} />

                        {deleting ? "Deleting..." : "Delete Product"}
                    </button>
                </div>
            </div>
        </div>
    );
}