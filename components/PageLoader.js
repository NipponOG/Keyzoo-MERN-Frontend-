// components/PageLoader.js
import Image from "next/image";

export default function PageLoader() {
  return (
    // <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
    //   <svg
    //     xmlns="http://www.w3.org/2000/svg"
    //     viewBox="0 0 300 300"
    //     width="80"
    //     height="80"
    //     preserveAspectRatio="xMidYMid meet"
    //     className="page-spinner"
    //   >
    //     <g transform="translate(0,0)">
    //       <g transform="matrix(0.8837,0,0,0.8837,112.96,107.62)">
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="miter"
    //           fill="none"
    //           stroke="currentColor"
    //           strokeWidth="10"
    //           d="M-24.04,24.04 C-24.04,24.04 24.17,-24.17 24.17,-24.17 M-24.04,-24.04 C-24.04,-24.04 24.54,23.91 24.54,23.91"
    //         />
    //       </g>
    //       <g transform="matrix(0.8837,0,0,0.8837,107.46,187.15)">
    //         <path
    //           fill="currentColor"
    //           d="M0,-30 C16.56,-30 30,-16.56 30,0 C30,16.56 16.56,30 0,30 C-16.56,30 -30,16.56 -30,0 C-30,-16.56 -16.56,-30 0,-30z"
    //         />
    //       </g>
    //       <g transform="matrix(0.8837,0,0,0.8837,186.99,192.30)">
    //         <path
    //           fill="currentColor"
    //           d="M0,-29 C0,-29 -29,29 -29,29 C-29,29 29,29 29,29 C29,29 0,-29 0,-29z"
    //         />
    //       </g>
    //       <g transform="matrix(0.8837,0,0,0.8837,192.24,113.05)">
    //         <path
    //           fill="currentColor"
    //           d="M30,-24 C30,-24 30,24 30,24 C30,27.31 27.31,30 24,30 C24,30 -24,30 -24,30 C-27.31,30 -30,27.31 -30,24 C-30,24 -30,-24 -30,-24 C-30,-27.31 -27.31,-30 -24,-30 C-24,-30 24,-30 24,-30 C27.31,-30 30,-27.31 30,-24z"
    //         />
    //       </g>
    //     </g>
    //   </svg>
    // </div>

    <div
      className="
                fixed
                inset-0
                z-[9999]
                flex
                items-center
                justify-center
                bg-[#111]/95
                backdrop-blur-sm
            "
    >
      <Image
        src="/loader-super-fast-page-load.svg"
        alt="Loading"
        width={120}
        height={120}
        unoptimized
        priority
      />
    </div>
  );
}
