// components/ThemeToggle.js
'use client';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isLight = theme === 'light';

  return (
    <button
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      aria-label="Toggle Theme"
      className="bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors p-2 rounded-md cursor-pointer"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {isLight ? (
            <FaMoon className="text-white text-lg" />
          ) : (
            <FaSun className="text-yellow-400 text-lg" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
