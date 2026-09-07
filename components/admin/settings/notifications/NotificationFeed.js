import { useState } from "react";
import NotificationItem from "./NotificationItem";
import NotificationFilters from "./NotificationFilters";

export default function NotificationFeed() {

    const [filter, setFilter] = useState("All");

    const notifications = [
        {
            id: 1,
            type: "info",
            title: "New Order",
            message: "Order #KZ-10281 has been placed.",
            time: "2 minutes ago",
            unread: true,
        },
        {
            id: 2,
            type: "success",
            title: "Passkey Registered",
            message: "Windows Hello was successfully added.",
            time: "1 hour ago",
            unread: true,
        },
        {
            id: 3,
            type: "warning",
            title: "Low Stock",
            message: "Steam Wallet ₹500 has only 3 keys remaining.",
            time: "Yesterday",
            unread: false,
        },
        {
            id: 4,
            type: "danger",
            title: "Database Alert",
            message: "Aiven database storage exceeded 90%.",
            time: "2 days ago",
            unread: false,
        },
    ];

    const filteredNotifications = notifications.filter((n) => {

        if (filter === "All") return true;

        if (filter === "Unread") return n.unread;

        return n.category === filter;

    });

    return (
        <div className="mt-8">

            <div className="
mb-5
flex
flex-col
gap-4

sm:flex-row
sm:items-center
sm:justify-between
">

                <div>

                    <h3 className="text-lg font-semibold text-white">
                        Recent Notifications
                    </h3>

                    <p className="text-sm text-gray-400">
                        Latest events from your store and infrastructure.
                    </p>

                </div>

                <button
                    className="
                        rounded-lg
                        border
                        border-white/10
                        px-4
                        py-2
                        text-sm
                        text-gray-300
                        transition
                        hover:bg-white/5
                    "
                >
                    Mark all as read
                </button>

            </div>

            <NotificationFilters
                active={filter}
                onChange={setFilter}
            />

            <div className="mb-5">

                <input
                placeholder="Search here..."
                    className="
        w-full
        rounded-xl
        border
        border-white/10
        bg-[#181818]
        px-4
        py-3
        text-sm
        text-white

        sm:text-base
    "
                />

            </div>

            <div className="space-y-3">

                {filteredNotifications.map((notification) => (

                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                    />

                ))}



            </div>

        </div>
    );

}