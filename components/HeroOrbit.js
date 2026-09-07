import Image from "next/image"

export default function HeroOrbit({ children }) {
    return (
        <div className="relative mx-auto mt-15 h-[720px] w-[720px] max-w-full">

            {/* Center content */}
            <div className="absolute inset-0 z-10 flex flex-col items-start justify-center text-center px-10">
                {children}
            </div>

            {/* Orbit Rings */}
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute inset-[90px] rounded-full border border-white/10" />
            <div className="absolute inset-[180px] rounded-full border border-white/10" />
            <div className="absolute inset-[-180px] rounded-full border border-white/10" />
            <div className="absolute inset-[-90px] rounded-full border border-white/10" />

            {/* Orbit 1 */}
            <div className="absolute inset-0 orbit">
                <IconOne position="top-[-20px] right-2/2 -translate-x-1/2" />   {/* Changed from left-1/2 to right-2/2 */}
                <IconTwo position="bottom-[-20px] left-1/2 -translate-x-1/2" /> {/* Don't change the value */}
            </div>

            {/* Orbit 2 */}
            <div className="absolute inset-[90px] orbit orbit-slow">
                <IconThree position="top-[-20px] left-2/2 -translate-x-1/2" />    {/* Don't change the value */}
                <IconFour position="bottom-[-15px] right-1/2 -translate-x-1/2" />    {/* Don't change the value */}
            </div>

            {/* Orbit 3 */}
            <div className="absolute inset-[180px] orbit orbit-fast">
                {/* <IconThree position="left-[-20px] top-9/9 -translate-y-1/2" /> */}
                <IconFive position="right-[-20px] top-1/2 -translate-y-1/2" />
            </div>

            {/* Orbit 4 */}
            <div className="absolute inset-[-180px] orbit orbit-fast">
                {/* <IconFour position="top-[20px] top-2/2 -translate-y-1/2" /> */}
                {/* <IconSix position="right-[-20px] top-3/2 -translate-y-1/2" /> */}
            </div>

            {/* Orbit 5 */}
            <div className="absolute inset-[-90px] orbit orbit-fast">
                <IconSeven position="right-[-20px] top-1/2 -translate-y-1/2" />
                <IconEight position="left-[-20px] top-1/2 -translate-y-1/2" />
            </div>

        </div>
    )
}

function IconOne({ position }) {
    return (
        <div
            className={`absolute ${position} flex h-14 w-14 items-center justify-center rounded-xl bg-[#111] shadow-lg`}
        >
            <Image
                src="https://driffle.com/tiles/about/steam.png"
                alt=""
                // width={32}
                // height={32}
                fill
            />
        </div>
    )
}

function IconTwo({ position }) {
    return (
        <div
            className={`absolute ${position} flex h-14 w-14 items-center justify-center rounded-xl bg-[#111] shadow-lg`}
        >
            <Image
                src="https://driffle.com/tiles/about/spiderman.png"
                alt=""
                // width={32}
                // height={32}
                fill
            />
        </div>
    )
}

function IconThree({ position }) {
    return (
        <div
            className={`absolute ${position} flex h-14 w-14 items-center justify-center rounded-xl bg-[#111] shadow-lg`}
        >
            <Image
                src="https://driffle.com/tiles/about/mortalkombat.png"
                alt=""
                // width={32}
                // height={32}
                fill
            />
        </div>
    )
}

function IconFour({ position }) {
    return (
        <div
            className={`absolute ${position} flex h-14 w-14 items-center justify-center rounded-xl bg-[#111] shadow-lg`}
        >
            <Image
                src="https://driffle.com/tiles/about/batman.png"
                alt=""
                // width={32}
                // height={32}
                fill
            />
        </div>
    )
}

function IconFive({ position }) {
    return (
        <div
            className={`absolute ${position} flex h-14 w-14 items-center justify-center rounded-xl bg-[#111] shadow-lg`}
        >
            <Image
                src="https://driffle.com/tiles/about/xbox.png"
                alt=""
                // width={32}
                // height={32}
                fill
            />
        </div>
    )
}

function IconSix({ position }) {
    return (
        <div
            className={`absolute ${position} flex h-14 w-14 items-center justify-center rounded-xl bg-[#111] shadow-lg`}
        >
            <Image
                src="https://driffle.com/tiles/about/minecraft.png"
                alt=""
                // width={32}
                // height={32}
                fill
            />
        </div>
    )
}

function IconSeven({ position }) {
    return (
        <div
            className={`absolute ${position} flex h-14 w-14 items-center justify-center rounded-xl bg-[#111] shadow-lg`}
        >
            <Image
                src="https://driffle.com/tiles/about/minecraft.png"
                alt=""
                // width={32}
                // height={32}
                fill
            />
        </div>
    )
}

function IconEight({ position }) {
    return (
        <div
            className={`absolute ${position} flex h-14 w-14 items-center justify-center rounded-xl bg-[#111] shadow-lg`}
        >
            <Image
                src="https://driffle.com/tiles/about/fifa.png"
                alt=""
                // width={32}
                // height={32}
                fill
            />
        </div>
    )
}