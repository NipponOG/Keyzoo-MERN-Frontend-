import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import CustomDropdown from "@/components/CustomDropdown";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

const CATEGORIES = [
    {
        value: "key_not_working",
        label: "Key not working",
    },
    {
        value: "wrong_key",
        label: "Wrong key",
    },
    {
        value: "key_already_used",
        label: "Key already used",
    },
    {
        value: "activation_problem",
        label: "Activation problem",
    },
    {
        value: "region_problem",
        label: "Region problem",
    },
    {
        value: "missing_key",
        label: "Missing key",
    },
    {
        value: "wrong_product",
        label: "Wrong product",
    },
    {
        value: "payment_problem",
        label: "Payment problem",
    },
    {
        value: "order_problem",
        label: "Order problem",
    },
    {
        value: "other",
        label: "Other",
    },
];

const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;

export default function NewTicketPage() {
    const router = useRouter();

    const {
        user,
        jwt,
        loading: authLoading,
    } = useAuth();

    const [order, setOrder] = useState(null);
    const [selectedItem, setSelectedItem] = useState("");

    const [category, setCategory] =
        useState("key_not_working");

    const [subject, setSubject] = useState("");
    const [description, setDescription] =
        useState("");

    const [attachments, setAttachments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const orderNumber =
        router.query.orderNumber ||
        router.query.orderId;

    useEffect(() => {
        if (!router.isReady || authLoading) {
            return;
        }

        if (!user || !jwt) {
            setError(
                "Please sign in to raise a support ticket."
            );
            setLoading(false);
            return;
        }

        if (
            !orderNumber ||
            orderNumber === "undefined"
        ) {
            setError(
                "Order information is missing."
            );
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await apiFetch(
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

                const fetchedOrder =
                    response?.order ||
                    response?.data ||
                    null;

                if (!fetchedOrder) {
                    throw new Error(
                        "Unable to load this order."
                    );
                }

                setOrder(fetchedOrder);

                if (
                    Array.isArray(
                        fetchedOrder.items
                    ) &&
                    fetchedOrder.items.length > 0
                ) {
                    setSelectedItem(
                        fetchedOrder.items[0].id ||
                        fetchedOrder.items[0]._id ||
                        ""
                    );
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message ||
                        "Unable to load the order."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchOrder();

        return () => {
            cancelled = true;
        };
    }, [
        router.isReady,
        orderNumber,
        user,
        jwt,
        authLoading,
    ]);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(
            event.target.files || []
        );

        setError("");

        if (!selectedFiles.length) {
            return;
        }

        if (
            attachments.length +
            selectedFiles.length >
            MAX_FILES
        ) {
            setError(
                `You can attach a maximum of ${MAX_FILES} files.`
            );

            event.target.value = "";
            return;
        }

        for (const file of selectedFiles) {
            if (
                !ALLOWED_FILE_TYPES.includes(
                    file.type
                )
            ) {
                setError(
                    "Unsupported file type. Only JPG, PNG, WEBP, and PDF files are allowed."
                );

                event.target.value = "";
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                setError(
                    `"${file.name}" is larger than 10 MB.`
                );

                event.target.value = "";
                return;
            }
        }

        setAttachments((current) => [
            ...current,
            ...selectedFiles,
        ]);

        event.target.value = "";
    };

    const removeAttachment = (index) => {
        setAttachments((current) =>
            current.filter(
                (_, currentIndex) =>
                    currentIndex !== index
            )
        );
    };

    const uploadAttachments = async () => {
        if (!attachments.length) {
            return [];
        }

        const formData = new FormData();

        attachments.forEach((file) => {
            formData.append(
                "attachments",
                file
            );
        });

        const response = await apiFetch(
            "/uploads/attachments",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                body: formData,
            }
        );

        return (
            response?.data ||
            response?.attachments ||
            []
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedItem) {
            setError(
                "Please select the item you need help with."
            );
            return;
        }

        if (!subject.trim()) {
            setError(
                "Please enter a subject."
            );
            return;
        }

        if (!description.trim()) {
            setError(
                "Please describe your issue."
            );
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const uploadedAttachments =
                await uploadAttachments();

            const response = await apiFetch(
                "/tickets",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        orderId: order._id,
                        productId: selectedItem,
                        category,
                        subject: subject.trim(),
                        description:
                            description.trim(),
                        attachments:
                            uploadedAttachments,
                    }),
                }
            );

            const ticket =
                response?.data ||
                response?.ticket ||
                null;

            if (!ticket?._id) {
                throw new Error(
                    "Ticket was created but its ID was not returned."
                );
            }

            router.push(
                `/account/tickets/${encodeURIComponent(
                    ticket.ticketNumber ||
                    ticket._id
                )}`
            );
        } catch (err) {
            setError(
                err.message ||
                "Unable to create support ticket."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || loading) {
        return (
            <main className="min-h-screen px-4 py-10 text-white sm:px-6">
                <div className="mx-auto max-w-3xl">
                    <div className="h-8 w-48 animate-pulse rounded bg-white/10" />

                    <div className="mt-8 space-y-4">
                        <div className="h-32 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />

                        <div className="h-64 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />
                    </div>
                </div>
            </main>
        );
    }

    if (error && !order) {
        return (
            <main className="min-h-screen px-4 py-10 text-white sm:px-6">
                <div className="mx-auto max-w-3xl">
                    <Link
                        href="/account/tickets"
                        className="text-sm text-white/50 transition hover:text-white"
                    >
                        ← Back to Support Tickets
                    </Link>

                    <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen px-4 py-10 text-white sm:px-6">
            <div className="mx-auto max-w-3xl">
                <Link
                    href={
                        orderNumber
                            ? `/orders/${encodeURIComponent(
                                order?.orderNumber ||
                                ""
                            )}`
                            : "/account/tickets"
                    }
                    className="text-sm text-white/50 transition hover:text-white"
                >
                    ← Back
                </Link>

                <div className="mt-6">
                    <p className="text-xs uppercase tracking-wide text-white/40">
                        Support
                    </p>

                    <h1 className="mt-1 text-2xl font-semibold">
                        Raise a Support Ticket
                    </h1>

                    <p className="mt-2 text-sm text-white/40">
                        Tell us what went wrong and our
                        support team will help you.
                    </p>
                </div>

                {order && (
                    <section className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-xs uppercase tracking-wide text-white/30">
                            Order
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                            {order.orderNumber}
                        </p>

                        <div className="mt-4 space-y-3">
                            {order.items?.map(
                                (item, index) => {
                                    const itemId =
                                        item.id ||
                                        item._id ||
                                        "";

                                    return (
                                        <label
                                            key={`${itemId}-${index}`}
                                            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${selectedItem ===
                                                itemId
                                                ? "border-purple-500/50 bg-purple-500/10"
                                                : "border-white/10 bg-white/[0.02] hover:border-white/20"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="ticket-item"
                                                value={itemId}
                                                checked={
                                                    selectedItem ===
                                                    itemId
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setSelectedItem(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className="mt-1 accent-purple-500"
                                            />

                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-white">
                                                    {
                                                        item.title
                                                    }
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
                                        </label>
                                    );
                                }
                            )}
                        </div>
                    </section>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-5"
                >
                    {error && (
                        <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    {/* <div>
                        <label
                            htmlFor="category"
                            className="text-sm font-medium text-white"
                        >
                            Issue type
                        </label>

                        <select
                            id="category"
                            value={category}
                            onChange={(event) =>
                                setCategory(
                                    event.target.value
                                )
                            }
                            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-3 text-sm text-white outline-none transition focus:border-purple-500/50"
                        >
                            {CATEGORIES.map(
                                (item) => (
                                    <option
                                        key={
                                            item.value
                                        }
                                        value={
                                            item.value
                                        }
                                    >
                                        {item.label}
                                    </option>
                                )
                            )}
                        </select>
                    </div> */}

                    <div>
                        <label
                            htmlFor="category"
                            className="text-sm font-medium text-white"
                        >
                            Issue type
                        </label>

                        <div className="mt-2">
                            <CustomDropdown
                                options={CATEGORIES}
                                value={category}
                                onChange={setCategory}
                                placeholder="Select issue type"
                            />
                        </div>
                    </div>

                    <div className="mt-5">
                        <label
                            htmlFor="subject"
                            className="text-sm font-medium text-white"
                        >
                            Subject
                        </label>

                        <input
                            id="subject"
                            type="text"
                            value={subject}
                            onChange={(event) =>
                                setSubject(
                                    event.target.value
                                )
                            }
                            placeholder="Briefly describe the issue"
                            maxLength={150}
                            className="mt-2 w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-purple-500/50"
                        />
                    </div>

                    <div className="mt-5">
                        <label
                            htmlFor="description"
                            className="text-sm font-medium text-white"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            placeholder="Please explain the issue in detail..."
                            rows={7}
                            maxLength={5000}
                            className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-neutral-900 px-3 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-purple-500/50"
                        />
                    </div>

                    <div className="mt-5">
                        <label
                            htmlFor="attachments"
                            className="text-sm font-medium text-white"
                        >
                            Attachments
                        </label>

                        <div className="mt-2 rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-4">
                            <input
                                id="attachments"
                                type="file"
                                multiple
                                accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                                onChange={
                                    handleFileChange
                                }
                                disabled={
                                    submitting ||
                                    attachments.length >=
                                    MAX_FILES
                                }
                                className="block w-full text-sm text-white/60 file:mr-4 file:rounded-lg file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white file:transition hover:file:bg-purple-500 disabled:cursor-not-allowed"
                            />

                            <p className="mt-2 text-xs text-white/30">
                                JPG, PNG, WEBP, or PDF.
                                Maximum 10 MB per file and{" "}
                                {MAX_FILES} files.
                            </p>

                            {attachments.length >
                                0 && (
                                    <div className="mt-4 space-y-2">
                                        {attachments.map(
                                            (
                                                file,
                                                index
                                            ) => (
                                                <div
                                                    key={`${file.name}-${file.size}-${index}`}
                                                    className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm text-white/80">
                                                            {
                                                                file.name
                                                            }
                                                        </p>

                                                        <p className="text-xs text-white/30">
                                                            {(
                                                                file.size /
                                                                1024 /
                                                                1024
                                                            ).toFixed(
                                                                2
                                                            )}{" "}
                                                            MB
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeAttachment(
                                                                index
                                                            )
                                                        }
                                                        disabled={
                                                            submitting
                                                        }
                                                        className="shrink-0 text-xs text-white/40 transition hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/account/tickets"
                            className="inline-flex items-center justify-center rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-white/60 transition hover:border-white/20 hover:text-white"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting
                                ? attachments.length
                                    ? "Uploading & Creating..."
                                    : "Creating Ticket..."
                                : "Create Ticket"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}