import Link from "next/link";
import {
    ArrowLeft,
    ChevronRight,
    MessageCircle,
    TicketCheck,
} from "lucide-react";

const SUPPORT_TOPICS = [
    {
        title: "Account and login issues",
        description: "Get help accessing or using your Keyzoo account.",
    },
    {
        title: "Product information",
        description: "Questions about a game's platform, edition, or region.",
    },
    {
        title: "Order-related questions",
        description: "Get help with an existing order or a problem not covered by another category.",
    },
    {
        title: "Something else",
        description: "Choose this option if your issue doesn't fit the topics above.",
    },
];

export default function OtherSupport() {
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
                            <MessageCircle size={25} />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold sm:text-2xl">
                                Other Issues
                            </h1>
                            <p className="mt-1 text-sm text-neutral-400">
                                Find the right support option for your issue.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {SUPPORT_TOPICS.map((topic) => (
                            <article
                                key={topic.title}
                                className="flex items-center justify-between gap-4 rounded-lg border border-neutral-800 bg-[#202020] p-4 sm:p-5"
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
                                    className="shrink-0 text-neutral-500"
                                />
                            </article>
                        ))}
                    </div>
                </section>

                <section className="mt-4 rounded-xl border border-neutral-800 bg-[#161616] px-5 py-7 text-center sm:px-8">
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                        <TicketCheck size={23} />
                    </div>

                    <h2 className="text-lg font-bold sm:text-xl">
                        Need help with something else?
                    </h2>

                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-neutral-400">
                        Visit your support tickets to see the available options for
                        getting help from the Keyzoo team.
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