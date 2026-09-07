// import React from 'react'
// import Image from 'next/image';

// const forgotpassword = () => {
//     return (
//         <div className="flex min-h-screen items-center justify-center text-white">
//             <div className="flex w-full max-w-4xl rounded-lg overflow-hidden shadow-lg">
//                 {/* Left: Form */}
//                 <div className="w-full md:w-1/2 bg-neutral-900 p-8 flex flex-col gap-5">
//                     <h2 className="text-2xl font-bold">Forgot password?</h2>

//                     <p className="text-sm text-neutral-400">
//                         Enter your email address below and we'll send you a link to reset your password.
//                     </p>

//                     <form className="flex flex-col gap-4">
//                         <div>
//                             <label className="text-sm">Email</label>
//                             <input
//                                 type="email"
//                                 //   value={email}
//                                 //   onChange={(e) => setEmail(e.target.value)}
//                                 required
//                                 className="w-full mt-1 px-4 py-3 bg-neutral-800 rounded text-white outline-none"
//                                 placeholder="Enter your Email"
//                             />
//                         </div>

//                         <button
//                             type="submit"
//                             className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded font-semibold"
//                         >
//                             Reset Password
//                         </button>
//                     </form>

//                     <div className="flex justify-between text-sm text-neutral-400">
//                         <a href="/sign-in" className="hover:underline">
//                             Already have an account? Login
//                         </a>
//                     </div>
//                 </div>

//                 {/* Right: Illustration */}
//                 <div className="hidden md:flex w-1/2 bg-neutral-800 items-center justify-center">
//                     {/* <img src="https://driffle.com/_next/image?url=https%3A%2F%2Fstatic.driffle.com%2Fimages%2Fgirl-using-phone.png&w=828&q=75" alt="Illustration" className="w-3/4" /> */}
//                     <Image src="/3d/reset_password.png" width={512} height={512} />
//                 </div>
//             </div>
//         </div>
//     );
// }




// export default forgotpassword
import React, { useState, useRef } from "react";
import Image from "next/image";
import Turnstile from "react-turnstile";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [turnstileToken, setTurnstileToken] = useState("");
    const [captchaKey, setCaptchaKey] = useState(Date.now());
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const turnstileRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        if (!turnstileToken) {
            setError("Please complete the security check.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, turnstileToken }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("A password reset link has been sent to your email.");
                setEmail("");
            } else {
                setError(data.error || "Something went wrong.");
                turnstileRef.current?.reset();
                setTurnstileToken("");
                setCaptchaKey(Date.now());
            }
        } catch (err) {
            setError("Something went wrong.");
            turnstileRef.current?.reset();
            setTurnstileToken("");
            setCaptchaKey(Date.now());
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center text-white bg-[#0f0f0f] px-4">
            <div className="flex w-full max-w-4xl rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 shadow-lg">

                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 p-8 flex flex-col gap-5">

                    <h2 className="text-2xl font-bold">Forgot password?</h2>

                    <p className="text-sm text-neutral-400">
                        Enter your email below and we’ll send you a password reset link.
                    </p>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                        <div>
                            <label className="text-sm">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-1 px-4 py-3 bg-neutral-800 rounded text-white outline-none"
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* Turnstile CAPTCHA */}
                        <Turnstile
                            key={captchaKey}
                            ref={turnstileRef}
                            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                            onVerify={(token) => setTurnstileToken(token)}
                        />

                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {message && <p className="text-green-500 text-sm">{message}</p>}

                        <button
                            type="submit"
                            className={`w-full py-3 rounded font-semibold transition ${loading
                                    ? "bg-neutral-700 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-500"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Reset Password"}
                        </button>
                    </form>

                    <div className="text-sm text-neutral-400 mt-2">
                        <a href="/sign-in" className="hover:underline">
                            Back to login
                        </a>
                    </div>
                </div>

                {/* Right Side - Illustration */}
                <div className="hidden md:flex w-1/2 bg-neutral-800 items-center justify-center">
                    <Image
                        src="/3d/reset_password.png"
                        width={450}
                        height={450}
                        alt="Reset Password Illustration"
                        className="object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
