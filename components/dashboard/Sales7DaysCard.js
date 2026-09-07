import { formatCurrency } from "@/lib/formatCurrency";

export default function SalesTodayCard({ amount = 0 }) {
    return (
        <div className="rounded-xl border border-[#23262d] bg-[#1d1d1d] p-6">
            <p className="text-gray-400 text-sm">
                Past Seven Days Sales
            </p>

            <h2 className="mt-3 text-4xl font-bold text-white">
                ₹ {formatCurrency(amount)}
            </h2>
        </div>
    );
}