
// import { Search, Menu, X } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";
// import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
// import { useAuth } from "@/context/AuthContext";
// import UserMenu from "./UserMenu";
// import LiveSearch from "./LiveSearch";
// import AccountOverlayMenu from "@/components/AccountOverlayMenu";

// export default function Header() {
//   const { user } = useAuth();
//   const [isNavOpen, setIsNavOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isAccountOpen, setIsAccountOpen] = useState(false);


//   return (
//     <header className="w-full shadow-sm border-b border-neutral-800 sticky top-0 z-50 bg-[#1e1e1e]">
//       {/* Top Header */}
//       <div className="px-4 py-3 flex items-center justify-between min-h-[72px] gap-3">
//         {/* Left: Logo */}
//         <div className="flex items-center gap-2">
//           <Link href="/" className="flex items-center gap-2">
//             <Image
//               src="/logo-white.png"
//               alt="Logo"
//               width={120}
//               height={100}
//             />
//             <span className="font-bold text-lg text-white hidden sm:inline">

//             </span>
//           </Link>
//         </div>

//         {/* Center: Search (Desktop only) */}
//         <div className="hidden md:flex flex-1 max-w-6xl mx-auto px-4">
//           <div className="relative w-full">
//             <LiveSearch isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
//             <Search className="absolute left-3 top-3 h-5 w-5 text-black" />
//           </div>
//         </div>

//         {/* Right Controls */}
//         <div className="flex items-center gap-2 md:gap-3.5 flex-none">
//           {/* Mobile Search Icon */}
//           <button
//             onClick={() => setIsSearchOpen(true)}
//             className="md:hidden p-2 rounded-md hover:bg-neutral-800 transition shrink-0"
//             aria-label="Open search"
//           >
//             <Search className="h-5 w-5 text-white" />
//           </button>

//           {/* Cart (compact) */}
//           <Link
//             href="/cart"
//             className="p-2 rounded-md hover:bg-neutral-800 transition relative shrink-0"
//             aria-label="View cart"
//           >
//             <FaShoppingCart className="text-xl text-white" />
//           </Link>

//           {/* Auth area: shows buttons for public users, user menu for logged in */}
//           {/* Auth area */}
//           <div className="flex items-center gap-2 justify-end shrink-0">
//             {user ? (
//             <>
//               {/* Desktop user menu */}
//               <div className="hidden md:block">
//                 <UserMenu user={user} />
//               </div>

//               {/* Mobile user overlay trigger */}
//               <button
//                 onClick={() => setIsAccountOpen(true)}
//                 className="md:hidden p-2 rounded-md hover:bg-neutral-800 transition"
//               >
//                 <FaUserCircle className="text-xl text-white" />
//               </button>
//             </>
//           ) : (
//             <Link href="/sign-in" className="p-2 rounded-md hover:bg-neutral-800 transition">
//               <FaUserCircle className="text-xl text-white" />
//             </Link>
//           )}
//           </div>


//           {/* Mobile Menu Toggle */}
//           <button
//             onClick={() => setIsNavOpen(!isNavOpen)}
//             className="md:hidden p-2 rounded-md hover:bg-neutral-800 transition shrink-0"
//             aria-label="Open menu"
//           >
//             <Menu className="h-5 w-5 text-white" />
//           </button>
//         </div>

//       </div>

//       {/* Bottom Navigation */}
//       <nav
//         className={`bg-neutral-900 text-white px-4 py-2 flex items-center gap-5 text-sm font-medium overflow-x-auto transition-all duration-300 ${isNavOpen ? "block" : "hidden md:flex"
//           }`}
//       >
//         <Link href="/store" className="whitespace-nowrap">
//           Store
//         </Link>
//         <Link href="/upcoming" className="whitespace-nowrap">
//           Upcoming
//         </Link>
//         <Link href="/topup" className="whitespace-nowrap">
//           Topups
//         </Link>
//         <Link href="#" className="whitespace-nowrap">
//           Save with <span className="text-purple-400 font-bold">plus</span>
//         </Link>
//         <Link href="#" className="whitespace-nowrap">
//           Explore eSIMs
//         </Link>
//       </nav>

//       {/* 🟣 Mobile Account Overlay */}
//       {isAccountOpen && (
//         <AccountOverlayMenu onClose={() => setIsAccountOpen(false)} />
//       )}

//       {/* 🟣 Mobile Fullscreen Search */}
//       {isSearchOpen && (
//         <div className="fixed inset-0 z-[70] bg-[#1e1e1e] flex flex-col md:hidden">
//           {/* Header (input + close button) */}
//           <div className="flex items-center px-4 py-3 border-b border-neutral-800">
//             {/* <Search className="h-5 w-5 text-gray-400 mr-3" /> */}
//             <div className="flex-1">
//               <LiveSearch isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
//             </div>
//             <button
//               onClick={() => setIsSearchOpen(false)}
//               className="ml-3 text-gray-400 hover:text-white"
//             >
//               <X className="h-6 w-6" />
//             </button>
//           </div>

//           {/* Results (scrollable area) */}
//           <div className="flex-1 overflow-y-auto p-2">
//             {/* The LiveSearch component automatically renders results inside */}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }



