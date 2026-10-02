import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

export default function VerifyEmailPage() {
    const router = useRouter();

    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!router.isReady) return;

        const { token } = router.query;

        if (!token || typeof token !== "string") {
            setStatus("error");
            setMessage("Invalid email verification link.");
            return;
        }

        const verifyEmail = async () => {
            try {
                const data = await apiFetch(
                    `/auth/verify-email?token=${encodeURIComponent(token)}`
                );

                setStatus("success");
                setMessage(
                    data.message || "Your email has been verified successfully."
                );
            } catch (err) {
                setStatus("error");
                setMessage(
                    err.message ||
                    "This verification link is invalid or has expired."
                );
            }
        };

        verifyEmail();
    }, [router.isReady, router.query]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] text-white px-4">
            <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#1a1a1a] p-8 text-center shadow-lg shadow-black/30">

                <div className="flex justify-center mb-6">
                    <Image
                        src="/3d/login.png"
                        alt="Keyzoo"
                        width={150}
                        height={150}
                        className="object-contain"
                        priority
                    />
                </div>

                {status === "loading" && (
                    <>
                        <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-neutral-700 border-t-purple-500" />

                        <h1 className="text-2xl font-bold">
                            Verifying your email...
                        </h1>

                        <p className="mt-3 text-sm text-neutral-400">
                            Please wait while we verify your email address.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-2xl text-green-400">
                            ✓
                        </div>

                        <h1 className="text-2xl font-bold">
                            Email Verified!
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-neutral-400">
                            {message}
                        </p>

                        <Link
                            href="/sign-in"
                            className="mt-7 inline-flex w-full items-center justify-center rounded-md bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
                        >
                            Continue to Sign In
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl text-red-400">
                            !
                        </div>

                        <h1 className="text-2xl font-bold">
                            Verification Failed
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-neutral-400">
                            {message}
                        </p>

                        <Link
                            href="/sign-in"
                            className="mt-7 inline-flex w-full items-center justify-center rounded-md bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
                        >
                            Go to Sign In
                        </Link>
                    </>
                )}

            </div>
        </div>
    );
}