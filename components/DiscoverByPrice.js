import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoArrowForward } from "react-icons/io5";
import useCurrency from "@/hook/useCurrency";

const PRICE_STEPS = [100, 200, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];

// Change this to match your listing route / query param
const priceHref = (max) => `/games?maxPrice=${max}`;

const formatPrice = (n) => n.toLocaleString("en-US");

function PriceChip({ amount, symbol }) {
    return (
        <Link
            href={priceHref(amount)}
            aria-label={`Games under ${symbol} ${formatPrice(amount)}`}
            className="group relative flex min-h-[92px] flex-col items-start justify-center overflow-hidden rounded-2xl
                       border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-sm
                       transition-all duration-300 ease-out
                       hover:-translate-y-1 hover:border-purple-400/50 hover:bg-white/[0.08]
                       hover:shadow-lg hover:shadow-purple-500/20
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
            {/* hover glow */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-purple-500/30 blur-2xl
                           opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400 transition-colors group-hover:text-purple-200">
                Under
            </span>

            <span className="mt-1 text-xl font-bold text-white sm:text-2xl">
                {symbol}
                {formatPrice(amount)}
            </span>

            <IoArrowForward
                aria-hidden="true"
                className="absolute right-4 top-4 -translate-x-1 text-lg text-white/0 transition-all duration-300
                           group-hover:translate-x-0 group-hover:text-white/80"
            />
        </Link>
    );
}

function CustomBudget({ symbol }) {
    const router = useRouter();
    const [value, setValue] = useState("");

    const submit = (e) => {
        e.preventDefault();
        const amount = Math.floor(Number(value));
        if (!amount || amount < 1) return;
        router.push(priceHref(amount));
    };

    return (
        <form
            onSubmit={submit}
            className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center"
        >
            <label htmlFor="custom-budget" className="text-sm text-gray-400 sm:mr-2">
                Or set your own budget
            </label>

            <div className="flex flex-1 gap-3">
                <div
                    className="flex flex-1 items-center rounded-xl border border-white/10 bg-white/[0.04] px-4
                               transition focus-within:border-purple-400/60 focus-within:ring-2 focus-within:ring-purple-400/30"
                >
                    <span className="mr-2 text-gray-400">{symbol}</span>
                    <input
                        id="custom-budget"
                        type="number"
                        inputMode="numeric"
                        min="1"
                        step="1"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="e.g. 750"
                        className="w-full bg-transparent py-3 text-white placeholder:text-gray-600 focus:outline-none
                                   [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!value || Number(value) < 1}
                    className="rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6D28D9] px-5 py-3 text-sm font-semibold text-white
                               shadow-lg shadow-purple-600/20 transition-all duration-300
                               hover:shadow-purple-600/40 disabled:cursor-not-allowed disabled:opacity-40
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                    Show deals
                </button>
            </div>
        </form>
    );
}

export default function DiscoverByPrice() {
    const { symbol } = useCurrency();

    return (
        <section
            aria-labelledby="discover-by-price-heading"
            className="relative w-full overflow-hidden rounded-3xl border border-white/10
                       bg-gradient-to-br from-[#101014] via-[#15151b] to-[#1a1523]
                       px-4 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14"
        >
            {/* Decorative background (single layer, hidden from assistive tech) */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute -left-32 -top-32 h-[320px] w-[320px] rounded-full bg-violet-500/15 blur-[120px] lg:h-[420px] lg:w-[420px]" />
                <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                        backgroundSize: "22px 22px",
                        maskImage: "linear-gradient(to bottom right, #000, transparent 70%)",
                        WebkitMaskImage: "linear-gradient(to bottom right, #000, transparent 70%)",
                    }}
                />
            </div>

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-12">
                {/* ---------- Left: content ---------- */}
                <div>
                    <span className="inline-block rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-purple-200">
                        Shop by budget
                    </span>

                    <h2
                        id="discover-by-price-heading"
                        className="mt-4 text-2xl font-bold text-white sm:text-3xl xl:text-4xl"
                    >
                        Discover By Price
                    </h2>

                    <p className="mt-3 max-w-[520px] text-sm text-gray-400 sm:text-base">
                        Find the best gaming deals instantly based on your budget.
                    </p>

                    <nav aria-label="Browse games by price" className="mt-8">
                        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                            {PRICE_STEPS.map((amount) => (
                                <li key={amount}>
                                    <PriceChip amount={amount} symbol={symbol} />
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <CustomBudget symbol={symbol} />
                </div>

                {/* ---------- Right: illustration ---------- */}
                <div className="relative hidden items-center justify-center lg:flex">
                    <div
                        aria-hidden="true"
                        className="absolute h-[70%] w-[70%] rounded-full bg-purple-500/20 blur-3xl"
                    />
                    <Image
                        src="/confused.png"
                        alt=""
                        width={650}
                        height={650}
                        sizes="(min-width: 1024px) 35vw, 0px"
                        className="pointer-events-none relative h-auto w-full max-w-[560px] select-none object-contain drop-shadow-2xl"
                    />
                </div>
            </div>
        </section>
    );
}