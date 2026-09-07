// components/LoadingButton.js
export default function LoadingButton({
    loading = false,
    children,
    className = "",
    type = "button",
    disabled = false,
    size = 18,
    colorClass = "text-white",
}) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`w-full py-3 rounded-md font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all ${loading
                ? "bg-gradient-to-r from-purple-700 to-blue-600 opacity-70 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 shadow-md shadow-purple-500/20"
                } ${className}`}
        >
            {loading && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    className={`inline-block ${colorClass}`}
                    aria-hidden="true"
                >
                    {/* Icon from SVG Spinners by Utkarsh Verma - MIT License */}
                    <path
                        fill="currentColor"
                        d="M12,23a9.63,9.63,0,0,1-8-9.5,9.51,9.51,0,0,1,6.79-9.1A1.66,1.66,0,0,0,12,2.81h0a1.67,1.67,0,0,0-1.94-1.64A11,11,0,0,0,12,23Z"
                    >
                        <animateTransform
                            attributeName="transform"
                            dur="0.75s"
                            repeatCount="indefinite"
                            type="rotate"
                            values="0 12 12;360 12 12"
                        />
                    </path>
                </svg>
            )}
            <span
                className={`${loading ? "opacity-90" : "opacity-100"} transition-opacity`}
            >
                {children}
            </span>
        </button>
    );
}
