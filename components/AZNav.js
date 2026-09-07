// // components/AZNav.js
// import { useEffect, useState } from "react"

// const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

// export default function AZNav({ activeLetter, data }) {
// //   const scrollTo = (letter) => {
// //     const el = document.getElementById(`section-${letter}`)
// //     if (el) {
// //       el.scrollIntoView({ behavior: "smooth", block: "start" })
// //     }
// //   }

// const scrollTo = (letter) => {
//   const el = document.getElementById(`section-${letter}`)
//   if (!el) return

//   const y =
//     el.getBoundingClientRect().top +
//     window.pageYOffset -
//     120 // header + nav offset

//   window.scrollTo({
//     top: y,
//     behavior: "smooth"
//   })
// }


//   return (
//     <div className="sticky top-[120px] z-30 mb-12">
//       {/* <div className="mx-auto max-w-6xl rounded-xl border border-white/10 bg-gradient-to-b from-[#111] to-[#0a0a0a] backdrop-blur px-4 py-3"> */}
//       <div className="mx-auto max-w-8xl rounded-xl border-none outline-none border-white/10 bg-[#1c1c1c] px-4 py-3">
//         <div className="flex flex-wrap justify-center gap-4">
//           {letters.map((l) => {
//             const isActive = activeLetter === l
//             const hasData = data[l]?.length > 0

//             return (
//               <button
//                 key={l}
//                 onClick={() => scrollTo(l)}
//                 disabled={!hasData}
//                 className={`
//                   text-2xl font-medium transition
//                   ${isActive
//                     ? "text-white"
//                     : "text-white/50 hover:text-white"
//                   }
//                   ${!hasData
//       ? "opacity-30 cursor-not-allowed"
//       : "hover:text-white"}
//                 `}
//               >
//                 {l}
//               </button>
//             )
//           })}
//         </div>
//       </div>
//     </div>
//   )
// }






const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export default function AZNav({ activeLetter, data }) {

  const scrollTo = (letter) => {
    const el = document.getElementById(`section-${letter}`)
    if (!el) return

    const y =
      el.getBoundingClientRect().top +
      window.pageYOffset -
      120

    window.scrollTo({
      top: y,
      behavior: "smooth",
    })
  }

  return (
    <div className="sticky top-[120px] z-30 mb-12">
      <div className="mx-auto max-w-7xl rounded-xl bg-[#151515] px-4 py-3">
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          {letters.map((l) => {
            const isActive = activeLetter === l
            const hasData = data?.[l]?.length > 0

            return (
              <button
                key={l}
                onClick={() => scrollTo(l)}
                disabled={!hasData}
                className={`min-w-[38px] h-[38px] rounded-lg text-2xl font-semibold transition flex items-center justify-center ${isActive ? "bg-[#222] text-blue-400" : "text-white/60 hover:bg-[#222]"} ${!hasData && "cursor-not-allowed text-white/20 hover:text-white/20"}`}>
                {l}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
