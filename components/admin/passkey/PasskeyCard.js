export default function PasskeyCard({
    passkey,
    onRename,
    onDelete,
}) {
    const lastUsed = passkey.lastUsedAt
        ? new Date(passkey.lastUsedAt).toLocaleString()
        : "Never";

    const created = new Date(
        passkey.createdAt
    ).toLocaleDateString();

    return (
        <div
            className="
                rounded-3xl
                border
                border-white/10
                p-6
                transition
                hover:border-indigo-500/30
            "
        >
            <div className="flex items-start justify-between">

                <div className="flex items-center gap-4">

                    <div
                        className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-indigo-600/15
                        "
                    >
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
                                d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4 9 5.567 9 7.5s1.343 3.5 3 3.5zm0 2c-2.761 0-5 2.015-5 4.5V20h10v-2.5c0-2.485-2.239-4.5-5-4.5z"
                            />
                        </svg>
                    </div>

                    <div>

                        <h3 className="text-xl font-semibold text-white">
                            {passkey.deviceName}
                        </h3>

                        <p className="mt-1 text-gray-400">
                            {passkey.deviceType === "singleDevice"
                                ? "Single-device passkey"
                                : "Multi-device passkey"}
                        </p>

                    </div>

                </div>

                <span
                    className="
                        rounded-full
                        bg-green-500/15
                        px-3
                        py-1
                        text-sm
                        text-green-400
                    "
                >
                    Active
                </span>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-6">

                <div>

                    <p className="text-sm text-gray-500">
                        Last used
                    </p>

                    <p className="mt-1 text-white">
                        {lastUsed}
                    </p>

                </div>

                <div>

                    <p className="text-sm text-gray-500">
                        Registered
                    </p>

                    <p className="mt-1 text-white">
                        {created}
                    </p>

                </div>

            </div>

            <div className="mt-8 flex gap-3">

                <button
                    onClick={() => onRename(passkey)}
                    className="
                        rounded-xl
                        border
                        border-white/10
                        px-5
                        py-3
                        text-white
                        transition
                        hover:border-indigo-500
                    "
                >
                    Rename
                </button>

                <button
                    onClick={() => onDelete(passkey)}
                    className="
                        rounded-xl
                        bg-red-500/10
                        px-5
                        py-3
                        text-red-400
                        transition
                        hover:bg-red-500/20
                    "
                >
                    Delete
                </button>

            </div>

        </div>
    );
}