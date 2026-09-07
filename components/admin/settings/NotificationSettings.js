import SectionCard from "./SectionCard";
import NotificationCategory from "./notifications/NotificationCategory";
import NotificationFeed from "./notifications/NotificationFeed";

export default function NotificationSettings() {

    return (

        <SectionCard
            title="Notifications"
            description="Choose which events you'd like to be notified about."
        >

            <div className="space-y-4">

                <NotificationCategory
                    icon="🛒"
                    title="Orders"
                    description="New orders, cancellations, refunds and delivery failures."
                    enabled={true}
                />

                <NotificationCategory
                    icon="💳"
                    title="Payments"
                    description="Payment failures, chargebacks and successful payouts."
                    enabled={true}
                />

                <NotificationCategory
                    icon="📦"
                    title="Inventory"
                    description="Low stock, out of stock and product restocks."
                    enabled={true}
                />

                <NotificationCategory
                    icon="🛡️"
                    title="Security"
                    description="Admin logins, password changes and passkey activity."
                    enabled={true}
                />

                <NotificationCategory
                    icon="⚙️"
                    title="Infrastructure"
                    description="Database alerts, server health and monitoring."
                    enabled={true}
                />

            </div>

            <NotificationFeed />

        </SectionCard>

    );

}