import { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function InventoryAlerts() {

    const [alerts, setAlerts] = useState([]);
    const [expanded, setExpanded] = useState(false);

    const visibleAlerts = expanded
        ? alerts
        : alerts.slice(0, 5);


    useEffect(() => {

        const loadAlerts = async () => {

            const res = await fetch(
                "/api/admin/inventory"
            );

            const data = await res.json();

            const alerts = data.products.filter(
                (item) => item.status === "low" || item.status === "out"
            );

            setAlerts(alerts);
        };

        loadAlerts();

    }, []);


    return (
        <div className="rounded-xl border border-[#23262d] bg-[#1d1d1d] p-6">

            <h3 className="text-white font-semibold mb-6">
                Inventory Alerts
            </h3>

            <div
                className={`space-y-3 transition-all duration-300 ${expanded
                    ? "max-h-[420px] overflow-y-auto pr-2"
                    : ""
                    }`}
            >

                {visibleAlerts.length === 0 && (
                    <p className="text-green-400 text-sm">
                        All products healthy
                    </p>
                )}

                {visibleAlerts.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between"
                    >
                        <div>
                            <p className="text-white text-sm">
                                {item.title}
                            </p>

                            <p className="text-xs text-gray-400">
                                {item.availableKeys} keys left
                            </p>
                        </div>

                        <span
                            className={`text-xs px-2 py-1 rounded-full ${item.status === "out"
                                ? "bg-red-500/15 text-red-400"
                                : "bg-yellow-500/15 text-yellow-400"
                                }`}
                        >
                            {item.status === "out"
                                ? "Out Stock"
                                : "Low Stock"}
                        </span>
                    </div>
                ))}

            </div>
            {alerts.length > 5 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-5 w-full flex items-center justify-center gap-2 rounded-lg border border-[#2b2b2b] bg-[#232323] py-2 text-sm text-gray-300 hover:bg-[#2c2c2c]"
                >
                    {expanded ? (
                        <>
                            <FiChevronUp />
                            Show Less
                        </>
                    ) : (
                        <>
                            <FiChevronDown />
                            View All Alerts ({alerts.length})
                        </>
                    )}
                </button>
            )}
        </div>
    );
}