// components/Footer.js

'use client';

import { React, useState, useEffect } from 'react';
import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaDiscord } from 'react-icons/fa';
import { MetaIcon, InstagramIcon, NewTwitterIcon, YoutubeIcon, DiscordIcon, CopyrightIcon } from '@hugeicons/core-free-icons';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';

export default function Footer() {

  const [showAddresses, setShowAddresses] = useState(false);

  // Option 1: Show based on environment variable
  useEffect(() => {
    // You can set this in your environment variables
    setShowAddresses(process.env.NEXT_PUBLIC_SHOW_ADDRESSES === 'true');
  }, []);

  return (
    <footer className="w-full bg-[#1e1e1e] text-white text-sm">
      {/* Payment Methods */}
      <div className="border-b border-neutral-800 py-4 px-4 flex flex-wrap items-center gap-4 text-center justify-center sm:justify-start">
        <span className="text-gray-300">Pay via</span>
        <Image src="/payments_footer/upi.svg" alt="UPI" width={40} height={20} draggable={false} />
        <Image src="/payments_footer/applepay.svg" alt="Apple Pay" width={40} height={20} draggable={false} />
        <Image src="/payments_footer/visa.svg" alt="Visa" width={40} height={20} draggable={false} />
        <Image src="/payments_footer/mastercard.svg" alt="MasterCard" width={40} height={20} draggable={false} />
        <Image src="/payments_footer/amex.svg" alt="Amex" width={40} height={20} draggable={false} />
        <span className="text-gray-400">and more</span>
      </div>

      {/* Main Footer */}
      <div className="px-4 py-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-12 text-gray-300 text-center md:text-left">
        {/* Column 1: Trustpilot + Language */}
        <div className="select-none space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
          <div>
            {/* Trustpilot logo */}
            <Image src="/icons/trust.svg" alt="Trustpilot" width={120} height={40} className='inline' draggable={false} />

            {/* Stars SVG below logo */}
            <div className="mt-3">
              <Image src="/icons/star.svg" alt="Trustpilot Stars" width={100} height={20} className='inline' draggable={false} />
            </div>

            {/* Review Text */}
            <p className="text-sm mt-2">
              TrustScore <span className="font-bold text-white">4.1</span> |{" "}
              <span className="font-bold text-white">3,826</span> reviews
            </p>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-[#2a2a2a] px-2 py-2 rounded-md w-max">
            <Image src="/icons/globe_2.0.svg" alt="Flag" width={20} height={14} draggable={false} />
            {/* <span>INR • English</span> */}
            <span><span className="font-bold uppercase">Global</span> • English</span>
            <ThemeToggle />
          </div>
        </div>

        {/* Column 2: Company */}
        <div className="space-y-3 items-center md:items-start flex flex-col">
          <h4 className="text-white font-semibold text-xl mb-3">Company</h4>
          <Link href={'/about-us'}><p className='cursor-pointer text-[gray] hover:text-white'>About Us</p></Link>
          <Link href={'/contact-us'}><p className='cursor-pointer text-[gray] hover:text-white'>Contact Us</p></Link>
        </div>

        {/* Column 3: Buy */}
        <div className="space-y-3 items-center md:items-start flex flex-col">
          <h4 className="text-white font-semibold text-xl mb-3">Buy</h4>
          <Link href={'/collection-list'}><p className='cursor-pointer text-[gray] hover:text-white'>Collections</p></Link>
          <Link href={'/product-list'}><p className='cursor-pointer text-[gray] hover:text-white'>Product List</p></Link>
        </div>

        {/* Column 4: Help */}
        <div className="space-y-3 items-center md:items-start flex flex-col">
          <h4 className="text-white font-semibold text-xl mb-3">Help</h4>
          <Link href={'/activation-guide'}><p className='cursor-pointer text-[gray] hover:text-white'>Activation Guides</p></Link>
          <Link href={'/contact-us'}><p className='cursor-pointer text-[gray] hover:text-white'>Contact Us</p></Link>
        </div>

        {/* Column 5: Community + Business */}
        <div className="space-y-3 items-center md:items-start flex flex-col">
          <h4 className="text-white font-semibold text-xl mb-3">Community</h4>
          <Link href={'/blog'} className='cursor-pointer text-[gray] hover:text-white'>Blog</Link>
          <p className='cursor-pointer text-[gray] hover:text-white'>System Status</p>

          <h4 className="text-white font-semibold text-xl mt-5 mb-3">Business</h4>
          <p className='cursor-pointer text-[gray] hover:text-white'>Sell with Keyzoo.</p>
          <p className='cursor-pointer text-[gray] hover:text-white'>Wholesale</p>
        </div>

        {/* Column 6: Follow Us */}
        <div className="space-y-3 items-center md:items-start flex flex-col">
          <h4 className="text-white font-semibold text-xl mb-3">Follow Us</h4>
          <div className="text-[grey] flex flex-wrap justify-center gap-4 md:flex-col md:items-start">
            <div className="flex items-center gap-3 cursor-pointer hover:text-[white]">
              {/* <FaFacebookF className="text-2xl" /> */}
              <HugeiconsIcon icon={MetaIcon} size={24} />
              <span className="hidden lg:inline">Facebook</span>
            </div>
            <div className="flex items-center gap-3 cursor-pointer hover:text-[white]">
              <HugeiconsIcon icon={InstagramIcon} size={24} />
              <span className="hidden lg:inline">Instagram</span>
            </div>
            <div className="flex items-center gap-3 cursor-pointer hover:text-[white]">
              <HugeiconsIcon icon={NewTwitterIcon} size={24} />
              <span className="hidden lg:inline">Twitter</span>
            </div>
            <div className="flex items-center gap-3 cursor-pointer hover:text-[white]">
              <HugeiconsIcon icon={YoutubeIcon} size={24} />
              <span className="hidden lg:inline">YouTube</span>
            </div>
            <div className="flex items-center gap-3 cursor-pointer hover:text-[white]">
              <HugeiconsIcon icon={DiscordIcon} size={24} />
              <span className="hidden lg:inline">Discord</span>
            </div>
          </div>
        </div>
      </div>

      {/* Company Address Grid */}
      {showAddresses && (<div className="border-t border-neutral-800 px-4 pt-8 pb-12 text-gray-400 text-sm max-w-7xl mx-auto text-justify tracking-tight">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="font-semibold text-white mb-1">Driffle UAB (Platform operator)</p>
            <p>Naugarduko g. 3-401, 03231, Lithuania.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-1">Driffle Inc (Platform operator)</p>
            <p>3524 Silverside Road Wilmington, Delaware, 19810 United States of America.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-1">Bundle Limited (Platform operator)</p>
            <p>Unit 2A, 17/F, Glenealy Tower, No. 1 Glenealy Central Hong Kong</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-1">Remittx Private Limited (Platform operator)</p>
            <p>1st Floor, Gopala Krishna Complex, Residency Road Bengaluru, Karnataka, 560025 India</p>
          </div>
        </div>
      </div>)}

      {/* Legal Bottom Bar */}
      <div className="border-t border-neutral-800 px-4 py-6 text-gray-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* <p>© 2026 Keyzoo. All rights reserved.</p> */}
          <p className="flex items-center gap-2">
            <HugeiconsIcon icon={CopyrightIcon} size={18} /> 2026 Keyzoo. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/policy/terms-and-conditions" className="hover:text-white transition">Terms & Conditions</Link>
            <Link href="/policy/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/policy/refund-policy" className="hover:text-white transition">Refund Policy</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
