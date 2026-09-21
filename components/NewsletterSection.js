import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

export default function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubscribe = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            const API_URL =
                process.env.NEXT_PUBLIC_API_URL;

            const res = await fetch(
                `${API_URL}/newsletter/subscribe`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to subscribe"
                );
            }

            if (data?.alreadySubscribed) {
                setMessage(
                    "✅ You’re already subscribed!"
                );
            } else {
                setMessage(
                    "🎉 Thank you for subscribing!"
                );

                setEmail("");
            }

            setTimeout(() => {
                setMessage("");
            }, 4000);
        } catch (err) {
            console.error(
                "Newsletter subscription error:",
                err
            );

            setMessage(
                err?.message ||
                "❌ Something went wrong. Try again."
            );

            setTimeout(() => {
                setMessage("");
            }, 4000);
        } finally {
            setLoading(false);
        }
    };

    return (
        // <section className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 py-12 md:py-20 lg:py-24 flex flex-col lg:flex-row justify-between items-center gap-12 bg-gradient-to-br from-[#2B0B52] via-[#4B1C75] to-[#1E003E] rounded-2xl mt-10">
        <section className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 py-12 md:py-20 lg:py-24 flex flex-col lg:flex-row justify-between items-center gap-12 rounded-2xl mt-10">
            {/* Left Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-snug text-white">
                    Subscribe to our newsletter and get<br className="hidden sm:block" />
                    updates on <span className="text-blue-500">best deals!</span>
                </h2>

                <form
                    onSubmit={handleSubscribe}
                    className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl mx-auto lg:mx-0"
                >
                    <input
                        required
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 p-3 sm:p-4 rounded-md focus:outline-none bg-white/10 text-white w-full placeholder:colo"
                    />
                    <button
                        type='submit'
                        disabled={loading}
                        style={{ cursor: 'pointer' }}
                        className="bg-[#6D28D9] hover:bg-[#5530a0] p-3 sm:p-4 rounded-md font-semibold w-full sm:w-auto text-white transition-all duration-300"
                    >
                        {loading ? "Subscribing..." : "Subscribe"}
                    </button>
                </form>

                <AnimatePresence>
                    {message && (
                        <motion.p
                            key="msg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="text-sm mt-3 text-gray-400"
                        >
                            {message}
                        </motion.p>
                    )}
                </AnimatePresence>

                <p className="text-sm text-white dark:text-gray-300 mt-4 leading-relaxed max-w-lg mx-auto lg:mx-0">
                    By subscribing, you agree to receive commercial communications from Driffle.com via email,
                    including personalized updates about products and services offered on our Marketplace.
                </p>

                <a
                    href="#"
                    className="inline-block mt-3 text-sm text-blue-400 font-semibold hover:underline"
                >
                    See more →
                </a>
            </div>

            {/* Right Section (Image) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2 flex justify-center lg:justify-end"
            >
                <Image
                    src="/3d/news.png"
                    height={400}
                    width={400}
                    priority
                    alt="newsletter"
                    draggable={false}
                    className="object-contain drop-shadow-lg"
                />
            </motion.div>
        </section>
    );
}
