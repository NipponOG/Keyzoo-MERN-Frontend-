import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import PasswordInput from "@/components/PasswordInput";
import Turnstile from "react-turnstile";
import Image from "next/image";

export default function ResetPasswordPage() {
    const router = useRouter();
    const { code } = router.query; // Token from email URL

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [turnstileToken, setTurnstileToken] = useState("");
    const [captchaKey, setCaptchaKey] = useState(Date.now());

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const turnstileRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!code) {
            setError("Invalid or missing reset token.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (!turnstileToken) {
            setError("Please complete the security check.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, password, turnstileToken }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Password reset successful! Redirecting...");
                setTimeout(() => router.push("/sign-in"), 1200);
            } else {
                setError(data.error || "Failed to reset password.");
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
        <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] text-white px-4">
            <div className="flex w-full max-w-4xl rounded-lg overflow-hidden shadow-lg border border-neutral-800">

                {/* Left Form */}
                <div className="w-full md:w-1/2 bg-neutral-900 p-8 flex flex-col gap-6">
                    <h2 className="text-2xl font-bold">Reset your password 🔐</h2>

                    <p className="text-sm text-neutral-400">
                        Enter your new password below.
                    </p>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                        <div>
                            <label className="text-sm">New Password</label>
                            <PasswordInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                        </div>

                        <div>
                            <label className="text-sm">Confirm New Password</label>
                            <PasswordInput
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </div>

                        {/* Turnstile */}
                        <Turnstile
                            key={captchaKey}
                            ref={turnstileRef}
                            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                            onVerify={(token) => setTurnstileToken(token)}
                        />

                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {success && <p className="text-green-500 text-sm">{success}</p>}

                        <button
                            type="submit"
                            className={`w-full py-3 rounded font-semibold transition ${loading
                                    ? "bg-neutral-700 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-500"
                                }`}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>

                    <div className="text-sm text-neutral-400">
                        <a href="/sign-in" className="hover:text-purple-400">
                            Back to login
                        </a>
                    </div>
                </div>

                {/* Image Right */}
                <div className="hidden md:flex w-1/2 bg-neutral-800 items-center justify-center">
                    <Image
                        src="/3d/reset_password.png"
                        width={450}
                        height={450}
                        alt="Reset Password"
                        className="object-contain"
                    />
                </div>
            </div>
        </div>
    );
}
