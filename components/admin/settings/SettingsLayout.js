import { useState } from "react";

import SettingsSidebar from "./SettingsSidebar";

export default function SettingsLayout({
    profile,
    security,
    notifications,
}) {
    const [active, setActive] = useState("security");

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

            <div className="mb-10">

                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                    Settings
                </h1>

                <p className="mt-2 text-sm text-gray-400 sm:text-base">
                    Manage your account, security and preferences.
                </p>

            </div>

            <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">

                <SettingsSidebar
                    active={active}
                    onChange={setActive}
                />

                <div>

                    {active === "profile" && profile}

                    {active === "security" && security}

                    {active === "notifications" &&
                        notifications}

                </div>

            </div>

        </div>
    );
}