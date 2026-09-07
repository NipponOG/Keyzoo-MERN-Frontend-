"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import adminFetch from "@/lib/adminFetch";

// const data = [
//     { month: "Jan", orders: 120 },
//     { month: "Feb", orders: 180 },
//     { month: "Mar", orders: 150 },
//     { month: "Apr", orders: 240 },
//     { month: "May", orders: 220 },
//     { month: "Jun", orders: 350 },
//     { month: "Jul", orders: 420 },
//     { month: "Aug", orders: 450 },
//     { month: "Sep", orders: 470 },
//     { month: "Oct", orders: 420 },
//     { month: "Nov", orders: 360 },
//     { month: "Dec", orders: 500 },
// ];

const CustomTooltip = ({ active, payload, label }) => {

    if (!active || !payload?.length) return null;

    return (
        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 shadow-2xl">
            <div className="text-xs text-gray-400 mb-2">
                {label} 2026
            </div>

            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />

                <span className="text-sm text-gray-300">
                    Orders
                </span>

                <span className="font-bold text-[#3B82F6] ml-auto">
                    {payload[0].value.toLocaleString()} pcs
                </span>
            </div>
        </div>
    );
};

export default function OrderChart() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadChart = async () => {

            try {

                const data = await adminFetch("/api/admin/order-chart");

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
                Order Overview
            </h2>

            <div className="h-[365px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient
                                id="colorOrders"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.45} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
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
                            dataKey="orders"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            fill="url(#colorOrders)"
                        />

                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}