import { useState } from "react";
import { useRouter } from "next/router";
import { useAdmin } from "@/context/AdminContext";
import { loginPasskey } from "@/lib/passkey";
import { HugeiconsIcon } from '@hugeicons/react';
import { FingerAccessIcon, AuthorizedIcon } from '@hugeicons/core-free-icons';

export default function AdminLogin() {

    const router = useRouter();

    const { login } = useAdmin();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        setError("");

        try {

            // const response = await fetch(
            //     `${process.env.NEXT_PUBLIC_STRAPI_URL}api/auth/local`,
            //     {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //         body: JSON.stringify({
            //             identifier: email,
            //             password,
            //         }),
            //     }
            // );

            // const data = await response.json();

            // if (!response.ok) {

            //     setError(
            //         data.error?.message || "Login failed"
            //     );

            //     setLoading(false);

            //     return;

            // }

            // const meResponse = await fetch("/api/admin/me", {
            //     headers: {
            //         Authorization: `Bearer ${data.jwt}`,
            //     },
            // });

            // const meData = await meResponse.json();

            // if (!meResponse.ok) {

            //     setError(meData.error || "Unauthorized");

            //     setLoading(false);

            //     return;

            // }

            // login(
            //     data.jwt,
            //     meData.user
            // );

            // router.replace("/tc");

            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {

                // setError(data.error || "Login failed");
                setError(typeof data.error === "string" ? data.error : data.error?.message || "Login failed");

                return;

            }

            // Save temporarily until 2FA finishes
            sessionStorage.setItem("admin_jwt", data.jwt);
            sessionStorage.setItem("admin_user", JSON.stringify(data.user));

            if (data.requiresSetup) {

                router.push("/admin/2fa/setup");
                return;

            }

            if (data.requires2FA) {

                router.push("/admin/2fa/login");
                return;

            }

            // Should never happen
            login(data.jwt, data.user);
            router.replace("/tc");

        } catch (err) {

            console.error(err);

            setError("Something went wrong.");

        } finally {

            setLoading(false);
        }
    };

    const handlePasskeyLogin = async () => {
        if (!email) {
            setError("Please enter your email first.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await loginPasskey(email);

            // Save authenticated user
            login(data.jwt, data.user);

            // Redirect to dashboard
            router.replace("/tc");

        } catch (err) {
            console.error(err);

            setError(
                err.message || "Passkey login failed."
            );
        } finally {
            setLoading(false);
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
                    disabled={loading}
                    className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 py-3 text-white font-medium transition flex items-center justify-center gap-2"
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
                    disabled={loading}
                    className="w-full rounded-lg border border-[#333] bg-[#232323] py-3 text-white transition hover:bg-[#2b2b2b] flex items-center justify-center gap-2 "
                >
                    <HugeiconsIcon icon={FingerAccessIcon} />
                    Sign in with Passkey
                </button>

            </form>

        </div>

    );

}