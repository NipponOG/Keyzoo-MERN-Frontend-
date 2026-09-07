export default function InventoryCard({
    title,
    value,
    color = "green",
}) {

    const colors = {
        green: "text-green-400",
        yellow: "text-yellow-400",
        red: "text-red-400",
        blue: "text-blue-400",
    };

    return (
        <div className="rounded-xl border border-[#23262d] bg-[#1d1d1d] p-6">

            <p className="text-gray-400 text-sm">
                {title}
            </p>

            <h2
                className={`mt-3 text-4xl font-bold ${colors[color]}`}
            >
                {value}
            </h2>

        </div>
    );
}