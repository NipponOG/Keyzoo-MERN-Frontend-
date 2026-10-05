import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
    FiArrowLeft,
    FiClock,
    FiMessageCircle,
    FiSend,
    FiAlertCircle,
    FiCheckCircle,
} from "react-icons/fi";

import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

const STATUS_STYLES = {
    open: "border-blue-500/20 bg-blue-500/10 text-blue-300",
    in_progress:
        "border-purple-500/20 bg-purple-500/10 text-purple-300",
    waiting_for_customer:
        "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
    resolved:
        "border-green-500/20 bg-green-500/10 text-green-300",
    closed:
        "border-neutral-700 bg-neutral-800 text-neutral-400",
};

const PRIORITY_STYLES = {
    low: "text-neutral-400",
    normal: "text-blue-400",
    high: "text-orange-400",
    urgent: "text-red-400",
};

const CATEGORY_LABELS = {
    key_not_working: "Key Not Working",
    wrong_key: "Wrong Key",
    key_already_used: "Key Already Used",
    activation_problem: "Activation Problem",
    region_problem: "Region Problem",
    missing_key: "Missing Key",
    wrong_product: "Wrong Product",
    payment_problem: "Payment Problem",
    order_problem: "Order Problem",
    other: "Other",
};

function formatStatus(status) {
    if (!status) return "Unknown";

    return status
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");
}

function formatDate(date) {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "";
    }

    return parsed.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getMessageText(message) {
    if (!message) return "";

    return (
        message.message ||
        message.content ||
        message.text ||
        message.description ||
        ""
    );
}

function isAdminMessage(message) {
    const sender =
        message?.senderType ||
        message?.sender ||
        message?.authorType ||
        message?.role ||
        "";

    return [
        "admin",
        "support",
        "staff",
    ].includes(String(sender).toLowerCase());
}

