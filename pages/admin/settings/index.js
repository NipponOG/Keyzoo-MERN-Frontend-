
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    FiArrowLeft,
    FiShield,
    FiUser,
    FiClock,
    FiMapPin,
    FiMonitor,
    FiRefreshCw,
} from "react-icons/fi";
import adminFetch from "@/lib/adminFetch";
import { startRegistration } from "@simplewebauthn/browser";

function formatDate(value) {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function getBrowserLabel(userAgent) {
    if (!userAgent) return "Unknown device";

    if (userAgent.includes("Edg/")) return "Microsoft Edge";
    if (userAgent.includes("Chrome/")) return "Google Chrome";
    if (userAgent.includes("Firefox/")) return "Mozilla Firefox";
    if (userAgent.includes("Safari/")) return "Safari";

    return "Unknown browser";
}

export default function AdminSettings() {

    const [admin, setAdmin] = useState(null);
    const [logins, setLogins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [passkeyLoading, setPasskeyLoading] = useState(false);
    const [passkeyMessage, setPasskeyMessage] = useState("");
    const [passkeyError, setPasskeyError] = useState("");

    const [passkeys, setPasskeys] = useState([]);
    const [passkeysLoading, setPasskeysLoading] = useState(false);

    const [removingPasskeyId, setRemovingPasskeyId] = useState("");
    const [passkeyActionError, setPasskeyActionError] = useState("");

    const fetchSettings = async () => {
        try {
            setLoading(true);
            setError("");

            const [meResponse, activityResponse] = await Promise.all([
                adminFetch("/admin/me"),
                adminFetch("/admin/login-activity"),
            ]);

            setAdmin(meResponse?.user || null);
            setLogins(activityResponse?.logins || []);
        } catch (err) {
            setError(
                err?.message || "Unable to load admin settings."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchPasskeys = async () => {
        try {
            setPasskeysLoading(true);

            const response = await adminFetch("/admin/passkeys");

            setPasskeys(response?.passkeys || []);
        } catch (err) {
            console.error("Failed to load admin passkeys:", err);
        } finally {
            setPasskeysLoading(false);
        }
    };

    const removePasskey = async (passkey) => {
        const confirmed = window.confirm(
            `Remove "${passkey.name || "My passkey"}"? This device will no longer be able to authenticate with this passkey.`
        );

        if (!confirmed) return;

        setRemovingPasskeyId(passkey.id);
        setPasskeyActionError("");
        setPasskeyError("");
        setPasskeyMessage("");

        try {
            const response = await adminFetch(
                `/admin/passkeys/${encodeURIComponent(passkey.id)}`,
                { method: "DELETE" }
            );

            if (!response?.success || !response?.removed) {
                throw new Error("The passkey could not be removed.");
            }

            setPasskeys((current) =>
                current.filter((item) => item.id !== passkey.id)
            );

            setPasskeyMessage("Passkey removed successfully.");
        } catch (err) {
            setPasskeyActionError(
                err?.message || "Unable to remove this passkey."
            );
        } finally {
            setRemovingPasskeyId("");
        }
    };


    useEffect(() => {
        fetchSettings();
        fetchPasskeys();
    }, []);

    const adminName =
        [admin?.firstName, admin?.lastName]
            .filter(Boolean)
            .join(" ") ||
        admin?.username ||
        "Administrator";


    const registerPasskey = async () => {
        setPasskeyLoading(true);
        setPasskeyMessage("");
        setPasskeyError("");

        try {
            // Request registration options from the backend.
            const optionsResponse = await adminFetch(
                "/admin/passkeys/register/options",
                {
                    method: "POST",
                    body: JSON.stringify({}),
                }
            );

            if (!optionsResponse?.options) {
                throw new Error("Unable to get passkey registration options.");
            }

            // Open the browser's passkey creation prompt.
            const credential = await startRegistration({
                optionsJSON: optionsResponse.options,
            });

            // Send the credential to the backend for verification.
            const verificationResponse = await adminFetch(
                "/admin/passkeys/register/verify",
                {
                    method: "POST",
                    body: JSON.stringify({
                        response: credential,
                        name: "Keyzoo Admin Passkey",
                    }),
                }
            );

            if (!verificationResponse?.verified) {
                throw new Error("Passkey verification failed.");
            }

            setPasskeyMessage(
                "Passkey registered successfully on this device."
            );
        } catch (err) {
            if (err?.name === "NotAllowedError") {
                setPasskeyError(
                    "Passkey registration was cancelled or not allowed."
                );
            } else {
                setPasskeyError(
                    err?.message || "Unable to register your passkey."
                );
            }
        } finally {
            setPasskeyLoading(false);
        }
    };


    return (
        <>
            <Head>
                <title>Admin Settings | Keyzoo</title>
                <meta
                    name="description"
                    content="Manage your Keyzoo admin account and security."
                />
            </Head>

            <main className="min-h-screen p-4 text-white sm:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <Link
                                href="/admin/dashboard"
                                className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
                            >
                                <FiArrowLeft />
                                Back to dashboard
                            </Link>

                            <h1 className="text-3xl font-bold">
                                Admin Settings
                            </h1>

                            <p className="mt-2 text-sm text-gray-400">
                                Manage your account and review security activity.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={fetchSettings}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#1d1d1d] px-4 py-3 text-sm text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
                        >
                            <FiRefreshCw
                                className={loading ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>
                    </header>

                    {error && (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    {loading && !admin ? (
                        <div className="grid gap-6 lg:grid-cols-2">
                            {[1, 2].map((item) => (
                                <div
                                    key={item}
                                    className="h-64 animate-pulse rounded-2xl border border-white/5 bg-[#1b1b1b]"
                                />
                            ))}
                        </div>
                    ) : (
                        <>
                            <section className="rounded-2xl border border-[#292929] bg-[#1b1b1b] p-6">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                        <FiUser size={22} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            Admin Profile
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Your current administrator account
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-2xl font-bold text-indigo-300">
                                        {adminName.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-xl font-semibold">
                                            {adminName}
                                        </h3>
                                        <p className="mt-1 break-all text-sm text-gray-400">
                                            {admin?.email || "Email unavailable"}
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                                                Administrator
                                            </span>

                                            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${admin?.isBlocked
                                                ? "border-red-500/20 bg-red-500/10 text-red-300"
                                                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                                                }`}>
                                                {admin?.isBlocked ? "Blocked" : "Active"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-4 border-t border-white/5 pt-5 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Account created
                                        </p>
                                        <p className="mt-1 text-sm text-gray-200">
                                            {formatDate(admin?.createdAt)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Two-factor authentication
                                        </p>
                                        <p className="mt-1 text-sm text-gray-200">
                                            {admin?.twoFactorEnabled
                                                ? "Enabled"
                                                : "Not enabled"}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-[#292929] bg-[#1b1b1b] p-6">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                                        <FiShield size={22} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            Login Activity
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Recent successful admin sign-ins
                                        </p>
                                    </div>
                                </div>

                                {logins.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
                                        <FiClock className="mx-auto mb-3 text-2xl text-gray-600" />
                                        <p className="text-sm text-gray-300">
                                            No login history available yet.
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            New successful logins will appear here.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {logins.map((login) => (
                                            <article
                                                key={login.id}
                                                className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex min-w-0 items-start gap-3">
                                                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-gray-400">
                                                            <FiMonitor />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-gray-200">
                                                                {getBrowserLabel(login.userAgent)}
                                                            </p>
                                                            <p className="mt-1 break-all text-xs text-gray-500">
                                                                {login.userAgent || "Device details unavailable"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span className="shrink-0 text-xs text-gray-400">
                                                        {formatDate(login.createdAt)}
                                                    </span>
                                                </div>


                                                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-xs text-gray-400">
                                                    <span className="inline-flex items-center gap-2">
                                                        <FiMapPin />
                                                        IP: {
                                                            !login.ipAddress
                                                                ? "Unavailable"
                                                                : ["::1", "127.0.0.1", "::ffff:127.0.0.1"].includes(
                                                                    login.ipAddress
                                                                )
                                                                    ? "Localhost (development)"
                                                                    : login.ipAddress
                                                        }
                                                    </span>

                                                    <span>
                                                        Method: {login.loginMethod || "Password"}
                                                    </span>

                                                    {login.location && (
                                                        <span className="inline-flex items-center gap-2">
                                                            <FiMapPin />
                                                            Location: {
                                                                [
                                                                    login.location.city,
                                                                    login.location.region,
                                                                    login.location.country,
                                                                ]
                                                                    .filter(Boolean)
                                                                    .join(", ") || "Unavailable"
                                                            }
                                                        </span>
                                                    )}
                                                </div>

                                            </article>
                                        ))}
                                    </div>
                                )}
                            </section>


                            <section className="rounded-2xl border border-[#292929] bg-[#1b1b1b] p-6">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                        <FiShield size={22} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-lg font-semibold">
                                            Passkey Security
                                        </h2>

                                        <p className="mt-1 text-sm leading-6 text-gray-400">
                                            Manage the passkeys registered to your admin account.
                                        </p>

                                        <div className="mt-5 space-y-3">
                                            {passkeysLoading ? (
                                                <div className="animate-pulse rounded-xl border border-white/5 bg-white/[0.02] p-5 text-sm text-gray-400">
                                                    Loading registered passkeys...
                                                </div>
                                            ) : passkeys.length === 0 ? (
                                                <div className="rounded-xl border border-dashed border-white/10 p-5">
                                                    <p className="text-sm text-gray-300">
                                                        No passkeys found.
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Register a passkey to get started.
                                                    </p>
                                                </div>
                                            ) : (
                                                passkeys.map((passkey) => (
                                                    <article
                                                        key={passkey.id}
                                                        className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                                                                <FiShield size={19} />
                                                            </div>

                                                            <div className="min-w-0 flex-1">
                                                                <p className="break-words text-sm font-medium text-gray-200">
                                                                    {passkey.name || "My passkey"}
                                                                </p>

                                                                <p className="mt-1 text-xs text-gray-400">
                                                                    Device type: {passkey.deviceType || "Unknown"}
                                                                </p>

                                                                <p className="mt-1 text-xs text-gray-500">
                                                                    Registered: {formatDate(passkey.createdAt)}
                                                                </p>

                                                                <p className="mt-1 text-xs text-gray-500">
                                                                    Last used: {formatDate(passkey.lastUsedAt)}
                                                                </p>

                                                                <p className="mt-2 text-xs text-gray-500">
                                                                    {passkey.backedUp
                                                                        ? "Backup eligible"
                                                                        : "Backup not reported"}
                                                                </p>
                                                            </div>

                                                            <div className="flex shrink-0 flex-col items-end gap-2">
                                                                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">
                                                                    Registered
                                                                </span>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => removePasskey(passkey)}
                                                                    disabled={removingPasskeyId === passkey.id}
                                                                    className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                                                >
                                                                    {removingPasskeyId === passkey.id
                                                                        ? "Removing..."
                                                                        : "Remove"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </article>
                                                ))
                                            )}
                                        </div>

                                        {passkeyActionError && (
                                            <p role="alert" className="mt-3 text-sm text-red-400">
                                                {passkeyActionError}
                                            </p>
                                        )}

                                        <button
                                            type="button"
                                            onClick={fetchPasskeys}
                                            disabled={passkeysLoading}
                                            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/10 disabled:opacity-50"
                                        >
                                            <FiRefreshCw
                                                className={passkeysLoading ? "animate-spin" : ""}
                                            />
                                            Refresh passkeys
                                        </button>

                                        <button
                                            type="button"
                                            onClick={registerPasskey}
                                            disabled={passkeyLoading}
                                            className="mt-4 ml-2 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <FiShield size={17} />
                                            {passkeyLoading ? "Registering passkey..." : "Register Passkey"}
                                        </button>

                                    </div>
                                </div>
                            </section>


                        </>
                    )}
                </div>
            </main>
        </>
    );
}
