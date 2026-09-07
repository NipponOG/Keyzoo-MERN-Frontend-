import Image from "next/image"

export default function OrbitIcons({
    size,
    icons,
    speed = "orbit",
}) {
    const radius = size / 2

    return (
        <div
            className={`absolute ${speed}`}
            style={{
                width: size,
                height: size,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            }}
        >
            {icons.map((src, index) => {
                const angle = (360 / icons.length) * index

                return (
                    <div
                        key={index}
                        className="absolute top-1/2 left-1/2"
                        style={{
                            transform: `
                rotate(${angle}deg)
                translate(${radius}px)
                rotate(-${angle}deg)
              `,
                        }}
                    >
                        <div className="h-14 w-14 rounded-xl bg-[#111] shadow-lg flex items-center justify-center">
                            <Image src={src} alt="" fill />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
