import StyledQRCode from "@/components/admin/qr/StyledQRCode";
import { registerPasskey } from "@/lib/passkey";
import { useState } from "react";
import RegisterPasskeyModal from "@/components/admin/passkey/RegisterPasskeyModal";

export default function QRSection({

    qrCode,

    otpAuthUrl,

    expiresIn,

    minutes,

    seconds,

    code,

    inputRefs,

    handleChange,

    handleKeyDown,

    handlePaste,

    verifyCode,

    submitting,

    error,

    loadQRCode,

}) {

    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [registeringPasskey, setRegisteringPasskey] = useState(false);

    const handleRegisterPasskey = async (deviceName) => {
        try {
            setRegisteringPasskey(true);

            const jwt = localStorage.getItem("jwt");

            await registerPasskey(jwt, deviceName);

            setShowRegisterModal(false);

            alert("Passkey registered successfully.");
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setRegisteringPasskey(false);
        }
    };

    return (

        <div className="flex h-full flex-col items-center">

            {/* Title */}

            <h2 className="text-3xl font-bold text-white">

                Scan this QR Code

            </h2>

            <p className="mt-4 max-w-2xl text-center text-lg text-gray-400">

                Open Google Authenticator, Microsoft Authenticator,
                Authy or any TOTP application and scan the QR code below.

            </p>

            {/* QR */}

            <div className="mt-6">

                <div className="rounded-[28px] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,.35)]">

                    {/* <img

                        src={qrCode}

                        alt="QR Code"

                        className="h-[270px] w-[270px]"

                    /> */}

                    <StyledQRCode value={otpAuthUrl} />

                </div>

            </div>

            {/* Timer */}

            <div className="mt-8">

                {

                    expiresIn > 0

                        ?

                        <div className="inline-flex items-center gap-3 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-6 py-3">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-yellow-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />

                            </svg>

                            <span className="text-lg font-medium text-yellow-400">

                                QR expires in {minutes}:{seconds}

                            </span>

                        </div>

                        :

                        <button

                            onClick={loadQRCode}

                            className="rounded-xl bg-indigo-600 px-6 py-3 text-white transition hover:bg-indigo-500"

                        >

                            Generate New QR

                        </button>

                }

            </div>

            {/* Divider */}

            <div className="my-6 h-px w-full bg-white/10" />

            {/* OTP */}

            <p className="text-xl text-gray-300">

                Enter the 6-digit code

            </p>

            <form
                onSubmit={verifyCode}
                className="mt-6 w-full max-w-lg"
            >

                <div
                    className="flex justify-center gap-4"
                    onPaste={handlePaste}
                >

                    {

                        code.map((digit, index) => (

                            <input

                                key={index}

                                ref={(el) => inputRefs.current[index] = el}

                                value={digit}

                                onChange={(e) =>
                                    handleChange(index, e.target.value)
                                }

                                onKeyDown={(e) =>
                                    handleKeyDown(index, e)
                                }

                                maxLength={1}

                                inputMode="numeric"

                                className="
                                    h-16
                                    w-16
                                    rounded-2xl
                                    border
                                    border-white/15
                                    bg-[#181821]
                                    text-center
                                    text-3xl
                                    font-bold
                                    text-white
                                    transition
                                    outline-none
                                    focus:border-indigo-500
                                    focus:ring-4
                                    focus:ring-indigo-500/20
                                "

                            />

                        ))

                    }

                </div>

                {

                    error &&

                    <div className="mt-5 text-center text-red-400">

                        {error}

                    </div>

                }

                <button

                    type="submit"

                    disabled={
                        submitting ||
                        expiresIn === 0 ||
                        code.some(x => !x)
                    }

                    className="
                        mt-10
                        h-14
                        w-full
                        rounded-2xl
                        bg-gradient-to-r
                        from-indigo-600
                        to-violet-600
                        text-xl
                        font-semibold
                        text-white
                        transition
                        hover:scale-[1.01]
                        disabled:opacity-50
                    "

                >

                    {

                        submitting

                            ?

                            "Verifying..."

                            :

                            "Verify & Enable 2FA"

                    }

                </button>

                <button
                    type="button"
                    onClick={() => setShowRegisterModal(true)}
                    className="
        mt-10
        h-14
        w-full
        rounded-2xl
        bg-gradient-to-r
        from-indigo-600
        to-violet-600
        text-xl
        font-semibold
        text-white
        transition
        hover:scale-[1.01]
    "
                >
                    Register Passkey
                </button>

                <div className="mt-8 text-center text-gray-400">

                    Need help?

                    <button
                        type="button"
                        className="ml-2 text-indigo-400 hover:text-indigo-300"
                    >

                        View Guide

                    </button>

                </div>

            </form>

            <RegisterPasskeyModal
                open={showRegisterModal}
                loading={registeringPasskey}
                onClose={() => setShowRegisterModal(false)}
                onRegister={handleRegisterPasskey}
            />

        </div>

    );

}