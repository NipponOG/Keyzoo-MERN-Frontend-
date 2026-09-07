import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useAdmin } from "@/context/AdminContext";
import SetupLayout from "@/components/admin/2fa/SetupLayout";
import SetupHeader from "@/components/admin/2fa/SetupHeader";
import SetupStepper from "@/components/admin/2fa/SetupStepper";
import QRSection from "@/components/admin/2fa/QRSection";
import InfoPanel from "@/components/admin/2fa/InfoPanel";

export default function Admin2FASetup() {

    // const [code, setCode] = useState("");
    const router = useRouter();
    const { login } = useAdmin();
    // const [qrCode, setQrCode] = useState("");
    const [otpAuthUrl, setOtpAuthUrl] = useState("");
    const [expiresIn, setExpiresIn] = useState(0);
    const [code, setCode] = useState(Array(6).fill(""));
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const inputRefs = useRef([]);

    const loadQRCode = async () => {

        const jwt = sessionStorage.getItem("admin_jwt");

        if (!jwt) {

            router.replace("/admin/login");

            return;

        }

        setLoading(true);

        setError("");

        try {

            const response = await fetch("/api/admin/2fa/setup", {

                headers: {
                    Authorization: `Bearer ${jwt}`,
                },

            });

            const data = await response.json();
            console.log(data);

            if (!response.ok) {

                setError(data.error || "Unable to generate QR Code.");

                return;

            }

            // setQrCode(data.qrCode);
            setOtpAuthUrl(data.otpAuthUrl);

            setExpiresIn(data.expiresIn);

            setCode(Array(6).fill(""));

        } catch (err) {

            console.error(err);

            setError("Unable to generate QR Code.");

        } finally {

            setLoading(false);

        }

    };

    // useEffect(() => {

    //     let mounted = true;

    //     const loadQRCode = async () => {

    //         const jwt = sessionStorage.getItem("admin_jwt");

    //         if (!jwt) {

    //             router.replace("/admin/login");

    //             return;

    //         }

    //         try {

    //             const response = await fetch("/api/admin/2fa/setup", {

    //                 headers: {

    //                     Authorization: `Bearer ${jwt}`,

    //                 },

    //             });

    //             const data = await response.json();

    //             if (!mounted) return;

    //             if (!response.ok) {

    //                 setError(data.error || "Unable to generate QR Code.");

    //                 return;

    //             }

    //             setQrCode(data.qrCode);
    //             setExpiresIn(data.expiresIn);

    //         } catch (err) {

    //             console.error(err);

    //             if (mounted) {

    //                 setError("Unable to load QR code.");

    //             }

    //         } finally {

    //             if (mounted) {

    //                 setLoading(false);

    //             }

    //         }

    //     };

    //     loadQRCode();

    //     return () => {

    //         mounted = false;

    //     };

    // }, [router]);

    useEffect(() => {

        loadQRCode();

    }, []);

    useEffect(() => {

        if (!expiresIn) return;

        const timer = setInterval(() => {

            setExpiresIn(prev => {

                if (prev <= 1) {

                    clearInterval(timer);

                    return 0;

                }

                return prev - 1;

            });

        }, 1000);

        return () => clearInterval(timer);

    }, [expiresIn > 0]);

    function handleChange(index, value) {

        if (!/^\d?$/.test(value)) return;

        const next = [...code];

        next[index] = value;

        setCode(next);

        if (value && index < 5) {

            inputRefs.current[index + 1]?.focus();

        }

    }

    function handleKeyDown(index, e) {

        if (
            e.key === "Backspace" &&
            !code[index] &&
            index > 0
        ) {

            inputRefs.current[index - 1]?.focus();

        }

    }

    function handlePaste(e) {

        e.preventDefault();

        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pasted) return;

        const next = Array(6).fill("");

        pasted.split("").forEach((digit, i) => {

            next[i] = digit;

        });

        setCode(next);

        const last = Math.min(
            pasted.length,
            6
        );

        inputRefs.current[last - 1]?.focus();

    }

    const verifyCode = async (e) => {

        e.preventDefault();

        setError("");

        if (code.some(d => !d)) {

            setError("Enter the 6-digit verification code.");

            return;

        }

        setSubmitting(true);

        try {

            const jwt = sessionStorage.getItem("admin_jwt");

            const user = JSON.parse(
                sessionStorage.getItem("admin_user")
            );

            const response = await fetch("/api/admin/2fa/verify", {

                method: "POST",

                headers: {

                    Authorization: `Bearer ${jwt}`,

                    "Content-Type": "application/json",

                },

                body: JSON.stringify({

                    code: code.join(""),

                }),

            });

            const data = await response.json();

            if (!response.ok) {

                setError(data.error || "Verification failed.");

                return;

            }

            login(jwt, user);

            sessionStorage.removeItem("admin_jwt");

            sessionStorage.removeItem("admin_user");

            router.replace("/tc");

        } catch (err) {

            console.error(err);

            setError("Something went wrong.");

        } finally {

            setSubmitting(false);

        }

    };

    if (loading) {

        return (

            <div className="min-h-screen flex items-center justify-center bg-[#111]">

                <div className="text-center">

                    <div className="h-10 w-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto" />

                    <p className="text-gray-400 mt-5">

                        Preparing Two-Factor Authentication...

                    </p>

                </div>

            </div>

        );

    }

    const minutes = String(
        Math.floor(expiresIn / 60)
    ).padStart(2, "0");

    const seconds = String(
        expiresIn % 60
    ).padStart(2, "0");

    // return (

    //     <div
    //         className="min-h-screen"
    //         style={{
    //             background: `
    //         radial-gradient(circle at top left, rgba(99,102,241,.15), transparent 35%),
    //         radial-gradient(circle at bottom right, rgba(168,85,247,.12), transparent 35%),
    //         #0b0b11
    //     `,
    //         }}
    //     >
    //         <div className="mx-auto max-w-[1700px] px-8 py-10">
    //             <div className="grid gap-8 xl:grid-cols-[280px_1fr_280px]">

    //                 <div className="h-full">
    //                     <SetupSidebar />
    //                 </div>

    //                 <div className="flex justify-center">

    //                     <div className="w-full rounded-3xl border border-white/10 bg-[#18181f] p-10 shadow-2xl">

    //                         {/* <div className="w-full rounded-3xl border border-white/10 bg-[#18181f] p-10 shadow-2xl"> */}

    //                         <div className="text-center">

    //                             <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-indigo-600/15 flex items-center justify-center">

    //                                 <svg
    //                                     xmlns="http://www.w3.org/2000/svg"
    //                                     className="h-8 w-8 text-indigo-400"
    //                                     fill="none"
    //                                     viewBox="0 0 24 24"
    //                                     stroke="currentColor"
    //                                 >
    //                                     <path
    //                                         strokeLinecap="round"
    //                                         strokeLinejoin="round"
    //                                         strokeWidth={2}
    //                                         d="M12 11c0-3.314 2.686-6 6-6m-6 6v10m0-10c0-3.314-2.686-6-6-6m6 6H6"
    //                                     />
    //                                 </svg>

    //                             </div>

    //                             <h1 className="text-3xl font-bold text-white">

    //                                 Secure Your Admin Account

    //                             </h1>

    //                             <p className="text-gray-400 mt-3">

    //                                 Protect your Keyzoo Admin account by enabling
    //                                 Two-Factor Authentication.

    //                             </p>

    //                         </div>

    //                         {qrCode && (

    //                             <div className="my-10 space-y-6">

    //                                 <div className="mx-auto w-fit rounded-3xl bg-white p-5 shadow-2xl">

    //                                     <img
    //                                         src={qrCode}
    //                                         alt="2FA QR Code"
    //                                         className="h-[340px] w-[340px]"
    //                                     />

    //                                 </div>

    //                                 <div className="mt-5 text-center">

    //                                     {expiresIn > 0 ? (

    //                                         <div className="inline-flex items-center rounded-full bg-yellow-500/10 border border-yellow-500/20 px-4 py-2">

    //                                             <span className="text-yellow-400 text-sm">

    //                                                 QR expires in {minutes}:{seconds}

    //                                             </span>

    //                                         </div>

    //                                     ) : (

    //                                         <div className="flex flex-col items-center gap-4">

    //                                             <div className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2">

    //                                                 <span className="text-sm text-red-400">

    //                                                     QR Code Expired

    //                                                 </span>

    //                                             </div>

    //                                             <button
    //                                                 type="button"
    //                                                 onClick={loadQRCode}
    //                                                 className="rounded-xl bg-indigo-600 px-6 py-3 text-white transition hover:bg-indigo-500"
    //                                             >

    //                                                 Generate New QR Code

    //                                             </button>

    //                                         </div>

    //                                     )}

    //                                 </div>

    //                                 <p className="text-center text-sm text-gray-500 mt-5">

    //                                     Scan using Google Authenticator,
    //                                     Microsoft Authenticator,
    //                                     Authy or Bitwarden.

    //                                 </p>

    //                             </div>

    //                         )}

    //                         <form onSubmit={verifyCode}>

    //                             <div
    //                                 className="flex justify-center gap-3"
    //                                 onPaste={handlePaste}
    //                             >

    //                                 {code.map((digit, index) => (

    //                                     <input

    //                                         key={index}

    //                                         ref={(el) =>
    //                                             inputRefs.current[index] = el
    //                                         }

    //                                         value={digit}

    //                                         onChange={(e) =>
    //                                             handleChange(
    //                                                 index,
    //                                                 e.target.value
    //                                             )
    //                                         }

    //                                         onKeyDown={(e) =>
    //                                             handleKeyDown(index, e)
    //                                         }

    //                                         inputMode="numeric"

    //                                         autoComplete="one-time-code"

    //                                         maxLength={1}

    //                                         className="
    //             h-16
    //             w-16
    //             shadow-lg
    //             rounded-xl
    //             border
    //             border-[#343434]
    //             bg-[#232323]
    //             text-center
    //             text-2xl
    //             font-semibold
    //             text-white
    //             outline-none
    //             transition
    //             focus:border-indigo-500
    //             focus:ring-2
    //             focus:ring-indigo-500/30
    //         "

    //                                     />

    //                                 ))}

    //                             </div>

    //                             {error && (

    //                                 <div className="text-red-400 text-sm mt-4">

    //                                     {error}

    //                                 </div>

    //                             )}

    //                             <button

    //                                 type="submit"

    //                                 disabled={
    //                                     submitting ||
    //                                     expiresIn === 0 ||
    //                                     code.some(d => !d)
    //                                 }

    //                                 // className="mt-6 w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-white font-medium transition"
    //                                 className="mt-8 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-4 text-lg font-semibold text-white transition hover:scale-[1.01] hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50"

    //                             >

    //                                 {submitting
    //                                     ? "Verifying..."
    //                                     : expiresIn === 0
    //                                         ? "QR Expired"
    //                                         : "Verify & Enable 2FA"}

    //                             </button>

    //                         </form>

    //                         {/* </div> */}

    //                     </div>

    //                 </div>

    //                 <div className="h-full">
    //                     <SecurityPanel />
    //                 </div>

    //             </div>
    //         </div>




    //     </div>

    // );

    return (

        <SetupLayout

            header={<SetupHeader />}

            left={<SetupStepper />}

            center={

                <QRSection

                    // qrCode={qrCode}

                    otpAuthUrl={otpAuthUrl}

                    expiresIn={expiresIn}

                    minutes={minutes}

                    seconds={seconds}

                    code={code}

                    inputRefs={inputRefs}

                    handleChange={handleChange}

                    handleKeyDown={handleKeyDown}

                    handlePaste={handlePaste}

                    verifyCode={verifyCode}

                    submitting={submitting}

                    error={error}

                    loadQRCode={loadQRCode}

                />

            }

            right={<InfoPanel />}

        />

    );
}