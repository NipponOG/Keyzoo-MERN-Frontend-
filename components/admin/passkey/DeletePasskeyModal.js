export default function DeletePasskeyModal({
    passkey,
    onClose,
    onDelete,
    deleting = false,
}) {

    if (!passkey) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1b1b] p-6">

                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15">
                        <svg
                            className="h-6 w-6 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v4m0 4h.01M10.29 3.86l-8 14A2 2 0 004 21h16a2 2 0 001.71-3.14l-8-14a2 2 0 00-3.42 0z"
                            />
                        </svg>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            Delete Passkey
                        </h2>

                        <p className="text-sm text-gray-400">
                            This action cannot be undone.
                        </p>
                    </div>

                </div>

                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4">

                    <p className="text-sm text-gray-300">
                        You're about to remove:
                    </p>

                    <p className="mt-2 font-semibold text-white">
                        {passkey.deviceName}
                    </p>

                </div>

                <p className="mt-6 text-sm text-gray-400">
                    After deleting this passkey, this device will no longer
                    be able to sign in using Windows Hello, Face ID or your
                    security key.
                </p>

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        disabled={deleting}
                        className="
                            rounded-xl
                            border
                            border-white/10
                            px-5
                            py-3
                            text-white
                            disabled:opacity-50
                        "
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onDelete}
                        disabled={deleting}
                        className="
                            rounded-xl
                            bg-red-600
                            px-5
                            py-3
                            font-medium
                            text-white
                            hover:bg-red-500
                            disabled:opacity-50
                        "
                    >
                        {deleting ? "Deleting..." : "Delete Passkey"}
                    </button>

                </div>

            </div>

        </div>
    );
}