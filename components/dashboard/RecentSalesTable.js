export default function RecentSalesTable() {
    return (
        <div className="rounded-xl border border-[#23262d] bg-[#1d1d1d] p-6">

            <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold">
                    Recent Sales
                </h3>

                <button className="border border-[#23262d] text-white px-4 py-2 rounded-lg">
                    View All
                </button>
            </div>

            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-[#23262d]">
                        <th className="py-3 text-gray-400">Order</th>
                        <th className="py-3 text-gray-400">Product</th>
                        <th className="py-3 text-gray-400">Customer</th>
                        <th className="py-3 text-gray-400">Amount</th>
                        <th className="py-3 text-gray-400">Status</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td className="py-4 text-white">#KZ1234</td>
                        <td className="py-4 text-white">Steam Wallet</td>
                        <td className="py-4 text-white">Rahul</td>
                        <td className="py-4 text-white">₹1,499</td>
                        <td className="py-4 text-green-500">Completed</td>
                    </tr>
                </tbody>
            </table>

        </div>
    );
}