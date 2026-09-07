"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import adminFetch from "@/lib/adminFetch";

// const data = [
//     { month: "Jan", refunds: 0 },
//     { month: "Feb", refunds: 0 },
//     { month: "Mar", refunds: 0 },
//     { month: "Apr", refunds: 0 },
//     { month: "May", refunds: 0 },
//     { month: "Jun", refunds: 0 },
//     { month: "Jul", refunds: 100 },
//     { month: "Aug", refunds: 0 },
//     { month: "Sep", refunds: 0 },
//     { month: "Oct", refunds: 0 },
//     { month: "Nov", refunds: 0 },
//     { month: "Dec", refunds: 0 },
// ];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 shadow-2xl">
            <div className="text-xs text-gray-400 mb-2">
                {label} {new Date().getFullYear()}
            </div>

            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#EF4444]" />

                <span className="text-sm text-gray-300">
                    Refunds
                </span>

                <span className="font-bold text-[#EF4444] ml-auto">
                    {/* ₹{payload[0].value.toLocaleString()} */}
                    ₹ {payload[0].value.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </span>
            </div>
        </div>
    );
};

export default function RefundsChart() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadChart = async () => {

            try {

                const data = await adminFetch("/api/admin/refunds-chart");

                setData(data || []);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        };

        loadChart();

        const interval = setInterval(
            loadChart,
            60000
        );

        return () => clearInterval(interval);

    }, []);

    if (loading) {
        return (
            <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
                Loading chart...
            </div>
        );
    }

    return (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
                Refunds Overview
            </h2>

            <div className="h-[365px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient
                                id="colorRefunds"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.45} />
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        {/* <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#2a2f3a"
                        /> */}

                        <XAxis
                            dataKey="month"
                            stroke="#9ca3af"
                        />

                        <YAxis
                            stroke="#9ca3af"
                        />

                        <Tooltip content={CustomTooltip} />

                        <Area
                            type="monotone"
                            dataKey="refunds"
                            stroke="#EF4444"
                            strokeWidth={3}
                            fill="url(#colorRefunds)"
                        />

                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}