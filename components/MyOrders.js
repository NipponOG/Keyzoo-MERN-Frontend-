import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function MyOrders() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All Orders");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const fetchUser = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token || !user?.id) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}api/my-orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <p className="text-center text-white mt-10">Loading orders...</p>;

  return (
    <div className="min-h-screen text-white px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-center md:text-left">My Orders</h1>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by product title"
              className="bg-neutral-900 text-white pl-10 pr-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>

          {/* Sort Dropdown */}
          <button className="bg-neutral-900 px-4 py-2 rounded-md flex items-center justify-between text-sm">
            Order Date <ChevronDown className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center md:justify-start">
        {["All Orders", "Successful Orders", "Unsuccessful & Refunded Orders", "Pending Orders"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-md font-medium text-sm ${
              filter === tab ? "bg-white text-black" : "bg-neutral-900 text-gray-300 hover:bg-neutral-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-6">
        {orders.length === 0 ? (
          <p className="text-gray-400 flex items-center justify-center h-[50vh]">
            No orders found.
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#1a1a1a] rounded-xl border border-gray-700 p-4 sm:p-6 text-white space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="grid grid-cols-2 sm:flex sm:space-x-8 text-sm text-gray-300 w-full sm:w-auto">
                  <p>
                    <span className="block text-xs text-gray-400">Order Placed</span>
                    <span className="font-semibold text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </p>
                  <p>
                    <span className="block text-xs text-gray-400">Amount</span>
                    <span className="font-semibold text-white">
                      {order.currency} {order.totalAmount}
                    </span>
                  </p>
                  <p>
                    <span className="block text-xs text-gray-400">Order ID</span>
                    <span className="font-semibold text-white break-all">{order.orderNumber}</span>
                  </p>
                </div>

                {/* Status + Button */}
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-lg uppercase ${
                      order.deliveryStatus === "completed" || order.deliveryStatus === "delivered"
                        ? "bg-[#01b40133] text-[#01b401]"
                        : order.deliveryStatus === "pending"
                        ? "bg-[#b4010133] text-[#ff5a5a]"
                        : "bg-[#80808033] text-gray-400"
                    }`}
                  >
                    {order.deliveryStatus}
                  </span>
                  <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-md text-[#808080] bg-[#80808033] hover:bg-[#80808055] transition">
                    View Order Details
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-700"></div>

              {/* Product(s) */}
              <div className="flex flex-col gap-4">
                {order.cartSnapshot?.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex flex-col sm:flex-row sm:items-center sm:gap-6 rounded-md"
                  >
                    <div className="flex justify-center sm:justify-start">
                      <Image
                        src={item.image}
                        alt={item.title}
                        height={160}
                        width={120}
                        className="rounded-lg object-cover"
                      />
                    </div>

                    <div className="flex flex-col mt-3 sm:mt-0 space-y-2">
                      <h3 className="font-semibold text-sm sm:text-base text-white">{item.title}</h3>
                      <p className="text-blue-400 text-xs sm:text-sm font-medium uppercase">
                        {item.region}
                      </p>

                      {/* Keys */}
                      {order.assignedKeys?.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {order.assignedKeys
                            ?.filter((k) => k.product === item.title)
                            .map((k, idx) => (
                              <div
                                key={idx}
                                className="bg-neutral-800 border border-gray-700 px-3 py-2 rounded-md text-xs sm:text-sm font-mono text-green-400 break-all"
                              >
                                {k.key}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
