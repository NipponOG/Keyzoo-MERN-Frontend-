import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAdmin } from "@/context/AdminContext";

export default function Admin2FALogin() {

    const router = useRouter();

    const { login } = useAdmin();

    const [code, setCode] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {

        const jwt = sessionStorage.getItem("admin_jwt");

        const user = sessionStorage.getItem("admin_user");

        if (!jwt || !user) {

            router.replace("/admin/login");

        }

    }, []);

    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);

        setError("");

        try {

            const jwt = sessionStorage.getItem("admin_jwt");

            const response = await fetch(
                "/api/admin/2fa/login",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        code,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setError(data.error || "Invalid code");

                return;

            }

            login(
                jwt,
                data.user
            );

            sessionStorage.removeItem("admin_jwt");
            sessionStorage.removeItem("admin_user");

            router.replace("/tc");

        } catch (err) {

            console.error(err);

            setError("Something went wrong.");

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="min-h-screen bg-[#111] flex items-center justify-center p-6">

            <div className="w-full max-w-md rounded-2xl bg-[#1b1b1b] border border-[#2d2d2d] p-8">

                <h1 className="text-3xl font-bold text-white">

                    Two-Factor Authentication

                </h1>

                <p className="text-gray-400 mt-2 mb-8">

                    Enter the 6-digit code from your authenticator app.

                </p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={code}
                        onChange={(e) =>
                            setCode(
                                e.target.value.replace(/\D/g, "")
                            )
                        }
                        placeholder="123456"
                        className="w-full rounded-lg bg-[#232323] border border-[#333] px-4 py-3 text-white text-center text-2xl tracking-[0.5em] mb-4 outline-none focus:border-indigo-500"
                    />

                    {error && (

                        <div className="text-red-400 text-sm mb-4">

                            {error}

                        </div>

                    )}

                    <button
                        disabled={loading}
                        className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 py-3 text-white font-medium transition"
                    >

                        {loading
                            ? "Verifying..."
                            : "Verify"}

                    </button>

                </form>

            </div>

        </div>

    );

}