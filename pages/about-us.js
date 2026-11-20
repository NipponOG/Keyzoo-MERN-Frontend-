import { useEffect, useRef, useState } from "react"
import HeroOrbit from "@/components/HeroOrbit"
import HeroCenterContent from "@/components/HeroCenterContent"
import WhyBuySection from "@/components/WhyBuySection"
import SellOnKeyzooSection from "@/components/SellOnKeyzooSection"
import OurInvestorsSection from "@/components/OurInvestorsSection"

const SECTIONS = [
    { id: "about", label: "About Keyzoo" },
    { id: "buy", label: "Why buy on Keyzoo" },
    { id: "sell", label: "Sell on Keyzoo" },
    { id: "investors", label: "Our investors" },
]

function Panel({ id, children, className = "" }) {
    return (
        <section
            id={id}
            className={`relative flex min-h-[100svh] snap-start items-center justify-center py-16 ${className}`}
        >
            {children}
        </section>
    )
}

export default function AboutUs() {

    const scrollerRef = useRef(null)
    const [active, setActive] = useState(SECTIONS[0].id)

    // Highlight whichever section crosses the middle of the screen
    useEffect(() => {
        const root = scrollerRef.current
        if (!root) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id)
                })
            },
            { root, rootMargin: "-45% 0px -45% 0px", threshold: 0 }
        )

        SECTIONS.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [])

    return (
        // Native scroll-snap: works with touch, trackpad, keyboard and screen readers
        <main
            ref={scrollerRef}
            className="relative h-[100svh] w-full snap-y snap-proximity overflow-y-auto overflow-x-hidden scroll-smooth text-[#6d3cff] motion-reduce:scroll-auto dark:text-white lg:snap-mandatory no-scrollbar"
        >
            {/* Section dots */}
            <nav
                aria-label="Page sections"
                className="fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex"
            >
                {SECTIONS.map(({ id, label }) => {
                    const isActive = active === id
                    return (
                        <a
                            key={id}
                            href={`#${id}`}
                            aria-label={label}
                            aria-current={isActive ? "true" : undefined}
                            className="group relative flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d3cff]"
                        >
                            <span
                                className={`block w-2 rounded-full transition-all duration-300 ${
                                    isActive
                                        ? "h-6 bg-[#6d3cff]"
                                        : "h-2 bg-violet-950/25 group-hover:bg-violet-950/50 dark:bg-white/30 dark:group-hover:bg-white/60"
                                }`}
                            />
                            <span className="pointer-events-none absolute right-8 whitespace-nowrap rounded-md bg-[#190B30] px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-white dark:text-[#190B30]">
                                {label}
                            </span>
                        </a>
                    )
                })}
            </nav>

            {/* HERO */}
            <Panel id="about" className="overflow-hidden">
                <HeroOrbit>
                    <HeroCenterContent />
                </HeroOrbit>

                <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
                    <a
                        href="#buy"
                        aria-label="Scroll to next section"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-950/20 text-[#190B30] transition hover:bg-violet-950/5 motion-safe:animate-bounce dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </a>
                </div>
            </Panel>

            {/* BUY */}
            <Panel id="buy">
                <WhyBuySection />
            </Panel>

            {/* SELL */}
            <Panel id="sell">
                <SellOnKeyzooSection />
            </Panel>

            {/* INVESTORS */}
            <Panel id="investors">
                <OurInvestorsSection />
            </Panel>
        </main>
    )
}