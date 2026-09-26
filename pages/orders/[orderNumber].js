import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function OrderDetailsPage() {
    const router = useRouter();
    const { user, jwt, loading: authLoading } = useAuth();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copiedKey, setCopiedKey] = useState("");

    const orderNumber = router.query.orderNumber;

    useEffect(() => {
        if (!router.isReady || authLoading) {
            return;
        }

        if (!orderNumber) {
            setError("Order number is missing.");
            setLoading(false);
            return;
        }

        if (!user || !jwt) {
            setError("Please sign in to view your order.");
            setLoading(false);
            return;
        }

        let cancelled = false;
        let pollTimer = null;

        const fetchOrder = async (isPolling = false) => {
            try {
                if (!isPolling) {
                    setLoading(true);
                }

                setError("");

                const data = await apiFetch(
                    `/orders/my/${encodeURIComponent(
                        orderNumber
                    )}`,
                    {
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );

                if (cancelled) {
                    return;
                }

                const fetchedOrder = data.order;

                setOrder(fetchedOrder);
                setLoading(false);

                const shouldPoll =
                    fetchedOrder?.paymentStatus === "paid" &&
                    fetchedOrder?.deliveryStatus !== "ready";

                if (shouldPoll) {
                    pollTimer = setTimeout(() => {
                        fetchOrder(true);
                    }, 3000);
                }
            } catch (err) {
                if (cancelled) {
                    return;
                }

                setError(
                    err.message ||
                    "Unable to load your order."
                );

                setLoading(false);
            }
        };

        fetchOrder();

        return () => {
            cancelled = true;

            if (pollTimer) {
                clearTimeout(pollTimer);
            }
        };
    }, [
        router.isReady,
        orderNumber,
        user,
        jwt,
        authLoading,
    ]);

    const copyKey = async (code) => {
        try {
            await navigator.clipboard.writeText(code);

            setCopiedKey(code);

            setTimeout(() => {
                setCopiedKey("");
            }, 2000);
        } catch (err) {
            console.error(
                "Failed to copy key:",
                err
            );
        }
    };

    if (authLoading || loading) {
        return (
            <main className="min-h-screen px-4 py-10 text-white sm:px-6">
                <div className="mx-auto max-w-5xl">
                    <div className="h-8 w-48 animate-pulse rounded bg-white/10" />

                    <div className="mt-8 space-y-4">
                        <div className="h-32 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />
                        <div className="h-48 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen px-4 py-10 text-white sm:px-6">
                <div className="mx-auto max-w-5xl">
                    <Link
                        href="/account/orders"
                        className="text-sm text-white/50 transition hover:text-white"
                    >
                        ← Back to My Orders
                    </Link>

                    <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    if (!order) {
        return null;
    }

    const keys = Array.isArray(order.keys)
        ? order.keys
        : [];

    return (
        <main className="min-h-screen px-4 py-10 text-white sm:px-6">
            <div className="mx-auto max-w-5xl">

                <Link
                    href="/account/orders"
                    className="text-sm text-white/50 transition hover:text-white"
                >
                    ← Back to My Orders
                </Link>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-white/40">
                            Order
                        </p>

                        <h1 className="mt-1 break-all text-2xl font-semibold">
                            {order.orderNumber}
                        </h1>

                        {order.createdAt && (
                            <p className="mt-2 text-sm text-white/40">
                                {new Date(
                                    order.createdAt
                                ).toLocaleString(
                                    "en-IN",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span
                            className={`rounded-full px-3 py-1.5 text-xs font-medium ${order.paymentStatus ===
                                    "paid"
                                    ? "bg-green-500/10 text-green-400"
                                    : "bg-yellow-500/10 text-yellow-400"
                                }`}
                        >
                            {order.paymentStatus ===
                                "paid"
                                ? "Payment successful"
                                : order.paymentStatus}
                        </span>

                        <span
                            className={`rounded-full px-3 py-1.5 text-xs font-medium ${order.deliveryStatus ===
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

                <div className="mt-8 space-y-5">

                    {/* Purchased items */}
                    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                        <h2 className="text-base font-semibold">
                            Purchased items
                        </h2>

                        <div className="mt-5 divide-y divide-white/10">
                            {order.items?.map(
                                (item, index) => (
                                    <div
                                        key={`${item.id}-${index}`}
                                        className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white">
                                                {item.title}
                                            </p>

                                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/40">
                                                {item.region && (
                                                    <span>
                                                        Region:{" "}
                                                        {
                                                            item.region
                                                        }
                                                    </span>
                                                )}

                                                {item.var_title && (
                                                    <span>
                                                        {
                                                            item.var_title
                                                        }
                                                    </span>
                                                )}

                                                <span>
                                                    Qty:{" "}
                                                    {
                                                        item.quantity
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        <p className="shrink-0 text-sm font-medium">
                                            {item.currency}{" "}
                                            {Number(
                                                item.subtotal ||
                                                0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </section>

                    {/* Game keys */}
                    {order.paymentStatus ===
                        "paid" &&
                        order.deliveryStatus ===
                        "ready" &&
                        keys.length > 0 && (
                            <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                                <div>
                                    <h2 className="text-base font-semibold">
                                        Your game key
                                    </h2>

                                    <p className="mt-1 text-sm text-white/40">
                                        Your digital key is ready.
                                    </p>
                                </div>

                                <div className="mt-5 space-y-5">
                                    {keys.map(
                                        (key, index) => (
                                            <div
                                                key={
                                                    key.keyId ||
                                                    index
                                                }
                                                className="min-w-0"
                                            >
                                                <p className="mb-2 text-xs text-white/40">
                                                    {key.title}
                                                </p>

                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                                                    <div className="min-w-0 flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 flex items-center">
                                                        <code className="block w-full break-all text-sm font-mono text-white sm:text-base">
                                                            {
                                                                key.code
                                                            }
                                                        </code>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            copyKey(
                                                                key.code
                                                            )
                                                        }
                                                        className="shrink-0 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90 sm:self-stretch"
                                                    >
                                                        {copiedKey ===
                                                            key.code
                                                            ? "Copied!"
                                                            : "Copy key"}
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </section>
                        )}

                    {/* Delivery pending */}
                    {order.paymentStatus ===
                        "paid" &&
                        order.deliveryStatus !==
                        "ready" && (
                            <section className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                                <h2 className="text-base font-semibold">
                                    Preparing your order
                                </h2>

                                <p className="mt-2 text-sm text-white/50">
                                    Your payment was successful.
                                    We are preparing your digital
                                    key. This page will update
                                    automatically.
                                </p>
                            </section>
                        )}

                    {/* Order summary */}
                    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                        <h2 className="text-base font-semibold">
                            Order summary
                        </h2>

                        <div className="mt-5 space-y-3 text-sm">
                            <div className="flex items-center justify-between text-white/50">
                                <span>
                                    Payment method
                                </span>

                                <span className="text-white">
                                    {order.paymentMethod ||
                                        "—"}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-white/50">
                                <span>
                                    Delivery email
                                </span>

                                <span className="max-w-[60%] break-all text-right text-white">
                                    {
                                        order.deliveryEmail
                                    }
                                </span>
                            </div>

                            <div className="h-px bg-white/10" />

                            <div className="flex items-center justify-between">
                                <span className="font-medium">
                                    Total
                                </span>

                                <span className="text-lg font-semibold">
                                    {order.currency}{" "}
                                    {Number(
                                        order.totalAmount ||
                                        0
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </span>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}