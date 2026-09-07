import Image from "next/image"

export default function OurInvestorsSection() {
    return (
        <section className="h-screen w-screen flex items-center justify-center text-white">
            <div className="w-full max-w-6xl px-6">

                {/* Heading */}
                <h2 className="text-center text-4xl md:text-5xl font-semibold mb-20">
                    Our Investors
                </h2>

                {/* Logos */}
                <div className="flex flex-wrap items-center justify-center gap-x-20 gap-y-16 opacity-90">

                    <InvestorLogo src="https://driffle.com/images/investors/Beenext.png" alt="Beenext" />
                    <InvestorLogo src="https://driffle.com/images/investors/Better.png" alt="Better" />
                    <InvestorLogo src="https://driffle.com/images/investors/Jafco-asia.png" alt="JAFCO Asia" />
                    <InvestorLogo src="https://driffle.com/images/investors/WhiteVenture.png" alt="White Venture Capital" />
                    <InvestorLogo src="https://driffle.com/images/investors/Taurus.png" alt="Taurus Ventures" />

                </div>
            </div>
        </section>
    )
}

function InvestorLogo({ src, alt }) {
    return (
        <div className="relative h-15 w-44 grayscale opacity-80 transition hover:opacity-100 hover:grayscale-0">
            <Image
                src={src}
                alt={alt}
                fill
                className="object-center"
            />
        </div>
    )
}
