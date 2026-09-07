import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAdmin } from "@/context/AdminContext";

export default function AdminGuard({ children }) {

    const router = useRouter();

    const {
        user,
        loading,
    } = useAdmin();

    useEffect(() => {

        if (!loading && !user) {

            router.replace("/admin/login");

        }

    }, [loading, user, router]);

    if (loading) {

        return (

            <div className="min-h-screen flex items-center justify-center bg-[#111]">

                <div className="text-center">

                    <div className="h-10 w-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto" />

                    <p className="text-gray-400 mt-5">

                        Checking admin session...

                    </p>

                </div>

            </div>

        );

    }

    if (!user) {

        return null;

    }

    return children;

}