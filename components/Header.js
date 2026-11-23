import { memo, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { CircleUser, Heart, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LiveSearch from "./LiveSearch";

// Only needed after a tap on mobile, so keep it out of the initial bundle
const AccountOverlayMenu = dynamic(() => import("@/components/AccountOverlayMenu"), {
  ssr: false,
});

// LiveSearch doesn't need to re-render when the menu or account state changes
const SearchBox = memo(LiveSearch);

const LOGO_URL =
  "https://res.cloudinary.com/dblttl9bh/image/upload/v1778325665/Chat_GPT_Image_May_9_2026_04_48_26_PM_1_113ae62610.png";

const NAV_LINKS = [
  { href: "/store", label: "Store" },
  { href: "/upcoming", label: "Upcoming" },
  { href: "/topup", label: "Topups" },
  {
    href: "/pricing",
    label: (
      <>
        Save with <span className="font-bold text-[#8f6bff]">plus</span>
      </>
    ),
  },
  { href: "/country-connections", label: "Explore eSIMs" },
];

const ICON_BTN =
  "relative shrink-0 rounded-md p-2 text-white transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d3cff]";

function AuthArea({ user, loading, onOpenAccount }) {
  // Placeholder keeps the header from shifting while auth state loads
  if (loading) {
    return (
      <div
        aria-hidden="true"
        className="h-9 w-9 animate-pulse rounded-full bg-neutral-700 md:w-[170px] md:rounded-md"
      />
    );
  }

  if (user) {
    return (
      <>
        <Link href="/account/profile" aria-label="Your account" className={`${ICON_BTN} hidden md:block`}>
          <CircleUser className="h-6 w-6" aria-hidden="true" />
        </Link>

        <button
          type="button"
          onClick={onOpenAccount}
          aria-label="Open account menu"
          className={`${ICON_BTN} md:hidden`}
        >
          <CircleUser className="h-5 w-5" aria-hidden="true" />
        </button>
      </>
    );
  }

  return (
    <>
      <div className="hidden items-center gap-2 md:flex">
        <Link
          href="/sign-in"
          className="rounded-md border border-[#6d3cff] bg-white px-4 py-2 text-sm font-semibold text-[#6d3cff] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d3cff]"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="rounded-md bg-[#6d3cff] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Sign Up
        </Link>
      </div>

      <Link href="/sign-in" aria-label="Sign in" className={`${ICON_BTN} md:hidden`}>
        <CircleUser className="h-5 w-5" aria-hidden="true" />
      </Link>
    </>
  );
}

export default function Header() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // mobile full-screen search
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const openAccount = useCallback(() => setIsAccountOpen(true), []);
  const closeAccount = useCallback(() => setIsAccountOpen(false), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  // Close menus after navigating, and when the screen grows to desktop size
  useEffect(() => {
    const closeAll = () => {
      setIsNavOpen(false);
      setIsSearchOpen(false);
      setIsAccountOpen(false);
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = (e) => e.matches && closeAll();

    router.events.on("routeChangeStart", closeAll);
    mq.addEventListener("change", onBreakpoint);

    return () => {
      router.events.off("routeChangeStart", closeAll);
      mq.removeEventListener("change", onBreakpoint);
    };
  }, [router.events]);

  // Full-screen search: lock page scroll and close on Escape
  useEffect(() => {
    if (!isSearchOpen) return;

    const onKey = (e) => e.key === "Escape" && setIsSearchOpen(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isSearchOpen]);

  const isActive = (href) =>
    router.pathname === href || router.pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-[#1e1e1e] shadow-sm">
      {/* Top bar */}
      <div className="flex min-h-[72px] items-center justify-between gap-3 px-4 py-3">
        {/* Logo: always rendered (it doesn't depend on auth) and loaded eagerly */}
        <Link href="/" aria-label="Keyzoo home" className="flex shrink-0 items-center">
          <Image src={LOGO_URL} alt="Keyzoo" width={120} height={100} priority />
        </Link>

        {/* Desktop search */}
        <div className="mx-auto hidden max-w-6xl flex-1 px-4 md:flex">
          <div className="relative w-full">
            <SearchBox />
          </div>
        </div>

        {/* Right controls */}
        <div className="flex flex-none items-center gap-1 md:gap-3">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className={`${ICON_BTN} md:hidden`}
            aria-label="Open search"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>

          <Link href="/favorites" className={ICON_BTN} aria-label="View favourites">
            <Heart className="h-5 w-5" aria-hidden="true" />
          </Link>

          <Link href="/cart" className={ICON_BTN} aria-label="View cart">
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          </Link>

          <div className="flex shrink-0 items-center justify-end gap-2">
            <AuthArea user={user} loading={loading} onOpenAccount={openAccount} />
          </div>

          <button
            type="button"
            onClick={() => setIsNavOpen((open) => !open)}
            className={`${ICON_BTN} md:hidden`}
            aria-label={isNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={isNavOpen}
            aria-controls="site-nav"
          >
            {isNavOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Main navigation: a stacked list on mobile, a row on desktop */}
      <nav
        id="site-nav"
        aria-label="Main"
        className={`${isNavOpen ? "flex" : "hidden"
          } flex-col gap-1 bg-neutral-900 px-4 py-2 text-sm font-medium text-white md:flex md:flex-row md:items-center md:gap-5 md:overflow-x-auto`}
      >
        {NAV_LINKS.map(({ href, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap rounded-md py-2.5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d3cff] md:py-0 ${active
                  ? "text-white underline decoration-[#6d3cff] decoration-2 underline-offset-8"
                  : "text-white/75"
                }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile account overlay (code-split) */}
      {isAccountOpen && <AccountOverlayMenu onClose={closeAccount} />}

      {/* Mobile full-screen search */}
      {isSearchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="fixed inset-0 z-[70] flex flex-col bg-[#1e1e1e] md:hidden"
        >
          <div className="flex items-center border-b border-neutral-800 px-4 py-3">
            <div className="flex-1">
              <SearchBox setIsSearchOpen={setIsSearchOpen} autoFocus />
            </div>
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              className="ml-3 rounded-md p-2 text-gray-400 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6d3cff]"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}