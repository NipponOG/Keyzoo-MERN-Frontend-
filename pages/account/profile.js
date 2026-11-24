// import { useEffect, useState } from "react";
// import Link from "next/link";
// import {
//     FiUser,
//     FiMail,
//     FiPhone,
//     FiShield,
//     FiPackage,
//     FiHeart,
//     FiGift,
//     FiCalendar,
//     FiCheckCircle,
//     FiEdit3,
//     FiArrowRight,
//     FiMessageCircle,
//     FiLogOut,
// } from "react-icons/fi";
// import { apiFetch } from "@/lib/api";
// import { useAuth } from "@/context/AuthContext";
// import { QRCodeSVG } from "qrcode.react";

// const ProfileStat = ({ icon, value, label }) => (
//     <div className="cursor-pointer rounded-2xl border border-neutral-800 bg-[#202020] p-5 transition-all duration-300 hover:border-purple-500/40 hover:bg-[#242424]">
//         <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
//             {icon}
//         </div>

//         <div className="text-2xl font-bold text-white">
//             {value}
//         </div>

//         <div className="mt-1 text-sm text-neutral-400">
//             {label}
//         </div>
//     </div>
// );

// const InfoRow = ({ icon, label, value, verified }) => (
//     <div className="flex items-center justify-between gap-4 border-b border-neutral-800 py-4 last:border-b-0">
//         <div className="flex min-w-0 items-center gap-3">
//             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-800 text-neutral-400">
//                 {icon}
//             </div>

//             <div className="min-w-0">
//                 <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
//                     {label}
//                 </p>

//                 <p className="mt-1 truncate text-sm font-medium text-white">
//                     {value || "Not provided"}
//                 </p>
//             </div>
//         </div>

//         {verified && (
//             <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-emerald-400">
//                 <FiCheckCircle />
//                 <span className="hidden sm:inline">Verified</span>
//             </div>
//         )}
//     </div>
// );

// export default function ProfilePage() {

//     const { user, jwt, loading, setUser, updateUser, logout } = useAuth();

//     const [stats, setStats] = useState({
//         orders: 0,
//         games: 0,
//         giftCards: 0,
//     });

//     const [isEditing, setIsEditing] = useState(false);
//     const [savingProfile, setSavingProfile] = useState(false);
//     const [profileMessage, setProfileMessage] = useState("");
//     const [profileError, setProfileError] = useState("");

//     const [mfaStep, setMfaStep] = useState("idle");
//     const [mfaSetupUrl, setMfaSetupUrl] = useState("");
//     const [mfaCode, setMfaCode] = useState("");
//     const [mfaRecoveryCodes, setMfaRecoveryCodes] = useState([]);
//     const [mfaMessage, setMfaMessage] = useState("");
//     const [mfaError, setMfaError] = useState("");
//     const [mfaLoading, setMfaLoading] = useState(false);

//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         phone: "",
//     });

//     useEffect(() => {

//         if (!user || !jwt) return;

//         let cancelled = false;

//         const loadProfileStats = async () => {
//             try {
//                 const response = await apiFetch("/orders/my", {
//                     headers: {
//                         Authorization: `Bearer ${jwt}`,
//                     },
//                 });

//                 if (!response?.success) {
//                     throw new Error(
//                         response?.message || "Failed to load order statistics."
//                     );
//                 }

//                 const orders = Array.isArray(response.data)
//                     ? response.data
//                     : [];

//                 let games = 0;
//                 let giftCards = 0;

//                 for (const order of orders) {
//                     const items = Array.isArray(order.items)
//                         ? order.items
//                         : [];

//                     for (const item of items) {
//                         const quantity = Number(item.quantity) || 0;

//                         if (item.type === "product") {
//                             games += quantity;
//                         }

//                         if (item.type === "gift-card") {
//                             giftCards += quantity;
//                         }
//                     }
//                 }

//                 if (cancelled) return;

//                 setStats({
//                     orders: orders.length,
//                     games,
//                     giftCards,
//                 });
//             } catch (error) {
//                 console.error("Failed to load profile statistics:", error);

//                 if (cancelled) return;

//                 setStats({
//                     orders: 0,
//                     games: 0,
//                     giftCards: 0,
//                 });
//             }
//         };

//         loadProfileStats();

//         return () => {
//             cancelled = true;
//         };
//     }, [user]);

//     useEffect(() => {
//         if (!user) return;

//         setFormData({
//             firstName: user.firstName || "",
//             lastName: user.lastName || "",
//             phone: user.phone || "",
//         });
//     }, [user]);

//     const handleEditProfile = () => {
//         setProfileMessage("");
//         setProfileError("");

//         setFormData({
//             firstName: user.firstName || "",
//             lastName: user.lastName || "",
//             phone: user.phone || "",
//         });

//         setIsEditing(true);
//     };

//     const handleCancelEdit = () => {
//         setProfileMessage("");
//         setProfileError("");

//         setFormData({
//             firstName: user.firstName || "",
//             lastName: user.lastName || "",
//             phone: user.phone || "",
//         });

//         setIsEditing(false);
//     };

//     const handleProfileChange = (event) => {
//         const { name, value } = event.target;

//         setFormData((current) => ({
//             ...current,
//             [name]: value,
//         }));
//     };

//     const handleSaveProfile = async (event) => {
//         event.preventDefault();

//         setProfileMessage("");
//         setProfileError("");

//         if (!formData.firstName.trim()) {
//             setProfileError("First name is required.");
//             return;
//         }

//         if (!formData.lastName.trim()) {
//             setProfileError("Last name is required.");
//             return;
//         }

//         if (!formData.phone.trim()) {
//             setProfileError("Phone number is required.");
//             return;
//         }

//         try {
//             setSavingProfile(true);

//             const response = await apiFetch("/auth/me", {
//                 method: "PATCH",
//                 headers: {
//                     Authorization: `Bearer ${jwt}`,
//                 },
//                 body: JSON.stringify({
//                     firstName: formData.firstName.trim(),
//                     lastName: formData.lastName.trim(),
//                     phone: formData.phone.trim(),
//                 }),
//             });

//             if (!response?.success || !response?.user) {
//                 throw new Error(
//                     response?.message || "Failed to update profile."
//                 );
//             }

//             updateUser(response.user);

//             setFormData({
//                 firstName: response.user.firstName || "",
//                 lastName: response.user.lastName || "",
//                 phone: response.user.phone || "",
//             });

//             setIsEditing(false);
//             setProfileMessage("Profile updated successfully.");
//         } catch (error) {
//             console.error("Profile update failed:", error);

//             setProfileError(
//                 error.message || "Failed to update your profile."
//             );
//         } finally {
//             setSavingProfile(false);
//         }
//     };

//     const handleStartMfaSetup = async () => {
//         setMfaError("");
//         setMfaMessage("");
//         setMfaCode("");
//         setMfaRecoveryCodes([]);
//         setMfaLoading(true);

//         try {
//             const response = await apiFetch("/auth/2fa/setup", {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${jwt}`,
//                 },
//             });

//             if (!response?.success || !response?.data?.otpauthUrl) {
//                 throw new Error(
//                     response?.message || "Failed to start two-factor authentication."
//                 );
//             }

//             setMfaSetupUrl(response.data.otpauthUrl);
//             setMfaStep("setup");
//         } catch (error) {
//             console.error("Failed to start MFA setup:", error);
//             setMfaError(
//                 error.message || "Failed to start two-factor authentication."
//             );
//         } finally {
//             setMfaLoading(false);
//         }
//     };

