import Head from "next/head";
import SalesTodayCard from "@/components/dashboard/SalesTodayCard";
import SalesChart from "@/components/dashboard/SalesChart";
import OrderChart from "@/components/dashboard/OrderChart";
import RefundsChart from "@/components/dashboard/RefundsChart";
import CategorySales from "@/components/dashboard/CategorySales";
import Sales7DaysCard from "@/components/dashboard/Sales7DaysCard";
import ProfitCard from "@/components/dashboard/ProfitCard";
import ActiveOffersCard from "@/components/dashboard/ActiveOffersCard";
import ProductInventoryRow from "@/components/dashboard/ProductInventoryRow";
import InventoryCard from "@/components/dashboard/InventoryCard";
import { MdContentCopy, MdCached } from "react-icons/md";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useEffect, useState } from "react";
import GlassCard from "@/components/GlassCard";
import UploadKeysModal from "@/components/dashboard/UploadKeysModal";
import ViewKeysModal from "@/components/dashboard/ViewKeysModal";
import { FaSearch } from "react-icons/fa";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import Image from "next/image";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import adminFetch from "@/lib/adminFetch";
import { FiSettings } from "react-icons/fi";
import DeleteProductModal from "@/components/dashboard/DeleteProductModal";
import Link from "next/link";
import AddProductModal from "@/components/dashboard/AddProductModal";
import EditProductModal from "@/components/dashboard/EditProductModal";
import ClearCacheModal from "@/components/dashboard/ClearCacheModal";
import { HugeiconsIcon } from '@hugeicons/react';
import { Add02Icon, Wrench01Icon, Home01Icon } from '@hugeicons/core-free-icons';

import HeroBannerManager from "@/components/admin/HeroBannerManager";
import GameBannerManager from "@/components/admin/GameBannerManager";

