import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    FiArrowLeft,
    FiX,
    FiSend,
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
} from "react-icons/fi";

import adminFetch from "@/lib/adminFetch";

const STATUS_OPTIONS = [
    "open",
    "in_progress",
    "waiting_for_customer",
    "resolved",
    "closed",
];

const PRIORITY_OPTIONS = [
    "low",
    "normal",
    "high",
    "urgent",
];

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

const STATUS_STYLES = {
    open: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    in_progress:
        "border-purple-500/20 bg-purple-500/10 text-purple-400",
    waiting_for_customer:
        "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    resolved:
        "border-green-500/20 bg-green-500/10 text-green-400",
    closed:
        "border-gray-500/20 bg-gray-500/10 text-gray-400",
};

const PRIORITY_STYLES = {
    low: "text-gray-400",
    normal: "text-blue-400",
    high: "text-orange-400",
    urgent: "text-red-400",
};

function formatLabel(value) {
    if (!value) return "";

    return value
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");
}

function formatDate(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getMessageText(message) {
    return (
        message?.message ||
        message?.content ||
        message?.text ||
        message?.description ||
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

    return ["admin", "support", "staff"].includes(
        String(sender).toLowerCase()
    );
}

export default function AdminTicketDetailsPage() {
    const router = useRouter();
    const { id } = router.query;

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [reply, setReply] = useState("");
    const [replyLoading, setReplyLoading] = useState(false);

    const [statusLoading, setStatusLoading] = useState(false);
    const [priorityLoading, setPriorityLoading] = useState(false);
    const [resolveLoading, setResolveLoading] = useState(false);
    const [closeLoading, setCloseLoading] = useState(false);

    const [resolution, setResolution] = useState("");

    useEffect(() => {
        if (!id) {
            return;
        }

        let cancelled = false;

        const fetchTicket = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await adminFetch(
                    `/admin/tickets/${encodeURIComponent(id)}`
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
                        "Ticket data was not returned."
                    );
                }

                setTicket(fetchedTicket);
                setResolution(
                    fetchedTicket.resolution || ""
                );
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err?.message ||
                        "Failed to load ticket."
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
    }, [id]);

    const updateTicketState = (updatedTicket) => {
        if (!updatedTicket) {
            return;
        }

        setTicket(updatedTicket);
        setResolution(updatedTicket.resolution || "");
    };

    const handleReply = async (event) => {
        event.preventDefault();

        const message = reply.trim();

        if (!message || !ticket?._id) {
            return;
        }

        try {
            setReplyLoading(true);
            setError("");

            const response = await adminFetch(
                `/admin/tickets/${encodeURIComponent(
                    ticket._id
                )}/messages`,
                {
                    method: "POST",
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
                updateTicketState(updatedTicket);
            } else {
                const refreshed = await adminFetch(
                    `/admin/tickets/${encodeURIComponent(
                        ticket._id
                    )}`
                );

                updateTicketState(
                    refreshed?.data ||
                    refreshed?.ticket ||
                    ticket
                );
            }

            setReply("");
        } catch (err) {
            setError(
                err?.message ||
                "Failed to send reply."
            );
        } finally {
            setReplyLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (
            !ticket?._id ||
            newStatus === ticket.status
        ) {
            return;
        }

        try {
            setStatusLoading(true);
            setError("");

            const response = await adminFetch(
                `/admin/tickets/${encodeURIComponent(
                    ticket._id
                )}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const updatedTicket =
                response?.data ||
                response?.ticket ||
                null;

            if (updatedTicket) {
                updateTicketState(updatedTicket);
            } else {
                setTicket((current) =>
                    current
                        ? {
                            ...current,
                            status: newStatus,
                        }
                        : current
                );
            }
        } catch (err) {
            setError(
                err?.message ||
                "Failed to update ticket status."
            );
        } finally {
            setStatusLoading(false);
        }
    };

    const handlePriorityChange = async (newPriority) => {
        if (
            !ticket?._id ||
            newPriority === ticket.priority
        ) {
            return;
        }

        try {
            setPriorityLoading(true);
            setError("");

            const response = await adminFetch(
                `/admin/tickets/${encodeURIComponent(
                    ticket._id
                )}/priority`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        priority: newPriority,
                    }),
                }
            );

            const updatedTicket =
                response?.data ||
                response?.ticket ||
                null;

            if (updatedTicket) {
                updateTicketState(updatedTicket);
            } else {
                setTicket((current) =>
                    current
                        ? {
                            ...current,
                            priority: newPriority,
                        }
                        : current
                );
            }
        } catch (err) {
            setError(
                err?.message ||
                "Failed to update ticket priority."
            );
        } finally {
            setPriorityLoading(false);
        }
    };

    const handleResolve = async () => {
        const value = resolution.trim();

        if (!ticket?._id) {
            return;
        }

        if (!value) {
            setError(
                "Please enter a resolution before resolving the ticket."
            );
            return;
        }

        try {
            setResolveLoading(true);
            setError("");

            const response = await adminFetch(
                `/admin/tickets/${encodeURIComponent(
                    ticket._id
                )}/resolve`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        resolution: value,
                    }),
                }
            );

            const updatedTicket =
                response?.data ||
                response?.ticket ||
                null;

            if (updatedTicket) {
                updateTicketState(updatedTicket);
            } else {
                const refreshed = await adminFetch(
                    `/admin/tickets/${encodeURIComponent(
                        ticket._id
                    )}`
                );

                updateTicketState(
                    refreshed?.data ||
                    refreshed?.ticket ||
                    ticket
                );
            }
        } catch (err) {
            setError(
                err?.message ||
                "Failed to resolve ticket."
            );
        } finally {
            setResolveLoading(false);
        }
    };

    const handleCloseTicket = async () => {
        if (!ticket?._id) {
            return;
        }

        try {
            setCloseLoading(true);
            setError("");

            const response = await adminFetch(
                `/admin/tickets/${encodeURIComponent(
                    ticket._id
                )}/close`,
                {
                    method: "PATCH",
                }
            );

            const updatedTicket =
                response?.data ||
                response?.ticket ||
                null;

            if (updatedTicket) {
                updateTicketState(updatedTicket);
            } else {
                setTicket((current) =>
                    current
                        ? {
                            ...current,
                            status: "closed",
                        }
                        : current
                );
            }
        } catch (err) {
            setError(
                err?.message ||
                "Failed to close ticket."
            );
        } finally {
            setCloseLoading(false);
        }
    };

    if (!id) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Back */}
                <button
                    type="button"
                    onClick={() =>
                        router.push("/admin/dashboard")
                    }
                    className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#181818] px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
                >
                    <FiArrowLeft size={17} />
                    Back to Dashboard
                </button>

                {loading ? (
                    <div className="space-y-5">
                        <div className="h-20 animate-pulse rounded-2xl bg-white/5" />
                        <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
                        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
                        <div className="h-48 animate-pulse rounded-2xl bg-white/5" />
                    </div>
                ) : error && !ticket ? (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
                        <div className="flex items-start gap-3 text-sm text-red-300">
                            <FiAlertCircle className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    </div>
                ) : ticket ? (
                    <div className="space-y-5">
                        {/* Header */}
                        <div className="rounded-2xl border border-white/10 bg-[#181818] p-5 sm:p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="break-all text-xl font-semibold text-white">
                                            {ticket.ticketNumber ||
                                                "Support Ticket"}
                                        </h1>

                                        {ticket.status && (
                                            <span
                                                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLES[
                                                    ticket.status
                                                    ] ||
                                                    STATUS_STYLES.open
                                                    }`}
                                            >
                                                {formatLabel(
                                                    ticket.status
                                                )}
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Ticket details and customer
                                        conversation
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push(
                                            "/admin/dashboard"
                                        )
                                    }
                                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-gray-400 transition hover:bg-white/5 hover:text-white"
                                    title="Back to dashboard"
                                >
                                    <FiX size={19} />
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                                <FiAlertCircle className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Ticket information */}
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            <div className="rounded-xl border border-white/10 bg-[#202020] p-4">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                    Customer
                                </p>

                                <p className="mt-2 break-all text-sm font-medium text-white">
                                    {ticket.userId ||
                                        "Unknown customer"}
                                </p>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-[#202020] p-4">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                    Order
                                </p>

                                <p className="mt-2 break-all text-sm font-medium text-white">
                                    {ticket.orderNumber ||
                                        "No order number"}
                                </p>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-[#202020] p-4">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                    Created
                                </p>

                                <p className="mt-2 text-sm font-medium text-white">
                                    {formatDate(
                                        ticket.createdAt
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Purchased item */}
                        {ticket.item && (
                            <div className="rounded-xl border border-white/10 bg-[#202020] p-4">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                    Purchased Item
                                </p>

                                <p className="mt-2 text-sm font-semibold text-white">
                                    {ticket.item.title ||
                                        "Unknown item"}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    {formatLabel(
                                        ticket.item.type
                                    )}
                                </p>
                            </div>
                        )}

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-xl border border-white/10 bg-[#202020] p-4">
                                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                    Status
                                </label>

                                <select
                                    value={
                                        ticket.status || ""
                                    }
                                    onChange={(event) =>
                                        handleStatusChange(
                                            event.target.value
                                        )
                                    }
                                    disabled={statusLoading}
                                    className={`w-full rounded-lg border bg-[#181818] px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500/50 ${STATUS_STYLES[
                                            ticket.status
                                        ]?.replace(
                                            /bg-\S+|border-\S+/g,
                                            ""
                                        ) ||
                                        "text-white"
                                        }`}
                                >
                                    {STATUS_OPTIONS.map(
                                        (status) => (
                                            <option
                                                key={status}
                                                value={status}
                                                className="bg-[#181818] text-white"
                                            >
                                                {formatLabel(
                                                    status
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-[#202020] p-4">
                                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                    Priority
                                </label>

                                <select
                                    value={
                                        ticket.priority ||
                                        "normal"
                                    }
                                    onChange={(event) =>
                                        handlePriorityChange(
                                            event.target.value
                                        )
                                    }
                                    disabled={
                                        priorityLoading
                                    }
                                    className={`w-full rounded-lg border border-white/10 bg-[#181818] px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500/50 ${PRIORITY_STYLES[
                                        ticket.priority
                                        ] ||
                                        PRIORITY_STYLES.normal
                                        }`}
                                >
                                    {PRIORITY_OPTIONS.map(
                                        (priority) => (
                                            <option
                                                key={priority}
                                                value={priority}
                                                className="bg-[#181818] text-white"
                                            >
                                                {formatLabel(
                                                    priority
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* Subject + description */}
                        <div className="rounded-xl border border-white/10 bg-[#202020] p-4">
                            <div className="flex flex-wrap items-center gap-2">
                                {ticket.category && (
                                    <span className="rounded-lg border border-white/10 bg-[#181818] px-3 py-1.5 text-xs text-gray-300">
                                        {CATEGORY_LABELS[
                                            ticket.category
                                        ] ||
                                            formatLabel(
                                                ticket.category
                                            )}
                                    </span>
                                )}
                            </div>

                            <h2 className="mt-3 text-base font-semibold text-white">
                                {ticket.subject ||
                                    "No subject"}
                            </h2>

                            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-gray-300">
                                {ticket.description ||
                                    "No description provided."}
                            </p>
                        </div>

                        {/* Conversation */}
                        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#202020]">
                            <div className="border-b border-white/10 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <FiClock className="text-indigo-400" />

                                    <h2 className="text-sm font-semibold text-white">
                                        Conversation
                                    </h2>

                                    <span className="text-xs text-gray-500">
                                        {Array.isArray(
                                            ticket.messages
                                        )
                                            ? ticket.messages.length
                                            : 0}{" "}
                                        messages
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 p-4">
                                {!Array.isArray(
                                    ticket.messages
                                ) ||
                                    ticket.messages.length ===
                                    0 ? (
                                    <div className="py-10 text-center text-sm text-gray-500">
                                        No messages yet.
                                    </div>
                                ) : (
                                    ticket.messages.map(
                                        (
                                            message,
                                            index
                                        ) => {
                                            const admin =
                                                isAdminMessage(
                                                    message
                                                );

                                            return (
                                                <div
                                                    key={
                                                        message._id ||
                                                        message.id ||
                                                        index
                                                    }
                                                    className={`flex ${admin
                                                            ? "justify-start"
                                                            : "justify-end"
                                                        }`}
                                                >
                                                    <div
                                                        className={`max-w-[85%] rounded-2xl border px-4 py-3 ${admin
                                                                ? "rounded-tl-md border-white/10 bg-[#181818]"
                                                                : "rounded-tr-md border-indigo-500/20 bg-indigo-500/10"
                                                            }`}
                                                    >
                                                        <div className="mb-1 flex items-center gap-2">
                                                            <span className="text-[11px] font-semibold text-white">
                                                                {admin
                                                                    ? "Keyzoo Support"
                                                                    : "Customer"}
                                                            </span>

                                                            {message.createdAt && (
                                                                <span className="text-[10px] text-gray-600">
                                                                    {formatDate(
                                                                        message.createdAt
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-300">
                                                            {getMessageText(
                                                                message
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )
                                )}
                            </div>
                        </div>

                        {/* Reply */}
                        {ticket.status !== "closed" && (
                            <form
                                onSubmit={handleReply}
                                className="rounded-xl border border-white/10 bg-[#202020] p-4"
                            >
                                <label className="mb-2 block text-sm font-medium text-white">
                                    Reply to Customer
                                </label>

                                <textarea
                                    value={reply}
                                    onChange={(event) =>
                                        setReply(
                                            event.target
                                                .value
                                        )
                                    }
                                    rows={5}
                                    maxLength={5000}
                                    disabled={
                                        replyLoading
                                    }
                                    placeholder="Write a reply..."
                                    className="w-full resize-none rounded-lg border border-white/10 bg-[#181818] px-3 py-3 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-indigo-500/50"
                                />

                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[11px] text-gray-600">
                                        {reply.length}/5000
                                    </span>

                                    <button
                                        type="submit"
                                        disabled={
                                            replyLoading ||
                                            !reply.trim()
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <FiSend />

                                        {replyLoading
                                            ? "Sending..."
                                            : "Send Reply"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Resolution */}
                        {(ticket.status === "resolved" ||
                            ticket.status === "closed") && (
                                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                                    <div className="flex items-center gap-2">
                                        <FiCheckCircle className="text-green-400" />

                                        <h2 className="text-sm font-semibold text-green-400">
                                            Resolution
                                        </h2>
                                    </div>

                                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-gray-300">
                                        {ticket.resolution ||
                                            "No resolution provided."}
                                    </p>

                                    {ticket.resolvedAt && (
                                        <p className="mt-2 text-xs text-gray-600">
                                            Resolved:{" "}
                                            {formatDate(
                                                ticket.resolvedAt
                                            )}
                                        </p>
                                    )}
                                </div>
                            )}

                        {/* Resolve */}
                        {ticket.status !== "closed" &&
                            ticket.status !== "resolved" && (
                                <div className="rounded-xl border border-white/10 bg-[#202020] p-4">
                                    <label className="mb-2 block text-sm font-medium text-white">
                                        Resolve Ticket
                                    </label>

                                    <textarea
                                        value={resolution}
                                        onChange={(event) =>
                                            setResolution(
                                                event.target
                                                    .value
                                            )
                                        }
                                        rows={4}
                                        maxLength={5000}
                                        placeholder="Enter the resolution..."
                                        className="w-full resize-none rounded-lg border border-white/10 bg-[#181818] px-3 py-3 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-green-500/40"
                                    />

                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={
                                                handleResolve
                                            }
                                            disabled={
                                                resolveLoading ||
                                                !resolution.trim()
                                            }
                                            className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <FiCheckCircle />

                                            {resolveLoading
                                                ? "Resolving..."
                                                : "Resolve Ticket"}
                                        </button>
                                    </div>
                                </div>
                            )}

                        {/* Close */}
                        {ticket.status !== "closed" && (
                            <div className="flex justify-end border-t border-white/10 pt-4">
                                <button
                                    type="button"
                                    onClick={
                                        handleCloseTicket
                                    }
                                    disabled={closeLoading}
                                    className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <FiX />

                                    {closeLoading
                                        ? "Closing..."
                                        : "Close Ticket"}
                                </button>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}