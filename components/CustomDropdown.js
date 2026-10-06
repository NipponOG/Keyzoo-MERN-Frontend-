"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomDropdown({
    options = [],
    value = "",
    onChange,
    placeholder = "Select an option",
    disabled = false,
    className = "",
}) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(
        (option) => option.value === value
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, []);

    const handleSelect = (option) => {
        if (disabled) {
            return;
        }

        onChange?.(option.value);
        setOpen(false);
    };

    return (
        <div
            ref={dropdownRef}
            className={`relative ${className}`}
        >
            {/* Trigger */}
            <button
                type="button"
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
                className={`
                    group flex w-full items-center
                    justify-between
                    rounded-xl border
                    px-4 py-3
                    text-left text-sm
                    outline-none
                    transition-all duration-200
                    ${open
                        ? "border-purple-500/70 bg-purple-500/[0.08] shadow-[0_0_0_3px_rgba(168,85,247,0.10),0_8px_30px_rgba(124,58,237,0.10)]"
                        : "border-purple-500/20 bg-purple-500/[0.035] hover:border-purple-500/40 hover:bg-purple-500/[0.06] hover:shadow-[0_8px_25px_rgba(124,58,237,0.08)]"
                    }
                    ${disabled
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }
                `}
            >
                <span
                    className={`
                        transition-colors duration-200
                        ${selectedOption
                            ? "text-white"
                            : "text-white/35"
                        }
                        ${open
                            ? "text-white"
                            : ""
                        }
                    `}
                >
                    {selectedOption?.label || placeholder}
                </span>

                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`
                        shrink-0
                        transition-all duration-200
                        ${open
                            ? "rotate-180 text-purple-400"
                            : "text-white/40 group-hover:text-purple-400"
                        }
                    `}
                >
                    <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    role="listbox"
                    className="
                        absolute left-0 right-0 z-50 mt-2
                        overflow-hidden
                        rounded-xl
                        border border-purple-500/20
                        bg-[#14111d]/98
                        p-1.5
                        shadow-[0_20px_60px_rgba(0,0,0,0.55),0_0_35px_rgba(124,58,237,0.10)]
                        backdrop-blur-xl
                        animate-in fade-in slide-in-from-top-1 duration-150
                    "
                >
                    <div className="max-h-72 overflow-y-auto">
                        {options.length > 0 ? (
                            options.map((option) => {
                                const isSelected =
                                    option.value === value;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="option"
                                        aria-selected={
                                            isSelected
                                        }
                                        onClick={() =>
                                            handleSelect(
                                                option
                                            )
                                        }
                                        className={`
                                            group/option
                                            flex w-full
                                            items-center
                                            justify-between
                                            rounded-lg
                                            px-3 py-2.5
                                            text-left text-sm
                                            transition-all
                                            duration-150
                                            ${isSelected
                                                ? "bg-purple-500/15 text-purple-300 shadow-[inset_2px_0_0_rgba(168,85,247,0.9)]"
                                                : "text-white/70 hover:bg-purple-500/[0.08] hover:text-white"
                                            }
                                        `}
                                    >
                                        <span>
                                            {option.label}
                                        </span>

                                        {isSelected && (
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="shrink-0 text-purple-400"
                                            >
                                                <path
                                                    d="M5 12.5L9.5 17L19 7.5"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-3 py-3 text-sm text-white/35">
                                No options available
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}