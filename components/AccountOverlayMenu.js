import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
    FaUserCircle,
    FaShoppingBag,
    FaGoogleWallet,
    FaHeart,
    FaSignOutAlt
} from "react-icons/fa";
import { IoGameControllerSharp } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";

export default function AccountOverlayMenu({ onClose }) {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        window.location.href = "/"; // Redirect to homepage after logout
    };

    const links = [
        {
            href: "/user/profile",
            icon: <FaUserCircle className="text-blue-400 text-xl" />,
            label: "My Profile",
            desc: "Edit your name, email, phone...",
        },
        {
            href: "/user/orders",
            icon: <FaShoppingBag className="text-blue-400 text-xl" />,
            label: "My Orders",
            desc: "View your order history.",
        },
        {
            href: "/user/library",
            icon: <IoGameControllerSharp className="text-blue-400 text-xl" />,
            label: "My Library",
            desc: "Your collection of games.",
        },
        {
            href: "/user/favourites",
            icon: <FaHeart className="text-blue-400 text-xl" />,
            label: "Favorites",
            desc: "View your favourite games.",
        },
        {
            href: "/user/wallet",
            icon: <FaGoogleWallet className="text-blue-400 text-xl" />,
            label: "Wallet",
            desc: "View your wallet.",
        },
    ];

    return (
        <div className="fixed inset-0 z-[80] bg-[#0f0f0f] overflow-y-auto md:hidden">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                <h2 className="text-xl font-bold">My Account</h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-md hover:bg-neutral-800 transition"
                >
                    <X className="h-6 w-6 text-white" />
                </button>
            </div>

            <div className="p-4 space-y-3">
                {links.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`flex flex-col gap-1 p-4 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] transition ${router.pathname === item.href
                            ? "border border-blue-500"
                            : "border border-transparent"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            {item.icon}
                            <span className="font-semibold">{item.label}</span>
                        </div>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                    </Link>
                ))}
                {/* 🔴 Logout Button */}
                {user && (
                    <div className="flex flex-col gap-1 p-4 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] transition">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-start gap-3 p-4 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] transition text-red-400"
                        >
                            <FaSignOutAlt className="text-xl" />
                            <span className="font-semibold">Logout</span>
                        </button>
                        {/* <p className="text-gray-400 text-sm">View your wallet.</p> */}
                    </div>
                )}
            </div>
        </div>
    );
}
