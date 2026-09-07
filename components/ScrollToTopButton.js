// "use client";

// import { useEffect, useState } from "react";
// import { FiChevronUp } from "react-icons/fi";

// const ScrollToTopButton = () => {

//     const [showButton, setShowButton] = useState(false);

//     useEffect(() => {

//         const handleScroll = () => {

//             if (window.scrollY > 400) {
//                 setShowButton(true);
//             } else {
//                 setShowButton(false);
//             }
//         };

//         window.addEventListener("scroll", handleScroll);

//         return () => {
//             window.removeEventListener("scroll", handleScroll);
//         };

//     }, []);

//     const scrollToTop = () => {

//         window.scrollTo({
//             top: 0,
//             behavior: "smooth",
//         });
//     };

//     return (
//         <button
//             onClick={scrollToTop}
//             className={`
//                 fixed
//                 bottom-6
//                 right-6
//                 z-[999]
//                 w-15
//                 h-15
//                 rounded-full
//                 bg-[#2a2a2a]
//                 border
//                 border-white/10
//                 shadow-lg
//                 flex
//                 items-center
//                 justify-center
//                 text-white
//                 transition-all
//                 duration-300
//                 hover:bg-[#1a1a1a]
//                 hover:scale-110
//                 ${showButton
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-5 pointer-events-none"
//                 }
//             `}
//         >
//             <FiChevronUp size={24} />
//         </button>
//     );
// };

// export default ScrollToTopButton;



"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown02Icon } from '@hugeicons/core-free-icons';

const ScrollToTopButton = () => {

    const [showButton, setShowButton] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {

        const handleScroll = () => {

            const scrollTop = window.scrollY;
            const documentHeight =
                document.documentElement.scrollHeight - window.innerHeight;

            const progress =
                documentHeight > 0
                    ? (scrollTop / documentHeight) * 100
                    : 0;

            setScrollProgress(progress);

            setShowButton(scrollTop > 400);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        // Calculate initial state
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };

    }, []);

    const scrollToTop = () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={`
                fixed
                bottom-6
                right-6
                z-[999]
                w-15
                h-15
                rounded-full
                p-[2px]
                flex
                items-center
                justify-center
                transition-all
                duration-300

                ${showButton
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5 pointer-events-none"
                }
            `}
            style={{
                background: `
        conic-gradient(
            from 0deg,
            #8b5cf6 ${scrollProgress}%,
            #3b82f6 ${scrollProgress}%,
            rgba(255,255,255,0.10) ${scrollProgress}%
        )
    `,
            }}
        >

            {/* Inner Button */}
            <span
                className="
                    w-full
                    h-full
                    rounded-full
                    bg-[#2a2a2a]
                    flex
                    items-center
                    justify-center
                    text-white
                    transition-all
                    duration-300
                    hover:bg-[#1a1a1a]
                    hover:scale-105
                "
            >
                <HugeiconsIcon icon={ArrowDown02Icon} />
            </span>

        </button>
    );
};

export default ScrollToTopButton;