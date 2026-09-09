import { useEffect, useState } from "react";
import adminFetch from "@/lib/adminFetch";

export default function CategorySales() {
    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await adminFetch(
                    "/admin/dashboard/category-sales"
                );

                console.log("CATEGORY API:", data);
                console.log("Array?", Array.isArray(data?.data));

                setCategories(data?.data || []);
            } catch (error) {
                console.error("Failed to load category sales:", error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    if (loading) {
        return (
            <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
                Loading chart...
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-[#23262d] bg-[#1d1d1d] p-6">

            <h3 className="text-white font-semibold mb-6">
                Category Sales
            </h3>

            <div className="space-y-5">
                {categories.map((item) => (
                    <div key={item.name}>
                        <div className="flex justify-between text-sm text-white mb-2">
                            <span>{item.name}</span>
                            <span>{item.value}%</span>
                        </div>

                        <div className="h-4 bg-[#1c1f26] rounded-full">
                            <div
                                className="h-2 bg-blue-500 rounded-full"
                                style={{ width: `${item.value}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}