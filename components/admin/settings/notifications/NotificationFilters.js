const filters = [
    "All",
    "Unread",
    "Orders",
    "Payments",
    "Inventory",
    "Security",
    "System",
];

export default function NotificationFilters({
    active,
    onChange,
}) {

    return (
        <div
            className="
        mb-5
        flex
        gap-2
        overflow-x-auto
        pb-2
        scrollbar-hide
    "
        >

            {filters.map((filter) => (

                <button
                    key={filter}
                    onClick={() => onChange(filter)}
                    className={`rounded-full px-4 py-2 text-sm transition
                        ${active === filter
                            ? "bg-indigo-600 text-white"
                            : "bg-[#202020] text-gray-400 hover:bg-[#2a2a2a]"
                        }
                    `}
                >
                    {filter}
                </button>

            ))}

        </div>
    );
}