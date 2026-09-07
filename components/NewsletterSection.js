// import Image from 'next/image';
// import { useState } from 'react';
// import { motion, AnimatePresence } from "framer-motion";

// export default function NewsletterSection() {

//     const [email, setEmail] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");
//     // const [showMessage, setShowMessage] = useState(true);

//     const handleSubscribe = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage("");
//         // setShowMessage(false);

//         try {
//             // Optional: basic front-end duplicate check in localStorage
//             if (localStorage.getItem("subscribedEmail") === email) {
//                 setMessage("✅ You’re already subscribed!");
//                 setLoading(false);
//                 return;
//             }

//             const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}api/newsletter-subscribers`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     data: { email },
//                 }),
//             });

//             if (!res.ok) {
//                 throw new Error("Failed to subscribe");
//             }

//             setMessage("🎉 Thank you for subscribing!");
//             setEmail("");

//             // 👇 Automatically clear message after 4 seconds
//             setTimeout(() => {
//                 setMessage("");
//             }, 4000);

//         } catch (err) {
//             setMessage("❌ Something went wrong. Try again.");
//             console.error(err);

//             // Clear error message after 4 seconds too
//             setTimeout(() => {
//                 setMessage("");
//             }, 4000);

//         } finally {
//             setLoading(false);
//         }
//     };

//     // Vapor motion variants
//     const vaporVariants = {
//         hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
//         visible: (i) => ({
//             opacity: 1,
//             y: 0,
//             filter: "blur(0px)",
//             transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
//         }),
//     };

//     return (
//         <div className=" px-6 py-16 lg:px-24 flex flex-col lg:flex-row justify-between items-start lg:items-center">
//             {/* Left: Newsletter Form */}
//             <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
//                 <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-snug">
//                     Subscribe to our newsletter and get<br />
//                     updates on <span className="">best deals!</span>
//                 </h2>

//                 <form onSubmit={handleSubscribe} className="flex w-full max-w-xl gap-4">
//                     <input
//                         required
//                         type="email"
//                         placeholder="Enter your email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="flex-1 p-4 rounded-md focus:outline-none bg-[#1a1a1a]"
//                     />
//                     <button type='submit' disabled={loading} style={{ cursor: 'pointer' }} className="bg-blue-600 hover:bg-blue-700 px-6 rounded-md font-semibold">
//                         {loading ? "Subscribing..." : "Subscribe"}
//                     </button>
//                 </form>

//                 {/* {message && <p className="text-sm mt-3 text-gray-300">{message}</p>} */}

//                 {/* Animated Message */}
//                 <AnimatePresence>
//                     {message && (
//                         <motion.p
//                             key="msg"
//                             initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
//                             animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//                             exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
//                             transition={{ duration: 0.6 }}
//                             className="text-sm mt-3 text-[#808073]"
//                         >
//                             {message}
//                         </motion.p>
//                     )}
//                 </AnimatePresence>

//                 <p className="text-sm text-gray-400 mt-4 max-w-lg text-justify tracking-tight sm:tracking-tighter">
//                     By subscribing, you agree to receive commercial communications from driffle.com via email, including
//                     personalized updates about products and services offered on the Driffle Marketplace.
//                 </p>

//                 <a
//                     href="#"
//                     className="inline-block mt-2 text-sm text-white font-semibold hover:underline"
//                 >
//                     See more &rarr;
//                 </a>
//             </div>

//             {/* Right: Logo Grid */}
//             <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
//                 <Image
//                     // src={'https://steadfast-gem-fdb13b7584.media.strapiapp.com/unnamed_1_d52c38025a.png'}
//                     // src={'https://playful-book-1c46d71b3d.media.strapiapp.com/unnamed_1_d52c38025a_3632a18adf.png'}
//                     src={'/3d/news.png'}
//                     height={512}
//                     width={512}
//                     priority
//                     alt='newsletter'
//                     className='object-contain drop-shadow-lg'
//                 />

//             </div>

//             {/* Right: Image */}
//             {/* <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.8 }}
//                 className="w-full lg:w-1/2 flex justify-center lg:justify-end"
//             >
//                 <Image
//                     src="/3d/news.png"
//                     height={512}
//                     width={512}
//                     priority
//                     alt="newsletter"
//                     className="object-contain drop-shadow-lg"
//                 />
//             </motion.div> */}
//         </div>
//     );
// }




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
            if (localStorage.getItem("subscribedEmail") === email) {
                setMessage("✅ You’re already subscribed!");
                setLoading(false);
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}api/newsletter-subscribers`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: { email } }),
            });

            if (!res.ok) throw new Error("Failed to subscribe");

            setMessage("🎉 Thank you for subscribing!");
            setEmail("");
            setTimeout(() => setMessage(""), 4000);

        } catch (err) {
            setMessage("❌ Something went wrong. Try again.");
            console.error(err);
            setTimeout(() => setMessage(""), 4000);
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
