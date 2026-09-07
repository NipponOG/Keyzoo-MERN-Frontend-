export default function StepItem({

    active = false,

    completed = false,

    number,

    title,

    description,

}) {

    return (

        <div className="relative flex gap-4.5">

            {/* Vertical Line */}

            <div className="absolute left-6 top-14 h-16 w-px bg-white/10" />

            {/* Circle */}

            <div
                className={`
                    relative z-10
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    text-lg
                    font-bold
                    transition-all
                    ${completed
                        ? "border-indigo-500 bg-indigo-600 text-white shadow-[0_0_25px_rgba(99,102,241,.45)]"
                        : active
                            ? "border-indigo-500 bg-indigo-600 text-white shadow-[0_0_25px_rgba(99,102,241,.45)]"
                            : "border-white/15 bg-[#1b1b24] text-gray-500"
                    }
                `}
            >

                {completed ? "✓" : number}

            </div>

            {/* Text */}

            <div className="pt-1">

                <h3 className="text-xl font-semibold text-white">

                    {title}

                </h3>

                <p className="mt-2 text-gray-400 text-sm text-justify" style={{hyphens: "auto"}}>

                    {description}

                </p>

            </div>

        </div>

    );

}