//     const handleEnableMfa = async (event) => {
//         event.preventDefault();

//         setMfaError("");
//         setMfaMessage("");

//         if (!/^\d{6}$/.test(mfaCode.trim())) {
//             setMfaError("Enter the 6-digit code from your authenticator app.");
//             return;
//         }

//         setMfaLoading(true);

//         try {
//             const response = await apiFetch("/auth/2fa/enable", {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${jwt}`,
//                 },
//                 body: JSON.stringify({
//                     code: mfaCode.trim(),
//                 }),
//             });

//             if (!response?.success || !response?.user) {
//                 throw new Error(
//                     response?.message || "Failed to enable two-factor authentication."
//                 );
//             }

//             updateUser(response.user);

//             setMfaRecoveryCodes(response.recoveryCodes || []);
//             setMfaCode("");
//             setMfaStep("recovery");
//             setMfaMessage(
//                 "Two-factor authentication has been enabled successfully."
//             );
//         } catch (error) {
//             console.error("Failed to enable MFA:", error);
//             setMfaError(
//                 error.message || "Failed to enable two-factor authentication."
//             );
//         } finally {
//             setMfaLoading(false);
//         }
//     };

//     const handleDisableMfa = async (event) => {
//         event.preventDefault();

//         setMfaError("");
//         setMfaMessage("");

//         if (!/^\d{6}$/.test(mfaCode.trim())) {
//             setMfaError("Enter the 6-digit code from your authenticator app.");
//             return;
//         }

//         setMfaLoading(true);

//         try {
//             const response = await apiFetch("/auth/2fa/disable", {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${jwt}`,
//                 },
//                 body: JSON.stringify({
//                     code: mfaCode.trim(),
//                 }),
//             });

//             if (!response?.success || !response?.user) {
//                 throw new Error(
//                     response?.message || "Failed to disable two-factor authentication."
//                 );
//             }

//             updateUser(response.user);

//             setMfaCode("");
//             setMfaSetupUrl("");
//             setMfaRecoveryCodes([]);
//             setMfaStep("idle");
//             setMfaMessage(
//                 "Two-factor authentication has been disabled."
//             );
//         } catch (error) {
//             console.error("Failed to disable MFA:", error);
//             setMfaError(
//                 error.message || "Failed to disable two-factor authentication."
//             );
//         } finally {
//             setMfaLoading(false);
//         }
//     };

//     const handleCopyRecoveryCodes = async () => {
//         try {
//             await navigator.clipboard.writeText(
//                 mfaRecoveryCodes.join("\n")
//             );

//             setMfaMessage("Recovery codes copied to clipboard.");
//         } catch (error) {
//             console.error("Failed to copy recovery codes:", error);
//             setMfaError("Failed to copy recovery codes.");
//         }
//     };

//     const handleDownloadRecoveryCodes = () => {
//         const content = [
//             "Keyzoo Two-Factor Authentication Recovery Codes",
//             "",
//             `Account: ${user.email}`,
//             "",
//             "Keep these codes somewhere safe.",
//             "Each recovery code can only be used once.",
//             "",
//             ...mfaRecoveryCodes,
//             "",
//         ].join("\n");

//         const blob = new Blob([content], {
//             type: "text/plain;charset=utf-8",
//         });

//         const url = URL.createObjectURL(blob);

//         const link = document.createElement("a");
//         link.href = url;
//         link.download = "keyzoo-recovery-codes.txt";

//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);

//         URL.revokeObjectURL(url);

//         setMfaMessage("Recovery codes downloaded successfully.");
//     };

//     if (loading) {
//         return (
//             <main className="min-h-screen bg-[#1e1e1e] px-4 py-10">
//                 <div className="mx-auto max-w-6xl animate-pulse">
//                     <div className="h-48 rounded-3xl bg-neutral-800" />

//                     <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
//                         {[1, 2, 3, 4].map((item) => (
//                             <div
//                                 key={item}
//                                 className="h-32 rounded-2xl bg-neutral-800"
//                             />
//                         ))}
//                     </div>

//                     <div className="mt-6 h-96 rounded-3xl bg-neutral-800" />
//                 </div>
//             </main>
//         );
//     }

//     if (!user) {
//         return (
//             <main className="flex min-h-screen items-center justify-center bg-[#1e1e1e] px-4">
//                 <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-[#202020] p-8 text-center shadow-2xl">
//                     <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
//                         <FiUser className="text-2xl" />
//                     </div>

//                     <h1 className="mt-5 text-2xl font-bold text-white">
//                         Sign in to your account
//                     </h1>

//                     <p className="mt-2 text-sm leading-6 text-neutral-400">
//                         Sign in to view your profile, orders, purchases, and account
//                         settings.
//                     </p>

//                     <Link
//                         href="/sign-in"
//                         className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90"
//                     >
//                         Sign In
//                         <FiArrowRight />
//                     </Link>
//                 </div>
//             </main>
//         );
//     }

//     const firstName = user.firstName || user.username || "User";
//     const lastName = user.lastName || "";
//     const fullName = `${firstName} ${lastName}`.trim();

//     const initials =
//         `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();

//     const memberSince = user.createdAt
//         ? new Date(user.createdAt).toLocaleDateString("en-IN", {
//             month: "long",
//             year: "numeric",
//         })
//         : "Recently";

//     return (
//         <main className="min-h-screen bg-[#1e1e1e] px-4 py-8 md:py-10">
//             <div className="mx-auto max-w-6xl">
//                 {/* Page heading */}
//                 <div className="mb-6">
//                     <p className="text-sm font-medium text-purple-400">
//                         Account
//                     </p>

//                     <h1 className="mt-1 text-3xl font-bold tracking-tight text-white md:text-4xl">
//                         My Profile
//                     </h1>

//                     <p className="mt-2 text-sm text-neutral-400">
//                         Manage your Keyzoo account and view your activity.
//                     </p>
//                 </div>

//                 {/* Profile hero */}
//                 <section className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-[#202020] shadow-xl">
//                     <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />
//                     <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

//                     <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
//                         <div className="flex items-center gap-5">
//                             {/* Avatar */}
//                             <div className="cursor-pointer flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 text-2xl font-bold text-white shadow-lg shadow-purple-500/20">
//                                 {initials || "U"}
//                             </div>

//                             <div className="min-w-0">
//                                 <div className="flex flex-wrap items-center gap-2">
//                                     <h2 className="text-2xl font-bold text-white" title={fullName}>
//                                         {fullName}
//                                     </h2>

//                                     {user.isEmailVerified && (
//                                         <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
//                                             <FiCheckCircle />
//                                             Verified
//                                         </span>
//                                     )}
//                                 </div>

//                                 <p className="mt-1 truncate text-sm text-neutral-400">
//                                     {user.email}
//                                 </p>

//                                 <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500">
//                                     <FiCalendar />
//                                     Member since {memberSince}
//                                 </div>
//                             </div>
//                         </div>

//                         <Link
//                             href="/account/orders"
//                             className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900/70 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-purple-500/50 hover:text-purple-400"
//                         >
//                             <FiPackage />
//                             My Orders
//                             <FiArrowRight />
//                         </Link>
//                     </div>
//                 </section>

//                 {/* Stats */}
//                 <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
//                     <ProfileStat
//                         icon={<FiPackage className="text-xl" />}
//                         value={stats.orders}
//                         label="Total Orders"
//                     />

