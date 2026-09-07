import React from "react";

const Tooltip = ({ text, children }) => {
    return (
        <div className="relative inline-flex group">
            {children}

            {/* Tooltip box */}
            <div
                className="
                    absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                    opacity-0 scale-95
                    group-hover:opacity-100 group-hover:scale-100
                    transition-all duration-200
                    pointer-events-none
                    z-50
                "
            >
                <div
                    className="
                        relative whitespace-nowrap
                        rounded-md bg-[#1c1c1e]
                        px-5 py-2.5
                        text-[0.975rem] text-white
                        border border-white/10
                        shadow-lg
                    "
                >
                    {text}

                    {/* Arrow */}
                    <div
                        className="
                            absolute left-1/2 top-full -translate-x-1/2
                            w-2 h-2 bg-[#1c1c1e]
                            rotate-45
                            border-r border-b border-white/10
                        "
                    />
                </div>
            </div>
        </div>
    );
};

export default Tooltip;
