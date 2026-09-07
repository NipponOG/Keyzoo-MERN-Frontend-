import { useState } from "react";

export default function Disable2FAModal({
    open,
    loading,
    onClose,
    onConfirm,
}) {

    if (!open) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#161616] p-6 shadow-2xl">

                <div className="flex items-center gap-4">

                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-red-500/10
                        "
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-red-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                            />
                        </svg>
                    </div>

                    <div>

                        <h2 className="text-xl font-semibold text-white">
                            Disable Two-Factor Authentication
                        </h2>

                        <p className="mt-1 text-sm text-gray-400">
                            Your account will no longer require an authenticator
                            code when signing in.
                        </p>

                    </div>

                </div>

                <div
                    className="
                        mt-6
                        rounded-xl
                        border
                        border-yellow-500/20
                        bg-yellow-500/10
                        p-4
                    "
                >
                    <p className="text-sm text-yellow-300">
                        This reduces your account security. Make sure your
                        password is strong before disabling two-factor
                        authentication.
                    </p>
                </div>

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="
                            rounded-xl
                            border
                            border-white/10
                            px-5
                            py-3
                            text-white
                            transition
                            hover:bg-white/5
                        "
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-red-600
                            px-5
                            py-3
                            font-medium
                            text-white
                            transition
                            hover:bg-red-500
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        {loading && (
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

                        {loading
                            ? "Disabling..."
                            : "Disable 2FA"}
                    </button>

                </div>

            </div>

        </div>

    );

}