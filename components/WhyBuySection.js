// import {
//     DollarSign,
//     Zap,
//     Globe,
//     CreditCard,
//     Star,
// } from "lucide-react"

// export default function WhyBuySection() {
//     return (
//         <section className="h-screen w-full flex items-center justify-center">
//             <div className="mx-auto max-w-6xl px-6">

//                 {/* Heading */}
//                 <div className="text-center mb-16">
//                     <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
//                         Buy on Keyzoo
//                     </h2>
//                     <p className="mt-4 text-white/60 max-w-2xl mx-auto">
//                         We're on a mission to provide seamless access to games and digital
//                         goods for everyone.
//                     </p>
//                 </div>

//                 {/* Cards Grid */}
//                 <div className="grid gap-8 md:grid-cols-3">

//                     <FeatureCard
//                         icon={<DollarSign size={20} />}
//                         title="Best Prices"
//                         description="Get premium games at the most affordable prices and experience top-tier gaming without emptying your wallet!"
//                     />

//                     <FeatureCard
//                         icon={<Zap size={20} />}
//                         title="Buy Goods in Seconds"
//                         description="Buy goods in a flash with Keyzoo's one-click checkout and instant key delivery."
//                     />

//                     <FeatureCard
//                         icon={<Globe size={20} />}
//                         title="Your Country, Your Currency"
//                         description="Buying goods in other currencies can be a hassle, so we make it easy for you to pay in your currency."
//                     />

//                 </div>

//                 {/* Bottom row */}
//                 <div className="mt-8 grid gap-8 md:grid-cols-2 md:px-28">

//                     <FeatureCard
//                         icon={<CreditCard size={20} />}
//                         title="Diverse Payment Methods"
//                         description="Your convenience is our priority! Choose your preferred payment method and skip the trouble."
//                     />

//                     <FeatureCard
//                         icon={<Star size={20} />}
//                         title="Customer Satisfaction"
//                         description="We've got you covered in quality. With top Trustpilot ratings, we guarantee the authenticity of the products!"
//                     />

//                 </div>
//             </div>
//         </section>
//     )
// }

// function FeatureCard({ icon, title, description }) {
//     return (
//         <div className="rounded-2xl border border-white/10 bg-[#0e0e0e] p-6 transition hover:border-white/20">
//             <div className="mb-4 flex items-center gap-2 text-white">
//                 <span className="text-white">{icon}</span>
//                 <h3 className="font-semibold">{title}</h3>
//             </div>

//             <p className="text-sm text-white/60 leading-relaxed">
//                 {description}
//             </p>
//         </div>
//     )
// }


import {
    DollarSign,
    Zap,
    Globe,
    CreditCard,
    Star,
} from "lucide-react"
import Image from "next/image"

export default function WhyBuySection() {
    return (
        <section className="h-screen w-full flex items-center justify-center text-white">
            <div className="mx-auto max-w-6xl px-6 w-full">

                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
                        Buy on Keyzoo
                    </h2>
                    <p className="mt-4 text-white/60 max-w-2xl mx-auto">
                        We're on a mission to provide seamless access to games and digital
                        goods for everyone.
                    </p>
                </div>

                {/* Cards */}
                <div className="space-y-6">

                    {/* Top row */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <FeatureCard
                        icon="https://driffle.com/icons/about/attach_money.svg"
                        title="Best Prices"
                        description="Get premium games at the most affordable prices and experience top-tier gaming without emptying your wallet!"
                    />

                        <FeatureCard
                            icon="https://driffle.com/icons/globe-icon-24.svg"
                            title="Buy Goods in Seconds"
                            description="Buy goods in a flash with Driffle's one-click checkout and Instant Key Delivery."
                        />

                        <FeatureCard
                            icon="https://driffle.com/icons/thunder-icon-24.svg"
                            title="Your Country, Your Currency"
                            description="Buying goods in other currencies can be a hassle, so we make it easy for you to pay in your currency."
                        />
                    </div>

                    {/* Bottom row */}
                    <div className="grid gap-6 md:grid-cols-2 md:px-24">
                        <FeatureCard
                            icon="https://driffle.com/icons/about/diverse_payment_methods.svg"
                            title="Diverse Payment Methods"
                            description="Your convenience is our priority! Choose your preferred payment method and skip the trouble."
                        />

                        <FeatureCard
                            icon="https://driffle.com/icons/about/customer_satisfaction.svg"
                            title="Customer Satisfaction"
                            description="We've got you covered in quality. With top Trustpilot ratings, we guarantee the authenticity of the products!"
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
                <Image src={icon} alt={title} height={24} width={24}/>
                <h3 className="font-medium">{title}</h3>
            </div>

            <p className="text-[0.875rem] text-[#ffffff99] leading-relaxed text-center">
                {description}
            </p>
        </div>
    )
}


