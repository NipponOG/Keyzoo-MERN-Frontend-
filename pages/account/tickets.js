import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    ClipboardList,
    Headset,
    ShoppingBag,
} from "lucide-react";

export default function SupportTicketsPage() {
    return (
        <main className="min-h-[70vh] px-4 py-12 text-white sm:px-6 sm:py-16">
            <div className="mx-auto max-w-4xl">
                <Link
                    href="/support"
                    className="inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white"
                >
                    <ArrowLeft size={17} />
                    Back to Support
                </Link>

                <section className="mt-6 rounded-xl border border-neutral-800 bg-[#161616] p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                            <Headset size={26} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Support Tickets
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
                                Need help with an order? Start by finding your order so you
                                can create a support ticket associated with the correct
                                purchase.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <Link
                            href="/account/tickets/my-tickets"
                            className="group rounded-xl border border-neutral-800 bg-[#202020] p-5 transition hover:border-purple-500/50 hover:bg-[#25212d]"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                                <ShoppingBag size={22} />
                            </div>

                            <h2 className="mt-4 text-base font-semibold">
                                Get help with an order
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-neutral-400">
                                Find your purchase and use its support option to raise a
                                ticket.
                            </p>

                            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-purple-400">
                                View My Orders
                                <ArrowRight
                                    size={16}
                                    className="transition group-hover:translate-x-1"
                                />
                            </span>
                        </Link>

                        <Link
                            href="/support"
                            className="group rounded-xl border border-neutral-800 bg-[#202020] p-5 transition hover:border-purple-500/50 hover:bg-[#25212d]"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                                <ClipboardList size={22} />
                            </div>

                            <h2 className="mt-4 text-base font-semibold">
                                Browse help articles
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-neutral-400">
                                Explore troubleshooting guides for activation, delivery,
                                payments, and refunds.
                            </p>

                            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-purple-400">
                                Visit Support Center
                                <ArrowRight
                                    size={16}
                                    className="transition group-hover:translate-x-1"
                                />
                            </span>
                        </Link>
                    </div>

                    <div className="mt-6 rounded-lg border border-neutral-800 bg-[#111111] p-4">
                        <p className="text-sm leading-6 text-neutral-400">
                            <span className="font-semibold text-white">
                                Looking for an existing ticket?
                            </span>{" "}
                            Your ticket history will appear here once we connect this page
                            to your backend's ticket-list endpoint.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}