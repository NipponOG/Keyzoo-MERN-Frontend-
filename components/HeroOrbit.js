import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"

const TILE_BASE = "https://driffle.com/tiles/about"

/**
 * One entry per ring.
 * size      ring diameter as a % of the orbit box (100 = the box itself)
 * duration  seconds for one full turn (higher = slower)
 * direction 1 = clockwise, -1 = counter-clockwise
 * icons     angle is where the tile sits on the ring: 0 = top, 90 = right, 180 = bottom, 270 = left
 */
const RINGS = [
    { size: 150, duration: 90, direction: -1, icons: [] },
    {
        size: 125,
        duration: 45,
        direction: 1,
        icons: [
            { name: "minecraft", angle: 90 },
            { name: "fifa", angle: 270 },
        ],
    },
    {
        size: 100,
        duration: 55,
        direction: 1,
        icons: [
            { name: "steam", angle: 0 },
            { name: "spiderman", angle: 180 },
        ],
    },
    {
        size: 75,
        duration: 80,
        direction: -1,
        icons: [
            { name: "mortalkombat", angle: 0 },
            { name: "batman", angle: 180 },
        ],
    },
    {
        size: 50,
        duration: 35,
        direction: 1,
        icons: [{ name: "xbox", angle: 90 }],
    },
]

function IconTile({ name }) {
    return (
        <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 dark:bg-[#1a1030] dark:ring-white/10 sm:h-14 sm:w-14">
            <Image
                src={`${TILE_BASE}/${name}.png`}
                alt=""
                fill
                sizes="56px"
                draggable={false}
                className="object-cover"
            />
        </div>
    )
}

function Ring({ size, duration, direction, icons, reduceMotion }) {
    const offset = (100 - size) / 2
    const transition = { duration, ease: "linear", repeat: Infinity }

    return (
        <div
            className="absolute rounded-full border border-white/2 shadow-[0_0_24px_rgba(109,60,255,0.12),inset_0_0_24px_rgba(109,60,255,0.08)]"
            style={{
                width: `${size}%`,
                height: `${size}%`,
                left: `${offset}%`,
                top: `${offset}%`,
            }}
        >
            {/* The whole ring layer spins... */}
            <motion.div
                className="absolute inset-0"
                animate={reduceMotion ? undefined : { rotate: 360 * direction }}
                transition={transition}
            >
                {icons.map(({ name, angle }) => (
                    // ...each icon is parked at its angle on the ring...
                    <div
                        key={name}
                        className="absolute inset-0"
                        style={{ transform: `rotate(${angle}deg)` }}
                    >
                        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                            {/* ...and counter-rotated so the tile always stays upright */}
                            <div style={{ transform: `rotate(${-angle}deg)` }}>
                                <motion.div
                                    animate={reduceMotion ? undefined : { rotate: -360 * direction }}
                                    transition={transition}
                                >
                                    <IconTile name={name} />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

export default function HeroOrbit({ children }) {
    const reduceMotion = useReducedMotion()

    return (
        // Square box that always fits the viewport width and height
        <div className="relative aspect-square w-[min(90vw,72svh,720px)]">
            {/* Orbit layer: purely decorative, faded on phones so text stays readable */}
            <div aria-hidden="true" className="absolute inset-0 opacity-40 sm:opacity-100">
                {RINGS.map((ring) => (
                    <Ring key={ring.size} reduceMotion={reduceMotion} {...ring} />
                ))}
            </div>

            {/* Center content */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
                {children}
            </div>
        </div>
    )
}