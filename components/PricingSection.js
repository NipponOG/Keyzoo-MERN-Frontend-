// "use client";

// import { useState } from "react";

// const plans = [
//     {
//         name: "Basic plan",
//         price: "$10/mth",
//         features: [
//             "Access to all basic features",
//             "Basic reporting and analytics",
//             "Up to 10 individual users",
//             "20 GB individual data",
//             "Basic chat and email support",
//         ],
//     },
//     {
//         name: "Business plan",
//         price: "$20/mth",
//         features: [
//             "200+ integrations",
//             "Advanced reporting and analytics",
//             "Up to 20 individual users",
//             "40 GB individual data",
//             "Priority chat and email support",
//         ],
//     },
//     {
//         name: "Enterprise plan",
//         price: "$40/mth",
//         features: [
//             "Advanced custom fields",
//             "Audit log and data history",
//             "Unlimited individual users",
//             "Unlimited individual data",
//             "Personalized + priority service",
//         ],
//     },
// ];

// export default function PricingSection() {
//     const [annual, setAnnual] = useState(false);

//     return (
//         <section className="w-full py-20 relative overflow-hidden">
//             {/* Background Gradient Shape */}
//             {/* Background Layers */}
//             <div className="absolute inset-0 overflow-hidden pointer-events-none">
//                 {/* Layer 1 */}
//                 <div className="absolute w-[120%] h-[220px] bg-gradient-to-r from-purple-300 to-indigo-400 opacity-40 rotate-[-8deg] top-[45%] left-[-10%] rounded-full"></div>

//                 {/* Layer 2 */}
//                 <div className="absolute w-[120%] h-[180px] bg-gradient-to-r from-purple-400 to-indigo-500 opacity-30 rotate-[-8deg] top-[55%] left-[-10%] rounded-full"></div>

//                 {/* Layer 3 (lightest) */}
//                 <div className="absolute w-[120%] h-[140px] bg-gradient-to-r from-purple-200 to-indigo-300 opacity-20 rotate-[-8deg] top-[65%] left-[-10%] rounded-full"></div>
//             </div>

//             <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
//                 {/* Header */}
//                 <span className="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
//                     Pricing plans
//                 </span>

//                 <h2 className="text-4xl font-bold mt-4 text-gray-800">
//                     Plans for all sizes
//                 </h2>

//                 <p className="text-gray-500 mt-3">
//                     Simple, transparent pricing that grows with you. Try any plan free for
//                     30 days.
//                 </p>

//                 {/* Toggle */}
//                 <div className="flex items-center justify-center gap-3 mt-6">
//                     <button
//                         onClick={() => setAnnual(!annual)}
//                         className={`w-12 h-6 flex items-center rounded-full p-1 transition ${annual ? "bg-purple-600" : "bg-gray-300"
//                             }`}
//                     >
//                         <div
//                             className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${annual ? "translate-x-6" : ""
//                                 }`}
//                         />
//                     </button>
//                     <span className="text-sm text-gray-500">
//                         Annual pricing (save 20%)
//                     </span>
//                 </div>

//                 {/* Cards */}
//                 <div className="grid md:grid-cols-3 gap-6 mt-12">
//                     {plans.map((plan, idx) => (
//                         <div
//                             key={idx}
//                             className="bg-white rounded-2xl shadow-md p-6 text-left flex flex-col justify-between"
//                         >
//                             <div>
//                                 <h3 className="text-purple-600 font-semibold text-center">
//                                     {plan.name}
//                                 </h3>

//                                 <p className="text-4xl font-bold text-center mt-2">
//                                     {plan.price}
//                                 </p>

//                                 <p className="text-gray-400 text-sm text-center mt-1">
//                                     Billed annually.
//                                 </p>

//                                 <ul className="mt-6 space-y-3">
//                                     {plan.features.map((feature, i) => (
//                                         <li key={i} className="flex items-start gap-2 text-gray-600">
//                                             <span className="text-purple-600">✔</span>
//                                             {feature}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>

