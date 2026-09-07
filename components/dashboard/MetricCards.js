import {
    ShoppingCart,
    IndianRupee,
    Wallet,
    Package,
} from "lucide-react";

export default function MetricCards() {

    const cards = [
        {
            title: "Total Orders",
            value: "1,245",
            icon: ShoppingCart,
        },
        {
            title: "Revenue",
            value: "₹85,230",
            icon: IndianRupee,
        },
        {
            title: "Profit",
            value: "₹42,150",
            icon: Wallet,
        },
        {
            title: "Products",
            value: "875",
            icon: Package,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {cards.map((card, index) => {
                const Icon = card.icon;

                return (
                    <div
                        key={index}
                        className="bg-[#171b25] border border-white/5 rounded-2xl p-6"
                    >
                        <div className="flex justify-between items-center">

                            <div>
                                <p className="text-gray-400 text-sm">
                                    {card.title}
                                </p>

                                <h3 className="text-3xl font-bold text-white mt-2">
                                    {card.value}
                                </h3>
                            </div>

                            <div className="bg-indigo-500/20 p-3 rounded-xl">
                                <Icon
                                    size={24}
                                    className="text-indigo-400"
                                />
                            </div>

                        </div>
                    </div>
                );
            })}
        </div>
    );
}