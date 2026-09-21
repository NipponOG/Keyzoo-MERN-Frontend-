"use client";

import { useEffect, useRef, useState } from "react";
import adminFetch from "@/lib/adminFetch";

const AdBannerManager = () => {
    const fileInputRef = useRef(null);

    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        image: "",
        thumbnail: "",
        trailer: "",
        logo: "",
        productId: "",
        youtubeVideoId: "",
        status: "draft",
    });

    // ─────────────────────────────────────────────
    // Fetch banners
    // ─────────────────────────────────────────────

    const fetchBanners = async () => {
        try {
            setLoading(true);

            const response = await adminFetch(
                "/admin/ad-banners"
            );

            setBanners(response?.data || []);
        } catch (error) {
            console.error(
                "Failed to fetch ad banners:",
                error
            );

            alert(
                error?.message ||
                "Failed to load ad banners."
            );
        } finally {
            setLoading(false);
        }
    };

    // ─────────────────────────────────────────────
    // Fetch products
    // ─────────────────────────────────────────────

    const fetchProducts = async () => {
        try {
            /*
             * We will connect this to your existing
             * admin product listing endpoint.
             *
             * For now this uses the inventory endpoint,
             * since it already returns products and gift cards.
             */
            const response = await adminFetch(
                "/admin/inventory"
            );

            setProducts(response?.products || []);
        } catch (error) {
            console.error(
                "Failed to fetch products:",
                error
            );

            setProducts([]);
        }
    };

    useEffect(() => {
        fetchBanners();
        fetchProducts();
    }, []);

    // ─────────────────────────────────────────────
    // Open create modal
    // ─────────────────────────────────────────────

    const openCreateModal = () => {
        setEditingBanner(null);

        setForm({
            title: "",
            description: "",
            image: "",
            thumbnail: "",
            trailer: "",
            logo: "",
            productId: "",
            youtubeVideoId: "",
            status: "draft",
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setModalOpen(true);
    };

    // ─────────────────────────────────────────────
    // Open edit modal
    // ─────────────────────────────────────────────

    const openEditModal = (banner) => {
        setEditingBanner(banner);

        setForm({
            title: banner.title || "",
            description: banner.description || "",
            image: banner.image || "",
            thumbnail: banner.thumbnail || "",
            trailer: banner.trailer || "",
            logo: banner.logo || "",
            productId: banner.productId
                ? banner.productId.toString()
                : "",
            youtubeVideoId:
                banner.youtubeVideoId || "",
            status: banner.status || "draft",
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setModalOpen(true);
    };

    // ─────────────────────────────────────────────
    // Input change
    // ─────────────────────────────────────────────

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ─────────────────────────────────────────────
    // Upload media
    // ─────────────────────────────────────────────

    const uploadMedia = async (file, field) => {
        if (!file) return;

        try {
            setUploading(true);

            const token =
                sessionStorage.getItem("admin_jwt");

            if (!token) {
                window.location.href =
                    "/admin/login";
                return;
            }

            const formData = new FormData();

            formData.append("image", file);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/media/upload`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Media upload failed."
                );
            }

            const mediaUrl = data?.data?.url;

            if (!mediaUrl) {
                throw new Error(
                    "Cloudinary media URL was not returned."
                );
            }

            setForm((prev) => ({
                ...prev,
                [field]: mediaUrl,
            }));
        } catch (error) {
            console.error(
                "Ad banner media upload error:",
                error
            );

            alert(
                error?.message ||
                "Failed to upload media."
            );
        } finally {
            setUploading(false);
        }
    };

    // ─────────────────────────────────────────────
    // Save
    // ─────────────────────────────────────────────

    const handleSave = async () => {
        if (!form.title.trim()) {
            alert("Ad banner title is required.");
            return;
        }

        if (!form.image.trim()) {
            alert(
                "Please upload or enter the main image URL."
            );
            return;
        }

        try {
            setSaving(true);

            const payload = {
                title: form.title.trim(),
                description:
                    form.description.trim() || null,

                image: form.image.trim(),
                thumbnail:
                    form.thumbnail.trim() || null,
                trailer:
                    form.trailer.trim() || null,
                logo:
                    form.logo.trim() || null,

                productId:
                    form.productId || null,

                youtubeVideoId:
                    form.youtubeVideoId.trim() || null,

                status: form.status,
            };

            if (editingBanner) {
                await adminFetch(
                    `/admin/ad-banners/${editingBanner._id}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(payload),
                    }
                );
            } else {
                await adminFetch(
                    "/admin/ad-banners",
                    {
                        method: "POST",
                        body: JSON.stringify(payload),
                    }
                );
            }

            setModalOpen(false);

            await fetchBanners();
        } catch (error) {
            console.error(
                "Ad banner save error:",
                error
            );

            alert(
                error?.message ||
                "Failed to save ad banner."
            );
        } finally {
            setSaving(false);
        }
    };

    // ─────────────────────────────────────────────
    // Delete
    // ─────────────────────────────────────────────

    const handleDelete = async (banner) => {
        const confirmed = window.confirm(
            `Delete "${banner.title || "Untitled Ad"}"?`
        );

        if (!confirmed) return;

        try {
            await adminFetch(
                `/admin/ad-banners/${banner._id}`,
                {
                    method: "DELETE",
                }
            );

            await fetchBanners();
        } catch (error) {
            console.error(
                "Ad banner delete error:",
                error
            );

            alert(
                error?.message ||
                "Failed to delete ad banner."
            );
        }
    };

    return (
        <div className="mt-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        Ad Banners
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                        Manage promotional ad banner sections
                        displayed on the homepage.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                    + Add Ad Banner
                </button>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="rounded-xl border border-[#2a2a2a] bg-[#181818] p-8 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-indigo-500" />

                    <p className="mt-4 text-sm text-gray-400">
                        Loading ad banners...
                    </p>
                </div>
            ) : banners.length === 0 ? (
                /* Empty */
                <div className="rounded-xl border border-dashed border-[#333] bg-[#181818] p-10 text-center">
                    <h3 className="text-base font-semibold text-white">
                        No ad banners yet
                    </h3>

                    <p className="mt-2 text-sm text-gray-400">
                        Create your first homepage ad banner.
                    </p>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                    >
                        Create Ad Banner
                    </button>
                </div>
            ) : (
                /* Banner List */
                <div className="space-y-4">
                    {banners.map((banner) => (
                        <div
                            key={banner._id}
                            className="overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#181818]"
                        >
                            <div className="flex flex-col lg:flex-row">
                                {/* Preview */}
                                <div className="relative h-52 w-full shrink-0 overflow-hidden bg-[#111] lg:h-40 lg:w-72">
                                    {banner.image ? (
                                        <img
                                            src={banner.image}
                                            alt={
                                                banner.title ||
                                                "Ad banner"
                                            }
                                            className="h-full w-full object-center"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-gray-500">
                                            No image
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex min-w-0 flex-1 flex-col justify-between p-5">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="truncate text-base font-semibold text-white">
                                                {banner.title ||
                                                    "Untitled Ad Banner"}
                                            </h3>

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${banner.status ===
                                                    "published"
                                                    ? "bg-green-500/10 text-green-400"
                                                    : "bg-yellow-500/10 text-yellow-400"
                                                    }`}
                                            >
                                                {banner.status ===
                                                    "published"
                                                    ? "Published"
                                                    : "Draft"}
                                            </span>
                                        </div>

                                        {banner.description && (
                                            <p className="mt-2 line-clamp-2 text-sm text-gray-400">
                                                {
                                                    banner.description
                                                }
                                            </p>
                                        )}

                                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                                            {banner.productId && (
                                                <span className="rounded-lg bg-[#222] px-2.5 py-1">
                                                    Product linked
                                                </span>
                                            )}

                                            {banner.youtubeVideoId && (
                                                <span className="rounded-lg bg-[#222] px-2.5 py-1">
                                                    YouTube trailer
                                                </span>
                                            )}

                                            {banner.logo && (
                                                <span className="rounded-lg bg-[#222] px-2.5 py-1">
                                                    Logo
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-5 flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEditModal(
                                                    banner
                                                )
                                            }
                                            className="rounded-xl border border-[#333] bg-[#202020] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#292929]"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    banner
                                                )
                                            }
                                            className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#2a2a2a] bg-[#181818] shadow-2xl">
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#2a2a2a] bg-[#181818] px-6 py-5">
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {editingBanner
                                        ? "Edit Ad Banner"
                                        : "Create Ad Banner"}
                                </h3>

                                <p className="mt-1 text-sm text-gray-400">
                                    Configure the homepage promotional
                                    banner.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="rounded-lg px-3 py-2 text-xl text-gray-400 transition hover:bg-[#252525] hover:text-white"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="space-y-5 p-6">
                            {/* Title */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Enter ad banner title"
                                    className="w-full rounded-xl border border-[#333] bg-[#202020] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-500"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Enter ad banner description"
                                    className="w-full resize-none rounded-xl border border-[#333] bg-[#202020] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-500"
                                />
                            </div>

                            {/* Main Image */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Main Image
                                </label>

                                <div className="space-y-3">
                                    {form.image && (
                                        <div className="relative overflow-hidden rounded-xl border border-[#333] bg-[#111]">
                                            <img
                                                src={form.image}
                                                alt="Main ad banner preview"
                                                className="h-48 w-full object-cover"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        image: "",
                                                    }))
                                                }
                                                className="absolute right-3 top-3 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-500/80"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                uploadMedia(
                                                    e.target.files?.[0],
                                                    "image"
                                                )
                                            }
                                            disabled={uploading}
                                            className="block w-full rounded-xl border border-[#333] bg-[#202020] text-sm text-gray-400 file:mr-4 file:border-0 file:bg-[#292929] file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-[#333]"
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        name="image"
                                        value={form.image}
                                        onChange={handleChange}
                                        placeholder="Or paste image URL"
                                        className="w-full rounded-xl border border-[#333] bg-[#202020] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Thumbnail */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Thumbnail
                                </label>

                                <div className="space-y-3">
                                    {form.thumbnail && (
                                        <div className="relative overflow-hidden rounded-xl border border-[#333] bg-[#111]">
                                            <img
                                                src={form.thumbnail}
                                                alt="Thumbnail preview"
                                                className="h-36 w-full object-cover"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        thumbnail: "",
                                                    }))
                                                }
                                                className="absolute right-3 top-3 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-500/80"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            uploadMedia(
                                                e.target.files?.[0],
                                                "thumbnail"
                                            )
                                        }
                                        disabled={uploading}
                                        className="block w-full rounded-xl border border-[#333] bg-[#202020] text-sm text-gray-400 file:mr-4 file:border-0 file:bg-[#292929] file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-[#333]"
                                    />

                                    <input
                                        type="text"
                                        name="thumbnail"
                                        value={form.thumbnail}
                                        onChange={handleChange}
                                        placeholder="Or paste thumbnail URL"
                                        className="w-full rounded-xl border border-[#333] bg-[#202020] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Logo */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Logo
                                </label>

                                <div className="space-y-3">
                                    {form.logo && (
                                        <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-xl border border-[#333] bg-[#111] p-5">
                                            <img
                                                src={form.logo}
                                                alt="Logo preview"
                                                className="max-h-full max-w-full object-contain"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        logo: "",
                                                    }))
                                                }
                                                className="absolute right-3 top-3 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-500/80"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            uploadMedia(
                                                e.target.files?.[0],
                                                "logo"
                                            )
                                        }
                                        disabled={uploading}
                                        className="block w-full rounded-xl border border-[#333] bg-[#202020] text-sm text-gray-400 file:mr-4 file:border-0 file:bg-[#292929] file:px-4 file:py-3 file:font-medium file:text-white hover:file:bg-[#333]"
                                    />

                                    <input
                                        type="text"
                                        name="logo"
                                        value={form.logo}
                                        onChange={handleChange}
                                        placeholder="Or paste logo URL"
                                        className="w-full rounded-xl border border-[#333] bg-[#202020] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Trailer */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Trailer
                                </label>

                                <div className="space-y-3">
                                    {form.trailer && (
                                        <div className="rounded-xl border border-[#333] bg-[#111] p-4">
                                            <video
                                                src={form.trailer}
                                                controls
                                                className="max-h-64 w-full rounded-lg"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        trailer: "",
                                                    }))
                                                }
                                                className="mt-3 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
                                            >
                                                Remove Trailer
                                            </button>
                                        </div>
                                    )}

                                    <input
                                        type="text"
                                        name="trailer"
                                        value={form.trailer}
                                        onChange={handleChange}
                                        placeholder="Paste trailer video URL"
                                        className="w-full rounded-xl border border-[#333] bg-[#202020] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-500"
                                    />

                                    <p className="text-xs text-gray-500">
                                        Enter a direct video URL. Video upload will be
                                        added when the media API supports video files.
                                    </p>
                                </div>
                            </div>

                            {/* Product */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Product
                                </label>

                                <select
                                    name="productId"
                                    value={form.productId}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-[#333] bg-[#202020] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                                >
                                    <option value="">
                                        No product linked
                                    </option>

                                    {products.map((product) => (
                                        <option
                                            key={product._id}
                                            value={product._id}
                                        >
                                            {product.title}
                                            {product.var_title
                                                ? ` — ${product.var_title}`
                                                : ""}
                                        </option>
                                    ))}
                                </select>

                                <p className="mt-1.5 text-xs text-gray-500">
                                    Select the product that this ad banner should
                                    open when the customer clicks “Take It Now!”.
                                </p>
                            </div>

                            {/* YouTube Video ID */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    YouTube Video ID
                                </label>

                                <input
                                    type="text"
                                    name="youtubeVideoId"
                                    value={form.youtubeVideoId}
                                    onChange={handleChange}
                                    placeholder="Example: dQw4w9WgXcQ"
                                    className="w-full rounded-xl border border-[#333] bg-[#202020] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-500"
                                />

                                <p className="mt-1.5 text-xs text-gray-500">
                                    Enter only the YouTube video ID, not
                                    the full URL.
                                </p>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-[#333] bg-[#202020] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                                >
                                    <option value="draft">
                                        Draft
                                    </option>

                                    <option value="published">
                                        Published
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-[#2a2a2a] bg-[#181818] px-6 py-5">
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                disabled={saving}
                                className="rounded-xl border border-[#333] bg-[#202020] px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-[#292929] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving || uploading}
                                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingBanner
                                        ? "Update Ad Banner"
                                        : "Create Ad Banner"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdBannerManager;