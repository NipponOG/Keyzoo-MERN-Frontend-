import { useEffect, useState } from "react";
import Link from "next/link";
import {
    FiUser,
    FiMail,
    FiPhone,
    FiShield,
    FiPackage,
    FiHeart,
    FiGift,
    FiCalendar,
    FiCheckCircle,
    FiEdit3,
    FiArrowRight,
} from "react-icons/fi";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const ProfileStat = ({ icon, value, label }) => (
    <div className="rounded-2xl border border-neutral-800 bg-[#202020] p-5 transition-all duration-300 hover:border-purple-500/40 hover:bg-[#242424]">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            {icon}
        </div>

        <div className="text-2xl font-bold text-white">
            {value}
        </div>

        <div className="mt-1 text-sm text-neutral-400">
            {label}
        </div>
    </div>
);

const InfoRow = ({ icon, label, value, verified }) => (
    <div className="flex items-center justify-between gap-4 border-b border-neutral-800 py-4 last:border-b-0">
        <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-800 text-neutral-400">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    {label}
                </p>

                <p className="mt-1 truncate text-sm font-medium text-white">
                    {value || "Not provided"}
                </p>
            </div>
        </div>

        {verified && (
            <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-emerald-400">
                <FiCheckCircle />
                <span className="hidden sm:inline">Verified</span>
            </div>
        )}
    </div>
);

export default function ProfilePage() {

    const { user, jwt, loading, setUser, updateUser } = useAuth();

    const [stats, setStats] = useState({
        orders: 0,
        games: 0,
        giftCards: 0,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileMessage, setProfileMessage] = useState("");
    const [profileError, setProfileError] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
    });

    useEffect(() => {

        if (!user || !jwt) return;

        let cancelled = false;

        const loadProfileStats = async () => {
            try {
                const response = await apiFetch("/orders/my", {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });

                if (!response?.success) {
                    throw new Error(
                        response?.message || "Failed to load order statistics."
                    );
                }

                const orders = Array.isArray(response.data)
                    ? response.data
                    : [];

                let games = 0;
                let giftCards = 0;

                for (const order of orders) {
                    const items = Array.isArray(order.items)
                        ? order.items
                        : [];

                    for (const item of items) {
                        const quantity = Number(item.quantity) || 0;

                        if (item.type === "product") {
                            games += quantity;
                        }

                        if (item.type === "gift-card") {
                            giftCards += quantity;
                        }
                    }
                }

                if (cancelled) return;

                setStats({
                    orders: orders.length,
                    games,
                    giftCards,
                });
            } catch (error) {
                console.error("Failed to load profile statistics:", error);

                if (cancelled) return;

                setStats({
                    orders: 0,
                    games: 0,
                    giftCards: 0,
                });
            }
        };

        loadProfileStats();

        return () => {
            cancelled = true;
        };
    }, [user]);

    useEffect(() => {
        if (!user) return;

        setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phone: user.phone || "",
        });
    }, [user]);

    const handleEditProfile = () => {
        setProfileMessage("");
        setProfileError("");

        setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phone: user.phone || "",
        });

        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setProfileMessage("");
        setProfileError("");

        setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phone: user.phone || "",
        });

        setIsEditing(false);
    };

    const handleProfileChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSaveProfile = async (event) => {
        event.preventDefault();

        setProfileMessage("");
        setProfileError("");

        if (!formData.firstName.trim()) {
            setProfileError("First name is required.");
            return;
        }

        if (!formData.lastName.trim()) {
            setProfileError("Last name is required.");
            return;
        }

        if (!formData.phone.trim()) {
            setProfileError("Phone number is required.");
            return;
        }

        try {
            setSavingProfile(true);

            const response = await apiFetch("/auth/me", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    phone: formData.phone.trim(),
                }),
            });

            if (!response?.success || !response?.user) {
                throw new Error(
                    response?.message || "Failed to update profile."
                );
            }

            updateUser(response.user);

            setFormData({
                firstName: response.user.firstName || "",
                lastName: response.user.lastName || "",
                phone: response.user.phone || "",
            });

            setIsEditing(false);
            setProfileMessage("Profile updated successfully.");
        } catch (error) {
            console.error("Profile update failed:", error);

            setProfileError(
                error.message || "Failed to update your profile."
            );
        } finally {
            setSavingProfile(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#1e1e1e] px-4 py-10">
                <div className="mx-auto max-w-6xl animate-pulse">
                    <div className="h-48 rounded-3xl bg-neutral-800" />

                    <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-32 rounded-2xl bg-neutral-800"
                            />
                        ))}
                    </div>

                    <div className="mt-6 h-96 rounded-3xl bg-neutral-800" />
                </div>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#1e1e1e] px-4">
                <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-[#202020] p-8 text-center shadow-2xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                        <FiUser className="text-2xl" />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-white">
                        Sign in to your account
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-neutral-400">
                        Sign in to view your profile, orders, purchases, and account
                        settings.
                    </p>

                    <Link
                        href="/sign-in"
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90"
                    >
                        Sign In
                        <FiArrowRight />
                    </Link>
                </div>
            </main>
        );
    }

    const firstName = user.firstName || user.username || "User";
    const lastName = user.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();

    const initials =
        `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();

    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
        })
        : "Recently";

    return (
        <main className="min-h-screen bg-[#1e1e1e] px-4 py-8 md:py-10">
            <div className="mx-auto max-w-6xl">
                {/* Page heading */}
                <div className="mb-6">
                    <p className="text-sm font-medium text-purple-400">
                        Account
                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-white md:text-4xl">
                        My Profile
                    </h1>

                    <p className="mt-2 text-sm text-neutral-400">
                        Manage your Keyzoo account and view your activity.
                    </p>
                </div>

                {/* Profile hero */}
                <section className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-[#202020] shadow-xl">
                    <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />
                    <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

                    <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
                        <div className="flex items-center gap-5">
                            {/* Avatar */}
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 text-2xl font-bold text-white shadow-lg shadow-purple-500/20">
                                {initials || "U"}
                            </div>

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-2xl font-bold text-white">
                                        {fullName}
                                    </h2>

                                    {user.isEmailVerified && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                                            <FiCheckCircle />
                                            Verified
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 truncate text-sm text-neutral-400">
                                    {user.email}
                                </p>

                                <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500">
                                    <FiCalendar />
                                    Member since {memberSince}
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/orders"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900/70 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-purple-500/50 hover:text-purple-400"
                        >
                            <FiPackage />
                            My Orders
                            <FiArrowRight />
                        </Link>
                    </div>
                </section>

                {/* Stats */}
                <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <ProfileStat
                        icon={<FiPackage className="text-xl" />}
                        value={stats.orders}
                        label="Total Orders"
                    />

                    <ProfileStat
                        icon={<FiUser className="text-xl" />}
                        value={stats.games}
                        label="Games Purchased"
                    />

                    <ProfileStat
                        icon={<FiGift className="text-xl" />}
                        value={stats.giftCards}
                        label="Gift Cards"
                    />

                    <ProfileStat
                        icon={<FiShield className="text-xl" />}
                        value="Active"
                        label="Account Status"
                    />
                </section>

                {/* Main content */}
                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    {/* Personal information */}
                    <section className="lg:col-span-2 rounded-3xl border border-neutral-800 bg-[#202020] p-6 md:p-7">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Personal Information
                                </h2>

                                <p className="mt-1 text-sm text-neutral-400">
                                    Your account information.
                                </p>
                            </div>

                            {!isEditing && (
                                <button
                                    type="button"
                                    onClick={handleEditProfile}
                                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition-all duration-300 hover:border-purple-500/50 hover:text-purple-400"
                                >
                                    <FiEdit3 />
                                    Edit
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <form
                                onSubmit={handleSaveProfile}
                                className="mt-6"
                            >
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="firstName"
                                            className="mb-2 block text-sm font-medium text-neutral-300"
                                        >
                                            First Name
                                        </label>

                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            value={formData.firstName}
                                            onChange={handleProfileChange}
                                            className="w-full rounded-xl border border-neutral-700 bg-[#181818] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-neutral-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                                            placeholder="Enter your first name"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="lastName"
                                            className="mb-2 block text-sm font-medium text-neutral-300"
                                        >
                                            Last Name
                                        </label>

                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            value={formData.lastName}
                                            onChange={handleProfileChange}
                                            className="w-full rounded-xl border border-neutral-700 bg-[#181818] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-neutral-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <label
                                        htmlFor="phone"
                                        className="mb-2 block text-sm font-medium text-neutral-300"
                                    >
                                        Phone Number
                                    </label>

                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        value={formData.phone}
                                        onChange={handleProfileChange}
                                        className="w-full rounded-xl border border-neutral-700 bg-[#181818] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-neutral-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                                        placeholder="10-digit phone number"
                                    />
                                </div>

                                <div className="mt-5">
                                    <label className="mb-2 block text-sm font-medium text-neutral-300">
                                        Email
                                    </label>

                                    <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3">
                                        <span className="truncate text-sm text-neutral-400">
                                            {user.email}
                                        </span>

                                        {user.isEmailVerified && (
                                            <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-emerald-400">
                                                <FiCheckCircle />
                                                Verified
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-2 text-xs text-neutral-500">
                                        Email changes require a separate verification process.
                                    </p>
                                </div>

                                {profileError && (
                                    <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                        {profileError}
                                    </div>
                                )}

                                {profileMessage && (
                                    <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                                        {profileMessage}
                                    </div>
                                )}

                                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        disabled={savingProfile}
                                        className="rounded-xl border border-neutral-700 px-5 py-3 text-sm font-medium text-neutral-300 transition-all duration-300 hover:border-neutral-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={savingProfile}
                                        className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {savingProfile ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="mt-5">
                                <InfoRow
                                    icon={<FiUser />}
                                    label="First Name"
                                    value={user.firstName}
                                />

                                <InfoRow
                                    icon={<FiUser />}
                                    label="Last Name"
                                    value={user.lastName}
                                />

                                <InfoRow
                                    icon={<FiMail />}
                                    label="Email"
                                    value={user.email}
                                    verified={user.isEmailVerified}
                                />

                                <InfoRow
                                    icon={<FiPhone />}
                                    label="Phone"
                                    value={user.phone}
                                />

                                {profileMessage && (
                                    <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                                        {profileMessage}
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Account actions */}
                    <section className="rounded-3xl border border-neutral-800 bg-[#202020] p-6 md:p-7">
                        <h2 className="text-xl font-bold text-white">
                            Account
                        </h2>

                        <p className="mt-1 text-sm text-neutral-400">
                            Manage your account.
                        </p>

                        <div className="mt-5 space-y-3">
                            <Link
                                href="/orders"
                                className="group flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 transition-all duration-300 hover:border-purple-500/40 hover:bg-neutral-900"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                        <FiPackage />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            My Orders
                                        </p>

                                        <p className="mt-0.5 text-xs text-neutral-500">
                                            View your purchases
                                        </p>
                                    </div>
                                </div>

                                <FiArrowRight className="text-neutral-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-purple-400" />
                            </Link>

                            <Link
                                href="/favourites"
                                className="group flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 transition-all duration-300 hover:border-purple-500/40 hover:bg-neutral-900"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
                                        <FiHeart />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            Favourites
                                        </p>

                                        <p className="mt-0.5 text-xs text-neutral-500">
                                            Your saved items
                                        </p>
                                    </div>
                                </div>

                                <FiArrowRight className="text-neutral-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-pink-400" />
                            </Link>

                            <Link
                                href="/reset-password"
                                className="group flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 transition-all duration-300 hover:border-purple-500/40 hover:bg-neutral-900"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                        <FiShield />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            Password
                                        </p>

                                        <p className="mt-0.5 text-xs text-neutral-500">
                                            Manage your password
                                        </p>
                                    </div>
                                </div>

                                <FiArrowRight className="text-neutral-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-400" />
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}