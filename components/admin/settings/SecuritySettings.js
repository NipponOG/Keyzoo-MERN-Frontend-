import SectionCard from "./SectionCard";
import { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";
import PasskeyList from "@/components/admin/passkey/PasskeyList";
import { getPasskeys, renamePasskey, deletePasskey } from "@/lib/passkey";
import RenamePasskeyModal from "@/components/admin/passkey/RenamePasskeyModal";
import DeletePasskeyModal from "@/components/admin/passkey/DeletePasskeyModal";
import Enable2FAModal from "./Enable2FAModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { changePassword, disable2FA } from "@/lib/auth";
import Disable2FAModal from "./Disable2FAModal";
import { toast } from "sonner";
import Enable2FAConfirmModal from "./Enable2FAConfirmModal";
import Enable2FASuccessModal from "./Enable2FASuccessModal";


export default function SecuritySettings({ user, refreshUser }) {

    console.log("User:", user);
    console.log("2FA:", user?.twoFactorEnabled);

    const [passkeys, setPasskeys] = useState([]);
    const [loadingPasskeys, setLoadingPasskeys] = useState(true);
    const [selectedPasskey, setSelectedPasskey] = useState(null);
    const [deletePasskeyItem, setDeletePasskeyItem] = useState(null);
    const [deletingPasskey, setDeletingPasskey] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [showEnable2FA, setShowEnable2FA] = useState(false);

    const [showDisable2FA, setShowDisable2FA] = useState(false);
    const [disabling2FA, setDisabling2FA] = useState(false);
    const [showEnableConfirm, setShowEnableConfirm] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const loadPasskeys = async () => {
        try {
            setLoadingPasskeys(true);

            const jwt = localStorage.getItem("jwt");

            const data = await getPasskeys(jwt);

            setPasskeys(data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoadingPasskeys(false);
        }
    };

    useEffect(() => {
        loadPasskeys();
    }, []);

    return (
        <div className="space-y-8">

            {/* <SectionCard
                title="Passkeys"
                description="Use Windows Hello, Face ID or a hardware security key to sign in without a password."
            >
                <button
                    className="
                        rounded-xl
                        bg-indigo-600
                        px-5
                        py-3
                        font-medium
                        text-white
                        transition
                        hover:bg-indigo-500
                    "
                >
                    Register Passkey
                </button>
            </SectionCard> */}

            {
                loadingPasskeys
                    ? (
                        <div className="text-gray-400">
                            Loading passkeys...
                        </div>
                    )
                    : (
                        <PasskeyList
                            passkeys={passkeys}
                            onRefresh={loadPasskeys}
                            onRename={(passkey) => {
                                setSelectedPasskey(passkey);
                            }}
                            onDelete={(passkey) => {
                                setDeletePasskeyItem(passkey);
                            }}
                        />
                    )
            }

            <SectionCard

                title="Password"
                description="Manage your account password."
            >
                <button
                    onClick={() => setShowChangePassword(true)}
                    className="
        rounded-xl
        border
        border-white/10
        px-5
        py-3
        text-white
    "
                >
                    Change Password
                </button>

            </SectionCard>

            <SectionCard
                user={user}
                // refreshUser={loadUser}
                title="Two-factor Authentication"
                description="Protect your account with an authenticator app."
            >
                {user?.twoFactorEnabled ? (

                    <div className="flex items-center justify-between">
                        <span className="text-green-400">
                            Enabled
                        </span>

                        <button
                            // onClick={async () => {

                            //     if (!confirm("Disable two-factor authentication?")) {
                            //         return;
                            //     }

                            //     try {

                            //         const jwt = localStorage.getItem("jwt");

                            //         await disable2FA(jwt);
                            //         await refreshUser();

                            //         toast.success("Two-factor authentication disabled.");

                            //         // Reload the user
                            //         // const data = await getAdminMe(jwt);

                            //     } catch (err) {

                            //         toast.error(err.message);

                            //     }

                            // }}
                            onClick={() => setShowDisable2FA(true)}
                            className="rounded-xl border border-red-500 px-5 py-3 text-red-400"
                        >
                            Disable
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">
                            Not enabled
                        </span>

                        <button
                            onClick={() => setShowEnableConfirm(true)}
                            className="rounded-xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-500"
                        >
                            Enable
                        </button>

                        <Enable2FAModal
                            open={showEnable2FA}
                            onClose={() => setShowEnable2FA(false)}
                            refreshUser={refreshUser}
                            onSuccess={() => setShowSuccessModal(true)}

                        />
                    </div>
                )}
            </SectionCard>

            <RenamePasskeyModal
                passkey={selectedPasskey}
                onClose={() => setSelectedPasskey(null)}
                onSave={async (deviceName) => {

                    // try {

                    //     const jwt = localStorage.getItem("jwt");

                    //     await renamePasskey(
                    //         jwt,
                    //         selectedPasskey.documentId,
                    //         deviceName
                    //     );

                    //     setSelectedPasskey(null);

                    //     await loadPasskeys();

                    // } catch (err) {
                    //     // toast.error(err.message);
                    //     toast.error("Unable to change password", {
                    //         description: err.message,
                    //     });
                    // }

                    const toastId = toast.loading("Renaming passkey...");

                    try {

                        const jwt = localStorage.getItem("jwt");

                        await renamePasskey(
                            jwt,
                            selectedPasskey.documentId,
                            deviceName
                        );

                        setSelectedPasskey(null);

                        await loadPasskeys();

                        toast.success("Passkey renamed", {
                            id: toastId,
                        });

                    } catch (err) {

                        toast.error("Unable to rename passkey", {
                            id: toastId,
                            description: err.message,
                        });

                    }

                }}
            />

            <DeletePasskeyModal
                passkey={deletePasskeyItem}
                deleting={deletingPasskey}
                onClose={() => setDeletePasskeyItem(null)}
                onDelete={async () => {

                    // try {

                    //     setDeletingPasskey(true);

                    //     const jwt = localStorage.getItem("jwt");

                    //     await deletePasskey(
                    //         jwt,
                    //         deletePasskeyItem.documentId
                    //     );

                    //     setDeletePasskeyItem(null);

                    //     await loadPasskeys();

                    // } catch (err) {

                    //     // toast.error(err.message);
                    //     toast.error("Unable to change password", {
                    //         description: err.message,
                    //     });

                    // } finally {

                    //     setDeletingPasskey(false);

                    // }

                    const toastId = toast.loading("Deleting passkey...");

                    try {

                        setDeletingPasskey(true);

                        const jwt = localStorage.getItem("jwt");

                        await deletePasskey(
                            jwt,
                            deletePasskeyItem.documentId
                        );

                        setDeletePasskeyItem(null);

                        await loadPasskeys();

                        toast.success("Passkey deleted", {
                            id: toastId,
                        });

                    } catch (err) {

                        toast.error("Unable to delete passkey", {
                            id: toastId,
                            description: err.message,
                        });

                    } finally {

                        setDeletingPasskey(false);

                    }

                }}
            />

            <ChangePasswordModal
                open={showChangePassword}
                loading={changingPassword}
                onClose={() => setShowChangePassword(false)}
                onSave={async ({
                    currentPassword,
                    newPassword,
                    confirmPassword,
                }) => {

                    if (newPassword !== confirmPassword) {
                        // return alert("Passwords do not match.");
                        return toast.error("Passwords do not match.");
                    }

                    // try {

                    //     setChangingPassword(true);

                    //     const jwt = localStorage.getItem("jwt");

                    //     await changePassword(
                    //         jwt,
                    //         currentPassword,
                    //         newPassword
                    //     );

                    //     setShowChangePassword(false);

                    //     // toast.success("Password changed successfully.");
                    //     toast.success("Password updated", {
                    //         description: "Your password has been changed successfully.",
                    //     });

                    // } catch (err) {

                    //     // toast.error(err.message);
                    //     toast.error("Unable to change password", {
                    //         description: err.message,
                    //     });

                    // } finally {

                    //     setChangingPassword(false);

                    // }

                    const toastId = toast.loading("Updating password...");

                    try {

                        setChangingPassword(true);

                        const jwt = localStorage.getItem("jwt");

                        await changePassword(
                            jwt,
                            currentPassword,
                            newPassword
                        );

                        setShowChangePassword(false);

                        toast.success("Password updated", {
                            id: toastId,
                            description: "Your password has been changed successfully.",
                        });

                    } catch (err) {

                        toast.error("Unable to change password", {
                            id: toastId,
                            description: err.message,
                        });

                    } finally {

                        setChangingPassword(false);

                    }

                }}
            />

            <Enable2FAConfirmModal
                open={showEnableConfirm}
                onClose={() => setShowEnableConfirm(false)}
                onContinue={() => {
                    setShowEnableConfirm(false);
                    setShowEnable2FA(true);
                }}
                isReset={false}
            />

            <Enable2FASuccessModal
                open={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
            />

            <Disable2FAModal
                open={showDisable2FA}
                loading={disabling2FA}
                onClose={() => setShowDisable2FA(false)}
                onConfirm={async () => {

                    // try {

                    //     setDisabling2FA(true);

                    //     const jwt = localStorage.getItem("jwt");

                    //     await disable2FA(jwt);

                    //     await refreshUser();

                    //     toast.success("Two-factor authentication disabled.");

                    //     setShowDisable2FA(false);

                    // } catch (err) {

                    //     // toast.error(err.message);
                    //     toast.error("Unable to change password", {
                    //         description: err.message,
                    //     });

                    // } finally {

                    //     setDisabling2FA(false);

                    // }

                    const toastId = toast.loading("Disabling two-factor authentication...");

                    try {

                        setDisabling2FA(true);

                        const jwt = localStorage.getItem("jwt");

                        await disable2FA(jwt);

                        await refreshUser();

                        setShowDisable2FA(false);

                        toast.success("Two-factor authentication disabled", {
                            id: toastId,
                            description: "Your account is no longer protected by an authenticator app.",
                        });

                    } catch (err) {

                        toast.error("Unable to disable two-factor authentication", {
                            id: toastId,
                            description: err.message,
                        });

                    } finally {

                        setDisabling2FA(false);

                    }

                }}
            />

        </div>
    );
}