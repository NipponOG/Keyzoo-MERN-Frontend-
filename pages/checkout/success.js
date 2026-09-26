'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

export default function CheckoutSuccess() {
    const router = useRouter();

    const {
        user,
        jwt,
        loading: authLoading,
    } = useAuth();

    const {
        order: orderNumber,
    } = router.query;

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const [order, setOrder] =
        useState(null);

    const [copiedKey, setCopiedKey] =
        useState('');

    useEffect(() => {
        if (
            !router.isReady ||
            authLoading
        ) {
            return;
        }

        if (!orderNumber) {
            setError(
                'Order number is missing.'
            );

            setLoading(false);
            return;
        }

        if (!user || !jwt) {
            setError(
                'Please sign in to view your order.'
            );

            setLoading(false);
            return;
        }

        let cancelled = false;
        let pollTimer = null;

        const fetchOrder = async (
            isPolling = false
        ) => {
            try {
                /*
                 * Only show the full loading screen
                 * for the initial request.
                 *
                 * Background polling should be silent.
                 */
                if (!isPolling) {
                    setLoading(true);
                }

                setError('');

                const data = await apiFetch(
                    `/orders/my/${encodeURIComponent(
                        orderNumber
                    )}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${jwt}`,
                        },
                    }
                );

                if (cancelled) {
                    return;
                }

                const fetchedOrder =
                    data.order;

                setOrder(fetchedOrder);
                setLoading(false);

                /*
                 * Payment succeeded but fulfillment
                 * has not finished yet.
                 *
                 * Check again after 3 seconds.
                 */
                const shouldPoll =
                    fetchedOrder?.paymentStatus ===
                    'paid' &&
                    fetchedOrder?.deliveryStatus !==
                    'ready';

                if (shouldPoll) {
                    pollTimer = setTimeout(
                        () => {
                            fetchOrder(true);
                        },
                        3000
                    );
                }
            } catch (err) {
                if (cancelled) {
                    return;
                }

                setError(
                    err.message ||
                    'Unable to load your order.'
                );

                setLoading(false);
            }
        };

        fetchOrder();

        return () => {
            cancelled = true;

            if (pollTimer) {
                clearTimeout(
                    pollTimer
                );
            }
        };
    }, [
        router.isReady,
        orderNumber,
        user,
        jwt,
        authLoading,
    ]);

    const copyKey = async (code) => {
        try {
            await navigator.clipboard.writeText(
                code
            );

            setCopiedKey(code);

            setTimeout(() => {
                setCopiedKey('');
            }, 2000);
        } catch (error) {
            console.error(
                'Failed to copy key:',
                error
            );
        }
    };

    if (
        authLoading ||
        loading
    ) {
        return (
            <main className="min-h-screen text-white px-4 py-16">
                <div className="max-w-5xl mx-auto flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-white/20 border-t-purple-500 animate-spin" />

                        <p className="text-white/60">
                            Loading your order...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen text-white px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                        <h1 className="text-2xl font-semibold">
                            Unable to load order
                        </h1>

                        <p className="mt-3 text-white/60">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                router.push('/')
                            }
                            className="mt-6 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                        >
                            Back to store
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (!order) {
        return null;
    }

    const firstItem =
        order.items?.[0];

    const keys =
        Array.isArray(order.keys)
            ? order.keys
            : [];

    const isDelivered =
        order.paymentStatus === 'paid' &&
        order.deliveryStatus === 'ready' &&
        keys.length > 0;

    return (
        <main className="min-h-screen text-white px-4 sm:px-6 py-10 sm:py-14">
            <div className="max-w-5xl mx-auto">

                {/* Success Header */}
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
                        <svg
                            className="h-8 w-8 text-green-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12.5l4 4L19 7.5"
                            />
                        </svg>
                    </div>

                    <h1 className="mt-5 text-3xl sm:text-4xl font-bold">
                        Payment successful
                    </h1>

                    <p className="mt-3 text-white/60">
                        Thank you for your purchase.
                        Your digital product is ready.
                    </p>

                    <p className="mt-2 text-sm text-white/40">
                        Order #{order.orderNumber}
                    </p>
                </div>

                {/* Main Content */}
                <div className="mt-10 space-y-6">

                    {/* Product */}
                    {firstItem && (
                        <section className="rounded-2xl border border-neutral-800 bg-[#151515] p-5 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-5">

                                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-800">
                                    {firstItem.image ? (
                                        <img
                                            src={
                                                firstItem.image
                                            }
                                            alt={
                                                firstItem.title
                                            }
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-white/30">
                                            DIGITAL
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h2 className="text-lg font-semibold">
                                        {
                                            firstItem.title
                                        }
                                    </h2>

                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/50">
                                        {firstItem.region && (
                                            <span>
                                                Region:{' '}
                                                {
                                                    firstItem.region
                                                }
                                            </span>
                                        )}

                                        {firstItem.var_title && (
                                            <span>
                                                Edition:{' '}
                                                {
                                                    firstItem.var_title
                                                }
                                            </span>
                                        )}

                                        <span>
                                            Quantity:{' '}
                                            {
                                                firstItem.quantity
                                            }
                                        </span>
                                    </div>
                                </div>

                                <div className="text-left sm:text-right">
                                    <p className="text-lg font-semibold">
                                        {order.currency}{' '}
                                        {Number(
                                            firstItem.subtotal
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Game Keys */}
                    <section className="rounded-2xl border border-purple-500/20 bg-gradient-to-b from-purple-500/[0.07] to-transparent p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Your game key
                                </h2>

                                <p className="mt-1 text-sm text-white/50">
                                    Your digital key is ready to use.
                                </p>
                            </div>

                            <div className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                                Delivered
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            {isDelivered ? (
                                keys.map(
                                    (key, index) => (
                                        <div
                                            key={
                                                key.keyId ||
                                                index
                                            }
                                            className="rounded-xl border border-neutral-700 bg-black/30 p-4"
                                        >
                                            <div className="min-w-0">
                                                <p className="mb-2 text-xs text-white/40">
                                                    {key.title}
                                                </p>

                                                <div className="flex flex-col sm:flex-row sm:items-stretch gap-3">
                                                    <div className="min-w-0 flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 flex items-center">
                                                        <code className="block w-full break-all text-sm sm:text-base font-mono text-white">
                                                            {key.code}
                                                        </code>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            copyKey(key.code)
                                                        }
                                                        className="shrink-0 sm:self-stretch rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                                                    >
                                                        {copiedKey === key.code
                                                            ? 'Copied!'
                                                            : 'Copy key'}
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    )
                                )
                            ) : (
                                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                                    <p className="font-medium text-yellow-400">
                                        Your payment has been confirmed.
                                    </p>

                                    <p className="mt-1 text-sm text-white/50">
                                        Your digital key is still
                                        being prepared. Please
                                        refresh this page in a
                                        moment.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Order Summary */}
                    <section className="rounded-2xl border border-neutral-800 bg-[#151515] p-5 sm:p-6">
                        <h2 className="text-lg font-semibold">
                            Order details
                        </h2>

                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                            <div>
                                <p className="text-white/40">
                                    Order number
                                </p>

                                <p className="mt-1 font-medium">
                                    {
                                        order.orderNumber
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-white/40">
                                    Payment
                                </p>

                                <p className="mt-1 font-medium capitalize text-green-400">
                                    {
                                        order.paymentStatus
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-white/40">
                                    Delivery
                                </p>

                                <p className="mt-1 font-medium capitalize">
                                    {
                                        order.deliveryStatus
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-white/40">
                                    Total
                                </p>

                                <p className="mt-1 font-medium">
                                    {order.currency}{' '}
                                    {Number(
                                        order.totalAmount
                                    ).toFixed(2)}
                                </p>
                            </div>

                            <div>
                                <p className="text-white/40">
                                    Delivered to
                                </p>

                                <p className="mt-1 font-medium break-all">
                                    {
                                        order.deliveryEmail
                                    }
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() =>
                                router.push('/')
                            }
                            className="w-full sm:w-auto rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                        >
                            Continue shopping
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    `/orders/${encodeURIComponent(
                                        order.orderNumber
                                    )}`
                                )
                            }
                            className="w-full sm:w-auto rounded-lg border border-neutral-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                        >
                            View order
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}