const dashboard = () => {

    const [maintenanceOpen, setMaintenanceOpen] = useState(false);
    const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
    const [maintenanceMessage, setMaintenanceMessage] = useState("Keyzoo is currently undergoing scheduled maintenance.");
    const [maintenanceLoading, setMaintenanceLoading] = useState(false);
    const [homePageMenuOpen, setHomePageMenuOpen] = useState(false);
    const [homePageSection, setHomePageSection] = useState(null);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    const [products, setProducts] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [viewProduct, setViewProduct] = useState(null);
    const [viewKeys, setViewKeys] = useState([]);

    const [showSearch, setShowSearch] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [productCount, setProductCount] = useState(0);

    const [orders, setOrders] = useState([]); // paginated list
    const [dashboardOrders, setDashboardOrders] = useState([]); // all orders

    const [copiedValue, setCopiedValue] = useState("");   // handle copy to clipboard...

    const [inventoryExpanded, setInventoryExpanded] = useState(false);

    const [inventorySearch, setInventorySearch] = useState("");

    // Cache clearing state

    const [editProduct, setEditProduct] = useState(null);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showEditProductModal, setShowEditProductModal] = useState(false);

    const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState(null);

    const [showClearCacheModal, setShowClearCacheModal] = useState(false);
    const [clearingCache, setClearingCache] = useState(false);

    const parentRef = useRef(null);
    const inventorySearchRef = useRef(null);
    const orderSearchRef = useRef(null);

    // const visibleProducts = inventoryExpanded
    //     ? products
    //     : products.slice(0, 5);

    const filteredProducts = products.filter((product) => {

        const q = inventorySearch.toLowerCase();

        return (
            product.title?.toLowerCase().includes(q) ||
            product._id?.toLowerCase().includes(q) ||
            product.region?.toLowerCase().includes(q) ||
            product.card_region?.toLowerCase().includes(q) ||
            product.workPlatform?.toLowerCase().includes(q)
        );

    });

    const displayedProducts = inventoryExpanded
        ? filteredProducts
        : filteredProducts.slice(0, 5);

    // const rowVirtualizer = useVirtualizer({
    //     count: displayedProducts.length,
    //     getScrollElement: () => parentRef.current,
    //     estimateSize: () => 316, // approximate row height
    //     overscan: 8,
    // });

    const rowVirtualizer = useVirtualizer({
        count: displayedProducts.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 320,
        measureElement: (el) => el?.getBoundingClientRect().height ?? 320,
        overscan: 8,
    });

    const [inventory, setInventory] = useState({
        totalProducts: 0,
        totalKeys: 0,
        lowStock: 0,
        outOfStock: 0,
        alerts: [],
    });

    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchMaintenanceStatus = async () => {
        try {
            setMaintenanceLoading(true);

            const response = await adminFetch(
                "/maintenance/status"
            );

            const maintenance = response?.data;

            setMaintenanceEnabled(
                maintenance?.enabled === true
            );

            setMaintenanceMessage(
                maintenance?.message ||
                "Keyzoo is currently undergoing scheduled maintenance."
            );
        } catch (error) {
            console.error(
                "Failed to fetch maintenance status:",
                error
            );

            alert(
                error?.message ||
                "Failed to fetch maintenance status."
            );
        } finally {
            setMaintenanceLoading(false);
        }
    };

    const fetchOrders = async () => {

        try {

            const params = new URLSearchParams({
                page,
                pageSize: 10,
                search,
                status,
            });

            const data = await adminFetch(
                `/admin/orders?${params.toString()}`
            );

            setOrders(data.data || []);
            setTotalPages(data.meta?.pagination?.pageCount || 1);

        } catch (err) {

            console.error(err);

        }

    };

    const fetchProductsCount = async () => {

        const data = await adminFetch("/admin/products-count");

        setProductCount(data.total || 0);
    };

    const fetchDashboardStats = async () => {

        // const token = localStorage.getItem("jwt");

        // const res = await fetch(
        //     `${STRAPI_URL}api/orders?pagination[pageSize]=5000`,  // if need use 5 insted of 10
        //     {
        //         headers: {
        //             Authorization: `Bearer ${token}`,
        //         },
        //     }
        // );

        const data = await adminFetch("/admin/dashboard");

        setDashboardOrders(data.data || []);
        // setDashboardStats(data.stats);  
        // setDashboardOrders(data.orders);
    };

    useEffect(() => {
        fetchOrders();
    }, [page, search, status]);

    useEffect(() => {
        fetchDashboardStats();
        fetchProductsCount();
        fetchInventory();

        const interval = setInterval(() => {
            fetchDashboardStats();
            fetchInventory();
        }, 60000);

        return () => clearInterval(interval);
    }, []);


    const handleOpenMaintenance = async () => {
        await fetchMaintenanceStatus();
        setMaintenanceOpen(true);
    };

    const handleAdminLogout = () => {
        sessionStorage.removeItem("admin_jwt");

        window.location.href = "/admin/login";
    };

    const handleSaveMaintenance = async () => {
        try {
            setMaintenanceLoading(true);

            const response = await adminFetch(
                "/maintenance/status",
                {
                    method: "PUT",
                    body: JSON.stringify({
                        enabled: maintenanceEnabled,
                        message: maintenanceMessage.trim(),
                    }),
                }
            );

            const maintenance = response?.data;

            setMaintenanceEnabled(
                maintenance?.enabled === true
            );

            setMaintenanceMessage(
                maintenance?.message ||
                "Keyzoo is currently undergoing scheduled maintenance."
            );

            setMaintenanceOpen(false);

        } catch (error) {
            console.error(
                "Failed to update maintenance mode:",
                error
            );

            alert(
                error?.message ||
                "Failed to update maintenance mode."
            );
        } finally {
            setMaintenanceLoading(false);
        }
    };

    const handleSendKeys = async (orderId) => {

        try {

            setLoadingId(orderId);

            await adminFetch("/api/admin/manual-send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderId,
                }),
            });

            await fetchOrders();
            await fetchDashboardStats();

        } catch (err) {

            alert(err.message);

        } finally {

            setLoadingId(null);

        }

    };

    const handleResend = async (orderId) => {

        await adminFetch("/api/admin/resend-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderId,
            }),
        });
    };

    const handleDelete = async (orderId) => {

        await adminFetch("/api/admin/delete-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId }),
        });

        await fetchOrders();
        await fetchDashboardStats();

    };

    const handleClearFullCache = async () => {

        try {

            setClearingCache(true);

            const data = await adminFetch(
                "/api/admin/cache/clear",
                {
                    method: "POST",
                }
            );

            console.log("Cache cleared:", data);

            setShowClearCacheModal(false);

        } catch (error) {

            console.error("Cache clear error:", error);

            alert(
                error.message || "Failed to clear cache"
            );

        } finally {

            setClearingCache(false);

        }

    };

    const handleToggleVisibility = async (product) => {
        try {
            const isCurrentlyLive =
                product.status === "published";

            const newStatus =
                isCurrentlyLive
                    ? "draft"
                    : "published";

            const endpoint =
                product.type === "gift-card"
                    ? `/admin/gift-cards/${product._id}`
                    : `/admin/products/${product._id}`;

            await adminFetch(endpoint, {
                method: "PUT",
                body: JSON.stringify({
                    status: newStatus,
                }),
            });

            await fetchInventory();
        } catch (error) {
            console.error(
                "Toggle visibility error:",
                error
            );

            alert(
                error?.message ||
                "Failed to change product visibility."
            );
        }
    };

    const stats = {
        total: dashboardOrders.length,
        pending: dashboardOrders.filter(o => o.deliveryStatus === "pending").length,
        partial: dashboardOrders.filter(o => o.deliveryStatus === "partial").length,
        completed: dashboardOrders.filter(o => o.deliveryStatus === "completed").length,
        manual: dashboardOrders.filter(o => o.manualDeliveryRequired).length,
    };

    const salesToday = dashboardOrders
        .filter((order) => {
            const today = new Date().toLocaleDateString("en-IN");

            return (
                order.paymentStatus === "paid" &&
                new Date(order.createdAt).toLocaleDateString("en-IN") === today
            );
        })
        .reduce(
            (sum, order) => sum + (order.totalAmount || 0),
            0
        );

    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() - 7
    );

    const sales7Days = dashboardOrders
        .filter(
            (order) =>
                order.paymentStatus === "paid" &&
                new Date(order.createdAt) >= sevenDaysAgo
        )
        .reduce(
            (sum, order) =>
                sum + (order.totalAmount || 0),
            0
        );

    // const totalRevenue = orders
    //     .filter(
    //         (o) => o.paymentStatus === "paid"
    //     )
    //     .reduce(
    //         (sum, o) =>
    //             sum + (o.totalAmount || 0),
    //         0
    //     );

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyRevenue = dashboardOrders
        .filter((o) => {
            const date = new Date(o.createdAt);

            return (
                o.paymentStatus === "paid" &&
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear
            );
        })
        .reduce(
            (sum, o) => sum + (o.totalAmount || 0),
            0
        );

    const getPages = () => {
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= page - 1 && i <= page + 1)
            ) {
                pages.push(i);
            } else if (
                i === page - 2 ||
                i === page + 2
            ) {
                pages.push("...");
            }
        }

        return [...new Set(pages)];
    };

    const copyToClipboard = async (value) => {
        try {
            await navigator.clipboard.writeText(value);

            setCopiedValue(value);

            setTimeout(() => {
                setCopiedValue("");
            }, 2000);
        } catch (err) {
            console.error(err);
        }
    };

    // const fetchInventory = async () => {
    //     const res = await fetch(
    //         "/api/admin/inventory"
    //     );

    //     const data = await res.json();

    //     setInventory(data);
    // };

    const fetchInventory = async () => {

        // const token = localStorage.getItem("jwt");

        // const res = await fetch("/api/admin/inventory", {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        // });

        const data = await adminFetch("/admin/inventory");

        setInventory({
            totalProducts: data.totalProducts,
            totalKeys: data.totalKeys,
            lowStock: data.lowStock,
            outOfStock: data.outOfStock,
        });

        setProducts(data.products || []);
    };

    // const fetchInventory = async () => {
    //     const res = await fetch("/api/admin/inventory");

    //     const data = await res.json();

    //     setInventory({
    //         totalProducts: data.totalProducts,
    //         totalKeys: data.totalKeys,
    //         lowStock: data.lowStock,
    //         outOfStock: data.outOfStock,
    //         alerts: data.alerts,
    //     });

    //     setProducts(data.products || []);
    // };

    const handleViewKeys = async (product) => {
        try {
            setViewProduct(product);

            const query =
                product.type === "gift-card"
                    ? `giftCardId=${product._id}`
                    : `productId=${product._id}`;

            const data = await adminFetch(
                `/admin/game-keys?${query}`
            );

            setViewKeys(data?.data || []);
        } catch (error) {
            console.error(
                "Failed to fetch game keys:",
                error
            );

            setViewKeys([]);
        }
    };

    // const exportOrders = () => {
    //     window.open(
    //         "/api/admin/export-orders",
    //         "_blank"
    //     );
    // };

    const handleExport = async () => {

        const token = localStorage.getItem("jwt");

        const response = await fetch("/api/admin/export-orders", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = `orders-${Date.now()}.csv`;

        document.body.appendChild(a);

        a.click();

        a.remove();

        window.URL.revokeObjectURL(url);

    };

    useEffect(() => {

        const handleKeyDown = (e) => {

            // Ctrl + K
            if (e.ctrlKey && e.key.toLowerCase() === "k") {
                e.preventDefault();
                inventorySearchRef.current?.focus();
            }

            // Ctrl + Shift + F
            if (
                e.ctrlKey &&
                e.shiftKey &&
                e.key.toLowerCase() === "f"
            ) {
                e.preventDefault();
                setShowSearch(true);

                setTimeout(() => {
                    orderSearchRef.current?.focus();
                }, 0);
            }

            // /
            if (
                e.key === "/" &&
                document.activeElement.tagName !== "INPUT"
            ) {
                e.preventDefault();
                inventorySearchRef.current?.focus();
            }

            // ESC
            if (e.key === "Escape") {

                setInventorySearch("");
                setSearch("");

                inventorySearchRef.current?.blur();
                orderSearchRef.current?.blur();

                setSelectedProduct(null);
                setViewProduct(null);
                setSelectedOrder(null);

                setEditProduct(null);
                setShowEditProductModal(false);
            }

            // Ctrl + I
            if (
                e.ctrlKey &&
                e.key.toLowerCase() === "i"
            ) {
                e.preventDefault();
                setInventoryExpanded(prev => !prev);
            }

            // Ctrl + E
            if (
                e.ctrlKey &&
                e.key.toLowerCase() === "e"
            ) {
                e.preventDefault();
                handleExport();
            }

            // Ctrl + R
            if (
                e.ctrlKey &&
                e.key.toLowerCase() === "r"
            ) {
                e.preventDefault();
                fetchInventory();
            }

            // Next page
            if (e.key === "ArrowRight") {
                setPage(p => Math.min(totalPages, p + 1));
            }

            // Previous page
            if (e.key === "ArrowLeft") {
                setPage(p => Math.max(1, p - 1));
            }

        };

        window.addEventListener("keydown", handleKeyDown);

        return () =>
            window.removeEventListener("keydown", handleKeyDown);

    }, [totalPages]);

    return (
        <>
            <Head>
                <title>Keyzoo Analytics</title>
            </Head>

            <div className="min-h-screen p-6">
                <div className="max-w-[1700px] mx-auto px-8 space-y-6">

                    {/* <div className="mb-6">
                            <h1 className="text-4xl font-bold text-white">
                                Welcome back, Nippan 👋
                            </h1>

                            <p className="text-gray-400 mt-2">
                                Here's what's happening with your store today.
                            </p>
                        </div> */}

                    <div className="mb-6 flex items-start justify-between">

                        <div>
                            <h1 className="text-4xl font-bold text-white">
                                Welcome back, Nippan 👋
                            </h1>

                            <p className="mt-2 text-gray-400">
                                Here's what's happening with your store today.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">

                            <button
                                type="button"
                                onClick={() => setShowAddProductModal(true)}
                                className="
        group
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-2xl
        border
        border-white/10
        bg-[#1d1d1d]
        text-gray-400
        transition-all
        duration-200
        hover:border-indigo-500/40
        hover:bg-indigo-500/10
        hover:text-indigo-400
    "
                                title="Add Product"
                            >
                                <HugeiconsIcon
                                    icon={Add02Icon}
                                    className="transition-transform duration-300 group-hover:rotate-90"
                                />
                            </button>

                            <button
                                onClick={handleOpenMaintenance}
                                type="button"
                                className="
        group
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-2xl
        border
        border-white/10
        bg-[#1d1d1d]
        text-gray-400
        transition-all
        duration-200
        hover:border-indigo-500/40
        hover:bg-indigo-500/10
        hover:text-indigo-400
    "
                                title="Maintenance mode"
                            >
                                <HugeiconsIcon
                                    icon={Wrench01Icon}
                                    className="transition-transform duration-300 group-hover:rotate-90"
                                />
                            </button>

                            {maintenanceOpen && (
                                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-2xl">

                                        <div className="mb-6">
                                            <h2 className="text-xl font-semibold text-white">
                                                Maintenance Mode
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-400">
                                                Control storefront maintenance mode.
                                            </p>
                                        </div>

                                        <div className="mb-5 flex items-center justify-between rounded-xl border border-white/10 bg-[#202020] p-4">
                                            <div>
                                                <p className="font-medium text-white">
                                                    Maintenance Mode
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    {maintenanceEnabled
                                                        ? "Storefront is currently offline."
                                                        : "Storefront is currently online."}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setMaintenanceEnabled(
                                                        !maintenanceEnabled
                                                    )
                                                }
                                                className={`relative h-6 w-11 rounded-full transition ${maintenanceEnabled
                                                    ? "bg-indigo-500"
                                                    : "bg-gray-700"
                                                    }`}
                                            >
                                                <span
                                                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${maintenanceEnabled
                                                        ? "left-6"
                                                        : "left-1"
                                                        }`}
                                                />
                                            </button>
                                        </div>

                                        <div className="mb-6">
                                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                                Maintenance message
                                            </label>

                                            <textarea
                                                value={maintenanceMessage}
                                                onChange={(e) =>
                                                    setMaintenanceMessage(
                                                        e.target.value
                                                    )
                                                }
                                                rows={4}
                                                className="w-full resize-none rounded-xl border border-white/10 bg-[#202020] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-indigo-500/50"
                                                placeholder="Enter maintenance message..."
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setMaintenanceOpen(false)
                                                }
                                                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5"
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleSaveMaintenance}
                                                disabled={maintenanceLoading}
                                                className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {maintenanceLoading
                                                    ? "Saving..."
                                                    : "Save Changes"}
                                            </button>

                                        </div>

                                    </div>
                                </div>
                            )}

                            <div className="relative">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setHomePageMenuOpen((prev) => !prev)
                                    }
                                    className="
            group
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-white/10
            bg-[#1d1d1d]
            text-gray-400
            transition-all
            duration-200
            hover:border-indigo-500/40
            hover:bg-indigo-500/10
            hover:text-indigo-400
        "
                                    title="Home Page"
                                >
                                    <HugeiconsIcon
                                        icon={Home01Icon}
                                        className="transition-transform duration-300 group-hover:scale-110"
                                    />
                                </button>

                                {homePageMenuOpen && (
                                    <div
                                        className="
                absolute
                right-0
                top-[calc(100%+10px)]
                z-[1000]
                w-56
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-[#181818]
                p-2
                shadow-2xl
                shadow-black/40
            "
                                    >

                                        {/* Header */}
                                        <div className="px-3 py-2">
                                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Home Page
                                            </p>
                                        </div>

                                        {/* Hero Banners */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setHomePageMenuOpen(false);
                                                setHomePageSection("hero-banners");
                                            }}
                                            className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    text-gray-300
                    transition
                    hover:bg-white/5
                    hover:text-white
                "
                                        >
                                            <span>Hero Banners</span>

                                            <span className="text-gray-600">
                                                →
                                            </span>
                                        </button>

                                        {/* Game Banners */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setHomePageMenuOpen(false);
                                                setHomePageSection("game-banners");
                                            }}
                                            className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    text-gray-300
                    transition
                    hover:bg-white/5
                    hover:text-white
                "
                                        >
                                            <span>Game Banners</span>

                                            <span className="text-gray-600">
                                                →
                                            </span>
                                        </button>

                                        {/* Category Banners */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setHomePageMenuOpen(false);
                                                console.log("Category Banners");
                                            }}
                                            className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    text-gray-300
                    transition
                    hover:bg-white/5
                    hover:text-white
                "
                                        >
                                            <span>Category Banners</span>

                                            <span className="text-gray-600">
                                                →
                                            </span>
                                        </button>

                                        {/* Promo Banners */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setHomePageMenuOpen(false);
                                                console.log("Promo Banners");
                                            }}
                                            className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    text-gray-300
                    transition
                    hover:bg-white/5
                    hover:text-white
                "
                                        >
                                            <span>Promo Banners</span>

                                            <span className="text-gray-600">
                                                →
                                            </span>
                                        </button>

                                    </div>
                                )}

                            </div>

                            <span
                                onClick={() => setShowClearCacheModal(true)}
                                className="
        group
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-2xl
        border
        border-white/10
        bg-[#1d1d1d]
        text-gray-400
        transition-all
        duration-200
        hover:border-indigo-500/40
        hover:bg-indigo-500/10
        hover:text-indigo-400
    "
                                title="Clear Cache"
                            >
                                <MdCached
                                    size={30}
                                    className="transition-transform duration-300 group-hover:rotate-90"
                                />
                            </span>

                            <Link
                                href="/admin/settings"
                                className="
            group
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-white/10
            bg-[#1d1d1d]
            text-gray-400
            transition-all
            duration-200
            hover:border-indigo-500/40
            hover:bg-indigo-500/10
            hover:text-indigo-400
        "
                                title="Settings"
                            >
                                <FiSettings
                                    size={22}
                                    className="transition-transform duration-300 group-hover:rotate-90"
                                />
                            </Link>

                            <button
                                type="button"
                                onClick={() => setLogoutModalOpen(true)}
                                className="
        group
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-2xl
        border
        border-white/10
        bg-[#1d1d1d]
        text-gray-400
        transition-all
        duration-200
        hover:border-red-500/40
        hover:bg-red-500/10
        hover:text-red-400
    "
                                title="Logout"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5"
                                >
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <path d="M16 17l5-5-5-5" />
                                    <path d="M21 12H9" />
                                </svg>
                            </button>

                            {logoutModalOpen && (
                                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                                    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-2xl">

                                        {/* Icon */}
                                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-6 w-6"
                                            >
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                <path d="M16 17l5-5-5-5" />
                                                <path d="M21 12H9" />
                                            </svg>
                                        </div>

                                        {/* Content */}
                                        <h2 className="text-xl font-semibold text-white">
                                            Logout?
                                        </h2>

                                        <p className="mt-2 text-sm leading-6 text-gray-400">
                                            Are you sure you want to logout from the admin
                                            dashboard?
                                        </p>

                                        {/* Buttons */}
                                        <div className="mt-6 flex justify-end gap-3">

                                            <button
                                                type="button"
                                                onClick={() => setLogoutModalOpen(false)}
                                                className="
                        rounded-xl
                        border
                        border-white/10
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-gray-300
                        transition
                        hover:bg-white/5
                    "
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleAdminLogout}
                                                className="
                        rounded-xl
                        bg-red-500
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-red-600
                    "
                                            >
                                                Logout
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* <MetricCards /> */}
                    <div className="grid grid-cols-12 gap-5">

                        <div className="col-span-12 md:col-span-4 xl:col-span-3">
                            <InventoryCard
                                title="Available Keys"
                                value={inventory.totalKeys}
                                color="green"
                            />

                        </div>

                        <div className="col-span-12 md:col-span-4 xl:col-span-3">
                            <InventoryCard
                                title="Low Stock"
                                value={inventory.lowStock}
                                color="yellow"
                            />
                        </div>

                        <div className="col-span-12 md:col-span-4 xl:col-span-3">
                            <InventoryCard
                                title="Out Of Stock"
                                value={inventory.outOfStock}
                                color="red"
                            />
                        </div>

                        <div className="col-span-12 md:col-span-4 xl:col-span-3">
                            <InventoryCard
                                title="Products Tracked"
                                value={inventory.totalProducts}
                                color="blue"
                            />
                        </div>

                        <div className="col-span-12">
                            {/* <InventoryAlerts /> */}
                        </div>

                        <div className="col-span-12">

                            {/* Product Featch */}
                            <div className="rounded-2xl border border-[#23262d] bg-[#1b1b1b] p-6">

                                <div className="flex items-center justify-between mb-6">

                                    <div>
                                        <h2 className="text-xl font-semibold text-white">
                                            Product Inventory
                                        </h2>

                                        <p className="text-sm text-gray-400 mt-1">
                                            {products.length} products
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">

                                        <div className="flex flex-col">

                                            <div className="relative">

                                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />

                                                <input
                                                    ref={inventorySearchRef}
                                                    type="text"
                                                    placeholder="Search products..."
                                                    value={inventorySearch}
                                                    onChange={(e) => setInventorySearch(e.target.value)}
                                                    className="
                w-[360px]
                h-12
                pl-11
                pr-20
                rounded-xl
                bg-[#232323]
                border border-[#32343a]
                text-white
                placeholder:text-gray-500
                transition-all
                duration-200
                outline-none
                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-500/20
            "
                                                />

                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <kbd className="rounded-md border border-[#3a3a3a] bg-[#191919] px-2 py-1 text-[10px] text-gray-400">
                                                        Ctrl K
                                                    </kbd>
                                                </div>

                                            </div>

                                            {/* <p className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                                                <span>Press</span>

                                                <kbd className="rounded border border-[#3a3a3a] bg-[#1b1b1b] px-1.5 py-0.5 text-[10px]">
                                                    Ctrl
                                                </kbd>

                                                <span>+</span>

                                                <kbd className="rounded border border-[#3a3a3a] bg-[#1b1b1b] px-1.5 py-0.5 text-[10px]">
                                                    K
                                                </kbd>

                                                <span>to search products instantly</span>
                                            </p> */}

                                        </div>

                                        {products.length > 5 && (

                                            <button
                                                onClick={() => setInventoryExpanded(!inventoryExpanded)}
                                                // className="flex items-center gap-2 rounded-lg border border-[#2b2b2b] bg-[#232323] px-4 py-2 hover:bg-[#2d2d2d]"
                                                className="
h-12
px-5
rounded-xl
border
border-[#2b2b2b]
bg-[#232323]
hover:bg-[#2d2d2d]
transition-all
duration-200
font-medium
flex
items-center
gap-2
shadow-lg
"
                                            >
                                                {inventoryExpanded ? (
                                                    <>
                                                        <FiChevronUp />
                                                        Collapse
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiChevronDown />
                                                        View All ({filteredProducts.length})
                                                    </>
                                                )}
                                            </button>

                                        )}

                                    </div>

                                </div>

                                {/* <div
                                    className={`space-y-4 ${inventoryExpanded
                                        ? "max-h-[70vh] overflow-y-auto pr-2"
                                        : ""
                                        }`}
                                >
                                    <div className="space-y-4">
                                        {visibleProducts.map((product) => (
                                            <ProductInventoryRow
                                                key={product.documentId || product.id}
                                                product={product}
                                                onUpload={() => setSelectedProduct(product)}
                                                onView={() => handleViewKeys(product)}
                                            />
                                        ))}

                                    </div>
                                </div> */}

                                {inventoryExpanded ? (
                                    <div
                                        ref={parentRef}
                                        className="max-h-[70vh] overflow-y-auto scroll-smooth pr-2"
                                    >
                                        <div
                                            style={{
                                                height: `${rowVirtualizer.getTotalSize()}px`,
                                                width: "100%",
                                                position: "relative",
                                            }}
                                        >
                                            {rowVirtualizer.getVirtualItems().map((virtualRow) => {

                                                const product = displayedProducts[virtualRow.index];

                                                return (
                                                    <div
                                                        key={product._id}
                                                        ref={rowVirtualizer.measureElement}
                                                        data-index={virtualRow.index}
                                                        className="pb-4"
                                                        style={{
                                                            position: "absolute",
                                                            top: 0,
                                                            left: 0,
                                                            width: "100%",
                                                            transform: `translateY(${virtualRow.start}px)`,
                                                        }}
                                                    >
                                                        <ProductInventoryRow
                                                            product={product}
                                                            onUpload={() => setSelectedProduct(product)}
                                                            onView={() => handleViewKeys(product)}
                                                            onEdit={() => {
                                                                setEditProduct(product);
                                                                setShowEditProductModal(true);
                                                            }}
                                                            onDelete={() => {
                                                                setDeleteProduct(product);
                                                                setShowDeleteProductModal(true);
                                                            }}
                                                            onToggleVisibility={() =>
                                                                handleToggleVisibility(product)
                                                            }
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {displayedProducts.map((product) => (
                                            <ProductInventoryRow
                                                key={product._id}
                                                product={product}
                                                onUpload={() => setSelectedProduct(product)}
                                                onView={() => handleViewKeys(product)}
                                                onEdit={() => {
                                                    setEditProduct(product);
                                                    setShowEditProductModal(true);
                                                }}
                                                onDelete={() => {
                                                    setDeleteProduct(product);
                                                    setShowDeleteProductModal(true);
                                                }}
                                                onToggleVisibility={() => handleToggleVisibility(product)}
                                            />
                                        ))}
                                    </div>
                                )}

                                {selectedProduct && (
                                    <UploadKeysModal
                                        product={selectedProduct}
                                        onClose={() => setSelectedProduct(null)}
                                        onUpload={async () => {
                                            await fetchInventory();
                                        }}
                                    />
                                )}

                                {viewProduct && (

                                    <ViewKeysModal
                                        product={viewProduct}
                                        keys={viewKeys}
                                        onClose={() => {
                                            setViewProduct(null);
                                            setViewKeys([]);
                                        }}
                                        onDelete={(updatedKeys) => {

                                            setViewKeys(updatedKeys);

                                            // Update the inventory card
                                            setProducts(prev =>
                                                prev.map(item => {

                                                    if (item._id !== viewProduct._id) {
                                                        return item;
                                                    }

                                                    const availableKeys =
                                                        updatedKeys.filter(k => k.isAvailable).length;

                                                    const soldKeys =
                                                        updatedKeys.length - availableKeys;

                                                    return {
                                                        ...item,
                                                        availableKeys,
                                                        soldKeys,
                                                    };

                                                })
                                            );

                                        }}

                                    />

                                )}

                            </div>

                        </div>

                        {/* <div className="grid grid-cols-12 gap-5"> */}

                        {/* Top Row */}
                        <div className="col-span-12 md:col-span-6 xl:col-span-3">
                            <SalesTodayCard amount={salesToday} />
                        </div>

                        <div className="col-span-12 md:col-span-6 xl:col-span-3">
                            <Sales7DaysCard amount={sales7Days} />
                        </div>

                        <div className="col-span-12 md:col-span-6 xl:col-span-3">
                            <ProfitCard amount={monthlyRevenue} />
                        </div>

                        <div className="col-span-12 md:col-span-6 xl:col-span-3">
                            <ActiveOffersCard amount={productCount} />
                        </div>

                        {/* Middle Row */}
                        <div className="col-span-12 lg:col-span-8">
                            <SalesChart />
                        </div>

                        <div className="col-span-12 lg:col-span-4 space-y-5">
                            <CategorySales />
                            {/* <InventoryAlerts /> */}
                        </div>

                        {/* <div className="col-span-12 lg:col-span-4">
                            <WithdrawCard />
                        </div> */}

                        {/* Bottom Row */}
                        {/* <div className="col-span-12">
                            <RecentSalesTable />
                        </div> */}

                        <div className="col-span-12 md:col-span-12 space-y-4">
                            <OrderChart />
                            <RefundsChart />
                        </div>

                        {/* Order Section Start Here... */}

                        <div className="col-span-12 md:col-span-12">
                            <div className="bg-[#1d1d1d] rounded-xl border border-white/5 text-white">
                                <div className="p-4">

                                    {/* HEADER + SEARCH */} {/* and this is work for large screens */}
                                    <div className="bg-white/5 rounded-xl px-4 py-3 flex items-center gap-4 relative overflow-hidden">

                                        {/* LEFT (fixed) */}
                                        <span className="text-lg sm:text-xl shrink-0">
                                            <Image src="https://res.cloudinary.com/dblttl9bh/image/upload/v1778325665/Chat_GPT_Image_May_9_2026_04_48_26_PM_1_113ae62610.png" alt="Logo" width={120} height={100} />
                                        </span>

                                        {/* RIGHT (flexible) */}
                                        <div className="flex items-center gap-2 flex-1 justify-end">

                                            {/* SEARCH */}
                                            <div className={`hidden lg:flex items-center gap-2 transition-all duration-300 ease-in-out ${showSearch ? "flex-1 opacity-100" : "w-0 opacity-0 overflow-hidden"}`}>
                                                <input
                                                    // ref={inventorySearchRef}
                                                    ref={orderSearchRef}
                                                    value={search}
                                                    onChange={(e) => {
                                                        setPage(1);
                                                        setSearch(e.target.value);
                                                    }}
                                                    placeholder="Search..."
                                                    className="flex-1 h-[38px] bg-[#1a1a1a] px-3 rounded-lg outline-none text-sm"
                                                />

                                                {/* FILTERS */}
                                                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                                    {["completed", "partial", "pending", "manual"].map((item) => (
                                                        <button
                                                            key={item}
                                                            onClick={() => {
                                                                setPage(1);
                                                                setStatus(item);
                                                            }}
                                                            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${status === item
                                                                ? "bg-white text-black"
                                                                : "bg-white/5"
                                                                }`}
                                                        >
                                                            {item}
                                                        </button>
                                                    ))}
                                                </div>

                                            </div>

                                            {/* TOGGLE */}
                                            <button
                                                onClick={() => setShowSearch(prev => !prev)}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/20 transition shrink-0"
                                            >
                                                <FaSearch />
                                            </button>

                                        </div>

                                    </div>

                                    {/* this block work on small screens after tap search icon */}
                                    {/* MOBILE SEARCH (ONLY < lg) */}
                                    {showSearch && (
                                        <div className="lg:hidden bg-white/5 rounded-xl p-4 flex flex-col gap-3 mt-3">

                                            <input
                                                value={search}
                                                onChange={(e) => {
                                                    setPage(1);
                                                    setSearch(e.target.value);
                                                }}
                                                placeholder="Search Order Number..."
                                                className="w-full h-[45px] bg-[#2a2a2a] px-4 rounded-lg outline-none"
                                            />

                                            <div className="flex flex-wrap gap-2">
                                                {["completed", "partial", "pending", "manual"].map((item) => (
                                                    <button
                                                        key={item}
                                                        onClick={() => {
                                                            setPage(1);
                                                            setStatus(item);
                                                        }}
                                                        className={`px-3 py-1 rounded-full text-xs ${status === item
                                                            ? "bg-white text-black"
                                                            : "bg-white/5"
                                                            }`}
                                                    >
                                                        {item}
                                                    </button>
                                                ))}
                                            </div>

                                        </div>
                                    )}

                                    {/* STATS */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6 mb-6">
                                        <GlassCard title="Total" value={stats.total} />
                                        <GlassCard title="Pending" value={stats.pending} />
                                        <GlassCard title="Partial" value={stats.partial} />
                                        <GlassCard title="Completed" value={stats.completed} />
                                        <GlassCard title="Manual" value={stats.manual} />
                                    </div>

                                    {/* ORDERS */}
                                    <div className="flex flex-col gap-4">
                                        {orders.map((order) => {

                                            const assigned = order.totalKeysAssigned || 0;
                                            const required = order.totalKeysRequired || 0;

                                            const percentage =
                                                required > 0
                                                    ? Math.round((assigned / required) * 100)
                                                    : 0;

                                            const progressColor =
                                                order.deliveryStatus === "completed"
                                                    ? "bg-green-500"
                                                    : order.deliveryStatus === "partial"
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500";
                                            return (
                                                <div key={order.id} className="bg-white/[0.03] border border-white/5 rounded-xl p-6">

                                                    <div className="flex flex-col md:flex-row md:justify-between gap-3">

                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-500 text-xs uppercase tracking-wider">
                                                                    Order ID
                                                                </span>
                                                                <h2 className="text-sm sm:text-base font-semibold cursor-pointer" onClick={() => copyToClipboard(order.orderNumber)}>
                                                                    {order.orderNumber}
                                                                </h2>

                                                                <button
                                                                    onClick={() => copyToClipboard(order.orderNumber)}
                                                                    className="text-gray-400 hover:text-white transition"
                                                                    title="Copy Order Number"
                                                                >
                                                                    <MdContentCopy className="text-lg cursor-pointer" />
                                                                </button>

                                                                {copiedValue === order.orderNumber && (
                                                                    <span className="text-green-400 text-xs">
                                                                        Copied
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-500 text-xs uppercase tracking-wider">
                                                                    Order Email
                                                                </span>
                                                                <p className="text-md sm:text-sm text-gray-300 break-all cursor-pointer" onClick={() => copyToClipboard(order.deliveryEmail)}>
                                                                    {order.deliveryEmail}
                                                                </p>

                                                                <button
                                                                    onClick={() => copyToClipboard(order.deliveryEmail)}
                                                                    className="text-gray-400 hover:text-white transition"
                                                                    title="Copy Email"
                                                                >
                                                                    <MdContentCopy className="text-lg cursor-pointer" />
                                                                </button>

                                                                {copiedValue === order.deliveryEmail && (
                                                                    <span className="text-green-400 text-xs">
                                                                        Copied
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-5 items-center">
                                                            {order.manualDeliveryRequired && (
                                                                // <span className="text-orange-400 text-md font-semibold">
                                                                //     ⚠ Needs Attention
                                                                // </span>
                                                                <span className="px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-sm font-medium">
                                                                    ⚠ Manual
                                                                </span>
                                                            )}

                                                            <span className={`py-1 px-2 rounded text-md capitalize ${order.deliveryStatus === "completed" ? "bg-green-500/15 text-green-400" : order.deliveryStatus === "partial" ? "bg-yellow-500/15 text-yellow-400" : "bg-red-500/15 text-red-400"}`}>
                                                                {order.deliveryStatus}
                                                            </span>
                                                        </div>

                                                    </div>

                                                    {/* <div className="mt-3 text-sm">
                                                        {order.totalKeysAssigned || 0} / {order.totalKeysRequired || 0}
                                                    </div> */}

                                                    <div className="mt-4">
                                                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                                                            <span>Delivery Progress</span>
                                                            <span>{percentage}%</span>
                                                        </div>

                                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all duration-500 ${progressColor}`}
                                                                style={{
                                                                    width: `${percentage}%`,
                                                                }}
                                                            />

                                                        </div>


                                                        <div className="text-xs text-gray-400 mt-2">
                                                            {assigned} of {required} keys delivered
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2.5 mt-4 text-sm">

                                                        {order.deliveryStatus !== "completed" && (
                                                            <button
                                                                onClick={() => handleSendKeys(order.id)}
                                                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                                                            >
                                                                Send Keys
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                                        >
                                                            Details
                                                        </button>

                                                        <button
                                                            onClick={() => handleResend(order.id)}
                                                            className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded"
                                                        >
                                                            Resend Key
                                                        </button>

                                                        <button
                                                            onClick={handleExport}
                                                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                                                        >
                                                            Export Orders CSV
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(order.id)}
                                                            className="bg-red-500/20 hover:bg-red-500/40 text-red-400 py-2 px-4 rounded"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* PAGINATION */}
                                    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">

                                        {/* PREV */}
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="px-1.5 py-1.5 rounded bg-white/5 disabled:opacity-40"
                                        >
                                            {/* {"<"} */}
                                            <MdOutlineKeyboardArrowLeft className="text-2xl" />
                                        </button>

                                        {/* PAGE NUMBERS */}
                                        {getPages().map((p, i) => (
                                            <button
                                                key={i}
                                                onClick={() => typeof p === "number" && setPage(p)}
                                                disabled={p === "..."}
                                                className={`px-3 py-1 rounded ${page === p
                                                    ? "bg-white text-black"
                                                    : "bg-white/5"
                                                    } ${p === "..." ? "cursor-default" : ""}`}
                                            >
                                                {p}
                                            </button>
                                        ))}

                                        {/* NEXT */}
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="px-1.5 py-1.5 rounded bg-white/5 disabled:opacity-40"
                                        >
                                            {/* {">"} */}
                                            <MdOutlineKeyboardArrowRight className="text-2xl" />
                                        </button>

                                    </div>

                                    {/* MODAL */}
                                    {selectedOrder && (
                                        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
                                            <div className="bg-white text-black p-4 sm:p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
                                                <h2 className="font-bold mb-4">Order Details</h2>

                                                {selectedOrder.assignedKeys?.map((k, i) => (
                                                    <p key={i}>{k.product} → {k.key}</p>
                                                ))}

                                                <button onClick={() => setSelectedOrder(null)}>
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>

                        {/* </div> */}

                    </div>
                </div>



                <AddProductModal
                    open={showAddProductModal}
                    onClose={() => setShowAddProductModal(false)}
                    onCreated={async () => {
                        await fetchInventory();
                    }}
                />

                <EditProductModal
                    open={showEditProductModal}
                    product={editProduct}
                    onClose={() => {
                        setShowEditProductModal(false);
                        setEditProduct(null);
                    }}
                    onUpdated={async () => {
                        setShowEditProductModal(false);
                        setEditProduct(null);

                        await fetchInventory();
                    }}
                />

                <DeleteProductModal
                    open={showDeleteProductModal}
                    product={deleteProduct}
                    onClose={() => {
                        if (deleteProduct) {
                            setShowDeleteProductModal(false);
                            setDeleteProduct(null);
                        }
                    }}
                    onDeleted={async () => {
                        setShowDeleteProductModal(false);
                        setDeleteProduct(null);
                        await fetchInventory();
                    }}
                />

                <ClearCacheModal
                    open={showClearCacheModal}
                    onClose={() => setShowClearCacheModal(false)}
                    onClear={handleClearFullCache}
                    clearing={clearingCache}
                />

                {homePageSection === "hero-banners" && (
                    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                        <div className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111111] shadow-2xl">

                            <button
                                type="button"
                                onClick={() => setHomePageSection(null)}
                                className="absolute right-5 top-5 z-10 text-gray-500 transition hover:text-white"
                            >
                                ✕
                            </button>

                            <div className="p-6">
                                <HeroBannerManager />
                            </div>

                        </div>
                    </div>
                )}

                {homePageSection === "game-banners" && (
                    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                        <div className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111111] shadow-2xl">

                            <button
                                type="button"
                                onClick={() => setHomePageSection(null)}
                                className="absolute right-5 top-5 z-10 text-gray-500 transition hover:text-white"
                            >
                                ✕
                            </button>

                            <div className="p-6">
                                <GameBannerManager />
                            </div>

                        </div>
                    </div>
                )}

                <ScrollToTopButton />
            </div>
        </ >
    );
}

export default dashboard