import { useEffect, useState } from "react";

export default function ChangePasswordModal({
    open,
    loading,
    onClose,
    onSave,
}) {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (!open) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1b1b] p-6">

                <h2 className="text-xl font-semibold text-white">
                    Change Password
                </h2>

                <div className="mt-6 space-y-4">

                    <input
                        type="password"
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) =>
                            setCurrentPassword(e.target.value)
                        }
                        className="w-full rounded-lg border border-[#333] bg-[#232323] px-4 py-3 text-white"
                    />

                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(e.target.value)
                        }
                        className="w-full rounded-lg border border-[#333] bg-[#232323] px-4 py-3 text-white"
                    />

                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        className="w-full rounded-lg border border-[#333] bg-[#232323] px-4 py-3 text-white"
                    />

                </div>

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border border-white/10 px-5 py-3 text-white"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={() =>
                            onSave({
                                currentPassword,
                                newPassword,
                                confirmPassword,
                            })
                        }
                        className="rounded-xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-500 disabled:opacity-50"
                    >
                        {loading
                            ? "Updating..."
                            : "Change Password"}
                    </button>

                </div>

            </div>

        </div>
    );
}