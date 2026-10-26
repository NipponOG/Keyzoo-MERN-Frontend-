import { useState } from "react";
import { useRouter } from "next/router";
import { apiFetch } from "@/lib/api";
import { loginPasskey } from "@/lib/passkey";
import { HugeiconsIcon } from '@hugeicons/react';
import { FingerAccessIcon, AuthorizedIcon } from '@hugeicons/core-free-icons';


function getFriendlyLoginError(error, method = "password") {
    const message = error?.message?.toLowerCase() || "";

    if (
        message.includes("cancel") ||
        message.includes("abort") ||
        message.includes("notallowederror")
    ) {
        return method === "passkey"
            ? "Passkey sign-in was cancelled. Please try again."
            : "Sign-in was cancelled. Please try again.";
    }

    if (
        message.includes("invalid") ||
        message.includes("credentials") ||
        message.includes("unauthorized")
    ) {
        return "Invalid email or password. Please try again.";
    }

    if (
        message.includes("required") &&
        method === "password"
    ) {
        return "Please enter your email and password.";
    }

    return method === "passkey"
        ? "Passkey sign-in failed. Please try again."
        : "Unable to sign in. Please try again.";
}

export default function AdminLogin() {

    const router = useRouter();

    // const { login } = useAdmin();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [passkeyLoading, setPasskeyLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const data = await apiFetch("/admin/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            // Store admin authentication separately
            sessionStorage.setItem("admin_jwt", data.jwt);
            sessionStorage.setItem(
                "admin_user",
                JSON.stringify(data.user)
            );

            // Temporary: 2FA is not connected yet
            router.replace("/admin/dashboard");
        } catch (err) {
            console.error("Admin login failed:", err);
            setError(getFriendlyLoginError(err, "password"));
        } finally {
            setLoading(false);
        }
    };

    const handlePasskeyLogin = async () => {

        // if (!email) {
        //     setError("Please enter your email first.");
        //     return;
        // }

        try {
            setPasskeyLoading(true);
            setError("");

            const data = await loginPasskey(email);

            // Save authenticated user
            sessionStorage.setItem("admin_jwt", data.jwt);
            sessionStorage.setItem(
                "admin_user",
                JSON.stringify(data.user)
            );

            // Redirect to dashboard
            router.replace("/admin/dashboard");

        } catch (err) {
            console.error("Admin passkey login failed:", err);
            setError(getFriendlyLoginError(err, "passkey"));
        } finally {
            setPasskeyLoading(false);
        }
    };

    return (

        <div className="min-h-screen bg-[#111] flex items-center justify-center p-6">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl bg-[#1b1b1b] border border-[#2d2d2d] p-8"
            >

                <h1 className="text-3xl font-bold text-white mb-2">

                    Admin Login

                </h1>

                <p className="text-gray-400 mb-8">

                    Sign in to Keyzoo Admin

                </p>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    className="w-full rounded-lg bg-[#232323] border border-[#333] px-4 py-3 text-white mb-4 outline-none focus:border-indigo-500"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    className="w-full rounded-lg bg-[#232323] border border-[#333] px-4 py-3 text-white mb-4 outline-none focus:border-indigo-500"
                />

                {error && (

                    <div className="text-red-400 text-sm mb-4">

                        {error}

                    </div>

                )}

                <button
                    disabled={loading || passkeyLoading}
                    className="cursor-pointer w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 py-3 text-white font-medium transition flex items-center justify-center gap-2"
                >

                    <HugeiconsIcon icon={AuthorizedIcon} />
                    {loading
                        ? "Signing In..."
                        : "Sign In"}

                </button>

                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#333]" />
                    <span className="text-sm text-gray-500">OR</span>
                    <div className="h-px flex-1 bg-[#333]" />
                </div>

                <button
                    type="button"
                    onClick={handlePasskeyLogin}
                    disabled={loading || passkeyLoading}
                    className="cursor-pointer w-full rounded-lg border border-[#333] bg-[#232323] py-3 text-white transition hover:bg-[#2b2b2b] flex items-center justify-center gap-2 "
                >
                    <HugeiconsIcon icon={FingerAccessIcon} />
                    {passkeyLoading ? "Signing In..." : "Sign in with Passkey"}
                </button>

            </form>

        </div>

    );

}