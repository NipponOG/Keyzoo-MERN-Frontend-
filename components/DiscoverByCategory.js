// components/DiscoverByPrice.js
import React from "react";
import useCurrency from "@/hook/useCurrency";

const priceRanges = [
    { label: "100" },
    { label: "200" },
    { label: "500" },
    { label: "800" },
    { label: "1000" },
    { label: "1500" },
    { label: "2000" },
    { label: "2500" },
    { label: "5000" },
];


export default function DiscoverByPrice() {

    const { symbol } = useCurrency();

    return (
        <div className=" py-10 px-4">
            <h2 className=" text-lg sm:text-xl font-semibold mb-6">
                Discover Games By Category
            </h2>

            <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:flex flex-wrap gap-4">
                {priceRanges.map((item, index) => (
                    <button
                        key={index}
                        className="bg-[#2a2a2a] hover:bg-[#333] transition-all text-white rounded-xl w-40 h-25 flex flex-col justify-center items-center shadow-sm"
                    >
                        <span className="text-sm text-gray-400">Under</span>
                        <span className="text-xl font-semibold">{symbol} {item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
