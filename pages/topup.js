import { useState, useEffect } from "react";
import Image from "next/image";

export default function TopupPage() {

    const [preview, setPreview] = useState(null);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);

    const [phone, setPhone] = useState("");
    const [country, setCountry] = useState("IN");
    const [operator, setOperator] = useState(null);

    const [selectedPlan, setSelectedPlan] = useState(null);

    const [countries, setCountries] = useState([]);
    const [operators, setOperators] = useState([]);
    const [plans, setPlans] = useState([]);

    const [loadingOperators, setLoadingOperators] = useState(false);
    const [loadingPlans, setLoadingPlans] = useState(false);

    useEffect(() => {
        if (!window.Cashfree) {
            const script = document.createElement("script");
            script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    useEffect(() => {
        async function getCountries() {
            try {
                const res = await fetch("/api/reloadly/countries");
                const data = await res.json();

                setCountries(data);
            } catch (err) {
                console.error(err);
            }
        }

        getCountries();
    }, []);

    useEffect(() => {
        if (!country) return;

        async function loadOperators() {

            try {

                setLoadingOperators(true);

                setOperator(null);
                setPlans([]);
                setSelectedPlan(null);

                const res = await fetch(
                    `/api/reloadly/operators?country=${country}`
                );

                const data = await res.json();

                setOperators(data);

            } catch (err) {

                console.error(err);

            } finally {

                setLoadingOperators(false);

            }
        }

        loadOperators();

    }, [country]);

    useEffect(() => {

        if (!operator?.id) return;

        async function loadPlans() {

            try {

                setLoadingPlans(true);

                setSelectedPlan(null);

                const res = await fetch(
                    `/api/reloadly/plans?operatorId=${operator.id}`
                );

                const data = await res.json();

                setPlans(data.plans || []);

            } catch (err) {

                console.error(err);

            } finally {

                setLoadingPlans(false);

            }
        }

        loadPlans();

    }, [operator]);

    async function handlePreview() {

        if (!operator || !selectedPlan) {
            return;
        }

        try {

            setPreviewLoading(true);

            const response = await fetch(
                "/api/reloadly/preview",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        phone,
                        country,
                        operatorId: operator.id,
                        operatorName: operator.name,
                        amount: selectedPlan.amount,
                    }),
                }
            );

            const data = await response.json();

            setPreview(data);

            setCheckoutOpen(true);

        } catch (error) {

            console.error(error);

        } finally {

            setPreviewLoading(false);

        }
    }

    async function handlePayment() {

        try {

            const response = await fetch(
                "/api/payment/cashfree/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: selectedPlan.amount,
                        phone,
                        country,
                        operatorId: operator.id,
                        operatorName: operator.name,
                    }),
                }
            );

            const data = await response.json();

            if (!data.payment_session_id) {
                alert("Unable to initialize payment");
                return;
            }

            const cashfree =
                new window.Cashfree({
                    mode: "sandbox",
                });

            await cashfree.checkout({
                paymentSessionId: data.payment_session_id,
                redirectTarget: "_self",
            });

        } catch (error) {

            console.error(error);
        }
    }

    return (
        <div className="min-h-screen bg-[#0f1115] text-white">

            {/* HERO */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />

                <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">

                        {/* LEFT */}
                        <div>
                            <span className="inline-flex items-center rounded-full bg-blue-500/10 text-blue-400 px-4 py-2 text-sm font-medium border border-blue-500/20">
                                Global Mobile Recharge
                            </span>

                            <h1 className="text-4xl md:text-6xl font-bold mt-6 leading-tight">
                                Recharge Mobile
                                <span className="text-blue-500"> Worldwide</span>
                            </h1>

                            <p className="mt-5 text-lg text-zinc-400 max-w-xl">
                                Instantly recharge prepaid mobile numbers in
                                150+ countries with secure payments and
                                instant delivery.
                            </p>

                            <div className="flex flex-wrap gap-3 mt-8">
                                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                                    ⚡ Instant Delivery
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                                    🌍 150+ Countries
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                                    🔒 Secure Checkout
                                </div>
                            </div>
                        </div>

                        {/* RIGHT CARD */}
                        <div>
                            <div className="
bg-[#181b22]
border border-white/10
rounded-3xl
p-6 md:p-8
shadow-2xl
backdrop-blur-xl
">
                                <div className="mb-4 text-sm text-green-400">
                                    ✓ Supports 150+ Countries
                                </div>

                                <h2 className="text-2xl font-bold mb-6">
                                    Quick Recharge
                                </h2>

                                <div className="space-y-5">

                                    {/* Country */}
                                    <div>
                                        <label className="text-sm text-zinc-400 block mb-2">
                                            Country
                                        </label>

                                        <select
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            className="w-full h-14 bg-[#242833] rounded-xl px-4 outline-none"
                                        >
                                            {countries.map((item) => (
                                                <option
                                                    key={item.isoName}
                                                    value={item.isoName}
                                                >
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="text-sm text-zinc-400 block mb-2">
                                            Mobile Number
                                        </label>

                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+91 9876543210"
                                            className="w-full h-14 bg-[#242833] rounded-xl px-4 outline-none"
                                        />

                                        {operator && (
                                            <div className="rounded-xl mt-4 border border-blue-500/30 bg-blue-500/10 p-4">
                                                <p className="text-sm text-blue-400">
                                                    Selected Operator
                                                </p>

                                                <p className="font-semibold">
                                                    {operator.name}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm text-zinc-400 block mb-2">
                                            Operator
                                        </label>

                                        <select
                                            disabled={loadingOperators}
                                            value={operator?.id || ""}
                                            onChange={(e) => {
                                                const selected = operators.find(
                                                    op => op.id === Number(e.target.value)
                                                );

                                                setOperator(selected);
                                            }}
                                            className="w-full h-14 bg-[#242833] rounded-xl px-4"
                                        >
                                            <option value="">
                                                {loadingOperators
                                                    ? "Loading operators..."
                                                    : "Select Operator"}
                                            </option>

                                            {operators.map((op) => (
                                                <option key={op.id} value={op.id}>
                                                    {op.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* <button
                                        disabled={!country || !operator}
                                        className="w-full h-14 rounded-xl bg-blue-600"
                                    >
                                        Load Plans
                                    </button> */}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {loadingPlans && (
                <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="
                        h-40
                        rounded-2xl
                        bg-[#181b22]
                        animate-pulse
                    "
                            />
                        ))}

                    </div>
                </section>
            )}

            {!loadingPlans && operator && plans.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">

                    <h2 className="text-2xl font-bold mb-2">
                        Popular Recharge Plans
                    </h2>

                    <p className="text-zinc-400 mb-6">
                        Example plans. Actual plans will appear after entering a phone number.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

                        {plans.map((plan) => (
                            <button
                                key={plan.amount}
                                onClick={() => setSelectedPlan(plan)}
                                className={`
        bg-[#181b22]
        border
        rounded-2xl
        p-6
        text-left

        ${selectedPlan?.amount === plan.amount
                                        ? "border-blue-500"
                                        : "border-white/10"
                                    }
      `}
                            >
                                <div className="text-2xl font-bold">
                                    ₹{plan.amount}
                                </div>

                                <div className="text-zinc-400 text-sm mt-3">
                                    {plan.description}
                                </div>
                            </button>
                        ))}

                    </div>

                </section>
            )}

            {selectedPlan && (
                <section className="max-w-7xl mx-auto px-4 md:px-6 pb-12">

                    <div className="bg-[#181b22] border border-white/10 rounded-2xl p-6">

                        <h3 className="text-xl font-bold mb-4">
                            Recharge Summary
                        </h3>

                        <div className="space-y-3 text-zinc-300">

                            <div>
                                <span className="text-zinc-500">
                                    Phone:
                                </span>{" "}
                                {phone}
                            </div>

                            <div>
                                <span className="text-zinc-500">
                                    Country:
                                </span>{" "}
                                {country}
                            </div>

                            <div>
                                <span className="text-zinc-500">
                                    Operator:
                                </span>{" "}
                                {operator?.name}
                            </div>

                            <div>
                                <span className="text-zinc-500">
                                    Amount:
                                </span>{" "}
                                ₹{selectedPlan.amount}
                            </div>

                        </div>

                        <button
                            disabled={!phone || phone.replace(/\D/g, "").length < 8}
                            onClick={handlePreview}
                            className={`
    mt-6
    h-12
    px-6
    rounded-xl
    transition

    ${!phone || phone.length < 8
                                    ? "bg-zinc-700 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }
  `}
                        >
                            {previewLoading
                                ? "Preparing..."
                                : "Continue To Checkout"}
                        </button>


                    </div>

                </section>
            )}

            {/* TOPUP CATEGORIES */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
                <h2 className="text-2xl font-bold mb-6">
                    Explore Services
                </h2>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                    <div className="bg-[#181b22] rounded-2xl p-6 border border-white/10">
                        <div className="text-4xl mb-4">📱</div>
                        <h3 className="font-semibold">Mobile Topups</h3>
                        <p className="text-zinc-400 text-sm mt-2">
                            Instant airtime recharge worldwide
                        </p>
                    </div>

                    <div className="bg-[#181b22] rounded-2xl p-6 border border-white/10">
                        <div className="text-4xl mb-4">🌐</div>
                        <h3 className="font-semibold">Data Bundles</h3>
                        <p className="text-zinc-400 text-sm mt-2">
                            Buy mobile internet packages
                        </p>
                    </div>

                    <div className="bg-[#181b22] rounded-2xl p-6 border border-white/10">
                        <div className="text-4xl mb-4">🎮</div>
                        <h3 className="font-semibold">Gaming Topups</h3>
                        <p className="text-zinc-400 text-sm mt-2">
                            Steam, PSN, Xbox and more
                        </p>
                    </div>

                    <div className="bg-[#181b22] rounded-2xl p-6 border border-white/10">
                        <div className="text-4xl mb-4">📶</div>
                        <h3 className="font-semibold">eSIM</h3>
                        <p className="text-zinc-400 text-sm mt-2">
                            Travel connectivity worldwide
                        </p>
                    </div>

                </div>
            </section>

            {/* POPULAR COUNTRIES */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">

                <h2 className="text-2xl font-bold mb-6">
                    Popular Countries
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">

                    {[
                        "India",
                        "United States",
                        "United Kingdom",
                        "Germany",
                        "France",
                        "Poland",
                    ].map((country) => (
                        <button
                            key={country}
                            className="bg-[#181b22] border border-white/10 rounded-xl p-4 hover:border-blue-500 transition"
                        >
                            {country}
                        </button>
                    ))}

                </div>
            </section>

            {/*  */}

            <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

                    <div className="text-center">
                        <h3 className="text-4xl font-bold text-blue-500">150+</h3>
                        <p className="text-zinc-400 mt-2">
                            Countries Supported
                        </p>
                    </div>

                    <div className="text-center">
                        <h3 className="text-4xl font-bold text-blue-500">500+</h3>
                        <p className="text-zinc-400 mt-2">
                            Mobile Operators
                        </p>
                    </div>

                    <div className="text-center">
                        <h3 className="text-4xl font-bold text-blue-500">1M+</h3>
                        <p className="text-zinc-400 mt-2">
                            Recharges Delivered
                        </p>
                    </div>

                    <div className="text-center">
                        <h3 className="text-4xl font-bold text-blue-500">99.9%</h3>
                        <p className="text-zinc-400 mt-2">
                            Success Rate
                        </p>
                    </div>

                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <div className="bg-[#181b22] rounded-2xl p-6 border border-white/10">
                        <div className="text-4xl mb-4">⚡</div>

                        <h3 className="font-semibold text-lg">
                            Instant Recharge
                        </h3>

                        <p className="text-zinc-400 text-sm mt-2">
                            Most recharges are delivered within seconds.
                        </p>
                    </div>

                    <div className="bg-[#181b22] rounded-2xl p-6 border border-white/10">
                        <div className="text-4xl mb-4">🌎</div>

                        <h3 className="font-semibold text-lg">
                            Global Coverage
                        </h3>

                        <p className="text-zinc-400 text-sm mt-2">
                            Support for operators in over 150 countries.
                        </p>
                    </div>

                    <div className="bg-[#181b22] rounded-2xl p-6 border border-white/10">
                        <div className="text-4xl mb-4">🔒</div>

                        <h3 className="font-semibold text-lg">
                            Secure Payments
                        </h3>

                        <p className="text-zinc-400 text-sm mt-2">
                            Protected transactions and trusted checkout.
                        </p>
                    </div>

                    <div className="bg-[#181b22] rounded-2xl p-6 border border-white/10">
                        <div className="text-4xl mb-4">💬</div>

                        <h3 className="font-semibold text-lg">
                            24/7 Support
                        </h3>

                        <p className="text-zinc-400 text-sm mt-2">
                            Our support team is available around the clock.
                        </p>
                    </div>

                </div>
            </section>

            {checkoutOpen && preview && (
                <>
                    {/* Overlay */}
                    <div
                        className="
fixed
inset-0
bg-black/80
backdrop-blur-sm
z-50
"
                        onClick={() => setCheckoutOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="
            fixed
            right-0
            top-0
            h-full
            w-full
            sm:w-[500px]
            bg-[#111418]
            border-l border-white/10
            z-50
            p-6
            overflow-y-auto
        ">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">
                                Checkout
                            </h2>

                            <button
                                onClick={() => setCheckoutOpen(false)}
                                className="text-zinc-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">

                            <div className="bg-[#181b22] rounded-xl p-4">
                                <p className="text-zinc-400 text-sm">
                                    Mobile Number
                                </p>

                                <p className="font-semibold mt-1">
                                    {preview.phone}
                                </p>
                            </div>

                            <div className="bg-[#181b22] rounded-xl p-4">
                                <p className="text-zinc-400 text-sm">
                                    Operator
                                </p>

                                <p className="font-semibold mt-1">
                                    {preview.operatorName}
                                </p>
                            </div>

                            <div className="bg-[#181b22] rounded-xl p-4">
                                <p className="text-zinc-400 text-sm">
                                    Country
                                </p>

                                <p className="font-semibold mt-1">
                                    {preview.country}
                                </p>
                            </div>

                            <div className="bg-[#181b22] rounded-xl p-4">
                                <p className="text-zinc-400 text-sm">
                                    Recharge Amount
                                </p>

                                <p className="text-2xl font-bold mt-1">
                                    ₹{preview.amount}
                                </p>
                            </div>

                            <div className="bg-[#181b22] rounded-xl p-4">
                                <p className="text-zinc-400 text-sm">
                                    Plan Details
                                </p>

                                <p className="mt-2 text-sm leading-relaxed">
                                    {selectedPlan?.description || "Recharge plan"}
                                </p>
                            </div>

                            <div className="bg-[#181b22] rounded-xl p-4">
                                <p className="text-zinc-400 text-sm mb-3">
                                    Payment Method
                                </p>

                                <div
                                    className="
            rounded-xl
            border
            border-blue-500/20
            bg-blue-500/5
            p-4
        "
                                >
                                    Cashfree
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                className="
        w-full
        h-14
        rounded-xl
        bg-blue-600
        hover:bg-blue-700
        font-semibold
        mt-6
    "
                            >
                                Proceed To Payment
                            </button>



                        </div>
                    </div>
                </>
            )}

        </div>
    );
}