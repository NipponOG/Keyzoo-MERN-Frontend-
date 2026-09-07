// import HeroCenterContent from "@/components/HeroCenterContent"
// import HeroOrbit from "@/components/HeroOrbit"
// import WhyBuySection from "@/components/WhyBuySection"

// export default function AboutUs() {
//   return (
//     <section className="min-h-screen bg-[radial-gradient(circle_at_center,_#0a2a55,_transparent_65%)] text-white overflow-hidden">
//       <HeroOrbit>
//         <HeroCenterContent />
//       </HeroOrbit>
//       <WhyBuySection />
//     </section>
//   )
// }





// import { useEffect, useState } from "react"
// import HeroOrbit from "@/components/HeroOrbit"
// import HeroCenterContent from "@/components/HeroCenterContent"
// import WhyBuySection from "@/components/WhyBuySection"
// import SellOnKeyzooSection from "@/components/SellOnKeyzooSection"

// export default function AboutUs() {
//   const [section, setSection] = useState(0)
//   const [isAnimating, setIsAnimating] = useState(false)

//   useEffect(() => {
//     const onWheel = (e) => {
//       if (isAnimating) return

//       if (e.deltaY > 0 && section === 0) {
//         setIsAnimating(true)
//         setSection(1)
//         setTimeout(() => setIsAnimating(false), 700)
//       }

//       if (e.deltaY < 0 && section === 1) {
//         setIsAnimating(true)
//         setSection(0)
//         setTimeout(() => setIsAnimating(false), 700)
//       }
//     }

//     window.addEventListener("wheel", onWheel, { passive: false })
//     return () => window.removeEventListener("wheel", onWheel)
//   }, [section, isAnimating])

//   return (
//     <main className="relative h-screen w-screen overflow-hidden bg-black text-white">

//       {/* HERO */}
//       <section
//         className={`absolute inset-0 h-screen w-screen transition-transform duration-700
//         ${section === 0 ? "translate-y-0" : "-translate-y-full"}`}
//       >
//         <HeroOrbit>
//           <HeroCenterContent />
//         </HeroOrbit>
//       </section>

//       {/* WHY BUY */}
//       <section
//         className={`absolute inset-0 h-screen w-screen transition-transform duration-700
//         ${section === 1 ? "translate-y-0" : "translate-y-full"}`}
//       >
//         <WhyBuySection />
//       </section>

//       {/* WHY Sell */}
//       <section
//         className={`absolute inset-0 h-screen w-screen transition-transform duration-700
//         ${section === 1 ? "translate-y-0" : "translate-y-full"}`}
//       >
//         <WhyBuySection />
//         <SellOnKeyzooSection />
//       </section>

//     </main>
//   )
// }

import { useEffect, useState } from "react"
import HeroOrbit from "@/components/HeroOrbit"
import HeroCenterContent from "@/components/HeroCenterContent"
import WhyBuySection from "@/components/WhyBuySection"
import SellOnKeyzooSection from "@/components/SellOnKeyzooSection"
import OurInvestorsSection from "@/components/OurInvestorsSection"

export default function AboutUs() {
  const [section, setSection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault()
      if (isAnimating) return

      setIsAnimating(true)

      if (e.deltaY > 0) {
        setSection((prev) => Math.min(prev + 1, 3))
      } else {
        setSection((prev) => Math.max(prev - 1, 0))
      }

      setTimeout(() => setIsAnimating(false), 700)
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel)
  }, [isAnimating])

  return (
    <main className="relative h-screen w-screen overflow-hidden text-white">

      {/* SECTION WRAPPER */}
      <div
        className="absolute top-0 left-0 h-[300vh] w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateY(-${section * 100}vh)` }}
      >

        {/* HERO */}
        <section className="h-screen w-screen flex items-center justify-center">
          <HeroOrbit>
            <HeroCenterContent />
          </HeroOrbit>
        </section>

        {/* BUY */}
        <section className="h-screen w-screen flex items-center justify-center">
          <WhyBuySection />
        </section>

        {/* SELL */}
        <section className="h-screen w-screen flex items-center justify-center">
          <SellOnKeyzooSection />
        </section>

        {/* INVESTORS */}
        <section className="h-screen w-screen flex items-center justify-center">
          <OurInvestorsSection />
        </section>


      </div>
    </main>
  )
}
