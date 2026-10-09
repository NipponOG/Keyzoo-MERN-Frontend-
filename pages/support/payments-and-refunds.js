import Link from "next/link";
import {
    ArrowLeft,
    ChevronRight,
    CreditCard,
    TicketCheck,
} from "lucide-react";

const SUPPORT_TOPICS = [
    {
        title: "My payment failed",
        description: "Get help with a failed or unsuccessful payment.",
        href: "/support/payments-and-refunds/payment-failed",
    },
    {
        title: "I was charged but my order is missing",
        description: "Learn what to do if your payment went through but no order appears.",
        href: "/support/payments-and-refunds/charged-order-missing",
    },
    {
        title: "How do I request a refund?",
        description: "Find out how to get help with a refund request.",
        href: "/support/payments-and-refunds/refund-request",
    },
    {
        title: "My refund hasn't arrived",
        description: "What to check if your refund is taking longer than expected.",
        href: "/support/payments-and-refunds/refund-not-received",
    },
    {
        title: "Other",
        description: "Get help with a different payment or refund issue.",
        href: "/support/other",
    },
];

export default function PaymentsAndRefundsSupport() {
    return (
        <main className="min-h-[70vh] bg-[#0b0b0b] px-4 py-12 text-white sm:py-16">
            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <Link
                        href="/support"
                        className="inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white"
                    >
                        <ArrowLeft size={17} />
                        Back to Support
                    </Link>
                </div>

                <section className="rounded-xl border border-neutral-800 bg-[#161616] p-5 sm:p-7">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                            <CreditCard size={25} />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold sm:text-2xl">
                                Payments and Refunds
                            </h1>
                            <p className="mt-1 text-sm text-neutral-400">
                                Choose the issue you're experiencing.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {SUPPORT_TOPICS.map((topic) => (
                            <Link
                                key={topic.title}
                                href={topic.href}
                                className="group flex items-center justify-between gap-4 rounded-lg border border-neutral-800 bg-[#202020] p-4 transition hover:border-purple-500/50 hover:bg-[#25212d] sm:p-5"
                            >
                                <div className="min-w-0">
                                    <h2 className="text-sm font-semibold sm:text-base">
                                        {topic.title}
                                    </h2>
                                    <p className="mt-1 text-sm leading-5 text-neutral-400">
                                        {topic.description}
                                    </p>
                                </div>

                                <ChevronRight
                                    size={20}
                                    className="shrink-0 text-neutral-500 transition group-hover:translate-x-1 group-hover:text-purple-400"
                                />
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mt-4 rounded-xl border border-neutral-800 bg-[#161616] px-5 py-7 text-center sm:px-8">
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                        <TicketCheck size={23} />
                    </div>

                    <h2 className="text-lg font-bold sm:text-xl">
                        Are you still experiencing problems?
                    </h2>

                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-neutral-400">
                        If these articles don't resolve your issue, visit your tickets
                        to find the available support options.
                    </p>

                    <Link
                        href="/account/tickets"
                        className="mt-5 inline-flex items-center gap-2 rounded-md bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
                    >
                        <TicketCheck size={17} />
                        Go to Support Tickets
                    </Link>
                </section>
            </div>
        </main>
    );
}