//                     <ProfileStat
//                         icon={<FiUser className="text-xl" />}
//                         value={stats.games}
//                         label="Games Purchased"
//                     />

//                     <ProfileStat
//                         icon={<FiGift className="text-xl" />}
//                         value={stats.giftCards}
//                         label="Gift Cards"
//                     />

//                     <ProfileStat
//                         icon={<FiShield className="text-xl" />}
//                         value="Active"
//                         label="Account Status"
//                     />
//                 </section>

//                 {/* Main content */}
//                 <div className="mt-6 grid gap-6 lg:grid-cols-2">

//                     {/* Personal information */}
//                     <section className="lg:col-span-2 rounded-3xl border border-neutral-800 bg-[#202020] p-6 md:p-7">
//                         <div className="flex items-center justify-between gap-4">
//                             <div>
//                                 <h2 className="text-xl font-bold text-white">
//                                     Personal Information
//                                 </h2>

//                                 <p className="mt-1 text-sm text-neutral-400">
//                                     Your account information.
//                                 </p>
//                             </div>

//                             {!isEditing && (
//                                 <button
//                                     type="button"
//                                     onClick={handleEditProfile}
//                                     className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition-all duration-300 hover:border-purple-500/50 hover:text-purple-400"
//                                 >
//                                     <FiEdit3 />
//                                     Edit
//                                 </button>
//                             )}
//                         </div>

//                         {isEditing ? (
//                             <form
//                                 onSubmit={handleSaveProfile}
//                                 className="mt-6"
//                             >
//                                 <div className="grid gap-5 sm:grid-cols-2">
//                                     <div>
//                                         <label
//                                             htmlFor="firstName"
//                                             className="mb-2 block text-sm font-medium text-neutral-300"
//                                         >
//                                             First Name
//                                         </label>

//                                         <input
//                                             id="firstName"
//                                             name="firstName"
//                                             type="text"
//                                             value={formData.firstName}
//                                             onChange={handleProfileChange}
//                                             className="w-full rounded-xl border border-neutral-700 bg-[#181818] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-neutral-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
//                                             placeholder="Enter your first name"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label
//                                             htmlFor="lastName"
//                                             className="mb-2 block text-sm font-medium text-neutral-300"
//                                         >
//                                             Last Name
//                                         </label>

//                                         <input
//                                             id="lastName"
//                                             name="lastName"
//                                             type="text"
//                                             value={formData.lastName}
//                                             onChange={handleProfileChange}
//                                             className="w-full rounded-xl border border-neutral-700 bg-[#181818] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-neutral-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
//                                             placeholder="Enter your last name"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="mt-5">
//                                     <label
//                                         htmlFor="phone"
//                                         className="mb-2 block text-sm font-medium text-neutral-300"
//                                     >
//                                         Phone Number
//                                     </label>

//                                     <input
//                                         id="phone"
//                                         name="phone"
//                                         type="tel"
//                                         inputMode="numeric"
//                                         maxLength={10}
//                                         value={formData.phone}
//                                         onChange={handleProfileChange}
//                                         className="w-full rounded-xl border border-neutral-700 bg-[#181818] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-neutral-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
//                                         placeholder="10-digit phone number"
//                                     />
//                                 </div>

//                                 <div className="mt-5">
//                                     <label className="mb-2 block text-sm font-medium text-neutral-300">
//                                         Email
//                                     </label>

//                                     <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3">
//                                         <span className="truncate text-sm text-neutral-400">
//                                             {user.email}
//                                         </span>

//                                         {user.isEmailVerified && (
//                                             <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-emerald-400">
//                                                 <FiCheckCircle />
//                                                 Verified
//                                             </span>
//                                         )}
//                                     </div>

//                                     <p className="mt-2 text-xs text-neutral-500">
//                                         Email changes require a separate verification process.
//                                     </p>
//                                 </div>

//                                 {profileError && (
//                                     <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
//                                         {profileError}
//                                     </div>
//                                 )}

//                                 {profileMessage && (
//                                     <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
//                                         {profileMessage}
//                                     </div>
//                                 )}

//                                 <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//                                     <button
//                                         type="button"
//                                         onClick={handleCancelEdit}
//                                         disabled={savingProfile}
//                                         className="cursor-pointer rounded-xl border border-neutral-700 px-5 py-3 text-sm font-medium text-neutral-300 transition-all duration-300 hover:border-neutral-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
//                                     >
//                                         Cancel
//                                     </button>

//                                     <button
//                                         type="submit"
//                                         disabled={savingProfile}
//                                         className="cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
//                                     >
//                                         {savingProfile ? "Saving..." : "Save Changes"}
//                                     </button>
//                                 </div>
//                             </form>
//                         ) : (
//                             <div className="mt-5">
//                                 <InfoRow
//                                     icon={<FiUser />}
//                                     label="First Name"
//                                     value={user.firstName}
//                                 />

//                                 <InfoRow
//                                     icon={<FiUser />}
//                                     label="Last Name"
//                                     value={user.lastName}
//                                 />

//                                 <InfoRow
//                                     icon={<FiMail />}
//                                     label="Email"
//                                     value={user.email}
//                                     verified={user.isEmailVerified}
//                                 />

//                                 <InfoRow
//                                     icon={<FiPhone />}
//                                     label="Phone"
//                                     value={user.phone}
//                                 />

//                                 {profileMessage && (
//                                     <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
//                                         {profileMessage}
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </section>

//                     {/* Account actions */}
//                     <section className="rounded-3xl border border-neutral-800 bg-[#202020] p-6 md:p-7">
//                         <h2 className="text-xl font-bold text-white">
//                             Account
//                         </h2>

//                         <p className="mt-1 text-sm text-neutral-400">
//                             Manage your account.
//                         </p>

//                         <div className="mt-5 space-y-3">
//                             <Link
//                                 href="/account/orders"
//                                 className="group flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 transition-all duration-300 hover:border-purple-500/40 hover:bg-neutral-900"
//                             >
//                                 <div className="flex items-center gap-3">
//                                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
//                                         <FiPackage />
//                                     </div>

//                                     <div>
//                                         <p className="text-sm font-semibold text-white">
//                                             My Orders
//                                         </p>

//                                         <p className="mt-0.5 text-xs text-neutral-500">
//                                             View your purchases
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <FiArrowRight className="text-neutral-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-purple-400" />
//                             </Link>

//                             <Link
//                                 href="/support"
//                                 className="group flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 transition-all duration-300 hover:border-purple-500/40 hover:bg-neutral-900"
//                             >
//                                 <div className="flex items-center gap-3">
//                                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
//                                         <FiMessageCircle />
//                                     </div>

//                                     <div>
//                                         <p className="text-sm font-semibold text-white">
//                                             Support Tickets
//                                         </p>

//                                         <p className="mt-0.5 text-xs text-neutral-500">
//                                             Get help with your orders and purchases
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <FiArrowRight className="text-neutral-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-400" />
//                             </Link>

//                             <Link
//                                 href="/account/favourites"
//                                 className="group flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 transition-all duration-300 hover:border-purple-500/40 hover:bg-neutral-900"
//                             >
//                                 <div className="flex items-center gap-3">
//                                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
//                                         <FiHeart />
//                                     </div>

//                                     <div>
//                                         <p className="text-sm font-semibold text-white">
//                                             Favourites
//                                         </p>

//                                         <p className="mt-0.5 text-xs text-neutral-500">
//                                             Your saved items
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <FiArrowRight className="text-neutral-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-pink-400" />
//                             </Link>

