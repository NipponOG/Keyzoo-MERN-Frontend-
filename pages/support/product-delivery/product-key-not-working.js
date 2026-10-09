
import Link from "next/link";
import {
    ArrowLeft,
    TicketCheck,
} from "lucide-react";

const HELP_STEPS = [
    {
        title: "Copy the complete product key",
        description:
            "Return to your Keyzoo order and copy the entire key. Make sure no characters are missing and avoid accidentally copying spaces before or after it.",
    },
    {
        title: "Check similar characters",
        description:
            "Carefully check characters that can look alike, such as 0 and O or 1 and I. If possible, copy and paste the key instead of typing it manually.",
    },
    {
        title: "Use the correct redemption page",
        description:
            "Make sure you enter the key on the activation platform specified in your product details. A key intended for one platform may not work on another.",
    },
    {
        title: "Check the region and product edition",
        description:
            "Confirm that the key matches your region and the correct game or product edition. Region restrictions and edition mismatches can prevent redemption.",
    },
    {
        title: "Keep the exact error message",
        description:
            "If the key is still rejected, note the full error message and the platform where you tried to redeem it. This information can help our team investigate.",
    },
];

export default function ProductKeyNotWorkingSupport() {
    return (
        <main className="min-h-[70vh] px-4 py-12 text-white sm:py-16">
            <div className="mx-auto max-w-3xl">
                <section className="rounded-xl border border-neutral-800 bg-[#161616] p-5 sm:p-7">
                    <div className="mb-6 flex items-start gap-3">
                        <Link
                            href="/support/product-activation"
                            aria-label="Back to Product Activation"
                            className="mt-0.5 rounded-md p-1 text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
                        >
                            <ArrowLeft size={23} />
                        </Link>

                        <div>
                            <h1 className="text-xl font-bold sm:text-2xl">
                                Did you copy the Product correctly?
                            </h1>
                            <p className="mt-1 text-sm text-neutral-400">
                                Check these common causes before trying to redeem your key again.
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
                        If your product key is still rejected, create a ticket with the
                        exact error message and the platform you used.
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
