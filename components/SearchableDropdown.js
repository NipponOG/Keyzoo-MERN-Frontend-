import { useEffect, useRef, useState } from "react";

export default function SearchableDropdown({value, options = [], placeholder = "Select option", onChange, width = "w-full",}) {

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter((opt) =>
        opt.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div ref={wrapperRef} className={`relative ${width}`}>
            {/* Trigger */}
            <button onClick={() => setOpen((v) => !v)} className="w-full h-[50px] bg-[#3a3a3a] text-white px-4 rounded-lg flex items-center justify-between outline-none">

                <span className="text-sm truncate">
                    {value || placeholder}
                </span>

                <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-2 w-full bg-[#2a2a2a] rounded-xl shadow-2xl border border-white/10">
                    {/* Search input */}
                    <div className="p-3 border-b border-white/10">
                        <input
                            autoFocus
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full bg-[#1f1f1f] text-white text-sm px-3 py-2 rounded-md outline-none"
                        />
                    </div>

                    {/* Options */}
                    <div className="max-h-[220px] overflow-y-auto no-scrollbar">
                        {filteredOptions.length > 0 ? 
                            (
                                filteredOptions.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => {
                                            onChange(opt);
                                            setOpen(false);
                                            setSearch("");
                                        }}
                                        className={`w-full text-left px-4 py-3 text-sm transition ${value === opt ? "bg-[#3a3a3a] text-white" : "text-white/90 hover:bg-[#3a3a3a]"}`}>
                                        {opt}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-white/50">
                                    No results found
                                </div>
                            )
                        }
                    </div>
                </div>
            )}
        </div>
    );
}
