import Link from "next/link";
import {
    ArrowLeft,
    ExternalLink,
    TicketCheck,
} from "lucide-react";

const HELP_STEPS = [
    {
        title: "Check your order history",
        description:
            "Open your Keyzoo account and look for the order. It may already exist even if you didn't see a confirmation immediately after checkout.",
        href: "/account/orders",
        linkText: "Go to My Orders",
    },
    {
        title: "Check your email",
        description:
            "Look in your inbox, spam, and junk folders for an order confirmation. Make sure you're checking the email address you used during checkout.",
    },
    {
        title: "Verify the payment transaction",
        description:
            "Check your bank statement or payment app to see whether the transaction is completed, pending, or reversed. A pending transaction does not always mean the payment was captured successfully.",
    },
    {
        title: "Avoid paying for the same order again",
        description:
            "Before trying checkout again, confirm whether an order was created or the original transaction is still pending. This helps prevent duplicate payments.",
    },
    {
        title: "Keep your transaction details ready",
        description:
            "If you still cannot find your order, keep the transaction reference, payment amount, approximate payment time, and checkout email available for the support team. Never share your password or full card details.",
    },
];

export default function ChargedOrderMissingSupport() {
    return (
        <main className="min-h-[70vh] bg-[#0b0b0b] px-4 py-12 text-white sm:py-16">
            <div className="mx-auto max-w-3xl">
                <section className="rounded-xl border border-neutral-800 bg-[#161616] p-5 sm:p-7">
                    <div className="mb-6 flex items-start gap-3">
                        <Link
                            href="/support/payments-and-refunds"
                            aria-label="Back to Payments and Refunds"
                            className="mt-0.5 rounded-md p-1 text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
                        >
                            <ArrowLeft size={23} />
                        </Link>

                        <div>
                            <h1 className="text-xl font-bold sm:text-2xl">
                                I was charged but my order is missing
                            </h1>
                            <p className="mt-1 text-sm text-neutral-400">
                                Here's what to check if your payment appears successful but
                                your order isn't showing up.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {HELP_STEPS.map((step, index) => (
                            <article
                                key={step.title}
                                className="rounded-lg border border-neutral-800 bg-[#202020] p-4 sm:p-5"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-sm font-semibold text-neutral-300">
                                        {index + 1}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-sm font-semibold sm:text-base">
                                            {step.title}
                                        </h2>

                                        <p className="mt-1 text-sm leading-6 text-neutral-400">
                                            {step.description}
                                        </p>

                                        {step.href && (
                                            <Link
                                                href={step.href}
                                                className="mt-3 inline-flex items-center gap-2 rounded-md bg-neutral-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-neutral-600"
                                            >
                                                {step.linkText}
                                                <ExternalLink size={15} />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </article>
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
                        If your order is still missing, visit your support tickets for
                        the available support options. Include your transaction reference
                        so the team can investigate.
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
