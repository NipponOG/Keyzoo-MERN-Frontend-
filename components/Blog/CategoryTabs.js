import { useState } from "react";

export default function CategoryTabs({ categories, onChange }) {
    const [active, setActive] = useState("all");

    const handle = (slug) => {
        setActive(slug);
        onChange(slug);
    };

    return (
        <div className="flex gap-6 border-b border-gray-800 mb-6 mt-6 overflow-x-auto justify-between content-between">
            <button
                onClick={() => handle("all")}
                className={`pb-2 ${active === "all"
                        ? "text-white border-b-2 border-indigo-500"
                        : "text-gray-400"
                    }`}
            >
                View all
            </button>

            {categories.map((cat) => (
                <button
                    key={cat.slug}
                    onClick={() => handle(cat.slug)}
                    className={`pb-2 ${active === cat.slug
                            ? "text-white border-b-2 border-indigo-500"
                            : "text-gray-400"
                        }`}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
}