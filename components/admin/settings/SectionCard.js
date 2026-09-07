export default function SectionCard({
    title,
    description,
    children,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-white/10
                p-5 sm:p-8
            "
        >
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">
                    {title}
                </h2>

                {description && (
                    <p className="mt-2 text-gray-400">
                        {description}
                    </p>
                )}
            </div>

            {children}
        </div>
    );
}