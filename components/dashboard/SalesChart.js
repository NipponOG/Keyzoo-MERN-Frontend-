"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import adminFetch from "@/lib/adminFetch";

// const data = [
//     { month: "Jan", revenue: 12000 },
//     { month: "Feb", revenue: 18000 },
//     { month: "Mar", revenue: 15000 },
//     { month: "Apr", revenue: 24000 },
//     { month: "May", revenue: 22000 },
//     { month: "Jun", revenue: 35000 },
//     { month: "Jul", revenue: 42000 },
//     { month: "Aug", revenue: 42000 },
//     { month: "Sep", revenue: 42000 },
//     { month: "Oct", revenue: 42000 },
//     { month: "Nov", revenue: 42000 },
//     { month: "Dec", revenue: 42000 },
// ];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 shadow-2xl">
            <div className="text-xs text-gray-400 mb-2">
                {label} {new Date().getFullYear()}
            </div>

            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />

                <span className="text-sm text-gray-300">
                    Revenue
                </span>

                <span className="font-bold text-green-400 ml-auto">
                    {/* ₹ {payload[0].value.toLocaleString()} */}
                    ₹ {payload[0].value.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </span>
            </div>
        </div>
    );
};

export default function SalesChart() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const loadChart = async () => {
    //         try {
    //             const res = await fetch("/api/admin/revenue-chart");
    //             const result = await res.json();

    //             setData(result || []);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     loadChart();
    // }, []);

    // useEffect(() => {
    //     const loadChart = async () => {
    //         const res = await fetch("/api/admin/revenue-chart");
    //         const result = await res.json();
    //         setData(result || []);
    //     };

    //     loadChart();
    //     setLoading(false);

    //     const interval = setInterval(
    //         loadChart,
    //         60000
    //     );

    //     return () => clearInterval(interval);
    // }, []);

    // useEffect(() => {
    //     const loadChart = async () => {

    //         try {
    //             const data = await adminFetch("/api/admin/revenue-chart");
    //             const result = await res.json();

    //             setData(result || []);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     loadChart();

    //     const interval = setInterval(
    //         loadChart,
    //         60000
    //     );

    //     return () => clearInterval(interval);
    // }, []);

    useEffect(() => {

        const loadChart = async () => {

            try {

                const data = await adminFetch("/api/admin/revenue-chart");

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
                Revenue Overview
            </h2>

            <div className="h-[365px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient
                                id="colorRevenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.45} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
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
                            dataKey="revenue"
                            stroke="#10B981"
                            strokeWidth={3}
                            fill="url(#colorRevenue)"
                        />

                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}