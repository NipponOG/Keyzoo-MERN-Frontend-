import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/cartSlice";
import { useRouter } from "next/router";
import { IoCheckmarkDone } from "react-icons/io5";
import SkeletonLoader from "@/components/SkeletonLoader";
import confetti from "canvas-confetti";

export default function SuccessPage() {
    
    const dispatch = useDispatch();
    const router = useRouter();
    const { session_id } = router.query;
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        dispatch(clearCart());
    }, [dispatch]);

    useEffect(() => {
        if (!session_id) return;

        const verifyPayment = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}api/checkout/verify?session_id=${session_id}`
                );
                const data = await res.json();

                if (data.success) {
                    setOrder(data.session); // you can also fetch actual order data here
                }
            } catch (err) {
                console.error("Payment verification error:", err);
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [session_id]);

    // if (loading) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen text-lg">
    //             Verifying your payment...
    //         </div>
    //     );
    // }

    useEffect(() => {
        // 🎉 Trigger confetti once when page loads
        const duration = 2 * 1000; // 2 seconds
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
            });
            confetti({
                particleCount: 5,
                angle: 90,
                spread: 10,
                origin: { x: 3 },
            });
            confetti({
                particleCount: 50,
                angle: 180,
                spread: 10,
                origin: { x: -3 },
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200); // fake loading 1.2s
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 py-12">
                <div className="bg-[#2a2a2a] shadow-lg rounded-2xl p-8 max-w-lg w-full text-center">
                    <SkeletonLoader />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
            <div className="bg-[#2a2a2a] shadow-lg rounded-2xl p-8 max-w-lg w-full text-center">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        {/* <span className="text-3xl">✅</span> */}
                        <span className="text-3xl"><IoCheckmarkDone className="text-black dark:text-white" /></span>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-green-100 mb-5">Payment Successful!</h1>
                <p className="text-white mb-6">
                    Thank you for your purchase. Your game keys will be delivered shortly to your email.
                </p>

                {/* Order Details */}
                {order && (
                    <div className="bg-gray-100 rounded-lg p-4 text-left mb-6">
                        <h2 className="font-semibold text-gray-700 mb-2">Order Summary</h2>
                        <p><span className="font-medium">Order ID:</span> {order.id}</p>
                        <p><span className="font-medium">Amount:</span> ₹{(order.amount_total / 100).toFixed(2)}</p>
                        <p><span className="font-medium">Payment Status:</span> {order.payment_status}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push("user/library")}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium cursor-pointer"
                    >
                        View My Orders
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium cursor-pointer"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
