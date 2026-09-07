import Image from "next/image";

const apps = [
    {
        name: "Google Authenticator",
        icon: "https://ik.imagekit.io/nws/Google%20Authenticator",
    },
    {
        name: "Microsoft Authenticator",
        icon: "https://ik.imagekit.io/nws/Microsoft%20Authenticator",
    },
    {
        name: "Authy",
        icon: "https://ik.imagekit.io/nws/authy.svg",
    },
    {
        name: "Bitwarden",
        icon: "https://ik.imagekit.io/nws/bitwarden-icon.svg",
    },
    {
        name: "1Password",
        icon: "https://ik.imagekit.io/nws/1password-icon.svg",
    },
];

export default function InfoPanel() {

    return (

        <div className="flex h-fit flex-col p-3">

            {/* How it Works */}

            <div>

                <h3 className="text-xl font-bold text-white">

                    How it works

                </h3>

                <p className="mt-1 text-gray-400">

                    Two-factor authentication adds an
                    extra verification step before
                    accessing your administrator account.

                </p>

            </div>

            {/* Steps */}

            <div className="mt-8 space-y-4">

                <Item
                    number="1"
                    title="Scan QR Code"
                    text="Open any authenticator application and scan the QR code."
                />

                <Item
                    number="2"
                    title="Enter Verification Code"
                    text="Type the generated 6-digit code."
                />

                <Item
                    number="3"
                    title="You're Protected"
                    text="Every login will require a fresh verification code."
                />

            </div>

            <div className="my-10 h-px bg-white/10" />

            {/* Supported Apps */}

            <div>

                <h4 className="text-lg font-semibold text-white">

                    Supported Apps

                </h4>

                <div className="mt-5 space-y-3">
                    {apps.map((app) => (
                        <div
                            key={app.name}
                            className="
                group
                flex
                items-center
                gap-4
                rounded-xl
                outline-none
                bg-white/[0.03]
                p-4
                transition-all
                duration-300
                hover:border-indigo-500/30
                hover:bg-white/[0.05]
            "
                        >
                            <div
                                className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#23232e]
                    transition-all
                    duration-300
                    group-hover:bg-white
                "
                            >
                                <Image
                                    src={app.icon}
                                    alt={app.name}
                                    width={24}
                                    height={24}
                                />
                            </div>

                            <span
                                className="
                    font-medium
                    text-gray-300
                    transition-colors
                    duration-300
                    group-hover:text-white
                "
                            >
                                {app.name}
                            </span>
                        </div>
                    ))}
                </div>

            </div>

            {/* Bottom Tip */}

            <div className="mt-5">

                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15">

                            🛡️

                        </div>

                        <h4 className="text-lg font-semibold text-white">

                            Security Tip

                        </h4>

                    </div>

                    <p className="mt-4 text-gray-400">

                        Keep your phone's date and time set
                        to automatic. Incorrect device time
                        can generate invalid verification
                        codes.

                    </p>

                </div>

            </div>

        </div>

    );

}

function Item({

    number,

    title,

    text,

}) {

    return (

        <div className="flex gap-4">

            <div className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-indigo-600
                font-semibold
                text-white
            ">

                {number}

            </div>

            <div>

                <h5 className="font-semibold text-white">

                    {title}

                </h5>

                <p className="mt-2 text-gray-400">

                    {text}

                </p>

            </div>

        </div>

    );

}