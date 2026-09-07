import {
    ShoppingBag,
    Shield,
    Database,
    TriangleAlert,
    CircleCheck,
} from "lucide-react";

const icons = {
    info: ShoppingBag,
    success: CircleCheck,
    warning: TriangleAlert,
    danger: Database,
};

const colors = {
    info: "text-blue-400 bg-blue-500/10",
    success: "text-green-400 bg-green-500/10",
    warning: "text-yellow-400 bg-yellow-500/10",
    danger: "text-red-400 bg-red-500/10",
};

export default function NotificationItem({ notification }) {

    const Icon = icons[notification.type];

    return (

        <div
            className="
                flex
                items-start
                gap-4
                rounded-2xl
                border
                border-white/10
                bg-[#181818]
                p-5
                transition
                hover:border-white/20
            "
        >

            <div
                className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    ${colors[notification.type]}
                `}
            >
                <Icon size={20} />
            </div>

            <div className="flex-1">

                <div className="flex items-center gap-2">

                    <h4 className="font-medium text-white">
                        {notification.title}
                    </h4>

                    {notification.unread && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                    )}

                </div>

                <p className="mt-1 text-sm text-gray-400">
                    {notification.message}
                </p>

                <p className="mt-3 text-xs text-gray-500">
                    {notification.time}
                </p>

            </div>

        </div>

    );

}