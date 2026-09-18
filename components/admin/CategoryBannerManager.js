import { useEffect, useRef, useState } from "react";
import adminFetch from "@/lib/adminFetch";

const CategoryBannerManager = () => {
    const desktopFileInputRef = useRef(null);
    const mobileFileInputRef = useRef(null);

    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingDesktop, setUploadingDesktop] = useState(false);
    const [uploadingMobile, setUploadingMobile] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);

    const [form, setForm] = useState({
        title: "",
        desktopImage: "",
        mobileImage: "",
        link: "",
        status: "draft",
        sortOrder: 0,
    });

    // ─────────────────────────────────────────────
    // Fetch banners
    // ─────────────────────────────────────────────

    const fetchBanners = async () => {
        try {
            setLoading(true);

            const response = await adminFetch(
                "/admin/category-banners"
            );

            setBanners(response?.data || []);
        } catch (error) {
            console.error(
                "Failed to fetch category banners:",
                error
            );

            alert(
                error?.message ||
                "Failed to load category banners."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    // ─────────────────────────────────────────────
    // Reset file inputs
    // ─────────────────────────────────────────────

    const resetFileInputs = () => {
        if (desktopFileInputRef.current) {
            desktopFileInputRef.current.value = "";
        }

        if (mobileFileInputRef.current) {
            mobileFileInputRef.current.value = "";
        }
    };

    // ─────────────────────────────────────────────
    // Open create modal
    // ─────────────────────────────────────────────

    const openCreateModal = () => {
        setEditingBanner(null);

        setForm({
            title: "",
            desktopImage: "",
            mobileImage: "",
            link: "",
            status: "draft",
            sortOrder: 0,
        });

        resetFileInputs();

        setModalOpen(true);
    };

    // ─────────────────────────────────────────────
    // Open edit modal
    // ─────────────────────────────────────────────

    const openEditModal = (banner) => {
        setEditingBanner(banner);

        setForm({
            title: banner.title || "",
            desktopImage: banner.desktopImage || "",
            mobileImage: banner.mobileImage || "",
            link: banner.link || "",
            status: banner.status || "draft",
            sortOrder: banner.sortOrder ?? 0,
        });

        resetFileInputs();

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
    // Desktop image URL
    // ─────────────────────────────────────────────

    const handleDesktopImageUrlChange = (e) => {
        setForm((prev) => ({
            ...prev,
            desktopImage: e.target.value,
        }));
    };

    // ─────────────────────────────────────────────
    // Mobile image URL
    // ─────────────────────────────────────────────

    const handleMobileImageUrlChange = (e) => {
        setForm((prev) => ({
            ...prev,
            mobileImage: e.target.value,
        }));
    };

    // ─────────────────────────────────────────────
    // Upload image
    // ─────────────────────────────────────────────

    const uploadImage = async (
        file,
        imageType
    ) => {
        if (!file) return;

        const isDesktop = imageType === "desktop";

        try {
            if (isDesktop) {
                setUploadingDesktop(true);
            } else {
                setUploadingMobile(true);
            }

            const token =
                sessionStorage.getItem("admin_jwt");

            if (!token) {
                window.location.href = "/admin/login";
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
                    "Image upload failed."
                );
            }

            const imageUrl = data?.data?.url;

            if (!imageUrl) {
                throw new Error(
                    "Cloudinary image URL was not returned."
                );
            }

            setForm((prev) => ({
                ...prev,
                [isDesktop
                    ? "desktopImage"
                    : "mobileImage"]: imageUrl,
            }));
        } catch (error) {
            console.error(
                "Category banner image upload error:",
                error
            );

            alert(
                error?.message ||
                "Failed to upload banner image."
            );
        } finally {
            if (isDesktop) {
                setUploadingDesktop(false);
            } else {
                setUploadingMobile(false);
            }
        }
    };

    // ─────────────────────────────────────────────
    // Save
    // ─────────────────────────────────────────────

    const handleSave = async () => {
        if (!form.title.trim()) {
            alert("Banner title is required.");
            return;
        }

        if (!form.desktopImage.trim()) {
            alert(
                "Please upload a desktop image or enter a desktop image URL."
            );
            return;
        }

        try {
            setSaving(true);

            const payload = {
                title: form.title.trim(),
                desktopImage: form.desktopImage.trim(),
                mobileImage:
                    form.mobileImage.trim() || null,
                link: form.link.trim() || null,
                status: form.status,
                sortOrder:
                    Number(form.sortOrder) || 0,
            };

            if (editingBanner) {
                await adminFetch(
                    `/admin/category-banners/${editingBanner._id}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(payload),
                    }
                );
            } else {
                await adminFetch(
                    "/admin/category-banners",
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
                "Category banner save error:",
                error
            );

            alert(
                error?.message ||
                "Failed to save category banner."
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
            `Delete "${banner.title}"?`
        );

        if (!confirmed) return;

        try {
            await adminFetch(
                `/admin/category-banners/${banner._id}`,
                {
                    method: "DELETE",
                }
            );

            await fetchBanners();
        } catch (error) {
            console.error(
                "Category banner delete error:",
                error
            );

            alert(
                error?.message ||
                "Failed to delete category banner."
            );
        }
    };

    return (
        <div className="mt-8">

            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        Category Banners
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage homepage category banners.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600"
                >
                    Add Banner
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="rounded-2xl border border-white/10 bg-[#181818] p-8 text-center text-sm text-gray-500">
                    Loading category banners...
                </div>
            )}

            {/* Empty */}
            {!loading && banners.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 bg-[#181818] p-10 text-center">
                    <p className="text-sm text-gray-400">
                        No category banners yet.
                    </p>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/5"
                    >
                        Create your first banner
                    </button>
                </div>
            )}

            {/* Banner list */}
            {!loading && banners.length > 0 && (
                <div className="space-y-3">
                    {banners.map((banner) => (
                        <div
                            key={banner._id}
                            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#181818] p-4 md:flex-row md:items-center"
                        >
                            {/* Desktop preview */}
                            <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-[#202020] md:w-40">
                                {banner.desktopImage && (
                                    <img
                                        src={banner.desktopImage}
                                        alt={banner.title}
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="truncate font-medium text-white">
                                        {banner.title}
                                    </h3>

                                    <span
                                        className={`rounded-full px-2 py-1 text-[11px] font-medium ${banner.status ===
                                                "published"
                                                ? "bg-emerald-500/10 text-emerald-400"
                                                : "bg-gray-500/10 text-gray-400"
                                            }`}
                                    >
                                        {banner.status ===
                                            "published"
                                            ? "Published"
                                            : "Draft"}
                                    </span>
                                </div>

                                <p className="mt-1 text-xs text-gray-500">
                                    Order: {banner.sortOrder}
                                </p>

                                <p className="mt-1 text-xs text-gray-600">
                                    {banner.mobileImage
                                        ? "Desktop + Mobile image"
                                        : "Desktop image only"}
                                </p>

                                {banner.link && (
                                    <p className="mt-1 truncate text-xs text-gray-600">
                                        {banner.link}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex shrink-0 gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        openEditModal(
                                            banner
                                        )
                                    }
                                    className="rounded-xl border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5"
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
                                    className="rounded-xl border border-red-500/20 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-2xl">

                        {/* Header */}
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-white">
                                    {editingBanner
                                        ? "Edit Category Banner"
                                        : "Add Category Banner"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Configure the homepage category banner.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setModalOpen(false)
                                }
                                className="text-gray-500 transition hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Desktop Image */}
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Desktop Image
                            </label>

                            {form.desktopImage && (
                                <div className="mb-3 overflow-hidden rounded-xl border border-white/10 bg-[#202020]">
                                    <img
                                        src={form.desktopImage}
                                        alt="Desktop banner preview"
                                        className="h-40 w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />
                                </div>
                            )}

                            <input
                                ref={desktopFileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                    uploadImage(
                                        e.target.files?.[0],
                                        "desktop"
                                    )
                                }
                            />

                            <button
                                type="button"
                                disabled={
                                    uploadingDesktop
                                }
                                onClick={() =>
                                    desktopFileInputRef.current?.click()
                                }
                                className="w-full rounded-xl border border-dashed border-white/10 bg-[#202020] px-4 py-4 text-sm text-gray-400 transition hover:border-indigo-500/40 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {uploadingDesktop
                                    ? "Uploading..."
                                    : form.desktopImage
                                        ? "Replace Desktop Image from PC"
                                        : "Choose Desktop Image from PC"}
                            </button>

                            <div className="my-4 flex items-center gap-3">
                                <div className="h-px flex-1 bg-white/10" />

                                <span className="text-xs text-gray-500">
                                    OR
                                </span>

                                <div className="h-px flex-1 bg-white/10" />
                            </div>

                            <input
                                type="url"
                                value={form.desktopImage}
                                onChange={
                                    handleDesktopImageUrlChange
                                }
                                placeholder="https://example.com/desktop-banner.jpg"
                                className="w-full rounded-xl border border-white/10 bg-[#202020] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-indigo-500/50"
                            />

                            <p className="mt-2 text-xs text-gray-600">
                                Desktop image is required.
                            </p>
                        </div>

                        {/* Mobile Image */}
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Mobile Image
                                <span className="ml-2 text-xs font-normal text-gray-600">
                                    Optional
                                </span>
                            </label>

                            {form.mobileImage && (
                                <div className="mb-3 overflow-hidden rounded-xl border border-white/10 bg-[#202020]">
                                    <img
                                        src={form.mobileImage}
                                        alt="Mobile banner preview"
                                        className="h-40 w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />
                                </div>
                            )}

                            <input
                                ref={mobileFileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                    uploadImage(
                                        e.target.files?.[0],
                                        "mobile"
                                    )
                                }
                            />

                            <button
                                type="button"
                                disabled={
                                    uploadingMobile
                                }
                                onClick={() =>
                                    mobileFileInputRef.current?.click()
                                }
                                className="w-full rounded-xl border border-dashed border-white/10 bg-[#202020] px-4 py-4 text-sm text-gray-400 transition hover:border-indigo-500/40 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {uploadingMobile
                                    ? "Uploading..."
                                    : form.mobileImage
                                        ? "Replace Mobile Image from PC"
                                        : "Choose Mobile Image from PC"}
                            </button>

                            <div className="my-4 flex items-center gap-3">
                                <div className="h-px flex-1 bg-white/10" />

                                <span className="text-xs text-gray-500">
                                    OR
                                </span>

                                <div className="h-px flex-1 bg-white/10" />
                            </div>

                            <input
                                type="url"
                                value={form.mobileImage}
                                onChange={
                                    handleMobileImageUrlChange
                                }
                                placeholder="https://example.com/mobile-banner.jpg"
                                className="w-full rounded-xl border border-white/10 bg-[#202020] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-indigo-500/50"
                            />

                            <p className="mt-2 text-xs text-gray-600">
                                If left empty, the desktop image will be used on mobile.
                            </p>
                        </div>

                        {/* Title */}
                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="PC Games"
                                className="w-full rounded-xl border border-white/10 bg-[#202020] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-indigo-500/50"
                            />
                        </div>

                        {/* Link */}
                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Link
                            </label>

                            <input
                                type="text"
                                name="link"
                                value={form.link}
                                onChange={handleChange}
                                placeholder="/category/pc-games"
                                className="w-full rounded-xl border border-white/10 bg-[#202020] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-indigo-500/50"
                            />
                        </div>

                        {/* Status + Sort */}
                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-white/10 bg-[#202020] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50"
                                >
                                    <option value="draft">
                                        Draft
                                    </option>

                                    <option value="published">
                                        Published
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Sort Order
                                </label>

                                <input
                                    type="number"
                                    name="sortOrder"
                                    value={form.sortOrder}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full rounded-xl border border-white/10 bg-[#202020] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() =>
                                    setModalOpen(false)
                                }
                                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={
                                    saving ||
                                    uploadingDesktop ||
                                    uploadingMobile
                                }
                                onClick={handleSave}
                                className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingBanner
                                        ? "Save Changes"
                                        : "Create Banner"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryBannerManager;