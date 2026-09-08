import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function DiscordCallbackPage() {
    const router = useRouter();
    const { login } = useAuth();
    const exchangeStarted = useRef(false);

    useEffect(() => {
        if (!router.isReady) return;

        if (exchangeStarted.current) return;

        exchangeStarted.current = true;

        const { code } = router.query;

        if (!code || Array.isArray(code)) {
            router.replace(
                "/sign-in?error=discord-login-failed"
            );
            return;
        }

        const exchangeCode = async () => {
            try {
                const data = await apiFetch(
                    "/auth/oauth/exchange",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            code,
                        }),
                    }
                );

                localStorage.setItem(
                    "jwt",
                    data.jwt
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                login(data.user, data.jwt);

                router.replace("/");
            } catch (error) {
                console.error(
                    "Discord login callback failed:",
                    error
                );

                router.replace(
                    "/sign-in?error=discord-login-failed"
                );
            }
        };

        exchangeCode();
    }, [
        router.isReady,
        router.query,
        login,
    ]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
            <p>Signing you in...</p>
        </div>
    );
}