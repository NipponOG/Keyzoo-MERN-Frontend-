import Image from "next/image";
import { CiTrash } from "react-icons/ci";
import { LuPlus, LuMinus } from "react-icons/lu";
import { useState } from "react";
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

    const isStripePayment =
        selectedPayment === "Debit / Credit Card" ||
        selectedPayment === "AMEX";

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

        if (!isStripePayment) {
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

            const data = await apiFetch(
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
                    }),
                }
            );

            if (!data?.url) {
                throw new Error(
                    "Unable to create Stripe checkout."
                );
            }

            window.location.href = data.url;
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
                                                onRemove(
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
                                                onDecrease(
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
                                                onIncrease(
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

            <div className="border-t border-gray-700 pt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>

                    <span>
                        {symbol}{" "}
                        {subtotal.toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>

                    <span>
                        {symbol}{" "}
                        {subtotal.toFixed(2)}
                    </span>
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