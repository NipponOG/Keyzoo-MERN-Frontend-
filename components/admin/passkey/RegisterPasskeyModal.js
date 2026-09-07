import { useState, useEffect } from "react";

export default function RegisterPasskeyModal({
    open,
    onClose,
    onRegister,
    loading,
}) {

    const [deviceName, setDeviceName] = useState("");

    useEffect(() => {

        if (!open) {
            setDeviceName("");
        }

    }, [open]);

    if (!open) return null;

    const handleSubmit = async () => {

        const name = deviceName.trim();

        if (!name) return;

        await onRegister(name);

    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111118] p-8 shadow-2xl">

                <h2 className="text-2xl font-bold text-white">
                    Register New Passkey
                </h2>

                <p className="mt-3 text-gray-400">
                    Give this passkey a name so you can recognize it later.
                </p>

                <input
                    type="text"
                    autoFocus
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="Work Laptop"
                    className="
                        mt-6
                        h-14
                        w-full
                        rounded-2xl
                        border
                        border-white/10
                        bg-[#181821]
                        px-4
                        text-white
                        outline-none
                        focus:border-indigo-500
                    "
                />

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="rounded-xl border border-white/10 px-5 py-3 text-gray-300"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!deviceName.trim() || loading}
                        onClick={handleSubmit}
                        className="
                            rounded-xl
                            bg-indigo-600
                            px-5
                            py-3
                            text-white
                            disabled:opacity-50
                        "
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                </div>

            </div>
        </div>
    );
}