import { useState } from "react";
import { HugeiconsIcon } from '@hugeicons/react';
import { EyeIcon, EyeOffIcon  } from '@hugeicons/core-free-icons';
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function PasswordInput({ value, onChange, placeholder }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full mt-1 px-4 py-3 bg-neutral-800 rounded text-white outline-none"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-4.5 text-white"
      >
        {showPassword ? (
          <HugeiconsIcon icon={EyeIcon} />
        ) : (
          <HugeiconsIcon icon={EyeOffIcon} />
        )}
      </button>
    </div>
  );
}
