
import Link from "next/link";
import {
    Gamepad2,
    PackageCheck,
    CreditCard,
    MessageCircle,
    ChevronRight,
} from "lucide-react";

const ISSUE_TYPES = [
    {
        title: "Product Activation",
        description:
            "Product key activation, validity or other key-related issues.",
        href: "/support/product-activation",
        icon: Gamepad2,
    },
    {
        title: "Product Delivery",
        description:
            "The product was not delivered or you have other delivery problems.",
        href: "/support/product-delivery",
        icon: PackageCheck,
    },
    {
        title: "Payments and Refunds",
        description:
            "Having difficulties with payments or refunds.",
        href: "/support/payments-and-refunds",
        icon: CreditCard,
    },
    {
        title: "Other",
        description:
            "Get help with other problems not described here.",
        href: "/support/other",
        icon: MessageCircle,
    },
];

export default function SupportHome() {
    return (
        <main className="min-h-[70vh] px-4 py-12 text-white sm:py-16">
            <div className="mx-auto max-w-5xl">
                <section className="rounded-xl border border-neutral-800 bg-[#161616] p-5 sm:p-7">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold sm:text-2xl">
                            Choose the type of issue
                        </h1>
                        <p className="mt-1 text-sm text-neutral-400">
                            What kind of issue are you experiencing?
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {ISSUE_TYPES.map((issue) => {
                            const Icon = issue.icon;

                            return (
                                <Link
                                    key={issue.title}
                                    href={issue.href}
                                    className="group flex min-h-[114px] items-center gap-4 rounded-lg border border-neutral-800 bg-[#202020] p-5 transition duration-200 hover:border-purple-500/60 hover:bg-[#26212f] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 transition group-hover:bg-purple-500/20">
                                        <Icon size={25} strokeWidth={1.8} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-sm font-semibold text-white sm:text-base">
                                            {issue.title}
                                        </h2>
                                        <p className="mt-1 text-sm leading-5 text-neutral-400">
                                            {issue.description}
                                        </p>
                                    </div>

                                    <ChevronRight
                                        size={18}
                                        className="shrink-0 text-neutral-500 transition group-hover:translate-x-1 group-hover:text-purple-400"
                                    />
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    );
}
