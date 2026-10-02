import React, { useState } from "react";
import { useRouter } from "next/router";
import PasswordInput from "@/components/PasswordInput";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

export default function ResetPasswordPage() {
    const router = useRouter();
    const { token } = router.query;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        if (password.length < 8) {
            setError(
                "Password must be at least 8 characters long."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const data = await apiFetch(
                "/auth/reset-password",
                {
                    method: "POST",
                    body: JSON.stringify({
                        token,
                        password,
                    }),
                }
            );

            setSuccess(
                data?.message ||
                "Password reset successful! Redirecting..."
            );

            setTimeout(() => {
                router.push("/sign-in");
            }, 1200);
        } catch (err) {
            setError(
                err?.message ||
                "Unable to reset your password. The link may have expired."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] text-white px-4">
            <div className="flex w-full max-w-4xl rounded-lg overflow-hidden shadow-lg border border-neutral-800">

                {/* Left Form */}
                <div className="w-full md:w-1/2 bg-neutral-900 p-8 flex flex-col gap-6">

                    <div>
                        <h2 className="text-2xl font-bold">
                            Reset your password 🔐
                        </h2>

                        <p className="text-sm text-neutral-400 mt-2">
                            Enter your new password below.
                        </p>
                    </div>

                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label className="text-sm">
                                New Password
                            </label>

                            <PasswordInput
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter new password"
                            />
                        </div>

                        <div>
                            <label className="text-sm">
                                Confirm New Password
                            </label>

                            <PasswordInput
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm new password"
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm">
                                {error}
                            </p>
                        )}

                        {success && (
                            <p className="text-green-500 text-sm">
                                {success}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded font-semibold transition ${loading
                                    ? "bg-neutral-700 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-500"
                                }`}
                        >
                            {loading
                                ? "Resetting..."
                                : "Reset Password"}
                        </button>
                    </form>

                    <div className="text-sm text-neutral-400">
                        <button
                            type="button"
                            onClick={() =>
                                router.push("/sign-in")
                            }
                            className="hover:text-purple-400 transition"
                        >
                            Back to login
                        </button>
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