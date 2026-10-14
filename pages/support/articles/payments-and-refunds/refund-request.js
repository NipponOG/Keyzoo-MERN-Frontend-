
import Link from "next/link";
import {
    ArrowLeft,
    ChevronRight,
    PackageCheck,
    TicketCheck,
} from "lucide-react";

const TOPICS = [
    {
        title: "I haven't received my Product",
        description:
            "Your payment was successful, but your product hasn't arrived yet.",
        href: "/support/product-delivery/product-not-received",
    },
    {
        title: "I cannot find the Product",
        description:
            "You purchased a product but can't locate it in your account.",
        href: "/support/product-activation/i-cannot-find-the-product",
    },
    {
        title: "My order is still processing",
        description:
            "Your order hasn't completed processing yet.",
        href: "/support/product-delivery/order-processing",
    },
    {
        title: "Other",
        description:
            "Get help with another product delivery issue.",
        href: "/support/other",
    },
];

export default function ProductDeliverySupport() {
    return (
        <main className="min-h-[70vh] px-4 py-12 text-white sm:py-16">
            <div className="mx-auto max-w-3xl">
                <section className="rounded-xl border border-neutral-800 bg-[#161616] p-5 sm:p-7">
                    <div className="mb-6 flex items-center gap-3">
                        <Link
                            href="/support"
                            aria-label="Back to support"
                            className="rounded-md p-1 text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
                        >
                            <ArrowLeft size={23} />
                        </Link>

                        <div>
                            <h1 className="text-xl font-bold sm:text-2xl">
                                Product Delivery
                            </h1>
                            <p className="mt-1 text-sm text-neutral-400">
                                Choose the delivery issue you need help with.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {TOPICS.map((topic, index) => (
                            <Link
                                key={topic.title}
                                href={topic.href}
                                className="group flex min-h-[78px] items-center gap-4 rounded-lg border border-neutral-800 bg-[#202020] px-4 py-4 transition duration-200 hover:border-purple-500/60 hover:bg-[#26212f] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 sm:px-5"
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-sm font-semibold text-neutral-300 group-hover:bg-purple-500/15 group-hover:text-purple-300">
                                    {index + 1}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <h2 className="text-sm font-semibold text-white sm:text-base">
                                        {topic.title}
                                    </h2>
                                    <p className="mt-1 text-sm leading-5 text-neutral-400">
                                        {topic.description}
                                    </p>
                                </div>

                                <ChevronRight
                                    size={19}
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
                        If your product hasn't arrived, our support team can help
                        investigate your order.
                    </p>

                    <Link
                        href="/account/tickets"
                        className="mt-5 inline-flex items-center gap-2 rounded-md bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
                    >
                        <PackageCheck size={17} />
                        Create a Ticket
                    </Link>
                </section>
            </div>
        </main>
    );
}
