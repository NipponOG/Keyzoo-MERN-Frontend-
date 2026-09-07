import {
    Store,
    TrendingUp,
    ShieldCheck,
    Globe2,
    Wallet,
} from "lucide-react"
import Image from "next/image"

export default function SellOnKeyzooSection() {
    return (
        <section className="h-screen w-full flex items-center justify-center text-white">
            <div className="mx-auto max-w-6xl px-6 w-full">

                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
                        Sell on Keyzoo
                    </h2>
                    <p className="mt-4 text-white/60 max-w-2xl mx-auto">
                        Join thousands of sellers and reach gamers worldwide with secure,
                        fast, and hassle-free selling.
                    </p>
                </div>

                {/* Cards */}
                <div className="space-y-6">

                    {/* Top row */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <FeatureCard
                            icon="https://driffle.com/icons/about/euro_symbol.svg"
                            title="Start Selling Instantly"
                            description="We offer the lowest available commissions in the market. Become a seller on Driffle without losing most of your benefits."
                        />

                        <FeatureCard
                            icon="https://driffle.com/icons/about/code.svg"
                            title="Global Reach"
                            description="Driffle offers a free API for digital goods, and we'll even help you take your first steps toward integrating it."
                        />

                        <FeatureCard
                            icon="https://driffle.com/icons/about/target.svg"
                            title="Seller Protection"
                            description="Driffle connects you with a receptive gaming-focused audience, enhancing your access to eager customers."
                        />
                    </div>

                    {/* Bottom row */}
                    <div className="grid gap-6 md:grid-cols-2 md:px-24">
                        <FeatureCard
                            icon="https://driffle.com/icons/about/instant-payout-24.svg"
                            title="Fast & Reliable Payouts"
                            description="Get instant settlements, as your amount becomes available for withdrawal 7 days from the transaction date."
                        />

                        <FeatureCard
                            icon="https://driffle.com/icons/about/market_support.svg"
                            title="Sell in Multiple Regions"
                            description="Driffle enhances your promotion for free. From social media to Google Ads, your offer gains the attention it deserves!"
                        />
                    </div>

                </div>
            </div>
        </section>
    )
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="rounded-2xl border-none outline-none border-white/10 bg-white/5 p-6 transition hover:border-white/20">
            <div className="mb-1.5 flex items-center justify-center gap-2">
                {/* <span className="text-white">{icon}</span> */}
                <Image src={icon} alt={title} width={24} height={24} />
                <h3 className="font-medium">{title}</h3>
            </div>

            <p className="text-[0.875rem] text-[#ffffff99] leading-relaxed text-center">
                {description}
            </p>
        </div>
    )
}
