import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function EmailStep() {
    const router = useRouter();
    const {
        user,
        jwt,
        loading: authLoading,
    } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!jwt || !user) {
            router.push("/sign-in");
            return;
        }

        setLoading(false);
    }, [
        authLoading,
        jwt,
        user,
        router,
    ]);

    if (loading || authLoading) {
        return (
            <div className="bg-[#1a1a1a] p-6 rounded-lg space-y-4">
                <h3 className="text-sm text-gray-400">
                    Step 1
                </h3>

                <h2 className="text-lg font-bold">
                    Add an email address
                </h2>

                <div className="h-12 rounded bg-[#222] animate-pulse" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#1a1a1a] p-6 rounded-lg space-y-4">
                <h3 className="text-sm text-gray-400">
                    Step 1
                </h3>

                <h2 className="text-lg font-bold">
                    Add an email address
                </h2>

                <p className="text-sm text-red-400">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[#1a1a1a] p-6 rounded-lg space-y-4">
            <h3 className="text-sm text-gray-400">
                Step 1
            </h3>

            <h2 className="text-lg font-bold">
                Add an email address
            </h2>

            <div className="flex items-center gap-4 bg-[#222] px-4 py-3 rounded cursor-not-allowed">
                <div className="min-w-0 flex-1">
                    <input
                        type="text"
                        value={
                            user?.email ||
                            "Add an email address"
                        }
                        readOnly
                        className="block w-full min-w-0 outline-none bg-transparent text-white cursor-not-allowed truncate"
                    />
                </div>

                <button
                    type="button"
                    className="shrink-0 text-[#6a6aff] text-sm cursor-pointer"
                >
                    Edit email
                </button>
            </div>

            <p className="text-xs text-gray-500">
                Your order will be delivered to this email address.
            </p>
        </div>
    );
}