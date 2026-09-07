import { useEffect, useState } from "react";

import SettingsLayout from "@/components/admin/settings/SettingsLayout";
import ProfileSettings from "@/components/admin/settings/ProfileSettings";
import SecuritySettings from "@/components/admin/settings/SecuritySettings";
import NotificationSettings from "@/components/admin/settings/NotificationSettings";

import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import { getAdminMe } from "@/lib/auth";

export default function SettingsPage() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            const jwt = localStorage.getItem("jwt");

            const data = await getAdminMe(jwt);

            setUser(data.user);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {

        const loadUser = async () => {

            try {

                const jwt = localStorage.getItem("jwt");

                const data = await getAdminMe(jwt);

                console.log("Admin response:", data);

                setUser(data.user);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        };

        loadUser();

    }, []);

    if (loading) {

        return (
            <AdminRouteGuard>
                <div className="p-8 text-gray-400 flex items-center justify-center">
                    Loading settings...
                </div>
            </AdminRouteGuard>
        );

    }

    return (
        <AdminRouteGuard>

            <SettingsLayout
                profile={<ProfileSettings user={user} />}
                security={<SecuritySettings user={user} refreshUser={loadUser} />}
                notifications={<NotificationSettings user={user} />}
            />

        </AdminRouteGuard>
    );
}