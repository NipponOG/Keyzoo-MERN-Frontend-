export default function ActiveOffersCard({ amount = 0 }) {
    return (
        <div className="rounded-xl border border-[#23262d] bg-[#1d1d1d] p-6">

            <p className="text-gray-400 text-sm">
                Active Offers
            </p>

            <h2 className="mt-3 text-4xl font-bold text-white">
                {amount}
            </h2>

            {/* <button className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium">
                View List
            </button> */}

        </div>
    );
}