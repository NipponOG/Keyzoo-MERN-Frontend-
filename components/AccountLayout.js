// import Link from "next/link";
// import { useRouter } from "next/router";
// import { FaUserCircle, FaGoogleWallet, FaHome, FaHandsHelping } from "react-icons/fa";
// import { IoGameControllerSharp, IoBagCheck, IoLogOut } from "react-icons/io5";

// export default function AccountLayout({ children }) {
//     const router = useRouter();

//     const navLinks = [
//         { href: "/user/profile", icon: <FaUserCircle />, label: "My Profile" },
//         { href: "/user/library", icon: <IoGameControllerSharp />, label: "My Library" },
//         { href: "/user/wallet", icon: <FaGoogleWallet />, label: "Wallet" },
//         { href: "/user/orders", icon: <FaHandsHelping />, label: "My Orders" },
//         // { href: "/account/store", icon: <FaStore />, label: "My Store" },
//         // { href: "/account/settings", icon: <FaCog />, label: "Store Settings" },
//     ];


//     return (
//         <div className="flex min-h-screen text-white">
//             {/* Sidebar */}
//             <aside className="hidden md:block w-64 bg-[#1a1a1a]">
//                 <nav className="space-y-2">
//                     {navLinks.map((link) => (
//                         <Link
//                             key={link.href}
//                             href={link.href}
//                             className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 ${router.pathname === link.href ? "bg-gray-800" : ""
//                                 }`}
//                         >
//                             <span className="text-lg">{link.icon}</span>
//                             <span>{link.label}</span>
//                         </Link>
//                     ))}
//                 </nav>
//             </aside>


//             {/* Main Content */}
//             <main className="flex-1 p-8">{children}</main>
//         </div>
//     );
// }

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import {
    FaUserCircle,
    FaGoogleWallet,
    FaHeart,
    FaShoppingBag,
} from "react-icons/fa";
import { IoGameControllerSharp } from "react-icons/io5";
import Image from "next/image";

export default function AccountLayout({ children }) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // mobile full-screen menu
    const [collapsed, setCollapsed] = useState(false); // desktop sidebar collapsed

    useEffect(() => {
        // read persisted state
        const saved = localStorage.getItem("account_sidebar_collapsed");
        if (saved === "1") setCollapsed(true);
    }, []);

    useEffect(() => {
        localStorage.setItem("account_sidebar_collapsed", collapsed ? "1" : "0");
    }, [collapsed]);

    const navLinks = [
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
            desc: "View your collection of games.",
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
        <div className="flex min-h-screen bg-[#0f0f0f] text-white">
            {/* Sidebar (Desktop only) */}
            <aside
                className={`hidden md:flex flex-col justify-between transition-all duration-200 ease-in-out bg-[#1a1a1a] border-r border-neutral-800
          ${collapsed ? "w-20" : "w-64"}`
                }
                aria-expanded={!collapsed}
            >
                {/* Top: Logo + collapse button */}
                <div className="p-4 flex items-center justify-between">
                    <div className={`flex items-center gap-3`}>
                        <div className={`flex-shrink-0 ${collapsed ? "mx-auto" : ""}`}>
                            {/* small logo / initial when collapsed */}
                            {/* <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                                K
                            </div> */}
                            <Image src="https://res.cloudinary.com/dblttl9bh/image/upload/v1778412609/keyzoo_symbol_modified_3f7649acdd.png" height={50} width={50} alt="Logo"  />
                        </div>
                        {/* label hidden when collapsed */}
                        {!collapsed && <span className="font-semibold">Account</span>}
                    </div>

                    {/* Collapse toggle */}
                    <button
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        onClick={() => setCollapsed((s) => !s)}
                        className="p-1 rounded hover:bg-neutral-800 transition"
                        title={collapsed ? "Expand" : "Collapse"}
                    >
                        {collapsed ? (
                            <ChevronRight className="w-4 h-4 text-white" />
                        ) : (
                            <ChevronLeft className="w-4 h-4 text-white" />
                        )}
                    </button>
                </div>

                {/* Nav links */}
                <nav className="px-2 py-4 space-y-1 flex-1">
                    {navLinks.map((link) => {
                        const active = router.pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href || "#"}
                                title={collapsed ? link.label : undefined} // tooltip on collapsed
                                className={`flex items-center gap-3 px-3 py-2 my-1 rounded-md transition-colors ${active ? "bg-gray-800" : "hover:bg-gray-800"
                                    } ${collapsed ? "justify-center" : ""}`}
                            >
                                <div className="flex-shrink-0">{link.icon}</div>
                                {/* hide text when collapsed */}
                                <span className={`${collapsed ? "hidden" : "block"}`}>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom area: logout or settings */}
                <div className="p-4">
                    {/* Example logout link — replace with your handler */}
                    <button
                        onClick={() => {
                            // local logout helper
                            localStorage.removeItem("jwt");
                            localStorage.removeItem("user");
                            window.location.href = "/";
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors ${collapsed ? "justify-center" : ""
                            } text-red-400`}
                        title={collapsed ? "Logout" : undefined}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                        </svg>
                        {!collapsed && <span className="font-semibold">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 w-full z-40 bg-[#1a1a1a] flex items-center justify-between px-4 py-3 border-b border-neutral-800">
                <h2 className="text-lg font-semibold">Account</h2>
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="p-2 rounded-md hover:bg-neutral-800 transition"
                    aria-label="Open account menu"
                >
                    <Menu className="h-6 w-6 text-white" />
                </button>
            </div>

            {/* Fullscreen Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-[#0f0f0f] overflow-y-auto">
                    <div className="flex justify-between items-center p-4 border-b border-neutral-800">
                        <h2 className="text-xl font-bold">My Account</h2>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-md hover:bg-neutral-800 transition">
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>

                    <div className="p-4 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex flex-col gap-1 p-4 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] transition ${router.pathname === link.href ? "border border-blue-500" : "border border-transparent"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {link.icon}
                                    <span className="font-semibold">{link.label}</span>
                                </div>
                                {link.desc && <span className="text-gray-400 text-sm">{link.desc}</span>}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main
                className={`flex-1 p-4 md:p-8 mt-14 md:mt-0 transition-all duration-200 ease-in-out`}
            // When sidebar is collapsed we still let main take full flexible space.
            >
                {children}
            </main>
        </div>
    );
}

