import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

const PAGE_SIZE = 20;

const STATUS_STYLES = {
    open: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    in_progress:
        "border-purple-500/30 bg-purple-500/10 text-purple-400",
    waiting_for_customer:
        "border-amber-500/30 bg-amber-500/10 text-amber-400",
    resolved:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    closed: "border-gray-500/30 bg-gray-500/10 text-gray-400",
};

function formatStatus(status) {
    if (!status) return "Unknown";

    return status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function formatDate(dateValue) {
    if (!dateValue) return "Date unavailable";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getTicketId(ticket) {
    return ticket?.ticketNumber || ticket?._id;
}

export default function TicketsPage() {
    const { user, jwt, isLoaded } = useAuth();

    const [tickets, setTickets] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTickets = useCallback(async () => {
        if (isLoaded === false) return;

        if (!user || !jwt) {
            setTickets([]);
            setTotal(0);
            setTotalPages(0);
            setLoading(false);
            setError("Please sign in to view your support tickets.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await apiFetch(
                `/tickets?page=${page}&pageSize=${PAGE_SIZE}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            if (response?.success === false) {
                throw new Error(
                    response.message || "Unable to load your tickets."
                );
            }

            // The controller returns { success: true, data: result }.
            // result comes from ticketRepository.findByUserId().
            const result = response?.data;

            if (!result || !Array.isArray(result.tickets)) {
                throw new Error(
                    "The server returned an unexpected ticket list response."
                );
            }

            setTickets(result.tickets);
            setTotal(Number(result.total) || 0);
            setTotalPages(Number(result.totalPages) || 0);
            setPage(Number(result.page) || page);
        } catch (err) {
            setTickets([]);
            setTotal(0);
            setTotalPages(0);
            setError(
                err?.message || "Something went wrong while loading your tickets."
            );
        } finally {
            setLoading(false);
        }
    }, [isLoaded, user, jwt, page]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const changePage = (nextPage) => {
        if (
            nextPage < 1 ||
            nextPage > totalPages ||
            nextPage === page
        ) {
            return;
        }

        setPage(nextPage);
    };

    return (
        <main className="min-h-screen px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <Link
                        href="/support"
                        className="mb-5 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
                    >
                        <span aria-hidden="true">←</span>
                        Support Center
                    </Link>

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-purple-400">
                                Customer Support
                            </p>

                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                My Support Tickets
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
                                View your support requests and follow their
                                progress.
                            </p>
                        </div>

                        <Link
                            href="/account/orders"
                            className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
                        >
                            Get Support for an Order
                        </Link>
                    </div>
                </div>

                {!loading && !error && (
                    <div className="mb-5 text-sm text-gray-400">
                        {total} {total === 1 ? "ticket" : "tickets"} in total
                    </div>
                )}

                {loading ? (
                    <div
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-8"
                        role="status"
                        aria-live="polite"
                    >
                        <div className="flex items-center gap-3">
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
                            <p className="text-sm text-gray-400">
                                Loading your support tickets...
                            </p>
                        </div>

                        <div className="mt-6 space-y-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-24 animate-pulse rounded-xl bg-white/[0.04]"
                                />
                            ))}
                        </div>
                    </div>
                ) : error ? (
                    <div
                        className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-6 sm:p-8"
                        role="alert"
                    >
                        <h2 className="text-lg font-semibold">
                            Unable to load tickets
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-400">
                            {error}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={fetchTickets}
                                className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-purple-500"
                            >
                                Try Again
                            </button>

                            <Link
                                href="/support"
                                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5"
                            >
                                Support Center
                            </Link>
                        </div>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center sm:px-10">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-3xl">
                            <span aria-hidden="true">🎧</span>
                        </div>

                        <h2 className="mt-5 text-xl font-semibold">
                            No support tickets yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
                            If you need help with a purchase, open your orders
                            and start a support request for the relevant item.
                        </p>

                        <Link
                            href="/account/orders"
                            className="mt-6 inline-flex items-center justify-center rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold transition hover:bg-purple-500"
                        >
                            View My Orders
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {tickets.map((ticket) => {
                                const ticketId = getTicketId(ticket);
                                const status = ticket?.status || "";
                                const statusStyle =
                                    STATUS_STYLES[status] ||
                                    "border-white/10 bg-white/5 text-gray-300";

                                return (
                                    <article
                                        key={ticketId}
                                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-purple-500/30 hover:bg-white/[0.045] sm:p-6"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-xs font-medium text-purple-400">
                                                        {ticket.ticketNumber ||
                                                            "Support Ticket"}
                                                    </span>

                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle}`}
                                                    >
                                                        {formatStatus(status)}
                                                    </span>
                                                </div>

                                                <h2 className="mt-3 break-words text-lg font-semibold text-white">
                                                    {ticket.subject ||
                                                        "Support request"}
                                                </h2>

                                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-400 sm:text-sm">
                                                    {ticket.orderNumber && (
                                                        <span>
                                                            Order:{" "}
                                                            <span className="text-gray-300">
                                                                {ticket.orderNumber}
                                                            </span>
                                                        </span>
                                                    )}

                                                    {ticket.category && (
                                                        <span>
                                                            Category:{" "}
                                                            <span className="text-gray-300">
                                                                {formatStatus(
                                                                    ticket.category
                                                                )}
                                                            </span>
                                                        </span>
                                                    )}

                                                    <span>
                                                        Updated:{" "}
                                                        {formatDate(
                                                            ticket.updatedAt ||
                                                            ticket.createdAt
                                                        )}
                                                    </span>
                                                </div>

                                                {ticket.item?.title && (
                                                    <p className="mt-3 text-sm text-gray-400">
                                                        Product:{" "}
                                                        <span className="text-gray-300">
                                                            {ticket.item.title}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>

                                            {ticketId ? (
                                                <Link
                                                    href={`/account/tickets/${encodeURIComponent(
                                                        ticketId
                                                    )}`}
                                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-200 transition hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white"
                                                >
                                                    View Ticket
                                                    <span aria-hidden="true">
                                                        →
                                                    </span>
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-gray-500">
                                                    Ticket ID unavailable
                                                </span>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {totalPages > 1 && (
                            <nav
                                className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row"
                                aria-label="Ticket pagination"
                            >
                                <p className="text-sm text-gray-400">
                                    Page {page} of {totalPages}
                                </p>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => changePage(page - 1)}
                                        disabled={page <= 1}
                                        className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Previous
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => changePage(page + 1)}
                                        disabled={page >= totalPages}
                                        className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Next
                                    </button>
                                </div>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}