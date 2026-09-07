export default function WithdrawCard() {
    return (
        <div className="rounded-xl border border-[#23262d] bg-[#1d1d1d] p-6">

            <h3 className="text-white font-semibold">
                Withdrawable Balance
            </h3>

            <h2 className="mt-4 text-4xl font-bold text-white">
                ₹18,420
            </h2>

            <div className="mt-5 border border-[#23262d] rounded-lg p-3 text-white">
                HDFC Bank
            </div>

            <button className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium">
                Withdraw
            </button>

        </div>
    );
}