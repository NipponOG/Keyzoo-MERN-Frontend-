import { MdCached } from "react-icons/md";

export default function ClearCacheModal({
    open,
    onClose,
    onClear,
    clearing = false,
}) {

    if (!open) return null;

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/70
                backdrop-blur-sm
                p-4
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#1b1b1b]
                    p-6
                "
            >

                {/* HEADER */}

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-indigo-500/15
                        "
                    >

                        <MdCached
                            className={`
                                h-6
                                w-6
                                text-indigo-400
                                ${clearing ? "animate-spin" : ""}
                            `}
                        />

                    </div>

                    <div>

                        <h2 className="text-xl font-semibold text-white">
                            Clear Cache
                        </h2>

                        <p className="text-sm text-gray-400">
                            Clear all cached data.
                        </p>

                    </div>

                </div>


                {/* WARNING */}

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

                    <p className="text-sm font-medium text-yellow-400">
                        Are you sure?
                    </p>

                    <p className="mt-2 text-sm leading-5 text-gray-300">
                        This will remove all cached product, homepage,
                        search and API data. Fresh data will be generated
                        automatically when requested again.
                    </p>

                </div>


                {/* DESCRIPTION */}

                <p className="mt-6 text-sm leading-6 text-gray-400">
                    Clearing the cache does not delete your products,
                    orders, inventory or database data.
                </p>


                {/* ACTIONS */}

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        disabled={clearing}
                        className="
                            rounded-xl
                            border
                            border-white/10
                            px-5
                            py-3
                            text-white
                            transition
                            hover:bg-white/5
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        Cancel
                    </button>


                    <button
                        onClick={onClear}
                        disabled={clearing}
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
                            transition
                            hover:bg-indigo-500
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        {clearing && (
                            <span
                                className="
                                    h-4
                                    w-4
                                    animate-spin
                                    rounded-full
                                    border-2
                                    border-white/30
                                    border-t-white
                                "
                            />
                        )}

                        {clearing
                            ? "Clearing..."
                            : "Clear Cache"
                        }

                    </button>

                </div>

            </div>

        </div>
    );
}