//                             <Link
//                                 href="/reset-password"
//                                 className="group flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 transition-all duration-300 hover:border-purple-500/40 hover:bg-neutral-900"
//                             >
//                                 <div className="flex items-center gap-3">
//                                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
//                                         <FiShield />
//                                     </div>

//                                     <div>
//                                         <p className="text-sm font-semibold text-white">
//                                             Password
//                                         </p>

//                                         <p className="mt-0.5 text-xs text-neutral-500">
//                                             Manage your password
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <FiArrowRight className="text-neutral-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-400" />
//                             </Link>

//                             <button
//                                 type="button"
//                                 onClick={logout}
//                                 className="group cursor-pointer flex w-full items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-left transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/10"
//                             >
//                                 <div className="flex items-center gap-3">
//                                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
//                                         <FiLogOut />
//                                     </div>

//                                     <div>
//                                         <p className="text-sm font-semibold text-red-400">
//                                             Logout
//                                         </p>

//                                         <p className="mt-0.5 text-xs text-neutral-500">
//                                             Sign out of your Keyzoo account
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <FiArrowRight className="text-red-400/60 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-red-400" />
//                             </button>

//                         </div>
//                     </section>

//                     {/* Security */}
//                     <section className="rounded-3xl border border-neutral-800 bg-[#202020] p-6 md:p-7">
//                         <div className="flex items-start justify-between gap-4">
//                             <div>
//                                 <h2 className="text-xl font-bold text-white">
//                                     Security
//                                 </h2>

//                                 <p className="mt-1 text-sm text-neutral-400">
//                                     Protect your account with two-factor authentication.
//                                 </p>
//                             </div>

//                             <div
//                                 className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${user.twoFactorEnabled
//                                     ? "bg-emerald-500/10 text-emerald-400"
//                                     : "bg-purple-500/10 text-purple-400"
//                                     }`}
//                             >
//                                 <FiShield />
//                             </div>
//                         </div>

//                         <div className="mt-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
//                             <div className="flex items-start justify-between gap-4">
//                                 <div>
//                                     <p className="text-sm font-semibold text-white">
//                                         Two-Factor Authentication
//                                     </p>

//                                     <p className="mt-1 text-xs leading-5 text-neutral-500">
//                                         Use an authenticator app to add an extra layer of
//                                         protection when signing in.
//                                     </p>
//                                 </div>

//                                 <span
//                                     className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${user.twoFactorEnabled
//                                         ? "bg-emerald-500/10 text-emerald-400"
//                                         : "bg-neutral-800 text-neutral-400"
//                                         }`}
//                                 >
//                                     {user.twoFactorEnabled ? "Enabled" : "Disabled"}
//                                 </span>
//                             </div>

//                             {!user.twoFactorEnabled && mfaStep === "idle" && (
//                                 <button
//                                     type="button"
//                                     onClick={handleStartMfaSetup}
//                                     disabled={mfaLoading}
//                                     className="mt-4 w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
//                                 >
//                                     {mfaLoading ? "Starting setup..." : "Enable 2FA"}
//                                 </button>
//                             )}

//                             {!user.twoFactorEnabled && mfaStep === "setup" && (
//                                 <div className="mt-5">
//                                     <div className="rounded-2xl border border-neutral-800 bg-[#181818] p-5">
//                                         <p className="text-sm font-semibold text-white">
//                                             1. Scan the QR code
//                                         </p>

//                                         <p className="mt-1 text-xs leading-5 text-neutral-500">
//                                             Open Google Authenticator, Microsoft Authenticator,
//                                             or another compatible authenticator app and scan
//                                             this QR code.
//                                         </p>

//                                         <div className="mt-5 flex justify-center">
//                                             <div className="rounded-2xl bg-white p-4">
//                                                 <QRCodeSVG
//                                                     value={mfaSetupUrl}
//                                                     size={220}
//                                                     includeMargin
//                                                 />
//                                             </div>
//                                         </div>

//                                         <p className="mt-5 text-center text-xs text-neutral-500">
//                                             After scanning, enter the 6-digit code shown in
//                                             your authenticator app.
//                                         </p>

//                                         <form
//                                             onSubmit={handleEnableMfa}
//                                             className="mt-4"
//                                         >
//                                             <input
//                                                 type="text"
//                                                 inputMode="numeric"
//                                                 autoComplete="one-time-code"
//                                                 value={mfaCode}
//                                                 onChange={(event) =>
//                                                     setMfaCode(
//                                                         event.target.value
//                                                             .replace(/\D/g, "")
//                                                             .slice(0, 6)
//                                                     )
//                                                 }
//                                                 maxLength={6}
//                                                 placeholder="Enter 6-digit code"
//                                                 className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-center text-lg tracking-[0.35em] text-white outline-none transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
//                                             />

//                                             {mfaError && (
//                                                 <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
//                                                     {mfaError}
//                                                 </div>
//                                             )}

//                                             <button
//                                                 type="submit"
//                                                 disabled={mfaLoading}
//                                                 className="mt-4 w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
//                                             >
//                                                 {mfaLoading
//                                                     ? "Verifying..."
//                                                     : "Verify & Enable 2FA"}
//                                             </button>
//                                         </form>
//                                     </div>
//                                 </div>
//                             )}

//                             {mfaStep === "recovery" && mfaRecoveryCodes.length > 0 && (
//                                 <div className="mt-5">
//                                     <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
//                                         <p className="text-sm font-semibold text-white">
//                                             Save your recovery codes
//                                         </p>

//                                         <p className="mt-1 text-xs leading-5 text-neutral-500">
//                                             Store these codes somewhere safe. Each recovery
//                                             code can only be used once if you lose access to
//                                             your authenticator.
//                                         </p>

