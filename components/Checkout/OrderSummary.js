import Image from "next/image";
import { CiTrash } from "react-icons/ci";
import { LuPlus, LuMinus } from "react-icons/lu";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import useCurrency from "@/hook/useCurrency";

export default function OrderSummary({
    cartItems,
    onRemove,
    onIncrease,
    onDecrease,
    selectedPayment,
}) {
    const { jwt } = useAuth();
    const { symbol } = useCurrency();

    const [loading, setLoading] = useState(false);
    const [cashfree, setCashfree] = useState(null);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState("");

    useEffect(() => {
        const existingScript = document.querySelector(
            'script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]'
        );

        const initializeCashfree = () => {
            if (!window.Cashfree) {
                console.error(
                    "❌ Cashfree SDK is not available."
                );
                return;
            }

            const instance = window.Cashfree({
                mode:
                    process.env.CASHFREE_ENVIRONMENT ||
                    "sandbox",
            });

            setCashfree(instance);
        };

        if (existingScript) {
            if (window.Cashfree) {
                initializeCashfree();
            } else {
                existingScript.addEventListener(
                    "load",
                    initializeCashfree
                );
            }

            return;
        }

        const script = document.createElement("script");

        script.src =
            "https://sdk.cashfree.com/js/v3/cashfree.js";

        script.async = true;

        script.onload = initializeCashfree;

        script.onerror = () => {
            console.error(
                "❌ Failed to load Cashfree SDK."
            );
        };

        document.body.appendChild(script);

        return () => {
            script.onload = null;
            script.onerror = null;
        };
    }, []);

    useEffect(() => {
        const existingScript = document.querySelector(
            'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        );

        const handleLoad = () => {
            setRazorpayLoaded(true);
        };

        if (existingScript) {
            if (window.Razorpay) {
                setRazorpayLoaded(true);
            } else {
                existingScript.addEventListener(
                    "load",
                    handleLoad
                );
            }

            return;
        }

        const script = document.createElement("script");

        script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

        script.async = true;

        script.onload = handleLoad;

        script.onerror = () => {
            console.error(
                "❌ Failed to load Razorpay Checkout SDK."
            );

            setRazorpayLoaded(false);
        };

        document.body.appendChild(script);

        return () => {
            script.onload = null;
            script.onerror = null;
        };
    }, []);

    /*
     * Frontend subtotal is only for display.
     *
     * The backend is the source of truth for:
     * - price
     * - discount
     * - stock
     * - total
     * - order snapshot
     */
    const subtotal = cartItems.reduce(
        (total, item) =>
            total +
            Number(item.price || 0) *
            Number(item.quantity || 0),
        0
    );

    const isStripePayment = selectedPayment === "Debit / Credit Card" || selectedPayment === "AMEX";
    const isCashfreePayment = selectedPayment === "Cashfree";
    const isRazorpayPayment = selectedPayment === "Razorpay";

    const handleApplyCoupon = async () => {
        if (couponLoading) {
            return;
        }

        const code = couponCode.trim();

        if (!code) {
            setCouponError("Please enter a coupon code.");
            return;
        }

        if (subtotal <= 0) {
            setCouponError("Your cart total must be greater than zero.");
            return;
        }

        if (!jwt) {
            setCouponError("Please log in to apply a coupon.");
            return;
        }

        try {
            setCouponLoading(true);
            setCouponError("");

            const data = await apiFetch(
                "/coupons/apply",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        code,
                        subtotal,
                    }),
                }
            );

            if (!data?.success || !data?.pricing) {
                throw new Error(
                    "Unable to apply coupon."
                );
            }

            setAppliedCoupon({
                id: data.coupon?.id ?? null,
                code: data.coupon?.code ?? code.toUpperCase(),
                discountType:
                    data.coupon?.discountType ?? null,
                discountValue:
                    data.coupon?.discountValue ?? null,
                subtotal:
                    Number(data.pricing.subtotal || 0),
                discount:
                    Number(data.pricing.discount || 0),
                total:
                    Number(data.pricing.total || 0),
            });

            setCouponCode(
                data.coupon?.code ??
                code.toUpperCase()
            );
        } catch (error) {
            setAppliedCoupon(null);

            setCouponError(
                error.message ||
                "Unable to apply coupon."
            );
        } finally {
            setCouponLoading(false);
        }
    };

    const clearAppliedCoupon = () => {
        setAppliedCoupon(null);
        setCouponError("");
    };

    const handleRemoveItem = (itemId) => {
        clearAppliedCoupon();
        onRemove(itemId);
    };

    const handleIncreaseItem = (itemId) => {
        clearAppliedCoupon();
        onIncrease(itemId);
    };

    const handleDecreaseItem = (itemId) => {
        clearAppliedCoupon();
        onDecrease(itemId);
    };

    const handleCheckout = async () => {
        if (loading) {
            return;
        }

        if (!jwt) {
            alert("Please log in to continue checkout.");
            return;
        }

        if (!cartItems.length) {
            alert("Your cart is empty.");
            return;
        }

        if (!isStripePayment && !isCashfreePayment && !isRazorpayPayment) {
            alert(
                "This payment method is not available yet."
            );
            return;
        }

        try {
            setLoading(true);

            const items = cartItems.map((item) => ({
                id: item.id,
                type: item.type || "product",
                quantity: Number(item.quantity || 1),
            }));

            let data;

            if (isStripePayment) {
                data = await apiFetch(
                    "/payments/stripe/create-checkout",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            items,
                            currency: "INR",
                            couponCode:
                                appliedCoupon?.code || null,
                        }),
                    }
                );

                if (!data?.checkout?.url) {
                    console.error(
                        "❌ Stripe checkout response does not contain checkout URL:",
                        data
                    );

                    throw new Error(
                        "Unable to create Stripe checkout."
                    );
                }

                window.location.href =
                    data.checkout.url;

                return;
            }

            if (isCashfreePayment) {
                if (!cashfree) {
                    throw new Error(
                        "Cashfree checkout is still loading. Please try again."
                    );
                }

                data = await apiFetch(
                    "/payments/cashfree/create-checkout",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            items,
                            currency: "INR",
                            couponCode:
                                appliedCoupon?.code || null,
                        }),
                    }
                );

                const paymentSessionId =
                    data?.checkout?.paymentSessionId;

                if (!paymentSessionId) {
                    console.error(
                        "❌ Cashfree checkout response does not contain payment session ID:",
                        data
                    );

                    throw new Error(
                        "Unable to create Cashfree checkout."
                    );
                }

                const checkoutResult =
                    await cashfree.checkout({
                        paymentSessionId,
                        redirectTarget: "_self",
                    });

                if (checkoutResult?.error) {
                    console.error(
                        "❌ Cashfree checkout error:",
                        checkoutResult.error
                    );

                    throw new Error(
                        checkoutResult.error.message ||
                        "Unable to open Cashfree checkout."
                    );
                }
            }

            if (isRazorpayPayment) {
                if (!razorpayLoaded || !window.Razorpay) {
                    throw new Error(
                        "Razorpay checkout is still loading. Please try again."
                    );
                }

                data = await apiFetch(
                    "/payments/razorpay/create-checkout",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            items,
                            currency: "INR",
                            couponCode:
                                appliedCoupon?.code || null,
                        }),
                    }
                );

                const razorpayOrderId =
                    data?.checkout?.orderId;

                const razorpayKeyId =
                    data?.checkout?.keyId;

                const razorpayAmount =
                    data?.checkout?.amount;

                if (
                    !razorpayOrderId ||
                    !razorpayKeyId ||
                    !razorpayAmount
                ) {
                    console.error(
                        "❌ Razorpay checkout response is incomplete:",
                        data
                    );

                    throw new Error(
                        "Unable to create Razorpay checkout."
                    );
                }

                const options = {
                    key: razorpayKeyId,

                    amount: razorpayAmount,

                    currency:
                        data?.checkout?.currency ||
                        "INR",

                    name: "Keyzoo",

                    description:
                        "Digital Game / Gift Card Purchase",

                    order_id: razorpayOrderId,

                    handler: function (response) {
                        console.log(
                            "✅ Razorpay checkout completed:",
                            response
                        );

                        /*
                         * Do not mark the order paid here.
                         *
                         * The backend Razorpay webhook is the
                         * authoritative payment confirmation.
                         */
                        window.location.href =
                            `/checkout/success?order=${encodeURIComponent(
                                data.order.orderNumber
                            )}`;
                    },

                    modal: {
                        ondismiss: function () {
                            setLoading(false);
                        },
                    },

                    theme: {
                        color: "#814DE5",
                    },
                };

                const razorpay =
                    new window.Razorpay(options);

                razorpay.on(
                    "payment.failed",
                    function (response) {
                        console.error(
                            "❌ Razorpay payment failed:",
                            response?.error
                        );

                        setLoading(false);

                        alert(
                            response?.error?.description ||
                            "Razorpay payment failed. Please try again."
                        );
                    }
                );

                razorpay.open();

                return;
            }

        } catch (error) {
            console.error(
                "Checkout error:",
                error
            );

            alert(
                error.message ||
                "Unable to start checkout. Please try again."
            );

            setLoading(false);
        }
    };

    return (
        <div className="bg-[#1a1a1a] p-6 rounded-lg space-y-4">
            <h2 className="text-lg font-bold">
                Order Summary
            </h2>

            {cartItems.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                    Your cart is empty.
                </div>
            ) : (
                <ul className="space-y-4">
                    {cartItems.map((item) => {
                        const image =
                            typeof item.image ===
                                "string" &&
                                item.image.trim()
                                ? item.image
                                : "/keyzoo-fallback.png";

                        return (
                            <li
                                key={item.id}
                                className="flex gap-4"
                            >
                                <div className="relative h-[100px] w-[70px] shrink-0 overflow-hidden rounded sm:h-[120px] sm:w-[90px]">
                                    <Image
                                        src={image}
                                        alt={
                                            item.title ||
                                            "Product"
                                        }
                                        fill
                                        sizes="90px"
                                        className="object-cover"
                                        unoptimized={
                                            image.startsWith(
                                                "http"
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col">
                                    <h3 className="line-clamp-2 break-words text-sm font-semibold leading-tight text-white">
                                        {item.title}
                                    </h3>

                                    <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveItem(
                                                    item.id
                                                )
                                            }
                                            disabled={loading}
                                            className="disabled:opacity-50"
                                            aria-label="Remove item"
                                        >
                                            <CiTrash className="text-2xl text-white" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDecreaseItem(
                                                    item.id
                                                )
                                            }
                                            disabled={
                                                loading ||
                                                Number(
                                                    item.quantity ||
                                                    0
                                                ) <= 1
                                            }
                                            className="flex h-[24px] w-[24px] items-center justify-center rounded bg-[#1a1a1a] text-white disabled:opacity-40"
                                            aria-label="Decrease quantity"
                                        >
                                            <LuMinus className="text-xl" />
                                        </button>

                                        <span className="flex h-[24px] w-[24px] items-center justify-center rounded text-white">
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleIncreaseItem(
                                                    item.id
                                                )
                                            }
                                            disabled={loading}
                                            className="flex h-[24px] w-[24px] items-center justify-center rounded bg-[#1a1a1a] text-white disabled:opacity-40"
                                            aria-label="Increase quantity"
                                        >
                                            <LuPlus className="text-xl" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            <div className="border-t border-gray-700 pt-4 space-y-4 text-sm">
                <div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(event) => {
                                setCouponCode(
                                    event.target.value.toUpperCase()
                                );
                                setCouponError("");
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    handleApplyCoupon();
                                }
                            }}
                            placeholder="Coupon code"
                            disabled={couponLoading || loading}
                            className="min-w-0 flex-1 rounded-md border border-gray-700 bg-[#111111] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 disabled:opacity-50"
                        />

                        <button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={
                                couponLoading ||
                                loading ||
                                !couponCode.trim()
                            }
                            className={`rounded-md px-4 py-2.5 text-sm font-semibold text-white transition ${couponLoading ||
                                loading ||
                                !couponCode.trim()
                                ? "cursor-not-allowed bg-gray-600"
                                : "bg-blue-600 hover:bg-blue-500"
                                }`}
                        >
                            {couponLoading
                                ? "Applying..."
                                : "Apply"}
                        </button>
                    </div>

                    {couponError && (
                        <p className="mt-2 text-xs text-red-400">
                            {couponError}
                        </p>
                    )}

                    {appliedCoupon && !couponError && (
                        <p className="mt-2 text-xs text-green-400">
                            Coupon{" "}
                            <span className="font-semibold">
                                {appliedCoupon.code}
                            </span>{" "}
                            applied successfully.
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between">
                        <span>Subtotal</span>

                        <span>
                            {symbol}{" "}
                            {subtotal.toFixed(2)}
                        </span>
                    </div>

                    {appliedCoupon && (
                        <div className="flex justify-between text-green-400">
                            <span>Discount</span>

                            <span>
                                -{symbol}{" "}
                                {appliedCoupon.discount.toFixed(2)}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between pt-1 font-bold text-lg">
                        <span>Total</span>

                        <span>
                            {symbol}{" "}
                            {(
                                appliedCoupon?.total ??
                                subtotal
                            ).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-500">
                By proceeding through checkout, I
                acknowledge I have read and accepted the
                Terms and Conditions including the Privacy
                Policy and Refund Policy.
            </p>

            <button
                type="button"
                onClick={handleCheckout}
                disabled={
                    loading ||
                    cartItems.length === 0
                }
                className={`w-full ${loading ||
                    cartItems.length === 0
                    ? "cursor-not-allowed bg-gray-500"
                    : "bg-blue-600 hover:bg-blue-500"
                    } rounded py-4 font-semibold text-white transition sm:py-3`}
            >
                {loading
                    ? "Processing..."
                    : "Pay Now"}
            </button>
        </div>
    );
}