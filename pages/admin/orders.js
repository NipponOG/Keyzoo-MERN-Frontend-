// import { useEffect, useState } from "react";
// import GlassCard from "@/components/GlassCard";

// export default function AdminOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loadingId, setLoadingId] = useState(null);

//   const fetchOrders = async () => {
//     const token = localStorage.getItem("jwt");

//     if (!token) {
//       window.location.href = "/sign-in";
//     }

//     const res = await fetch("http://localhost:1337/api/orders", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await res.json();
//     setOrders(data.data || []);
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("jwt");
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!token || !user) {
//       window.location.href = "/sign-in";
//       return;
//     }

//     if (user.email !== "admin@keyzoo.in") {
//       window.location.href = "/";
//       return;
//     }

//     fetchOrders();
//   }, []);

//   // const handleSendKeys = async (orderId) => {
//   //   setLoadingId(orderId);

//   //   await fetch("/api/admin/send-keys", {
//   //     method: "POST",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //     },
//   //     body: JSON.stringify({ orderId }),
//   //   });

//   //   await fetchOrders();
//   //   setLoadingId(null);
//   // };

//   const handleSendKeys = async (orderId) => {
//     setLoadingId(orderId);

//     const token = localStorage.getItem("jwt");

//     await fetch("http://localhost:1337/api/orders/manual-send", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`, // 🔥 IMPORTANT
//       },
//       body: JSON.stringify({ orderId }),
//     });

//     await fetchOrders();
//     setLoadingId(null);
//   };

//   const stats = {
//     total: orders.length,
//     pending: orders.filter(o => o.deliveryStatus === "pending").length,
//     partial: orders.filter(o => o.deliveryStatus === "partial").length,
//     completed: orders.filter(o => o.deliveryStatus === "completed").length,
//   };

//   return (
//     <div className="flex min-h-screen bg-[#1e1e1e] text-white">

//       {/* Sidebar */}
//       {/* <aside className="w-60 bg-[#111] p-5">
//         <h2 className="text-xl font-bold mb-6">Keyzoo Admin</h2>
//         <ul className="space-y-3 text-sm">
//           <li className="text-blue-400">📦 Orders</li>
//           <li className="text-gray-400">📊 Dashboard</li>
//           <li className="text-gray-400">👤 Users</li>
//         </ul>
//       </aside> */}

//       {/* Main */}
//       <main className="flex-1 p-6">

//         <h1 className="text-2xl font-bold mb-8 flex items-center justify-center">Orders Overview</h1>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-4 gap-6 mb-6">
//           <GlassCard title="Total Orders" value={stats.total} />
//           <GlassCard title="Pending" value={stats.pending} color="text-red-400" />
//           <GlassCard title="Partial" value={stats.partial} color="text-yellow-400" />
//           <GlassCard title="Completed" value={stats.completed} color="text-green-400" />
//         </div>

//         {/* Orders */}
//         <div className="">
//           <div className="text-white flex flex-col gap-5">
//             {orders.map((order) => (
//               <div
//                 key={order.id}
//                 className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30 shadow-2xl hover:shadow-3xl"
//               >
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h2 className="font-semibold">{order.orderNumber}</h2>
//                     <p className="text-md text-white mt-1.5">{order.deliveryEmail}</p>
//                   </div>

// <span className={`px-3 py-1 text-x rounded-lg capitalize ${order.deliveryStatus === "completed"
//   ? "bg-green-500"
//   : order.deliveryStatus === "partial"
//     ? "bg-yellow-500"
//     : "bg-red-500"
//   }`}>
//   {order.deliveryStatus}
// </span>
//                 </div>

//                 {/* Progress */}
//                 <div className="mt-3">
//                   <div className="flex justify-between text-md text-white/80">
//                     <span className="mb-2.5">Keys</span>
//                     <span>
//                       {order.totalKeysAssigned || 0} / {order.totalKeysRequired || 0}
//                     </span>
//                   </div>

//                   <div className="h-2 bg-gray-700 rounded mt-1">
//                     <div
//                       className="h-2 bg-white rounded"
//                       style={{
//                         width: `${order.totalKeysRequired
//                           ? (order.totalKeysAssigned / order.totalKeysRequired) * 100
//                           : 0
//                           }%`,
//                       }}
//                     />
//                   </div>
//                 </div>

//                 {/* Button */}
//                 {order.deliveryStatus !== "completed" && (
//                   <button
//                     onClick={() => handleSendKeys(order.id)}
//                     disabled={loadingId === order.id}
//                     className="mt-4 bg-black hover:bg-black/50 px-4 py-2 rounded-lg text-sm font-semibold"
//                   >
//                     {loadingId === order.id
//                       ? "Processing..."
//                       : "Send Remaining Keys"}
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//       </main>
//     </div>
//   );
// }

// function StatCard({ title, value, color = "text-white" }) {
//   return (
//     <div className="bg-[#1e293b] p-4 rounded-xl shadow">
//       <p className="text-sm text-gray-400">{title}</p>
//       <h2 className={`text-xl font-bold ${color}`}>{value}</h2>
//     </div>
//   );
// }

// import { useEffect, useState, useRef } from "react";
// import GlassCard from "@/components/GlassCard";
// import Link from "next/link";

// const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@keyzoo.in")
//   .trim()
//   .toLowerCase();

// export default function AdminOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loadingId, setLoadingId] = useState(null);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // 🔥 NEW STATES
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("");



//   const fetchOrders = async () => {
//     const token = localStorage.getItem("jwt");

//     const params = new URLSearchParams({
//       "pagination[page]": page,
//       "pagination[pageSize]": 10,
//       "filters[orderNumber][$containsi]": search || "",
//     });

//     if (status) {
//       params.append("filters[deliveryStatus][$eq]", status.toLowerCase());
//     }

//     const res = await fetch(`http://localhost:1337/api/orders?${params.toString()}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await res.json();
//     setOrders(data.data || []);
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("jwt");
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!token || !user) {
//       window.location.href = "/sign-in";
//       return;
//     }

//     if ((user.email || "").trim().toLowerCase() !== ADMIN_EMAIL) {
//       window.location.href = "/";
//       return;
//     }

//     fetchOrders();
//   }, [page, search, status]);

//   // 🔑 SEND KEYS
//   const handleSendKeys = async (orderId) => {
//     setLoadingId(orderId);

//     const token = localStorage.getItem("jwt");

//     await fetch("http://localhost:1337/api/orders/manual-send", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ orderId }),
//     });

//     fetchOrders();
//     setLoadingId(null);
//   };

//   // 📧 RESEND EMAIL
//   const handleResend = async (orderId) => {
//     const token = localStorage.getItem("jwt");

//     await fetch("http://localhost:1337/api/orders/resend", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ orderId }),
//     });
//   };

//   // 🗑 DELETE ORDER
//   const handleDelete = async (orderId) => {
//     const token = localStorage.getItem("jwt");

//     await fetch("http://localhost:1337/api/orders/delete", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ orderId }),
//     });

//     fetchOrders();
//   };

//   const stats = {
//     total: orders.length,
//     pending: orders.filter(o => o.deliveryStatus === "pending").length,
//     partial: orders.filter(o => o.deliveryStatus === "partial").length,
//     completed: orders.filter(o => o.deliveryStatus === "completed").length,
//     manual: orders.filter(o => o.manualDeliveryRequired).length,
//   };

//   return (
//     <div className="flex min-h-screen bg-[#1e1e1e] text-white">
//       <main className="flex-1 p-6">
//         <div className="flex justify-between flex-wrap gap-4">
//           {/* 🔥 HEADER */}
//           <div className="bg-white/10 flex items-center rounded-xl px-6 py-4 mb-6">
//             <Link href="/admin/orders" className="text-2xl">
//               Orders Dashboard
//             </Link>
//           </div>

//           <div className="rounded-xl mb-6 bg-white/10">
//             <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6 flex-wrap">

//               {/* Left side */}
//               <div className="flex items-center gap-4 w-full md:w-auto">
//                 <span className="text-lg text-[#ffffff] whitespace-nowrap">
//                   Get Orders By Order Number
//                 </span>

//                 <div className="relative min-w-[400px]">
//                   <div className="min-w-[400px]">
//                     <input
//                       value={search}
//                       onChange={(e) => {
//                         setPage(1);
//                         setSearch(e.target.value);
//                       }}
//                       placeholder="Search Order Number..."
//                       className="w-full h-[50px] bg-[#2a2a2a] text-white px-4 rounded-lg outline-none focus:ring-2 focus:ring-white/20"
//                     />
//                   </div>

//                 </div>

//               </div>

//               {/* Divider */}
//               <div className="hidden md:block w-px h-8 bg-white/20" />

//               {/* Right side */}
//               <div className="flex items-center gap-3 text-sm text-[#ffffff]">
//                 <span className="text-lg mr-1">Order Finding</span>

//                 {["Completed", "Partial", "Pending", "Manual"].map((item) => (
//                   <button
//                     key={item}
//                     onClick={() => {
//                       setPage(1);
//                       setStatus(item.toLowerCase());
//                     }}
//                     className={`px-4 py-1.5 rounded-full transition ${status === item.toLowerCase()
//                       ? "bg-white text-black"
//                       : "bg-white/10 hover:bg-white/20"
//                       }`}
//                   >
//                     {item}
//                   </button>
//                 ))}

//               </div>

//             </div>
//           </div>
//         </div>
//         {/* 📊 STATS */}
//         <div className="grid grid-cols-5 gap-6 mb-6">
//           <GlassCard title="Total" value={stats.total} />
//           <GlassCard title="Pending" value={stats.pending} color="text-red-400" />
//           <GlassCard title="Partial" value={stats.partial} color="text-yellow-400" />
//           <GlassCard title="Completed" value={stats.completed} color="text-green-400" />
//           <GlassCard title="Manual Delivery Required" value={stats.manual} color="text-blue-400" />
//         </div>

//         {/* 📦 ORDERS */}
//         <div className="flex flex-col gap-5">
//           {orders.map((order) => (
//             <div key={order.id} className="bg-white/10 rounded-xl p-6">

//               <div className="flex justify-between">
//                 <div>
//                   <h2>{order.orderNumber}</h2>
//                   <p className="text-sm text-gray-300">{order.deliveryEmail}</p>
//                 </div>

//                 {order.manualDeliveryRequired && (
//                   <span className="text-orange-400 text-md font-semibold">
//                     ⚠ Needs Attention
//                   </span>
//                 )}

//                 <span className={`capitalize ${order.deliveryStatus === "completed"
//                   ? "text-green-400"
//                   : order.deliveryStatus === "partial"
//                     ? "text-yellow-400"
//                     : "text-red-400"
//                   }`}>
//                   {order.deliveryStatus}
//                 </span>
//               </div>

//               {/* Progress */}
//               <div className="mt-3">
//                 {order.totalKeysAssigned || 0} / {order.totalKeysRequired || 0}
//               </div>

//               {/* 🔥 ACTION BUTTONS */}
//               <div className="flex gap-3 mt-4 flex-wrap">

//                 {order.deliveryStatus !== "completed" && (
//                   <button onClick={() => handleSendKeys(order.id)}>
//                     Send Keys
//                   </button>
//                 )}

//                 <button onClick={() => setSelectedOrder(order)}>
//                   View Details
//                 </button>

//                 <button onClick={() => handleResend(order.id)}>
//                   Resend Email
//                 </button>

//                 <button onClick={() => handleDelete(order.id)}>
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* 📄 PAGINATION */}
//         <div className="flex justify-center gap-4 mt-6">
//           <button onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
//           <button onClick={() => setPage(p => p + 1)}>Next</button>
//         </div>

