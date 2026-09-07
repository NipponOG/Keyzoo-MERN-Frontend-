import { useEffect, useState } from "react";

export default function RenamePasskeyModal({
    passkey,
    onClose,
    onSave,
}) {

    const [deviceName, setDeviceName] = useState("");

    useEffect(() => {
        if (passkey) {
            setDeviceName(passkey.deviceName || "");
        }
    }, [passkey]);

    if (!passkey) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1b1b] p-6">

                <h2 className="text-xl font-semibold text-white">
                    Rename Passkey
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                    Give this device a recognizable name.
                </p>

                <div className="mt-6">
                    <label className="mb-2 block text-sm text-gray-300">
                        Device Name
                    </label>

                    <input
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        className="
                            w-full
                            rounded-xl
                            border
                            border-white/10
                            bg-[#232323]
                            px-4
                            py-3
                            text-white
                            outline-none
                            focus:border-indigo-500
                        "
                    />
                </div>

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
                        onClick={() => onSave(deviceName)}
                        className="
                            rounded-xl
                            bg-indigo-600
                            px-5
                            py-3
                            font-medium
                            text-white
                            hover:bg-indigo-500
                        "
                    >
                        Save Changes
                    </button>

                </div>

            </div>

        </div>
    );
}