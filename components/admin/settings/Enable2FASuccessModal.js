export default function Enable2FASuccessModal({
    open,
    onClose,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#161616] p-8">

                <div className="flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                <h2 className="mt-6 text-center text-2xl font-semibold text-white">
                    Two-Factor Authentication Enabled
                </h2>

                <p className="mt-3 text-center text-gray-400">
                    Your account is now protected with an authenticator app.
                </p>

                <div className="mt-8 rounded-xl border border-white/10 bg-[#202020] p-5">

                    <p className="mb-3 font-medium text-white">
                        Next time you sign in you'll need:
                    </p>

                    <ul className="space-y-2 text-sm text-gray-300">
                        <li>✓ Your password</li>
                        <li>✓ A 6-digit authenticator code</li>
                    </ul>

                </div>

                <button
                    onClick={onClose}
                    className="mt-8 w-full rounded-xl bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-500"
                >
                    Continue
                </button>

            </div>

        </div>
    );
}