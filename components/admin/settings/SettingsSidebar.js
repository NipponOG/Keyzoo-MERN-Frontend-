export default function SettingsSidebar({
    active,
    onChange,
}) {

    const items = [
        {
            key: "profile",
            label: "Profile",
        },
        {
            key: "security",
            label: "Security",
        },
        {
            key: "notifications",
            label: "Notifications",
        },
    ];

    return (
        <div
            className="
        flex
        gap-2
        overflow-x-auto
        rounded-2xl
        border
        border-white/10
        p-2
        lg:block
        lg:rounded-3xl
        lg:p-4
        scrollbar-hide
    "
        >
            {items.map((item) => (
                <button
                    key={item.key}
                    onClick={() => onChange(item.key)}
                    className={`
    shrink-0
    rounded-xl
    px-4
    py-3
    text-left
    transition

    lg:mb-2
    lg:w-full

    ${active === item.key
                            ? "bg-[#1a1a1a] text-white"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }
`}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}