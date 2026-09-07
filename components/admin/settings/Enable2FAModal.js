import { useEffect, useState } from "react";
import StyledQRCode from "@/components/admin/qr/StyledQRCode";
import { toast } from "sonner";

import {
    generate2FA,
    verify2FA,
} from "@/lib/auth";

export default function Enable2FAModal({
    open,
    onClose,
    refreshUser,
    onSuccess,
}) {

    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const [otpAuthUrl, setOtpAuthUrl] = useState("");
    const [expiresIn, setExpiresIn] = useState(0);

    const [code, setCode] = useState("");

    const [error, setError] = useState("");

    useEffect(() => {

        if (!open) return;

        loadQRCode();

    }, [open]);

    useEffect(() => {

        if (!open || expiresIn <= 0) return;

        const timer = setInterval(() => {

            setExpiresIn((prev) => {

                if (prev <= 1) {

                    clearInterval(timer);

                    return 0;

                }

                return prev - 1;

            });

        }, 1000);

        return () => clearInterval(timer);

    }, [open, expiresIn]);

    const minutes = String(Math.floor(expiresIn / 60)).padStart(2, "0");

    const seconds = String(expiresIn % 60).padStart(2, "0");

    async function loadQRCode() {

        try {

            setLoading(true);

            const jwt = localStorage.getItem("jwt");

            const data = await generate2FA(jwt);

            setOtpAuthUrl(data.otpAuthUrl);
            setExpiresIn(data.expiresIn);

        } catch (err) {

            toast.error(err.message);

            onClose();

        } finally {

            setLoading(false);

        }

    }

    async function handleVerify() {

        if (code.length !== 6) {
            return toast.error("Enter the 6-digit verification code.");
        }

        // try {

        //     setVerifying(true);

        //     const jwt = localStorage.getItem("jwt");

        //     await verify2FA(jwt, code);

        //     await refreshUser();

        //     toast.success("Two-factor authentication enabled.");

        //     setCode("");

        //     onClose();

        // } catch (err) {

        //     toast.error(err.message);

        // } finally {

        //     setVerifying(false);

        // }

        const toastId = toast.loading("Enabling two-factor authentication...");

        try {

            setVerifying(true);

            const jwt = localStorage.getItem("jwt");

            await verify2FA(jwt, code);

            await refreshUser();

            setCode("");

            onClose();

            // toast.success("Two-factor authentication enabled", {
            //     id: toastId,
            //     description: "Your account is now protected with an authenticator app.",
            // });

            toast.dismiss(toastId);
            onClose();
            onSuccess?.();
            
        } catch (err) {

            toast.error("Verification failed", {
                id: toastId,
                description: err.message,
            });

        } finally {

            setVerifying(false);

        }

    }

    if (!open) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#161616] p-6">

                <h2 className="text-xl font-semibold text-white">
                    Enable Two-Factor Authentication
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                    Scan this QR code using Google Authenticator,
                    Microsoft Authenticator, Authy or 1Password.
                </p>

                {loading ? (

                    <div className="py-16 text-center text-gray-400">
                        Generating QR Code...
                    </div>

                ) : (

                    <>
                        <div className="mt-6 flex justify-center rounded-xl bg-white p-4">

                            <StyledQRCode value={otpAuthUrl} size={280} />

                        </div>

                        <p className="mt-3 text-center text-xs text-gray-500">
                            {expiresIn === 0 ? (

                                <button
                                    onClick={loadQRCode}
                                    className="
            rounded-xl
            bg-indigo-600
            px-5
            py-2
            text-white
            hover:bg-indigo-500
        "
                                >
                                    Generate New QR Code
                                </button>

                            ) : (

                                <p className="text-center text-xs text-gray-500">
                                    QR expires in {minutes}:{seconds}
                                </p>

                            )}
                        </p>

                        <div className="mt-6">

                            <label className="mb-2 block text-sm text-gray-300">
                                Verification Code
                            </label>

                            <input
                                value={code}
                                onChange={(e) =>
                                    setCode(
                                        e.target.value.replace(/\D/g, "")
                                    )
                                }
                                maxLength={6}
                                placeholder="123456"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-[#202020]
                                    px-4
                                    py-3
                                    text-center
                                    text-lg
                                    tracking-[0.35em]
                                    text-white
                                    outline-none
                                    focus:border-indigo-500
                                "
                            />

                        </div>

                        {
                            error && (

                                <div
                                    className="
                mt-5
                rounded-xl
                border
                border-red-500/20
                bg-red-500/10
                px-4
                py-3
                text-sm
                text-red-300
            "
                                >
                                    {error}
                                </div>

                            )
                        }

                        <div className="mt-8 flex justify-end gap-3">

                            <button
                                onClick={onClose}
                                className="
                                    rounded-xl
                                    border
                                    border-white/10
                                    px-5
                                    py-3
                                    text-white
                                "
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleVerify}
                                disabled={verifying}
                                className="
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-indigo-600
        px-5
        py-3
        font-medium
        text-white
        hover:bg-indigo-500
        disabled:opacity-60
    "
                            >
                                {verifying && (
                                    <span
                                        className="
                h-4
                w-4
                animate-spin
                rounded-full
                border-2
                border-white
                border-t-transparent
            "
                                    />
                                )}

                                {verifying ? "Enabling..." : "Enable 2FA"}
                            </button>

                        </div>

                    </>
                )}

            </div>

        </div>

    );

}