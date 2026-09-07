export default function Enable2FAConfirmModal({
    open,
    onClose,
    onContinue,
    isReset = false,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#161616] p-8">

                <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/15">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7 text-indigo-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2h-1V9a5 5 0 00-10 0v2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                            />
                        </svg>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            {isReset
                                ? "Reset Two-Factor Authentication"
                                : "Enable Two-Factor Authentication"}
                        </h2>

                        <p className="mt-1 text-sm text-gray-400">
                            {isReset
                                ? "A new authenticator key will be generated."
                                : "Protect your Keyzoo Admin account with an authenticator app."}
                        </p>
                    </div>
                </div>

                {isReset ? (
                    <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-5 text-sm text-yellow-200">
                        <p className="font-medium">
                            Your previous authenticator configuration has been removed.
                        </p>

                        <ul className="mt-3 space-y-2 list-disc pl-5">
                            <li>A new QR code will be generated.</li>
                            <li>Old authenticator entries will no longer work.</li>
                            <li>
                                Remove the previous <strong>Keyzoo Admin</strong> account
                                from Microsoft Authenticator after setup.
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="rounded-xl border border-white/10 bg-[#202020] p-5 text-sm text-gray-300">
                        <p className="mb-3">
                            After enabling Two-Factor Authentication you'll sign in using:
                        </p>

                        <ul className="space-y-2">
                            <li>✓ Password</li>
                            <li>✓ 6-digit verification code</li>
                        </ul>

                        <div className="mt-5 border-t border-white/10 pt-5">
                            <p className="mb-2 font-medium text-white">
                                Supported apps
                            </p>

                            <ul className="grid grid-cols-2 gap-2 text-gray-400">
                                <li>Microsoft Authenticator</li>
                                <li>Google Authenticator</li>
                                <li>Authy</li>
                                <li>Bitwarden</li>
                                <li>1Password</li>
                            </ul>
                        </div>
                    </div>
                )}

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-white/10 px-5 py-3 text-white"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onContinue}
                        className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-500"
                    >
                        {isReset
                            ? "Generate New QR"
                            : "Continue"}
                    </button>
                </div>

            </div>
        </div>
    );
}