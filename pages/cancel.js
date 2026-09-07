import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function CancelPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Optional: play a small shake animation when mounted
        const el = document.getElementById("error-icon");
        if (el) {
            el.classList.add("animate-shake");
            setTimeout(() => el.classList.remove("animate-shake"), 600);
        }

        // Countdown + auto-redirect
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push("/"); // redirect to checkout
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);

    }, [router]);



    // useEffect(() => {
    //     const timer = setTimeout(() => setLoading(false), 1200);
    //     return () => clearTimeout(timer);
    // }, []);

    // if (loading) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center px-6 py-12">
    //             <div className="bg-[#2a2a2a] shadow-lg rounded-2xl p-8 max-w-lg w-full text-center">
    //                 <SkeletonLoader />
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
            <div className="bg-[#2a2a2a] shadow-lg rounded-2xl p-8 max-w-lg w-full text-center">
                {/* Error Icon */}
                <div id="error-icon" className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-3xl">❌</span>
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-5 text-red-100">
                    Payment Failed
                </h1>
                <p className="text-gray-500 mb-6">
                    Oops! Your payment was not completed. Please try again or choose another payment method.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push("/checkout")}
                        className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-medium"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
