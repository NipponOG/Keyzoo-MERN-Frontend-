
import Link from "next/link";
import {
    ArrowLeft,
    ExternalLink,
    TicketCheck,
} from "lucide-react";

const HELP_STEPS = [
    {
        title: "Check your order status",
        description:
            "Visit your Keyzoo order history and check whether your order is completed, processing, or awaiting payment confirmation.",
        href: "/account/orders",
        linkText: "Go to My Orders",
    },
    {
        title: "Check your email inbox",
        description:
            "Look for your order confirmation and delivery email. Also check your spam, junk, and promotions folders.",
    },
    {
        title: "Confirm your payment",
        description:
            "Check whether your payment was completed successfully. A pending or unsuccessful payment may prevent an order from being fulfilled.",
    },
    {
        title: "Allow time for processing",
        description:
            "Some orders may require additional processing or review before delivery. If your order remains processing longer than expected, contact our support team.",
    },
    {
        title: "Keep your order details ready",
        description:
            "If your product is still missing, prepare your order number and payment confirmation so our team can investigate more efficiently.",
    },
];

export default function ProductNotReceivedSupport() {
    return (
        <main className="min-h-[70vh] px-4 py-12 text-white sm:py-16">
            <div className="mx-auto max-w-3xl">
                <section className="rounded-xl border border-neutral-800 bg-[#161616] p-5 sm:p-7">
                    <div className="mb-6 flex items-start gap-3">
                        <Link
                            href="/support/product-delivery"
                            aria-label="Back to Product Delivery"
                            className="mt-0.5 rounded-md p-1 text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
                        >
                            <ArrowLeft size={23} />
                        </Link>

                        <div>
                            <h1 className="text-xl font-bold sm:text-2xl">
                                I haven't received my Product
                            </h1>
                            <p className="mt-1 text-sm text-neutral-400">
                                Follow these steps if your purchased product hasn't arrived.
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
                        If your order was paid successfully but your product is still
                        missing, create a support ticket so our team can investigate.
                    </p>

                    <Link
                        href="/account/tickets"
                        className="mt-5 inline-flex items-center gap-2 rounded-md bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
                    >
                        <TicketCheck size={17} />
                        Create a Ticket
                    </Link>
                </section>
            </div>
        </main>
    );
}
