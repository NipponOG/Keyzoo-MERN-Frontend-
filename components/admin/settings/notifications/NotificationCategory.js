import { useState } from "react";

export default function NotificationCategory({
    icon,
    title,
    description,
    enabled,
}) {

    const [checked, setChecked] = useState(enabled);

    return (

        <div
            className="
flex
flex-col
gap-5
rounded-2xl
border
border-white/10
bg-[#181818]
p-5

sm:flex-row
sm:items-center
sm:justify-between
"
        >

            <div className="
flex
gap-4
rounded-2xl
border
border-white/10
bg-[#181818]
p-5

hover:border-white/20
">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center">
                    {icon}
                </div>

                <div>

                    <h3 className="text-white font-medium">
                        {title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                        {description}
                    </p>

                </div>

            </div>

            <button
                onClick={() => setChecked(!checked)}
                className={`
                    relative
                    h-7
                    w-12
                    rounded-full
                    transition-all
                    ${checked
                        ? "bg-indigo-600"
                        : "bg-[#2b2b2b]"
                    }
                `}
            >

                <span
                    className={`
                        absolute
                        top-1
                        h-5
                        w-5
                        rounded-full
                        bg-white
                        transition-all
                        ${checked
                            ? "left-6"
                            : "left-1"
                        }
                    `}
                />

            </button>

        </div>

    );

}