import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function OrdersPage() {
    const { user, jwt, loading: authLoading } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!user || !jwt) {
            setError("Please sign in to view your orders.");
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await apiFetch(
                    "/orders/my?page=1&pageSize=10",
                    {
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );

                if (cancelled) {
                    return;
                }

                setOrders(data.data || []);
            } catch (err) {
                if (cancelled) {
                    return;
                }

                setError(
                    err.message ||
                    "Unable to load your orders."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchOrders();

        return () => {
            cancelled = true;
        };
    }, [authLoading, user, jwt]);

    if (authLoading || loading) {
        return (
            <main className="min-h-screen px-4 py-10 text-white">
                <div className="mx-auto max-w-6xl">
                    <h1 className="text-2xl font-semibold">
                        My Orders
                    </h1>

                    <div className="mt-6 space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-32 animate-pulse rounded-xl border border-white/10 bg-white/5"
                            />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen px-4 py-10 text-white">
                <div className="mx-auto max-w-6xl">
                    <h1 className="text-2xl font-semibold">
                        My Orders
                    </h1>

                    <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen px-4 py-10 text-white sm:px-6">
            <div className="mx-auto max-w-6xl">

                <div className="mb-8">
                    <h1 className="text-2xl font-semibold">
                        My Orders
                    </h1>

                    <p className="mt-2 text-sm text-white/50">
                        View your recent orders and purchased products.
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-10 text-center">
                        <h2 className="text-lg font-medium">
                            No orders yet
                        </h2>

                        <p className="mt-2 text-sm text-white/50">
                            Your purchased products will appear here.
                        </p>

                        <Link
                            href="/"
                            className="mt-6 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                        >
                            Start shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const firstItem =
                                order.items?.[0];

                            const itemCount =
                                order.items?.reduce(
                                    (total, item) =>
                                        total +
                                        (item.quantity || 0),
                                    0
                                ) || 0;

                            return (
                                <div
                                    key={order.orderNumber}
                                    className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20"
                                >
                                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                                        <div className="min-w-0">
                                            <p className="text-xs uppercase tracking-wide text-white/40">
                                                Order
                                            </p>

                                            <p className="mt-1 break-all text-sm font-medium text-white">
                                                {order.orderNumber}
                                            </p>

                                            <p className="mt-2 text-xs text-white/40">
                                                {order.createdAt
                                                    ? new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )
                                                    : "—"}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${order.paymentStatus ===
                                                    "paid"
                                                    ? "bg-green-500/10 text-green-400"
                                                    : "bg-yellow-500/10 text-yellow-400"
                                                    }`}
                                            >
                                                {order.paymentStatus ===
                                                    "paid"
                                                    ? "Paid"
                                                    : order.paymentStatus}
                                            </span>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${order.deliveryStatus ===
                                                    "ready"
                                                    ? "bg-green-500/10 text-green-400"
                                                    : "bg-white/10 text-white/60"
                                                    }`}
                                            >
                                                {order.deliveryStatus ===
                                                    "ready"
                                                    ? "Ready"
                                                    : order.deliveryStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="my-5 h-px bg-white/10" />

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-white">
                                                {firstItem?.title ||
                                                    "Order item"}
                                            </p>

                                            <p className="mt-1 text-xs text-white/40">
                                                {itemCount}{" "}
                                                {itemCount === 1
                                                    ? "item"
                                                    : "items"}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between gap-5 sm:justify-end">
                                            <p className="text-base font-semibold text-white">
                                                {order.currency}{" "}
                                                {Number(
                                                    order.totalAmount || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>

                                            <Link
                                                href={`/orders/${encodeURIComponent(
                                                    order.orderNumber
                                                )}`}
                                                className="shrink-0 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                                            >
                                                View order
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}