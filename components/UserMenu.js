"use client";

import { Fragment } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaUserCircle, FaGoogleWallet, FaHandsHelping, FaHeart } from "react-icons/fa";
import { IoGameControllerSharp, IoBagCheck, IoLogOut } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";

export default function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async (close) => {
    try {
      close?.(); // close the popover first
      await logout(); // call logout from your AuthContext
      router.push("/"); // redirect to homepage
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Popover className="relative">
      {({ close }) => (
        <>
          {/* User Icon Button */}
          <PopoverButton className="text-2xl text-white focus:outline-none">
            <FaUserCircle className="cursor-pointer" />
          </PopoverButton>

          {/* Dropdown Panel */}
          <PopoverPanel
            as="div"
            className="absolute right-0 z-50 mt-2 w-75 divide-y divide-gray-700 rounded-lg bg-[#1a1a1a] shadow-lg ring-1 ring-black/5"
          >
            {/* Top Menu Links */}
            <div className="p-2">
              <Link
                href="/user/profile"
                onClick={() => close()}
                className="flex gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 rounded"
              >
                <FaUserCircle className="text-2xl" /> My Profile
              </Link>

              <Link
                href="/user/library"
                onClick={() => close()}
                className="flex gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 rounded"
              >
                <IoGameControllerSharp className="text-2xl" /> My Library
              </Link>

              <Link
                href="/user/favourites"
                onClick={() => close()}
                className="flex gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 rounded"
              >
                <FaHeart className="text-2xl" /> My Library
              </Link>

              <Link
                href="/user/wallet"
                onClick={() => close()}
                className="flex gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 rounded"
              >
                <FaGoogleWallet className="text-2xl" /> Wallet
              </Link>

              <Link
                href="/user/orders"
                onClick={() => close()}
                className="flex gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 rounded"
              >
                <IoBagCheck className="text-2xl" /> My Orders
              </Link>

              <Link
                href="/contact-us"
                onClick={() => close()}
                className="flex gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 rounded"
              >
                <FaHandsHelping className="text-2xl" /> Help Center
              </Link>
            </div>

            {/* Logout Button */}
            <div className="p-2">
              {user && (
                <button
                  onClick={() => handleLogout(close)}
                  className="flex gap-3 w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-800 rounded"
                >
                  <IoLogOut className="text-2xl text-red-400" /> Logout
                </button>
              )}
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}
