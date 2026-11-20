'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function StatusIcon({ type }) {
    const common = {
        width: 18,
        height: 18,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        className: 'mt-0.5 shrink-0',
    };

    if (type === 'error') {
        return (
            <svg {...common}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
            </svg>
        );
    }

    return (
        <svg {...common}>
            <circle cx="12" cy="12" r="10" />
            <path d="m8 12.5 2.8 2.8L16 9.5" />
        </svg>
    );
}

const STATUS_STYLES = {
    success: 'text-emerald-700 dark:text-emerald-300',
    info: 'text-violet-700 dark:text-violet-200',
    error: 'text-red-600 dark:text-red-300',
};

export default function NewsletterSection({ moreInfoHref = '#' }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    // status: { type: 'success' | 'info' | 'error', text: string } | null
    const [status, setStatus] = useState(null);

    const timerRef = useRef(null);
    const reduceMotion = useReducedMotion();

    useEffect(() => () => clearTimeout(timerRef.current), []);

    const showStatus = (type, text) => {
        clearTimeout(timerRef.current);
        setStatus({ type, text });

        // Errors stay until the person edits the field or retries.
        if (type !== 'error') {
            timerRef.current = setTimeout(() => setStatus(null), 5000);
        }
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (loading) return;

        const trimmed = email.trim();
        if (!trimmed) return;

        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch(`${API_URL}/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: trimmed }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data?.message || 'We couldn’t subscribe you. Please try again.');
            }

            if (data?.alreadySubscribed) {
                showStatus('info', 'This email is already subscribed.');
            } else {
                showStatus('success', 'You’re in. Your first deals are on the way.');
                setEmail('');
            }
        } catch (err) {
            console.error('Newsletter subscription error:', err);

            const isNetworkError = err instanceof TypeError;
            showStatus(
                'error',
                isNetworkError
                    ? 'Can’t reach the server. Check your connection and try again.'
                    : err?.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const reveal = reduceMotion
        ? {}
        : {
              initial: { opacity: 0, y: 16 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: '-80px' },
              transition: { duration: 0.6, ease: 'easeOut' },
          };

    return (
        <section
            aria-labelledby="newsletter-heading"
            className="mt-10 w-full"
        >
            <div className="relative overflow-hidden rounded-3xl border border-violet-200 bg-violet-50 dark:border-white/10 dark:bg-[#190B30]">
                {/* Soft glow behind the artwork, the only decoration */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-violet-400/30 blur-3xl dark:bg-violet-600/30"
                />

                <div className="relative grid items-center gap-10 px-6 py-12 sm:px-10 md:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6 lg:px-16 lg:py-20">
                    {/* Copy + form */}
                    <div className="text-left">
                        <h2
                            id="newsletter-heading"
                            className="text-balance text-3xl font-bold leading-tight tracking-tight text-[#190B30] dark:text-white sm:text-4xl lg:text-[2.75rem]"
                        >
                            Get the best deals in your inbox
                        </h2>
                        <p className="mt-4 max-w-md text-base leading-relaxed text-violet-900/75 dark:text-violet-200/80">
                            New offers and price drops on games, gift cards and software, sent by email.
                        </p>

                        <form
                            onSubmit={handleSubscribe}
                            noValidate={false}
                            className="mt-8 w-full max-w-xl"
                        >
                            <label htmlFor="newsletter-email" className="sr-only">
                                Email address
                            </label>

                            {/* One joined control: field and button share a single focus ring */}
                            <div className="flex flex-col gap-2 rounded-2xl bg-white p-1.5 ring-1 ring-violet-200 transition focus-within:ring-2 focus-within:ring-violet-500 dark:bg-white/[0.06] dark:ring-white/15 dark:focus-within:ring-violet-400 sm:flex-row">
                                <input
                                    id="newsletter-email"
                                    required
                                    type="email"
                                    name="email"
                                    inputMode="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (status?.type === 'error') setStatus(null);
                                    }}
                                    aria-invalid={status?.type === 'error'}
                                    aria-describedby="newsletter-status"
                                    className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-base text-[#190B30] placeholder:text-violet-900/40 focus:outline-none dark:text-white dark:placeholder:text-violet-200/50 sm:py-3.5"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:outline-white sm:py-3.5"
                                >
                                    {loading && (
                                        <span
                                            aria-hidden="true"
                                            className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none"
                                        />
                                    )}
                                    {loading ? 'Subscribing…' : 'Subscribe'}
                                </button>
                            </div>

                            {/* Live region stays mounted so screen readers announce changes */}
                            <div
                                id="newsletter-status"
                                role="status"
                                aria-live="polite"
                                className="mt-3 min-h-[1.75rem] text-left"
                            >
                                <AnimatePresence mode="wait">
                                    {status && (
                                        <motion.p
                                            key={status.type + status.text}
                                            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                                            transition={{ duration: 0.25 }}
                                            className={`flex items-start gap-2 text-sm font-medium ${STATUS_STYLES[status.type]}`}
                                        >
                                            <StatusIcon type={status.type} />
                                            <span>{status.text}</span>
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </form>

                        <p className="mt-4 max-w-lg text-xs leading-relaxed text-violet-900/70 dark:text-violet-200/60 sm:text-sm">
                            By subscribing, you agree to receive commercial communications from Driffle.com
                            by email, including personalized updates about products and services on our
                            Marketplace.{' '}
                            <a
                                href={moreInfoHref}
                                className="font-semibold text-violet-700 underline underline-offset-2 hover:text-violet-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:text-violet-300 dark:hover:text-white dark:focus-visible:outline-violet-300"
                            >
                                Learn more
                            </a>
                        </p>
                    </div>

                    {/* Artwork */}
                    <motion.div {...reveal} className="flex justify-start lg:justify-end">
                        <Image
                            src="/3d/news.png"
                            width={400}
                            height={400}
                            sizes="(min-width: 1024px) 400px, 70vw"
                            alt="3D illustration of a newsletter envelope"
                            draggable={false}
                            className="h-auto w-full max-w-[260px] object-contain drop-shadow-2xl sm:max-w-[340px] lg:max-w-[400px]"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}