//                                         <div className="mt-4 grid gap-2 sm:grid-cols-2">
//                                             {mfaRecoveryCodes.map((code) => (
//                                                 <div
//                                                     key={code}
//                                                     className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-center font-mono text-xs text-neutral-200"
//                                                 >
//                                                     {code}
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         {mfaMessage && (
//                                             <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-400">
//                                                 {mfaMessage}
//                                             </div>
//                                         )}

//                                         <div className="mt-4 flex flex-col gap-3 sm:flex-row">
//                                             <button
//                                                 type="button"
//                                                 onClick={handleCopyRecoveryCodes}
//                                                 className="flex-1 rounded-xl border border-neutral-700 px-4 py-3 text-sm font-medium text-neutral-300 transition-all hover:border-purple-500/50 hover:text-purple-400"
//                                             >
//                                                 Copy Recovery Codes
//                                             </button>

//                                             <button
//                                                 type="button"
//                                                 onClick={handleDownloadRecoveryCodes}
//                                                 className="flex-1 rounded-xl border border-neutral-700 px-4 py-3 text-sm font-medium text-neutral-300 transition-all hover:border-purple-500/50 hover:text-purple-400"
//                                             >
//                                                 Download Recovery Codes
//                                             </button>

//                                             <button
//                                                 type="button"
//                                                 onClick={() => {
//                                                     setMfaRecoveryCodes([]);
//                                                     setMfaSetupUrl("");
//                                                     setMfaStep("idle");
//                                                     setMfaMessage("");
//                                                     setMfaError("");
//                                                 }}
//                                                 className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
//                                             >
//                                                 I've Saved Them
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {user.twoFactorEnabled && mfaStep === "idle" && (
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         setMfaCode("");
//                                         setMfaError("");
//                                         setMfaMessage("");
//                                         setMfaStep("disable");
//                                     }}
//                                     className="cursor-pointer mt-4 w-full rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-semibold text-red-400 transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/10"
//                                 >
//                                     Disable 2FA
//                                 </button>
//                             )}

//                             {user.twoFactorEnabled && mfaStep === "disable" && (
//                                 <form
//                                     onSubmit={handleDisableMfa}
//                                     className="mt-5 rounded-2xl border border-neutral-800 bg-[#181818] p-5"
//                                 >
//                                     <p className="text-sm font-semibold text-white">
//                                         Disable two-factor authentication
//                                     </p>

//                                     <p className="mt-1 text-xs leading-5 text-neutral-500">
//                                         Enter the current 6-digit code from your authenticator
//                                         app to disable 2FA.
//                                     </p>

//                                     <input
//                                         type="text"
//                                         inputMode="numeric"
//                                         autoComplete="one-time-code"
//                                         value={mfaCode}
//                                         onChange={(event) =>
//                                             setMfaCode(
//                                                 event.target.value
//                                                     .replace(/\D/g, "")
//                                                     .slice(0, 6)
//                                             )
//                                         }
//                                         maxLength={6}
//                                         placeholder="Enter 6-digit code"
//                                         className="mt-4 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-center text-lg tracking-[0.35em] text-white outline-none transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
//                                     />

//                                     {mfaError && (
//                                         <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
//                                             {mfaError}
//                                         </div>
//                                     )}

//                                     <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row">
//                                         <button
//                                             type="button"
//                                             onClick={() => {
//                                                 setMfaStep("idle");
//                                                 setMfaCode("");
//                                                 setMfaError("");
//                                             }}
//                                             disabled={mfaLoading}
//                                             className="cursor-pointer flex-1 rounded-xl border border-neutral-700 px-4 py-3 text-sm font-medium text-neutral-300 transition-all hover:border-neutral-500 hover:text-white disabled:opacity-50"
//                                         >
//                                             Cancel
//                                         </button>

//                                         <button
//                                             type="submit"
//                                             disabled={mfaLoading}
//                                             className="cursor-pointer flex-1 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
//                                         >
//                                             {mfaLoading ? "Disabling..." : "Disable 2FA"}
//                                         </button>
//                                     </div>
//                                 </form>
//                             )}

//                             {mfaMessage && mfaStep !== "recovery" && (
//                                 <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-400">
//                                     {mfaMessage}
//                                 </div>
//                             )}

//                             {mfaError && mfaStep === "idle" && (
//                                 <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
//                                     {mfaError}
//                                 </div>
//                             )}
//                         </div>
//                     </section>

//                 </div>

//             </div>
//         </main>
//     );
// }


import { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
    FiArrowRight,
    FiCalendar,
    FiCheck,
    FiCheckCircle,
    FiCopy,
    FiDownload,
    FiEdit3,
    FiGift,
    FiHeart,
    FiKey,
    FiLogOut,
    FiMail,
    FiMessageCircle,
    FiMonitor,
    FiPackage,
    FiPhone,
    FiShield,
    FiUser,
    FiX,
} from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import useFavorites from "@/hook/useFavorites";

/* -------------------------------------------------------------------------- */
/*  Constants + helpers                                                        */
/* -------------------------------------------------------------------------- */

// Your existing route for saved items (the product-page heart should link here too)
const FAVOURITES_HREF = "/account/favourites";

const FOCUS =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1e1e]";

const CARD = "rounded-3xl border border-neutral-800 bg-[#202020]";

const INPUT =
    "w-full rounded-xl border border-neutral-700 bg-[#181818] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-neutral-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20";

const BTN_PRIMARY = `inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS}`;

const BTN_GHOST = `inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-700 px-5 py-3 text-sm font-medium text-neutral-300 transition-all duration-300 hover:border-purple-500/50 hover:text-purple-400 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS}`;

const isSixDigits = (value) => /^\d{6}$/.test(value.trim());
const digitsOnly = (value, max) => value.replace(/\D/g, "").slice(0, max);

const authHeader = (jwt) => ({ Authorization: `Bearer ${jwt}` });

/* -------------------------------------------------------------------------- */
/*  Small UI pieces                                                            */
/* -------------------------------------------------------------------------- */

function Alert({ tone = "error", children }) {
    if (!children) return null;

    const tones = {
        error: "border-red-500/20 bg-red-500/10 text-red-400",
        success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    };

    return (
        <div
            role={tone === "error" ? "alert" : "status"}
            className={`mt-4 rounded-xl border px-4 py-3 text-sm ${tones[tone]}`}
        >
            {children}
        </div>
    );
}

function Badge({ tone = "neutral", icon, children }) {
    const tones = {
        success: "bg-emerald-500/10 text-emerald-400",
        warning: "bg-amber-500/10 text-amber-400",
        neutral: "bg-neutral-800 text-neutral-400",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
        >
            {icon}
            {children}
        </span>
    );
}

function StatCard({ icon, value, label, href, loading }) {
    const body = (
        <>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 transition-colors group-hover:bg-purple-500/20">
                {icon}
            </div>

            {loading ? (
                <div className="h-8 w-12 animate-pulse rounded-md bg-neutral-800" />
            ) : (
                <div className="text-2xl font-bold text-white">{value}</div>
            )}

            <div className="mt-1 text-sm text-neutral-400">{label}</div>
        </>
    );

    const classes = `group block rounded-2xl border border-neutral-800 bg-[#202020] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500/40 hover:bg-[#242424] ${FOCUS}`;

    return href ? (
        <Link href={href} className={classes}>
            {body}
        </Link>
    ) : (
        <div className={classes.replace("hover:-translate-y-0.5", "")}>{body}</div>
    );
}

function InfoRow({ icon, label, value, verified }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-neutral-800 py-4 last:border-b-0">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-800 text-neutral-400">
                    {icon}
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                        {label}
                    </p>
                    <p
                        className={`mt-1 truncate text-sm font-medium ${value ? "text-white" : "text-neutral-600"
                            }`}
                    >
                        {value || "Not provided"}
                    </p>
                </div>
            </div>

            {verified && (
                <Badge tone="success" icon={<FiCheckCircle />}>
                    <span className="hidden sm:inline">Verified</span>
                </Badge>
            )}
        </div>
    );
}

function Field({ id, label, hint, ...inputProps }) {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-medium text-neutral-300">
                {label}
            </label>
            <input id={id} name={id} className={INPUT} {...inputProps} />
            {hint && <p className="mt-2 text-xs text-neutral-500">{hint}</p>}
        </div>
    );
}

function ActionLink({ href, onClick, icon, title, text, tone = "purple", danger = false }) {
    const tones = {
        purple: "bg-purple-500/10 text-purple-400 group-hover:text-purple-400",
        blue: "bg-blue-500/10 text-blue-400 group-hover:text-blue-400",
        pink: "bg-pink-500/10 text-pink-400 group-hover:text-pink-400",
        red: "bg-red-500/10 text-red-400 group-hover:text-red-400",
    };

    const shell = danger
        ? "border-red-500/20 bg-red-500/5 hover:border-red-500/40 hover:bg-red-500/10"
        : "border-neutral-800 bg-neutral-900/50 hover:border-purple-500/40 hover:bg-neutral-900";

    const inner = (
        <>
            <div className="flex min-w-0 items-center gap-3">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[danger ? "red" : tone].split(" ").slice(0, 2).join(" ")
                        }`}
                >
                    {icon}
                </div>

                <div className="min-w-0 text-left">
                    <p className={`text-sm font-semibold ${danger ? "text-red-400" : "text-white"}`}>
                        {title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-neutral-500">{text}</p>
                </div>
            </div>

            <FiArrowRight
                aria-hidden="true"
                className={`shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${danger ? "text-red-400/60" : "text-neutral-500"
                    }`}
            />
        </>
    );

    const classes = `group flex w-full items-center justify-between gap-3 rounded-2xl border p-4 transition-all duration-300 ${shell} ${FOCUS}`;

    return href ? (
        <Link href={href} className={classes}>
            {inner}
        </Link>
    ) : (
        <button type="button" onClick={onClick} className={`${classes} cursor-pointer`}>
            {inner}
        </button>
    );
}

function CodeInput({ value, onChange, id = "mfa-code" }) {
    return (
        <>
            <label htmlFor={id} className="sr-only">
                6-digit authentication code
            </label>
            <input
                id={id}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={value}
                onChange={(e) => onChange(digitsOnly(e.target.value, 6))}
                maxLength={6}
                placeholder="000000"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-center text-lg tracking-[0.5em] text-white outline-none transition-all placeholder:tracking-[0.5em] placeholder:text-neutral-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
        </>
    );
}

/* -------------------------------------------------------------------------- */
/*  Loading + signed-out states                                                */
/* -------------------------------------------------------------------------- */

function ProfileSkeleton() {
    return (
        <main className="min-h-screen bg-[#1e1e1e] px-4 py-10" aria-busy="true">
            <div className="mx-auto max-w-6xl animate-pulse">
                <div className="h-56 rounded-3xl bg-neutral-800" />
                <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 rounded-2xl bg-neutral-800" />
                    ))}
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                    <div className="h-96 rounded-3xl bg-neutral-800" />
                    <div className="h-96 rounded-3xl bg-neutral-800" />
                </div>
            </div>
        </main>
    );
}

function SignedOut() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#1e1e1e] px-4">
            <div className={`w-full max-w-md ${CARD} p-8 text-center shadow-2xl`}>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                    <FiUser className="text-2xl" />
                </div>

                <h1 className="mt-5 text-2xl font-bold text-white">Sign in to your account</h1>

                <p className="mt-2 text-sm leading-6 text-neutral-400">
                    Sign in to view your profile, orders, purchases, and account settings.
                </p>

                <Link href="/sign-in" className={`mt-6 ${BTN_PRIMARY}`}>
                    Sign In
                    <FiArrowRight />
                </Link>
            </div>
        </main>
    );
}

/* -------------------------------------------------------------------------- */
/*  Order statistics                                                           */
/* -------------------------------------------------------------------------- */

function useOrderStats(user, jwt) {
    const [stats, setStats] = useState({ orders: 0, games: 0, giftCards: 0 });
    const [status, setStatus] = useState("loading"); // loading | ready | error

    // depend on the id/token, not the whole user object (it changes on every profile edit)
    const userId = user?._id ?? user?.id ?? user?.email;

    useEffect(() => {
        if (!userId || !jwt) return;

        let cancelled = false;
        setStatus("loading");

        (async () => {
            try {
                const response = await apiFetch("/orders/my", { headers: authHeader(jwt) });

                if (!response?.success) {
                    throw new Error(response?.message || "Failed to load order statistics.");
                }

                const orders = Array.isArray(response.data) ? response.data : [];
                let games = 0;
                let giftCards = 0;

                for (const order of orders) {
                    for (const item of Array.isArray(order.items) ? order.items : []) {
                        const quantity = Number(item.quantity) || 0;
                        if (item.type === "product") games += quantity;
                        if (item.type === "gift-card") giftCards += quantity;
                    }
                }

                if (cancelled) return;
                setStats({ orders: orders.length, games, giftCards });
                setStatus("ready");
            } catch (error) {
                console.error("Failed to load profile statistics:", error);
                if (!cancelled) setStatus("error");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [userId, jwt]);

    return { stats, status };
}

/* -------------------------------------------------------------------------- */
/*  Personal information                                                       */
/* -------------------------------------------------------------------------- */

const profileFromUser = (user) => ({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
});

function PersonalInfoCard({ user, jwt, updateUser }) {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [formData, setFormData] = useState(() => profileFromUser(user));

    // success message disappears on its own
    useEffect(() => {
        if (!message) return;
        const t = setTimeout(() => setMessage(""), 4000);
        return () => clearTimeout(t);
    }, [message]);

    const startEdit = () => {
        setMessage("");
        setError("");
        setFormData(profileFromUser(user));
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setError("");
        setFormData(profileFromUser(user));
        setIsEditing(false);
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData((current) => ({
            ...current,
            [name]: name === "phone" ? digitsOnly(value, 10) : value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        const payload = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            phone: formData.phone.trim(),
        };

        if (!payload.firstName) return setError("First name is required.");
        if (!payload.lastName) return setError("Last name is required.");
        if (!/^\d{10}$/.test(payload.phone)) return setError("Enter a valid 10-digit phone number.");

        try {
            setSaving(true);

            const response = await apiFetch("/auth/me", {
                method: "PATCH",
                headers: authHeader(jwt),
                body: JSON.stringify(payload),
            });

            if (!response?.success || !response?.user) {
                throw new Error(response?.message || "Failed to update profile.");
            }

            updateUser(response.user);
            setFormData(profileFromUser(response.user));
            setIsEditing(false);
            setMessage("Profile updated successfully.");
        } catch (err) {
            console.error("Profile update failed:", err);
            setError(err.message || "Failed to update your profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className={`${CARD} p-6 md:p-7`} aria-labelledby="personal-info-heading">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 id="personal-info-heading" className="text-xl font-bold text-white">
                        Personal information
                    </h2>
                    <p className="mt-1 text-sm text-neutral-400">
                        The details tied to your Keyzoo account.
                    </p>
                </div>

                {!isEditing && (
                    <button type="button" onClick={startEdit} className={`${BTN_GHOST} !px-4 !py-2 cursor-pointer`}>
                        <FiEdit3 aria-hidden="true" />
                        Edit
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={onSubmit} className="mt-6" noValidate>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field
                            id="firstName"
                            label="First name"
                            type="text"
                            autoComplete="given-name"
                            value={formData.firstName}
                            onChange={onChange}
                            placeholder="Enter your first name"
                        />
                        <Field
                            id="lastName"
                            label="Last name"
                            type="text"
                            autoComplete="family-name"
                            value={formData.lastName}
                            onChange={onChange}
                            placeholder="Enter your last name"
                        />
                    </div>

                    <div className="mt-5">
                        <Field
                            id="phone"
                            label="Phone number"
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel-national"
                            maxLength={10}
                            value={formData.phone}
                            onChange={onChange}
                            placeholder="10-digit phone number"
                        />
                    </div>

                    <div className="mt-5">
                        <p className="mb-2 text-sm font-medium text-neutral-300">Email</p>
                        <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3">
                            <span className="truncate text-sm text-neutral-400">{user.email}</span>
                            {user.isEmailVerified && (
                                <Badge tone="success" icon={<FiCheckCircle />}>
                                    Verified
                                </Badge>
                            )}
                        </div>
                        <p className="mt-2 text-xs text-neutral-500">
                            Email changes require a separate verification process.
                        </p>
                    </div>

                    <Alert tone="error">{error}</Alert>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button type="button" onClick={cancelEdit} disabled={saving} className={`${BTN_GHOST} cursor-pointer`}>
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className={`${BTN_PRIMARY} cursor-pointer`}>
                            {saving ? "Saving…" : "Save changes"}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mt-4">
                    <InfoRow icon={<FiUser />} label="First name" value={user.firstName} />
                    <InfoRow icon={<FiUser />} label="Last name" value={user.lastName} />
                    <InfoRow icon={<FiMail />} label="Email" value={user.email} verified={user.isEmailVerified} />
                    <InfoRow icon={<FiPhone />} label="Phone" value={user.phone} />
                    <Alert tone="success">{message}</Alert>
                </div>
            )}
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*  Two-factor authentication                                                  */
/* -------------------------------------------------------------------------- */

function TwoFactorCard({ user, jwt, updateUser }) {
    const enabled = Boolean(user.twoFactorEnabled);

    const [step, setStep] = useState("idle"); // idle | setup | recovery | disable
    const [setupUrl, setSetupUrl] = useState("");
    const [code, setCode] = useState("");
    const [recoveryCodes, setRecoveryCodes] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // the text key for people who can't scan the QR code
    const manualKey = useMemo(() => {
        try {
            return new URL(setupUrl).searchParams.get("secret") || "";
        } catch {
            return "";
        }
    }, [setupUrl]);

    const reset = () => {
        setStep("idle");
        setSetupUrl("");
        setCode("");
        setRecoveryCodes([]);
        setMessage("");
        setError("");
    };

    const run = async (task, fallback) => {
        setError("");
        setMessage("");
        setLoading(true);
        try {
            await task();
        } catch (err) {
            console.error(fallback, err);
            setError(err.message || fallback);
        } finally {
            setLoading(false);
        }
    };

    const post = (path, body) =>
        apiFetch(path, {
            method: "POST",
            headers: authHeader(jwt),
            ...(body ? { body: JSON.stringify(body) } : {}),
        });

    const startSetup = () =>
        run(async () => {
            setCode("");
            const res = await post("/auth/2fa/setup");
            if (!res?.success || !res?.data?.otpauthUrl) {
                throw new Error(res?.message || "Failed to start two-factor authentication.");
            }
            setSetupUrl(res.data.otpauthUrl);
            setStep("setup");
        }, "Failed to start two-factor authentication.");

    const enable = (e) => {
        e.preventDefault();
        if (!isSixDigits(code)) return setError("Enter the 6-digit code from your authenticator app.");

        run(async () => {
            const res = await post("/auth/2fa/enable", { code: code.trim() });
            if (!res?.success || !res?.user) {
                throw new Error(res?.message || "Failed to enable two-factor authentication.");
            }
            updateUser(res.user);
            setRecoveryCodes(res.recoveryCodes || []);
            setCode("");
            setStep("recovery");
            setMessage("Two-factor authentication is now on.");
        }, "Failed to enable two-factor authentication.");
    };

    const disable = (e) => {
        e.preventDefault();
        if (!isSixDigits(code)) return setError("Enter the 6-digit code from your authenticator app.");

        run(async () => {
            const res = await post("/auth/2fa/disable", { code: code.trim() });
            if (!res?.success || !res?.user) {
                throw new Error(res?.message || "Failed to disable two-factor authentication.");
            }
            updateUser(res.user);
            reset();
            setMessage("Two-factor authentication has been turned off.");
        }, "Failed to disable two-factor authentication.");
    };

    const copyCodes = async () => {
        try {
            await navigator.clipboard.writeText(recoveryCodes.join("\n"));
            setError("");
            setMessage("Recovery codes copied.");
        } catch {
            setMessage("");
            setError("Couldn't copy. Use Download instead.");
        }
    };

    const downloadCodes = () => {
        const content = [
            "Keyzoo Two-Factor Authentication Recovery Codes",
            "",
            `Account: ${user.email}`,
            "",
            "Keep these codes somewhere safe.",
            "Each recovery code can only be used once.",
            "",
            ...recoveryCodes,
            "",
        ].join("\n");

        const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "keyzoo-recovery-codes.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setError("");
        setMessage("Recovery codes downloaded.");
    };

    return (
        <section className={`${CARD} p-6 md:p-7`} aria-labelledby="security-heading">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 id="security-heading" className="text-xl font-bold text-white">
                        Security
                    </h2>
                    <p className="mt-1 text-sm text-neutral-400">
                        Protect your account with two-factor authentication.
                    </p>
                </div>

                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${enabled ? "bg-emerald-500/10 text-emerald-400" : "bg-purple-500/10 text-purple-400"
                        }`}
                >
                    <FiShield aria-hidden="true" />
                </div>
            </div>

            <div className="mt-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-white">Authenticator app</p>
                        <p className="mt-1 text-xs leading-5 text-neutral-500">
                            Adds a one-time code to the sign-in process.
                        </p>
                    </div>
                    <Badge tone={enabled ? "success" : "neutral"}>{enabled ? "Enabled" : "Disabled"}</Badge>
                </div>

                {/* idle: enable */}
                {!enabled && step === "idle" && (
                    <button type="button" onClick={startSetup} disabled={loading} className={`${BTN_PRIMARY} mt-4 w-full cursor-pointer`}>
                        {loading ? "Starting setup…" : "Enable 2FA"}
                    </button>
                )}

                {/* setup: scan + verify */}
                {!enabled && step === "setup" && (
                    <div className="mt-5 rounded-2xl border border-neutral-800 bg-[#181818] p-5">
                        <p className="text-sm font-semibold text-white">1. Scan the QR code</p>
                        <p className="mt-1 text-xs leading-5 text-neutral-500">
                            Open Google Authenticator, Microsoft Authenticator, or any compatible app and scan this code.
                        </p>

                        <div className="mt-5 flex justify-center">
                            <div className="rounded-2xl bg-white p-3">
                                <QRCodeSVG value={setupUrl} size={190} includeMargin />
                            </div>
                        </div>

                        {manualKey && (
                            <p className="mt-4 break-all text-center text-xs text-neutral-500">
                                Can&apos;t scan? Enter this key manually:
                                <span className="mt-1 block select-all font-mono text-neutral-300">{manualKey}</span>
                            </p>
                        )}

                        <form onSubmit={enable} className="mt-5" noValidate>
                            <p className="mb-2 text-sm font-semibold text-white">2. Enter the 6-digit code</p>
                            <CodeInput value={code} onChange={setCode} />

                            <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row">
                                <button type="button" onClick={reset} disabled={loading} className={`${BTN_GHOST} flex-1 cursor-pointer`}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className={`${BTN_PRIMARY} flex-1 cursor-pointer`}>
                                    {loading ? "Verifying…" : "Verify & enable"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* recovery codes (shown once) */}
                {step === "recovery" && recoveryCodes.length > 0 && (
                    <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                        <p className="flex items-center gap-2 text-sm font-semibold text-white">
                            <FiKey aria-hidden="true" className="text-amber-400" />
                            Save your recovery codes
                        </p>
                        <p className="mt-1 text-xs leading-5 text-neutral-500">
                            These are shown only once. Each code works a single time if you lose access to your
                            authenticator app.
                        </p>

                        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                            {recoveryCodes.map((c) => (
                                <li
                                    key={c}
                                    className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-center font-mono text-xs text-neutral-200"
                                >
                                    {c}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={copyCodes} className={`${BTN_GHOST} cursor-pointer`}>
                                <FiCopy aria-hidden="true" />
                                Copy
                            </button>
                            <button type="button" onClick={downloadCodes} className={`${BTN_GHOST} cursor-pointer`}>
                                <FiDownload aria-hidden="true" />
                                Download
                            </button>
                        </div>

                        <button type="button" onClick={reset} className={`${BTN_PRIMARY} mt-3 w-full cursor-pointer`}>
                            <FiCheck aria-hidden="true" />
                            I&apos;ve saved them
                        </button>
                    </div>
                )}

                {/* idle: disable */}
                {enabled && step === "idle" && (
                    <button
                        type="button"
                        onClick={() => {
                            setCode("");
                            setError("");
                            setMessage("");
                            setStep("disable");
                        }}
                        className={`mt-4 w-full cursor-pointer rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-semibold text-red-400 transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/10 ${FOCUS}`}
                    >
                        Disable 2FA
                    </button>
                )}

                {/* disable: confirm with a code */}
                {enabled && step === "disable" && (
                    <form onSubmit={disable} className="mt-5 rounded-2xl border border-neutral-800 bg-[#181818] p-5" noValidate>
                        <p className="text-sm font-semibold text-white">Turn off two-factor authentication</p>
                        <p className="mt-1 mb-4 text-xs leading-5 text-neutral-500">
                            Enter the current 6-digit code from your authenticator app to confirm.
                        </p>

                        <CodeInput value={code} onChange={setCode} />

                        <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row">
                            <button type="button" onClick={reset} disabled={loading} className={`${BTN_GHOST} flex-1 cursor-pointer`}>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 cursor-pointer rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS}`}
                            >
                                {loading ? "Disabling…" : "Disable 2FA"}
                            </button>
                        </div>
                    </form>
                )}

                <Alert tone="error">{error}</Alert>
                <Alert tone="success">{message}</Alert>
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ProfilePage() {
    const { user, jwt, loading, updateUser, logout } = useAuth();
    const { stats, status: statsStatus } = useOrderStats(user, jwt);
    const { count: favouriteCount, ready: favouritesReady } = useFavorites();

    const identity = useMemo(() => {
        if (!user) return null;

        const firstName = user.firstName || user.username || "User";
        const lastName = user.lastName || "";

        return {
            fullName: `${firstName} ${lastName}`.trim(),
            initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U",
            memberSince: user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
                : "Recently",
        };
    }, [user]);

    const statValue = useCallback((n) => (statsStatus === "error" ? "–" : n), [statsStatus]);

    if (loading) return <ProfileSkeleton />;
    if (!user) return <SignedOut />;

    const statsLoading = statsStatus === "loading";

    return (
        <>
            <Head>
                <title>My profile | Keyzoo</title>
                <meta name="robots" content="noindex" />
            </Head>

            <main className="min-h-screen bg-[#1e1e1e] px-4 py-8 text-white md:py-10">
                <div className="mx-auto max-w-6xl">
                    {/* ---------- Hero ---------- */}
                    <section className={`relative overflow-hidden ${CARD} shadow-xl`}>
                        {/* cover */}
                        <div aria-hidden="true" className="relative h-28 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 sm:h-32">
                            <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                                    backgroundSize: "18px 18px",
                                }}
                            />
                            <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
                        </div>

                        <div className="relative px-6 pb-6 md:px-8 md:pb-8">
                            <div className="-mt-10 flex flex-col gap-5 sm:-mt-12 md:flex-row md:items-end md:justify-between">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                                    <div
                                        aria-hidden="true"
                                        className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-[#202020] bg-gradient-to-br from-purple-600 to-blue-500 text-3xl font-bold text-white shadow-xl shadow-purple-500/20"
                                    >
                                        {identity.initials}
                                    </div>

                                    <div className="min-w-0 sm:pb-1">
                                        <h1 className="truncate text-2xl font-bold tracking-tight md:text-3xl" title={identity.fullName}>
                                            {identity.fullName}
                                        </h1>
                                        <p className="mt-1 truncate text-sm text-neutral-400">{user.email}</p>

                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            {user.isEmailVerified && (
                                                <Badge tone="success" icon={<FiCheckCircle />}>
                                                    Email verified
                                                </Badge>
                                            )}
                                            <Badge
                                                tone={user.twoFactorEnabled ? "success" : "warning"}
                                                icon={<FiShield />}
                                            >
                                                {user.twoFactorEnabled ? "2FA on" : "2FA off"}
                                            </Badge>
                                            <Badge icon={<FiCalendar />}>Member since {identity.memberSince}</Badge>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/account/orders" className={`${BTN_GHOST} shrink-0`}>
                                    <FiPackage aria-hidden="true" />
                                    My orders
                                    <FiArrowRight aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* ---------- Stats ---------- */}
                    <section aria-label="Account overview" className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <StatCard
                            href="/account/orders"
                            icon={<FiPackage className="text-xl" />}
                            value={statValue(stats.orders)}
                            label="Total orders"
                            loading={statsLoading}
                        />
                        <StatCard
                            href="/account/orders"
                            icon={<FiMonitor className="text-xl" />}
                            value={statValue(stats.games)}
                            label="Games purchased"
                            loading={statsLoading}
                        />
                        <StatCard
                            href="/account/orders"
                            icon={<FiGift className="text-xl" />}
                            value={statValue(stats.giftCards)}
                            label="Gift cards"
                            loading={statsLoading}
                        />
                        <StatCard
                            href={FAVOURITES_HREF}
                            icon={<FiHeart className="text-xl" />}
                            value={favouriteCount}
                            label="Favourites"
                            loading={!favouritesReady}
                        />
                    </section>

                    {statsStatus === "error" && (
                        <p role="status" className="mt-3 text-xs text-neutral-500">
                            We couldn&apos;t load your order totals right now. Refresh the page to try again.
                        </p>
                    )}

                    {/* ---------- Main grid ---------- */}
                    <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
                        {/* left column */}
                        <div className="space-y-6">
                            <PersonalInfoCard user={user} jwt={jwt} updateUser={updateUser} />

                            <section className={`${CARD} p-6 md:p-7`} aria-labelledby="shortcuts-heading">
                                <h2 id="shortcuts-heading" className="text-xl font-bold text-white">
                                    Shortcuts
                                </h2>
                                <p className="mt-1 text-sm text-neutral-400">Jump to the things you use most.</p>

                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                    <ActionLink
                                        href="/account/orders"
                                        icon={<FiPackage />}
                                        title="My orders"
                                        text="View your purchases"
                                    />
                                    <ActionLink
                                        href={FAVOURITES_HREF}
                                        icon={<FiHeart />}
                                        tone="pink"
                                        title="Favourites"
                                        text="Your saved items"
                                    />
                                    <ActionLink
                                        href="/support"
                                        icon={<FiMessageCircle />}
                                        tone="blue"
                                        title="Support tickets"
                                        text="Get help with an order"
                                    />
                                    <ActionLink
                                        href="/reset-password"
                                        icon={<FiShield />}
                                        tone="blue"
                                        title="Password"
                                        text="Change your password"
                                    />
                                </div>
                            </section>
                        </div>

                        {/* right column */}
                        <div className="space-y-6">
                            <TwoFactorCard user={user} jwt={jwt} updateUser={updateUser} />

                            <ActionLink
                                onClick={logout}
                                danger
                                icon={<FiLogOut />}
                                title="Log out"
                                text="Sign out of your Keyzoo account"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}