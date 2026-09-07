// // pages/activation-guide.js
// import Head from "next/head"
// import Link from "next/link"

// export default function ActivationGuideComingSoon() {
//     return (
//         <>
//             <Head>
//                 <title>Activation Guides – Coming Soon | Keyzoo</title>
//                 <meta
//                     name="description"
//                     content="Activation guides for Steam, Epic Games, Rockstar and more are coming soon on Keyzoo."
//                 />
//             </Head>

//             <section className="min-h-[70vh] flex items-center justify-center text-white">
//                 <div className="max-w-xl px-6 text-center">

//                     {/* Badge */}
//                     <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#111] px-4 py-2 text-lg text-white/70">
//                         🚧 Under Development
//                     </div>

//                     {/* Heading */}
//                     <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
//                         Activation Guides Coming Soon
//                     </h1>

//                     {/* Description */}
//                     <p className="mt-4 text-white/70 leading-relaxed">
//                         We’re currently preparing step-by-step activation guides to help you
//                         activate your games on platforms like Steam, Epic Games, Rockstar,
//                         Xbox, and more.
//                     </p>

//                     {/* Divider */}
//                     <div className="my-8 h-px w-full bg-white/10" />

//                     {/* Support CTA */}
//                     <p className="text-sm text-white/60">
//                         Need help right now?
//                     </p>

//                     <div className="mt-4 flex justify-center gap-4">
//                         <Link
//                             href="/contact-us"
//                             className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
//                         >
//                             Contact Support
//                         </Link>

//                         <Link
//                             href="/"
//                             className="rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/5"
//                         >
//                             Go Back Home
//                         </Link>
//                     </div>

//                 </div>
//             </section>
//         </>
//     )
// }





// pages/activation-guide.js
import Head from "next/head"
import Link from "next/link"

export default function ActivationGuideComingSoon() {
  return (
    <>
      <Head>
        <title>Activation Guides – Coming Soon | Keyzoo</title>
        <meta
          name="description"
          content="Activation guides for Steam, Epic Games, Rockstar and more are coming soon on Keyzoo."
        />
      </Head>

      <section className="min-h-[75vh] flex items-center justify-center text-white">
        <div className="w-full max-w-2xl px-4 sm:px-6 text-center">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#111] px-4 py-2 text-sm sm:text-base text-white/70">
            🚧 Under Development
          </div>

          {/* Heading */}
          <h1 className="
            text-2xl
            sm:text-3xl
            md:text-4xl
            font-semibold
            tracking-tight
          ">
            Activation Guides Coming Soon
          </h1>

          {/* Description */}
          <p className="
            mt-4
            text-sm
            sm:text-base
            text-white/70
            leading-relaxed
          ">
            We’re currently preparing step-by-step activation guides to help you
            activate your games on platforms like Steam, Epic Games, Rockstar,
            Xbox, and more.
          </p>

          {/* Divider */}
          <div className="my-8 h-px w-full bg-white/10" />

          {/* Support CTA */}
          <p className="text-xs sm:text-sm text-white/60">
            Need help right now?
          </p>

          {/* Buttons */}
          <div className="
            mt-5
            flex
            flex-col
            sm:flex-row
            justify-center
            gap-3
            sm:gap-4
          ">
            <Link
              href="/contact-us"
              className="
                rounded-lg
                bg-white
                px-6
                py-3
                text-sm
                font-medium
                text-black
                transition
                hover:bg-white/90
              "
            >
              Contact Support
            </Link>

            <Link
              href="/"
              className="
                rounded-lg
                border
                border-white/15
                px-6
                py-3
                text-sm
                font-medium
                text-white
                transition
                hover:bg-white/5
              "
            >
              Go Back Home
            </Link>
          </div>

        </div>
      </section>
    </>
  )
}
