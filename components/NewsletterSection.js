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
            <svg {...common} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.3942 3.00083L14.1481 2.79115C12.9103 1.73628 11.0897 1.73628 9.85189 2.79115L9.60584 3.00083C8.96518 3.54679 8.16862 3.87674 7.32956 3.9437L7.00731 3.96941C5.38613 4.09878 4.09878 5.38613 3.96941 7.00731L3.9437 7.32956C3.87674 8.16862 3.54679 8.96518 3.00083 9.60584L2.79115 9.85189C1.73628 11.0897 1.73628 12.9103 2.79115 14.1481L3.00083 14.3942C3.54679 15.0348 3.87674 15.8314 3.9437 16.6704L3.96941 16.9927C4.09878 18.6139 5.38613 19.9012 7.00731 20.0306L7.32956 20.0563C8.16862 20.1233 8.96518 20.4532 9.60584 20.9992L9.85188 21.2089C11.0897 22.2637 12.9103 22.2637 14.1481 21.2089L14.3942 20.9992C15.0348 20.4532 15.8314 20.1233 16.6704 20.0563L16.9927 20.0306C18.6139 19.9012 19.9012 18.6139 20.0306 16.9927L20.0563 16.6704C20.1233 15.8314 20.4532 15.0348 20.9992 14.3942L21.2089 14.1481C22.2637 12.9103 22.2637 11.0897 21.2089 9.85188L20.9992 9.60584C20.4532 8.96518 20.1233 8.16862 20.0563 7.32956L20.0306 7.00731C19.9012 5.38613 18.6139 4.09878 16.9927 3.96941L16.6704 3.9437C15.8314 3.87674 15.0348 3.54679 14.3942 3.00083Z"></path>
                <path d="M12 8V12"></path>
                <path d="M12.125 15.75H12M12.25 15.75C12.25 15.8881 12.1381 16 12 16C11.8619 16 11.75 15.8881 11.75 15.75C11.75 15.6119 11.8619 15.5 12 15.5C12.1381 15.5 12.25 15.6119 12.25 15.75Z"></path>
            </svg>
        );
    }

    return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.2618 3.59937C13.1956 2.53312 12.6625 2 12 2C11.3375 2 10.8044 2.53312 9.73815 3.59937C9.09832 4.2392 8.46427 4.53626 7.55208 4.53626C6.7556 4.53626 5.62243 4.38178 5 5.00944C4.38249 5.63214 4.53628 6.76065 4.53628 7.55206C4.53628 8.46428 4.2392 9.09832 3.59935 9.73817C2.53312 10.8044 2.00001 11.3375 2 12C2.00002 12.6624 2.53314 13.1956 3.59938 14.2618C4.31616 14.9786 4.53628 15.4414 4.53628 16.4479C4.53628 17.2444 4.38181 18.3776 5.00949 19C5.63218 19.6175 6.76068 19.4637 7.55206 19.4637C8.52349 19.4637 8.99128 19.6537 9.68457 20.347C10.2749 20.9374 11.0663 22 12 22C12.9337 22 13.7251 20.9374 14.3154 20.347C15.0087 19.6537 15.4765 19.4637 16.4479 19.4637C17.2393 19.4637 18.3678 19.6175 18.9905 19M20.4006 9.73817C21.4669 10.8044 22 11.3375 22 12C22 12.6624 21.4669 13.1956 20.4006 14.2618C19.6838 14.9786 19.4637 15.4414 19.4637 16.4479C19.4637 17.2444 19.6182 18.3776 18.9905 19M18.9905 19H19"></path>
            <path d="M8 10.3077C8 10.3077 10.25 10 12 14C12 14 17.0588 4 22 2"></path>
        </svg>
    );
}

const STATUS_STYLES = {
    success: 'text-emerald-700 dark:text-emerald-300',
    info: 'text-white dark:text-white',
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
            <div className="relative overflow-hidden rounded-3xl outline-none dark:border-white/10 dark:bg-[#190B30]">
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
                            className="text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]"
                        >
                            Get the best deals in your inbox
                        </h2>
                        <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
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
                                    className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-base text-[#190B30] placeholder:text-violet-900/40 focus:outline-none dark:text-white dark:placeholder:text-violet-200/50 sm:py-3.5 font-bold"
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

                        <p className="mt-4 max-w-lg text-xs leading-relaxed text-white/70 sm:text-sm">
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