//         {/* 🔥 MODAL (ORDER DETAILS) */}
//         {
//           selectedOrder && (
//             <div className="fixed inset-0 bg-black/80 flex justify-center items-center">
//               <div className="bg-white text-black p-6 rounded-lg w-[400px]">
//                 <h2 className="font-bold mb-4">Order Details</h2>

//                 {selectedOrder.assignedKeys?.map((k, i) => (
//                   <p key={i}>{k.product} → {k.key}</p>
//                 ))}

//                 <button onClick={() => setSelectedOrder(null)}>
//                   Close
//                 </button>
//               </div>
//             </div>
//           )
//         }

//       </main >
//     </div >
//   );
// }








import { useEffect, useState } from "react";
import GlassCard from "@/components/GlassCard";

import { FaSearch } from "react-icons/fa";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";


import Link from "next/link";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showSearch, setShowSearch] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchOrders = async () => {
    const token = localStorage.getItem("jwt");

    const params = new URLSearchParams({
      "pagination[page]": page,
      "pagination[pageSize]": 10,
      "filters[orderNumber][$containsi]": search || "",
    });

    if (status === "manual") {
      params.append("filters[manualDeliveryRequired][$eq]", true);
    } else if (status) {
      params.append("filters[deliveryStatus][$eq]", status);
    }

    const res = await fetch(
      `http://localhost:1337/api/orders?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setOrders(data.data || []);
    setTotalPages(data.meta?.pagination?.pageCount || 1);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      window.location.href = "/sign-in";
      return;
    }

    fetchOrders();
  }, [page, search, status]);

  const handleSendKeys = async (orderId) => {
    setLoadingId(orderId);
    const token = localStorage.getItem("jwt");

    await fetch("http://localhost:1337/api/orders/manual-send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId }),
    });

    fetchOrders();
    setLoadingId(null);
  };

  const handleResend = async (orderId) => {
    const token = localStorage.getItem("jwt");

    await fetch("http://localhost:1337/api/orders/resend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId }),
    });
  };

  const handleDelete = async (orderId) => {
    const token = localStorage.getItem("jwt");

    await fetch("http://localhost:1337/api/orders/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId }),
    });

    fetchOrders();
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.deliveryStatus === "pending").length,
    partial: orders.filter(o => o.deliveryStatus === "partial").length,
    completed: orders.filter(o => o.deliveryStatus === "completed").length,
    manual: orders.filter(o => o.manualDeliveryRequired).length,
  };

  const getPages = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - 1 && i <= page + 1)
      ) {
        pages.push(i);
      } else if (
        i === page - 2 ||
        i === page + 2
      ) {
        pages.push("...");
      }
    }

    return [...new Set(pages)];
  };

  return (
    <div className="flex min-h-screen bg-[#1e1e1e] text-white">
      <main className="flex-1 p-3 sm:p-4 md:p-6">

        {/* HEADER + SEARCH */} {/* and this is work for large screens */}
        <div className="bg-white/10 rounded-xl px-4 py-3 flex items-center gap-4 relative overflow-hidden">

          {/* LEFT (fixed) */}
          <Link href="/admin/orders" className="text-lg sm:text-xl shrink-0">
            Orders Dashboard
          </Link>

          {/* RIGHT (flexible) */}
          <div className="flex items-center gap-2 flex-1 justify-end">

            {/* SEARCH */}
            <div className={`hidden lg:flex items-center gap-2 transition-all duration-300 ease-in-out ${showSearch ? "flex-1 opacity-100" : "w-0 opacity-0 overflow-hidden"}`}>
              <input
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                placeholder="Search..."
                className="flex-1 h-[38px] bg-[#2a2a2a] px-3 rounded-lg outline-none text-sm"
              />

              {/* FILTERS */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {["completed", "partial", "pending", "manual"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setPage(1);
                      setStatus(item);
                    }}
                    className={`px-3 py-1 rounded text-xs whitespace-nowrap ${status === item
                      ? "bg-white text-black"
                      : "bg-white/10"
                      }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

            </div>

            {/* TOGGLE */}
            <button
              onClick={() => setShowSearch(prev => !prev)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition shrink-0"
            >
              <FaSearch />
            </button>

          </div>

        </div>

        {/* this block work on small screens after tap search icon */}
        {/* MOBILE SEARCH (ONLY < lg) */}
        {showSearch && (
          <div className="lg:hidden bg-white/10 rounded-xl p-4 flex flex-col gap-3 mt-3">

            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search Order Number..."
              className="w-full h-[45px] bg-[#2a2a2a] px-4 rounded-lg outline-none"
            />

            <div className="flex flex-wrap gap-2">
              {["completed", "partial", "pending", "manual"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setPage(1);
                    setStatus(item);
                  }}
                  className={`px-3 py-1 rounded-full text-xs ${status === item
                    ? "bg-white text-black"
                    : "bg-white/10"
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>

          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6 mb-6">
          <GlassCard title="Total" value={stats.total} />
          <GlassCard title="Pending" value={stats.pending} />
          <GlassCard title="Partial" value={stats.partial} />
          <GlassCard title="Completed" value={stats.completed} />
          <GlassCard title="Manual" value={stats.manual} />
        </div>

        {/* ORDERS */}
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white/10 rounded-xl p-4 sm:p-6">

              <div className="flex flex-col md:flex-row md:justify-between gap-3">

                <div>
                  <h2 className="text-sm sm:text-base font-semibold">
                    {order.orderNumber}
                  </h2>
                  <p className="text-md sm:text-sm text-gray-300 break-all">
                    {order.deliveryEmail}
                  </p>
                </div>

                <div className="flex flex-wrap gap-5 items-center">
                  {order.manualDeliveryRequired && (
                    <span className="text-orange-400 text-md font-semibold">
                      ⚠ Needs Attention
                    </span>
                  )}

                  <span className={`py-1 px-2 rounded text-md capitalize ${order.deliveryStatus === "completed" ? "bg-green-500" : order.deliveryStatus === "partial" ? "bg-yellow-500" : "bg-red-500"}`}>
                    {order.deliveryStatus}
                  </span>
                </div>

              </div>

              <div className="mt-3 text-sm">
                {order.totalKeysAssigned || 0} / {order.totalKeysRequired || 0}
              </div>

              <div className="flex flex-wrap gap-2.5 mt-4 text-sm">

                {order.deliveryStatus !== "completed" && (
                  <button
                    onClick={() => handleSendKeys(order.id)}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                  >
                    Send Keys
                  </button>
                )}

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Details
                </button>

                <button
                  onClick={() => handleResend(order.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
                >
                  Resend
                </button>

                <button
                  onClick={() => handleDelete(order.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">

          {/* PREV */}
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-1.5 py-1.5 rounded bg-white/10 disabled:opacity-40"
          >
            {/* {"<"} */}
            <MdOutlineKeyboardArrowLeft className="text-2xl" />
          </button>

          {/* PAGE NUMBERS */}
          {getPages().map((p, i) => (
            <button
              key={i}
              onClick={() => typeof p === "number" && setPage(p)}
              disabled={p === "..."}
              className={`px-3 py-1 rounded ${page === p
                ? "bg-white text-black"
                : "bg-white/10"
                } ${p === "..." ? "cursor-default" : ""}`}
            >
              {p}
            </button>
          ))}

          {/* NEXT */}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-1.5 py-1.5 rounded bg-white/10 disabled:opacity-40"
          >
            {/* {">"} */}
            <MdOutlineKeyboardArrowRight className="text-2xl" />
          </button>

        </div>

        {/* MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white text-black p-4 sm:p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
              <h2 className="font-bold mb-4">Order Details</h2>

              {selectedOrder.assignedKeys?.map((k, i) => (
                <p key={i}>{k.product} → {k.key}</p>
              ))}

              <button onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}