//                             <button className="mt-6 w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition">
//                                 Get started
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }




// "use client";

import { useState } from "react";

const plans = [
    {
        name: "Basic plan",
        price: "$10/mth",
        features: [
            "Access to all basic features",
            "Basic reporting and analytics",
            "Up to 10 individual users",
            "20 GB individual data",
            "Basic chat and email support",
        ],
    },
    {
        name: "Business plan",
        price: "$20/mth",
        features: [
            "200+ integrations",
            "Advanced reporting and analytics",
            "Up to 20 individual users",
            "40 GB individual data",
            "Priority chat and email support",
        ],
        featured: true,
    },
    {
        name: "Enterprise plan",
        price: "$40/mth",
        features: [
            "Advanced custom fields",
            "Audit log and data history",
            "Unlimited individual users",
            "Unlimited individual data",
            "Personalized + priority service",
        ],
    },
];

export default function PricingSection() {
    const [annual, setAnnual] = useState(false);

    return (
        <section className="relative py-24 bg-[#f9f7fd] overflow-hidden">

            {/* 🎯 Exact Diagonal Background Bands */}  {/* 🔥 Advanced Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Base background */}
                <div className="absolute inset-0 bg-[#f9f7fd]" />

                {/* Diagonal band container */}
                <div className="absolute inset-0 flex items-center justify-center">

                    <div className="absolute w-[140%] h-[120px] bg-gradient-to-r from-purple-500 to-indigo-500 rotate-[-8deg] translate-y-10 opacity-80"></div>

                    <div className="absolute w-[140%] h-[140px] bg-gradient-to-r from-purple-300 to-indigo-400 rotate-[-8deg] translate-y-28 opacity-70"></div>

                    <div className="absolute w-[140%] h-[160px] bg-gradient-to-r from-purple-200 to-indigo-300 rotate-[-8deg] translate-y-48 opacity-80"></div>

                </div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                {/* Header */}
                <span className="inline-block text-sm font-medium text-white bg-[#6d3cff] px-3 py-1 rounded">
                    Pricing plans
                </span>

                <h2 className="text-5xl font-semibold mt-6 text-gray-900 tracking-tight">
                    Plans for all sizes
                </h2>

                <p className="text-gray-500 mt-4 text-lg">
                    Simple, transparent pricing that grows with you. Try any plan free for
                    30 days.
                </p>

                {/* Toggle */}
                <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                        onClick={() => setAnnual(!annual)}
                        className={`w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${annual ? "bg-[#6d3cff]" : "bg-gray-300"
                            }`}
                    >
                        <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-all duration-300 ${annual ? "translate-x-7" : ""
                                }`}
                        />
                    </button>
                    <span className="text-sm text-gray-600">
                        Annual pricing (save 20%)
                    </span>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-8 mt-16">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`relative bg-white rounded-2xl border p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${plan.featured
                                ? "border-purple-500 shadow-lg scale-105"
                                : "border-gray-200"
                                }`}
                        >
                            {/* Badge */}
                            {plan.featured && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6c3dff] text-white text-xs px-3 py-1 rounded shadow">
                                    Most popular
                                </span>
                            )}

                            <div>
                                <div className="flex items-center justify-center ">
                                    <h3 className="text-white rounded font-semibold text-center px-3 py-1 bg-[#6d3cff]">
                                        {plan.name}
                                    </h3>
                                </div>

                                <p className="text-5xl font-semibold text-center mt-4 text-gray-900">
                                    {plan.price}
                                </p>

                                <p className="text-gray-400 text-sm text-center mt-2">
                                    Billed annually.
                                </p>

                                <ul className="mt-8 space-y-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-600">
                                            <span className="text-purple-600 mt-1">✔</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 🔥 Premium Button */}
                            <button className="mt-8 w-full py-3 rounded-lg font-medium text-white 
                bg-gradient-to-r from-[#6d3cff] to-indigo-500 
                shadow-md hover:shadow-lg 
                hover:from-[#6d3cff] hover:to-indigo-600
                transition-all duration-300">
                                Get started
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}