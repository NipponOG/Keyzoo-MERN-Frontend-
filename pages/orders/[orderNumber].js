import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { FiMessageCircle, FiDownload } from "react-icons/fi";
import { apiFetch } from "@/lib/api";

export default function OrderDetailsPage() {
    const router = useRouter();
    const { user, jwt, loading: authLoading } = useAuth();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copiedKey, setCopiedKey] = useState("");

    const [invoiceDownloading, setInvoiceDownloading] = useState(false);

    const [tickets, setTickets] = useState([]);
    const [ticketsLoading, setTicketsLoading] = useState(true);
    const [ticketsError, setTicketsError] = useState("");

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

                setTicketsLoading(true);
                setTicketsError("");

                try {
                    const ticketResponse = await apiFetch(
                        `/tickets/order/${encodeURIComponent(fetchedOrder._id)}`,
                        {
                            headers: {
                                Authorization: `Bearer ${jwt}`,
                            },
                        }
                    );

                    if (ticketResponse?.success) {
                        setTickets(
                            Array.isArray(ticketResponse.data)
                                ? ticketResponse.data
                                : []
                        );
                    }
                } catch (ticketError) {
                    if (!cancelled) {
                        setTicketsError(
                            ticketError.message ||
                            "Unable to load support tickets."
                        );
                    }
                } finally {
                    if (!cancelled) {
                        setTicketsLoading(false);
                    }
                }

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

    const downloadInvoice = async () => {
        if (invoiceDownloading) {
            return;
        }

        if (!jwt) {
            setError("Please sign in to download your invoice.");
            return;
        }

        if (!orderNumber) {
            setError("Order number is missing.");
            return;
        }

        if (order?.paymentStatus !== "paid") {
            setError(
                "Invoice is available only after payment is confirmed."
            );
            return;
        }

        try {
            setInvoiceDownloading(true);
            setError("");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/invoices/${encodeURIComponent(
                    orderNumber
                )}`,
                {
                    method: "GET",
                    cache: "no-store",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        Accept: "application/pdf",
                    },
                }
            );

            if (!response.ok) {
                let message =
                    "Unable to download invoice.";

                try {
                    const data =
                        await response.json();

                    message =
                        data?.message ||
                        message;
                } catch {
                    // Response was not JSON.
                }

                throw new Error(message);
            }

            const blob =
                await response.blob();

            const contentDisposition =
                response.headers.get(
                    "Content-Disposition"
                );

            let fileName =
                `KZ-INV-${orderNumber}.pdf`;

            const fileNameMatch =
                contentDisposition?.match(
                    /filename="([^"]+)"/i
                );

            if (fileNameMatch?.[1]) {
                fileName =
                    fileNameMatch[1];
            }

            const blobUrl =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = blobUrl;
            link.download = fileName;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(
                blobUrl
            );
        } catch (err) {
            console.error(
                "Invoice download error:",
                err
            );

            setError(
                err.message ||
                "Unable to download invoice."
            );
        } finally {
            setInvoiceDownloading(false);
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

                    {/* <div className="flex flex-wrap gap-2">
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
                    </div> */}

                    <div className="flex flex-wrap items-center gap-2">
                        {order.paymentStatus === "paid" && (
                            <button
                                type="button"
                                onClick={downloadInvoice}
                                disabled={invoiceDownloading}
                                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-300 transition hover:border-purple-500/50 hover:bg-purple-500/20 hover:text-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <FiDownload
                                    className={
                                        invoiceDownloading
                                            ? "animate-pulse"
                                            : ""
                                    }
                                />

                                {invoiceDownloading
                                    ? "Generating..."
                                    : "Download Invoice"}
                            </button>
                        )}

                        <span
                            className={`rounded-full px-3 py-1.5 text-xs font-medium ${order.paymentStatus === "paid"
                                    ? "bg-green-500/10 text-green-400"
                                    : "bg-yellow-500/10 text-yellow-400"
                                }`}
                        >
                            {order.paymentStatus === "paid"
                                ? "Payment successful"
                                : order.paymentStatus}
                        </span>

                        <span
                            className={`rounded-full px-3 py-1.5 text-xs font-medium ${order.deliveryStatus === "ready"
                                    ? "bg-green-500/10 text-green-400"
                                    : "bg-white/10 text-white/60"
                                }`}
                        >
                            {order.deliveryStatus === "ready"
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

                    {/* Support tickets */}
                    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-base font-semibold">
                                    Support Tickets
                                </h2>

                                <p className="mt-1 text-sm text-white/40">
                                    Get help with an issue related to this order.
                                </p>
                            </div>

                            <Link
                                href={`/account/tickets/new?orderId=${encodeURIComponent(
                                    order.orderNumber
                                )}`}
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
                            >
                                <FiMessageCircle />
                                Raise Ticket
                            </Link>
                        </div>

                        {ticketsLoading ? (
                            <div className="mt-5 space-y-3">
                                <div className="h-16 animate-pulse rounded-lg bg-white/5" />
                                <div className="h-16 animate-pulse rounded-lg bg-white/5" />
                            </div>
                        ) : ticketsError ? (
                            <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
                                {ticketsError}
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm text-white/40">
                                No support tickets have been raised for this order yet.
                            </div>
                        ) : (
                            <div className="mt-5 space-y-3">
                                {tickets.map((ticket) => {
                                    const statusClass = {
                                        open: "bg-purple-500/10 text-purple-400",
                                        in_progress: "bg-blue-500/10 text-blue-400",
                                        waiting_for_customer:
                                            "bg-yellow-500/10 text-yellow-400",
                                        resolved: "bg-green-500/10 text-green-400",
                                        closed: "bg-white/10 text-white/50",
                                    };

                                    const priorityClass = {
                                        urgent: "bg-red-500/10 text-red-400",
                                        high: "bg-orange-500/10 text-orange-400",
                                        normal: "bg-blue-500/10 text-blue-400",
                                        low: "bg-white/10 text-white/50",
                                    };

                                    return (
                                        <Link
                                            key={ticket._id}
                                            href={`/account/tickets/${encodeURIComponent(
                                                ticket.ticketNumber
                                            )}`}
                                            className="block rounded-lg border border-white/10 bg-white/[0.02] p-4 transition hover:border-purple-500/30 hover:bg-white/[0.04]"
                                        >
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="min-w-0">
                                                    <p className="text-xs text-white/30">
                                                        {ticket.ticketNumber}
                                                    </p>

                                                    <p className="mt-1 truncate text-sm font-medium text-white">
                                                        {ticket.subject}
                                                    </p>

                                                    {ticket.item?.title && (
                                                        <p className="mt-1 truncate text-xs text-white/40">
                                                            {ticket.item.title}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex shrink-0 flex-wrap gap-2">
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass[ticket.status] ||
                                                            "bg-white/10 text-white/50"
                                                            }`}
                                                    >
                                                        {ticket.status
                                                            ?.replaceAll("_", " ")
                                                            .replace(/\b\w/g, (char) =>
                                                                char.toUpperCase()
                                                            )}
                                                    </span>

                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityClass[ticket.priority] ||
                                                            "bg-white/10 text-white/50"
                                                            }`}
                                                    >
                                                        {ticket.priority
                                                            ?.replace(/\b\w/g, (char) =>
                                                                char.toUpperCase()
                                                            )}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
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