// import { useState, useRef } from "react";
// import { useFloating, offset, flip, shift, autoUpdate, FloatingPortal, arrow } from "@floating-ui/react";

// export default function HoverCard({ title, children }) {

//     const [open, setOpen] = useState(false);
//     const arrowRef = useRef(null);
//     const timeoutRef = useRef();

//     const isLongTitle = (title?.length ?? 0) > 100;

//     const openTooltip = () => {
//         timeoutRef.current = setTimeout(() => {
//             setOpen(true);
//         }, 50);
//     };

//     const closeTooltip = () => {
//         clearTimeout(timeoutRef.current);
//         setOpen(false);
//     };

//     const { refs, floatingStyles, middlewareData, placement } = useFloating({
//         open,
//         onOpenChange: setOpen,
//         placement: "top", // default like Driffle
//         middleware: [
//             offset(10),
//             flip(),
//             shift({ padding: 8 }),
//             arrow({ element: arrowRef })
//         ],
//         whileElementsMounted: autoUpdate
//     });

//     return (
//         <>
//             {/* Trigger */}
//             <span
//                 ref={refs.setReference}
//                 onMouseEnter={openTooltip}
//                 onMouseLeave={closeTooltip}
//                 className="inline-block"
//             >
//                 {children}
//             </span>

//             {/* 🔥 PORTAL FIX */}
//             {open && (
//                 <FloatingPortal>
//                     <div
//                         ref={refs.setFloating}
//                         style={floatingStyles}
//                         // className="z-[9999] min-w-[50px] break-words rounded-lg bg-[#1c1c1e]/95 backdrop-blur-md border border-white/10 shadow-black/40 px-4 py-3 text-sm text-white pointer-events-none transition-opacity duration-150">
//                         className="z-[9999] max-w-[300px] w-fit break-words rounded-lg bg-[#1c1c1e]/95 backdrop-blur-md border border-white/10 shadow-black/40 px-4 py-3 text-sm text-white pointer-events-none transition-opacity duration-150"
//                     >
//                         {/* 🔺 ARROW */}
//                         <div
//                             ref={arrowRef}
//                             className="absolute w-2.5 h-2.5 bg-[#1c1c1e]/95 rotate-45 border-r border-b border-white/10"
//                             style={{
//                                 left: middlewareData.arrow?.x ?? "",
//                                 top: middlewareData.arrow?.y ?? "",
//                                 [placement.startsWith("top") ? "bottom" : "top"]: "-4px",
//                             }}
//                         />
//                         <p className="leading-snug line-clamp-3">
//                             {title}
//                         </p>
//                     </div>
//                 </FloatingPortal>
//             )}
//         </>
//     );
// }




import { useState, useRef } from "react";
import {
    useFloating,
    offset,
    flip,
    shift,
    autoUpdate,
    FloatingPortal,
    arrow,
    useHover,
    useInteractions,
    safePolygon,
    useFocus,
} from "@floating-ui/react";
import { FiCopy, FiCheck } from "react-icons/fi";
import { HugeiconsIcon } from '@hugeicons/react'
import { CopyIcon } from '@hugeicons/core-free-icons'

export default function HoverCard({ title, children }) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const arrowRef = useRef(null);

    const {
        refs,
        floatingStyles,
        middlewareData,
        placement,
        context,
    } = useFloating({
        open,
        onOpenChange: setOpen,
        placement: "top",

        middleware: [
            offset(10),
            flip(),
            shift({ padding: 8 }),
            arrow({ element: arrowRef }),
        ],

        whileElementsMounted: autoUpdate,
    });

    const hover = useHover(context, {
        move: false,
        handleClose: safePolygon({
            buffer: 4,
        }),
    });

    const focus = useFocus(context);

    const {
        getReferenceProps,
        getFloatingProps,
    } = useInteractions([
        hover,
        focus,
    ]);

    const handleCopy = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await navigator.clipboard.writeText(title);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <>
            {/* Trigger */}
            <span
                ref={refs.setReference}
                className="inline-block"
                {...getReferenceProps()}
            >
                {children}
            </span>

            {/* Tooltip */}
            {open && (
                <FloatingPortal>
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                        className="
                            relative
                            z-[9999]

                            max-w-[300px]
                            w-fit

                            break-words
                            rounded-lg

                            bg-[var(--keyzoo-bg-card)]
                            border border-[var(--keyzoo-border)]

                            backdrop-blur-md

                            shadow-[var(--keyzoo-shadow-hover)]

                            px-4
                            py-3
                            pr-11

                            text-sm
                            text-[var(--keyzoo-text)]

                            pointer-events-auto
                        "
                    >
                        {/* Arrow */}
                        <div
                            ref={arrowRef}
                            className="
                                absolute
                                h-2.5
                                w-2.5

                                rotate-45

                                bg-[var(--keyzoo-bg-card)]

                                border-r
                                border-b
                                border-[var(--keyzoo-border)]
                            "
                            style={{
                                left: middlewareData.arrow?.x ?? "",
                                top: middlewareData.arrow?.y ?? "",
                                [placement.startsWith("top")
                                    ? "bottom"
                                    : "top"]: "-4px",
                            }}
                        />

                        {/* Title */}
                        <p className="leading-snug">
                            {title}
                        </p>

                        {/* Copy */}
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="
                                absolute
                                right-2
                                bottom-2

                                flex
                                h-7
                                w-7
                                items-center
                                justify-center

                                rounded-md

                                text-[var(--keyzoo-text-muted)]

                                transition-all
                                duration-200

                                hover:bg-[var(--keyzoo-primary)]/10
                                hover:text-[var(--keyzoo-primary-light)]

                                active:scale-95
                            "
                            title={copied ? "Copied!" : "Copy"}
                        >
                            {copied ? (
                                <FiCheck
                                    size={15}
                                    className="text-[var(--keyzoo-success)]"
                                />
                            ) : (
                                <HugeiconsIcon icon={CopyIcon} />
                            )}
                        </button>
                    </div>
                </FloatingPortal>
            )}
        </>
    );
}