import { Search, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaShoppingCart, FaUserCircle, FaHeart } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "./UserMenu";
import LiveSearch from "./LiveSearch";
import AccountOverlayMenu from "@/components/AccountOverlayMenu";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HeaderSkeleton = () => (
  <SkeletonTheme baseColor="#202020" highlightColor="#444">
    <header className="w-full shadow-sm border-b border-neutral-800 sticky top-0 z-50 bg-[#1e1e1e]">
      <div className="px-4 py-3 flex items-center justify-between min-h-[72px] gap-3">

        {/* Logo */}
        <Skeleton width={120} height={40} />

        {/* Search bar (desktop) */}
        <div className="hidden md:block w-full max-w-lg mx-4">
          <Skeleton height={42} borderRadius={8} />
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          <Skeleton circle width={36} height={36} />
          <Skeleton circle width={36} height={36} />
          <Skeleton circle width={36} height={36} />
        </div>
      </div>

      {/* Nav Skeleton */}
      <nav className="bg-neutral-900 px-4 py-3 flex gap-5">
        <Skeleton width={60} />
        <Skeleton width={80} />
        <Skeleton width={70} />
        <Skeleton width={90} />
      </nav>
    </header>
  </SkeletonTheme>
);


export default function Header() {
  const { user, loading } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // ⭐ Show skeleton while loading AuthContext
  if (loading) return <HeaderSkeleton />;

  return (
    <header className="w-full shadow-sm border-b border-neutral-800 sticky top-0 z-50 bg-[#1e1e1e]">
      {/* Top Header */}
      <div className="px-4 py-3 flex items-center justify-between min-h-[72px] gap-3">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="https://res.cloudinary.com/dblttl9bh/image/upload/v1778325665/Chat_GPT_Image_May_9_2026_04_48_26_PM_1_113ae62610.png" alt="Logo" width={120} height={100} />
          </Link>
        </div>

        {/* Center: Search (Desktop only) */}
        <div className="hidden md:flex flex-1 max-w-6xl mx-auto px-4">
          <div className="relative w-full">
            <LiveSearch
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-black" />
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 md:gap-3.5 flex-none">
          {/* Mobile Search Icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-md hover:bg-neutral-800 transition shrink-0"
            aria-label="Open search"
          >
            <Search className="h-5 w-5 text-white" />
          </button>

          {/* Cart */}
          <Link
            href="/favourites"
            className="p-2 rounded-md hover:bg-neutral-800 transition relative shrink-0"
            aria-label="View cart"
          >
            <FaHeart className="text-xl text-white" />
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="p-2 rounded-md hover:bg-neutral-800 transition relative shrink-0"
            aria-label="View cart"
          >
            <FaShoppingCart className="text-xl text-white" />
          </Link>

          {/* Auth Area */}
          <div className="flex items-center gap-2 justify-end shrink-0">
            {user ? (
              <>
                {/* Desktop user menu */}
                <div className="hidden md:block">
                  <UserMenu user={user} />
                </div>

                {/* Mobile user overlay trigger */}
                <button
                  onClick={() => setIsAccountOpen(true)}
                  className="md:hidden p-2 rounded-md hover:bg-neutral-800 transition"
                >
                  <FaUserCircle className="text-xl text-white" />
                </button>
              </>
            ) : (
              <>
                {/* Desktop Buttons */}
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/sign-in"
                    className="px-4 py-2 rounded-md border border-neutral-700 text-sm text-white hover:border-purple-500 hover:text-purple-400 transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-500 text-sm font-semibold text-white hover:opacity-90 transition-all duration-300 shadow-md shadow-purple-500/20"
                  >
                    Sign Up
                  </Link>
                </div>

                {/* Mobile Icon */}
                <Link
                  href="/sign-in"
                  className="md:hidden p-2 rounded-md hover:bg-neutral-800 transition"
                >
                  <FaUserCircle className="text-xl text-white" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="md:hidden p-2 rounded-md hover:bg-neutral-800 transition shrink-0"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav
        className={`bg-neutral-900 text-white px-4 py-2 flex items-center gap-5 text-sm font-medium overflow-x-auto transition-all duration-300 ${isNavOpen ? "block" : "hidden md:flex"
          }`}
      >
        <Link href="/store" className="whitespace-nowrap">
          Store
        </Link>
        <Link href="/upcoming" className="whitespace-nowrap">
          Upcoming
        </Link>
        <Link href="/topup" className="whitespace-nowrap">
          Topups
        </Link>
        <Link href="/pricing" className="whitespace-nowrap">
          Save with <span className="text-[#6d3cff] font-bold">plus</span>
        </Link>
        <Link href="/country-connections" className="whitespace-nowrap">
          Explore eSIMs
        </Link>
      </nav>

      {/* Mobile Account Overlay */}
      {isAccountOpen && <AccountOverlayMenu onClose={() => setIsAccountOpen(false)} />}

      {/* Mobile Fullscreen Search */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[70] bg-[#1e1e1e] flex flex-col md:hidden">
          <div className="flex items-center px-4 py-3 border-b border-neutral-800">
            <div className="flex-1">
              <LiveSearch
                isSearchOpen={isSearchOpen}
                setIsSearchOpen={setIsSearchOpen}
              />
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="ml-3 text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