export default function TicketDetailsPage() {
    const router = useRouter();

    const { user, jwt, loading: authLoading } = useAuth();

    const ticketId = router.query.id;

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [reply, setReply] = useState("");
    const [sending, setSending] = useState(false);
    const [replyError, setReplyError] = useState("");

    useEffect(() => {
        if (!router.isReady || authLoading) {
            return;
        }

        if (!ticketId) {
            return;
        }

        if (!user || !jwt) {
            setError("Please sign in to view this ticket.");
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchTicket = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await apiFetch(
                    `/tickets/${encodeURIComponent(ticketId)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );

                if (cancelled) {
                    return;
                }

                const fetchedTicket =
                    response?.data ||
                    response?.ticket ||
                    null;

                if (!fetchedTicket) {
                    throw new Error(
                        "Unable to load this support ticket."
                    );
                }

                setTicket(fetchedTicket);
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message ||
                        "Unable to load this support ticket."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchTicket();

        return () => {
            cancelled = true;
        };
    }, [
        router.isReady,
        ticketId,
        user,
        jwt,
        authLoading,
    ]);

    const handleReply = async (event) => {
        event.preventDefault();

        const message = reply.trim();

        if (!message) {
            setReplyError("Please enter a message.");
            return;
        }

        if (!ticket?._id) {
            return;
        }

        if (ticket.status === "closed") {
            setReplyError(
                "This ticket is closed and cannot receive new replies."
            );
            return;
        }

        try {
            setSending(true);
            setReplyError("");

            const response = await apiFetch(
                `/tickets/${encodeURIComponent(
                    ticket._id
                )}/messages`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                    body: JSON.stringify({
                        message,
                    }),
                }
            );

            const updatedTicket =
                response?.data ||
                response?.ticket ||
                null;

            if (updatedTicket) {
                setTicket(updatedTicket);
            } else {
                setTicket((current) => {
                    if (!current) return current;

                    return {
                        ...current,
                        status:
                            current.status ===
                                "waiting_for_customer"
                                ? "in_progress"
                                : current.status,
                    };
                });
            }

            setReply("");
        } catch (err) {
            setReplyError(
                err.message ||
                "Unable to send your reply."
            );
        } finally {
            setSending(false);
        }
    };

    if (authLoading || loading) {
        return (
            <main className="min-h-screen px-4 py-10 text-white sm:px-6">
                <div className="mx-auto max-w-5xl">
                    <div className="h-5 w-36 animate-pulse rounded bg-white/10" />

                    <div className="mt-8 h-32 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />

                    <div className="mt-5 h-96 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen px-4 py-10 text-white sm:px-6">
                <div className="mx-auto max-w-5xl">
                    <Link
                        href="/account/tickets"
                        className="inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white"
                    >
                        <FiArrowLeft />
                        Back to Support Tickets
                    </Link>

                    <div className="mt-8 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
                        <FiAlertCircle className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                </div>
            </main>
        );
    }

    if (!ticket) {
        return null;
    }

    const statusStyle =
        STATUS_STYLES[ticket.status] ||
        STATUS_STYLES.open;

    const priorityStyle =
        PRIORITY_STYLES[ticket.priority] ||
        PRIORITY_STYLES.normal;

    const messages = Array.isArray(ticket.messages)
        ? ticket.messages
        : [];

    const canReply = ticket.status !== "closed";

    return (
        <main className="min-h-screen px-4 py-8 text-white sm:px-6 lg:py-10">
            <div className="mx-auto max-w-5xl">
                {/* Back */}
                <Link
                    href="/account/tickets"
                    className="inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white"
                >
                    <FiArrowLeft />
                    Back to Support Tickets
                </Link>

                {/* Header */}
                <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-300">
                                    {ticket.ticketNumber}
                                </span>

                                <span
                                    className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${statusStyle}`}
                                >
                                    {formatStatus(
                                        ticket.status
                                    )}
                                </span>
                            </div>

                            <h1 className="mt-4 break-words text-xl font-bold text-white sm:text-2xl">
                                {ticket.subject ||
                                    "Support Ticket"}
                            </h1>

                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500">
                                {ticket.orderNumber && (
                                    <span>
                                        Order:{" "}
                                        <span className="text-neutral-300">
                                            {
                                                ticket.orderNumber
                                            }
                                        </span>
                                    </span>
                                )}

                                {ticket.createdAt && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <FiClock />
                                        {formatDate(
                                            ticket.createdAt
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">
                            {ticket.category && (
                                <span className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-400">
                                    {CATEGORY_LABELS[
                                        ticket.category
                                    ] ||
                                        formatStatus(
                                            ticket.category
                                        )}
                                </span>
                            )}

                            {ticket.priority && (
                                <span
                                    className={`rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs font-semibold ${priorityStyle}`}
                                >
                                    {formatStatus(
                                        ticket.priority
                                    )}{" "}
                                    priority
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Purchased item */}
                    {ticket.item && (
                        <div className="mt-5 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                                Purchased Item
                            </p>

                            <p className="mt-1 text-sm font-semibold text-white">
                                {ticket.item.title ||
                                    "Purchased item"}
                            </p>

                            {ticket.item.type && (
                                <p className="mt-1 text-xs text-neutral-500">
                                    {formatStatus(
                                        ticket.item.type
                                    )}
                                </p>
                            )}
                        </div>
                    )}
                </section>

                {/* Original issue */}
                <section className="mt-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 sm:p-6">
                    <div className="flex items-center gap-2">
                        <FiMessageCircle className="text-purple-400" />

                        <h2 className="text-sm font-semibold text-white">
                            Issue Description
                        </h2>
                    </div>

                    <div className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-neutral-300">
                        {ticket.description ||
                            "No description provided."}
                    </div>
                </section>

                {/* Conversation */}
                <section className="mt-5 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50">
                    <div className="border-b border-neutral-800 px-5 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-white">
                                    Conversation
                                </h2>

                                <p className="mt-1 text-xs text-neutral-500">
                                    {messages.length}{" "}
                                    {messages.length ===
                                        1
                                        ? "message"
                                        : "messages"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5 p-5 sm:p-6">
                        {messages.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-neutral-800 py-10 text-center">
                                <FiMessageCircle className="mx-auto text-2xl text-neutral-600" />

                                <p className="mt-3 text-sm text-neutral-500">
                                    No messages yet.
                                </p>
                            </div>
                        ) : (
                            messages.map(
                                (message, index) => {
                                    const admin =
                                        isAdminMessage(
                                            message
                                        );

                                    const text =
                                        getMessageText(
                                            message
                                        );

                                    return (
                                        <div
                                            key={
                                                message._id ||
                                                message.id ||
                                                `${message.createdAt || "message"}-${index}`
                                            }
                                            className={`flex ${admin
                                                    ? "justify-start"
                                                    : "justify-end"
                                                }`}
                                        >
                                            <div
                                                className={`max-w-[90%] sm:max-w-[75%] ${admin
                                                        ? "rounded-2xl rounded-tl-md border border-neutral-800 bg-neutral-950"
                                                        : "rounded-2xl rounded-tr-md border border-purple-500/20 bg-purple-500/10"
                                                    }`}
                                            >
                                                <div className="px-4 pt-3">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`text-xs font-semibold ${admin
                                                                    ? "text-purple-300"
                                                                    : "text-white"
                                                                }`}
                                                        >
                                                            {admin
                                                                ? "Keyzoo Support"
                                                                : "You"}
                                                        </span>

                                                        {message.createdAt && (
                                                            <span className="text-[10px] text-neutral-600">
                                                                {formatDate(
                                                                    message.createdAt
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="whitespace-pre-wrap break-words px-4 pb-4 pt-2 text-sm leading-6 text-neutral-300">
                                                    {text}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )
                        )}
                    </div>
                </section>

                {/* Reply */}
                {canReply ? (
                    <section className="mt-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 sm:p-6">
                        <div className="mb-4">
                            <h2 className="text-sm font-semibold text-white">
                                Reply to Support
                            </h2>

                            <p className="mt-1 text-xs text-neutral-500">
                                Add more information if you
                                need help with this issue.
                            </p>
                        </div>

                        {replyError && (
                            <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                                <FiAlertCircle className="mt-0.5 shrink-0" />
                                <span>{replyError}</span>
                            </div>
                        )}

                        <form onSubmit={handleReply}>
                            <textarea
                                value={reply}
                                onChange={(event) =>
                                    setReply(
                                        event.target.value
                                    )
                                }
                                rows={5}
                                maxLength={5000}
                                disabled={sending}
                                placeholder="Write your message..."
                                className="w-full resize-none rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                            />

                            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-xs text-neutral-600">
                                    {reply.length}/5000
                                </span>

                                <button
                                    type="submit"
                                    disabled={
                                        sending ||
                                        !reply.trim()
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <FiSend />

                                    {sending
                                        ? "Sending..."
                                        : "Send Reply"}
                                </button>
                            </div>
                        </form>
                    </section>
                ) : (
                    <section className="mt-5 flex items-start gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 text-sm text-neutral-400">
                        <FiCheckCircle className="mt-0.5 shrink-0 text-green-400" />

                        <div>
                            <p className="font-semibold text-neutral-300">
                                This ticket is closed.
                            </p>

                            <p className="mt-1 text-xs text-neutral-500">
                                This conversation is no longer
                                accepting replies.
                            </p>
                        </div>
                    </section>
                )}

                {/* Resolution */}
                {ticket.resolution && (
                    <section className="mt-5 rounded-2xl border border-green-500/20 bg-green-500/5 p-5 sm:p-6">
                        <div className="flex items-center gap-2">
                            <FiCheckCircle className="text-green-400" />

                            <h2 className="text-sm font-semibold text-green-300">
                                Resolution
                            </h2>
                        </div>

                        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-300">
                            {ticket.resolution}
                        </p>

                        {ticket.resolvedAt && (
                            <p className="mt-3 text-xs text-neutral-600">
                                Resolved{" "}
                                {formatDate(
                                    ticket.resolvedAt
                                )}
                            </p>
                        )}
                    </section>
                )}
            </div>
        </main>
    );
}