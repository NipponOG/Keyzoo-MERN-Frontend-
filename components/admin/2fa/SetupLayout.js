// export default function SetupLayout({
//     header,
//     left,
//     center,
//     right,
// }) {

//     return (

//         <div
//             className="min-h-screen"
//             style={{
//                 background: `
//                     radial-gradient(circle at top left, rgba(99,102,241,.15), transparent 35%),
//                     radial-gradient(circle at bottom right, rgba(168,85,247,.12), transparent 35%),
//                     #0b0b11
//                 `,
//             }}
//         >

//             <div className="mx-auto max-w-[1700px] px-8 py-8">

//                 {header}

//                 <div className="mt-8 rounded-[34px] border border-white/10 bg-[#12121a]/95 shadow-[0_0_80px_rgba(0,0,0,.45)] backdrop-blur-xl">

//                     <div className="grid min-h-[760px] grid-cols-[320px_minmax(0,1fr)_340px]">

//                         {/* LEFT */}

//                         <aside className="border-r border-white/10">

//                             {left}

//                         </aside>

//                         {/* CENTER */}

//                         <main className="px-14 py-12">

//                             {center}

//                         </main>

//                         {/* RIGHT */}

//                         <aside className="border-l border-white/10">

//                             {right}

//                         </aside>

//                     </div>

//                 </div>

//             </div>

//         </div>

//     );

// }

export default function SetupLayout({
    header,
    left,
    center,
    right,
}) {
    return (
        <div className="min-h-screen bg-[#0b0b11]">

            <div className="mx-auto max-w-[1600px] px-8 py-8">

                {header}

                <div className="mt-8 grid grid-cols-[360px_minmax(0,1fr)_400px] gap-0 rounded-3xl border border-white/10 bg-[#16161d]">

                    <aside className="p-8 self-start">
                        {left}
                    </aside>

                    <main className="border-r border-white/10 p-8">
                        {center}
                    </main>

                    <aside className="p-8 self-start">
                        {right}
                    </aside>

                </div>

            </div>

        </div>
    );
}