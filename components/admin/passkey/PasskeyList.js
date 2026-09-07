import PasskeyCard from "./PasskeyCard";
import { registerPasskey } from "@/lib/passkey";
import { useState } from "react";
import RegisterPasskeyModal from "@/components/admin/passkey/RegisterPasskeyModal";
import { toast } from "sonner";

export default function PasskeyList({
    passkeys,
    onRename,
    onDelete,
    onRefresh,
}) {

    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [registeringPasskey, setRegisteringPasskey] = useState(false);

    // const handleRegisterPasskey = async (deviceName) => {
    //     try {
    //         setRegisteringPasskey(true);

    //         const jwt = localStorage.getItem("jwt");

    //         await registerPasskey(jwt, deviceName);

    //         await onRefresh();

    //         setShowRegisterModal(false);

    //         alert("Passkey registered successfully.");
    //     } catch (err) {
    //         console.error(err);
    //         alert(err.message);
    //     } finally {
    //         setRegisteringPasskey(false);
    //     }
    // };

    const handleRegisterPasskey = async (deviceName) => {

        const toastId = toast.loading("Registering passkey...");

        try {

            setRegisteringPasskey(true);

            const jwt = localStorage.getItem("jwt");

            await registerPasskey(jwt, deviceName);

            await onRefresh();

            setShowRegisterModal(false);

            toast.success("Passkey registered", {
                id: toastId,
                description: `"${deviceName}" is now available for passwordless sign in.`,
            });

        } catch (err) {

            console.error(err);

            toast.error("Unable to register passkey", {
                id: toastId,
                description: err.message,
            });

        } finally {

            setRegisteringPasskey(false);

        }

    };

    if (!passkeys.length) {
        return (
            <>
                <div className="w-full flex flex-col items-center gap-4 rounded-3xl border border-dashed border-white/10 p-10 text-center text-gray-400">
                    No passkeys registered.

                    <button
                        type="button"
                        onClick={() => setShowRegisterModal(true)}
                        className="w-lg rounded-lg border border-[#333] bg-[#232323] py-3 text-white transition hover:bg-[#2b2b2b]"
                    >
                        Register Passkey
                    </button>
                </div>

                <RegisterPasskeyModal
                    open={showRegisterModal}
                    loading={registeringPasskey}
                    onClose={() => setShowRegisterModal(false)}
                    onRegister={handleRegisterPasskey}
                />
            </>
        );
    }

    return (
        <div className="space-y-6">
            {passkeys.map((passkey) => (
                <PasskeyCard
                    key={passkey.documentId}
                    passkey={passkey}
                    onRename={onRename}
                    onDelete={onDelete}
                />
            ))}
        </div>

    );
}