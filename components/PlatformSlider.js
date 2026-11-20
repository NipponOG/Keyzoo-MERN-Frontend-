import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/**
 * `svg`  -> symbol id inside /slider-svg/platform.svg
 * `slug` -> used for the link target (adjust the route below to match your app)
 * `bg`   -> Tailwind class (full string so Tailwind can detect it)
 * `style`-> only for backgrounds Tailwind can't express (Rockstar gradient)
 */
const PLATFORMS = [
    {
        label: 'Rockstar Games',
        slug: 'rockstar',
        svg: 'rockstar',
        style: {
            background:
                'linear-gradient(77.76deg, rgb(0,0,0) -5.75%, rgb(16,13,70) 17.78%, rgb(66,83,162) 37.39%, rgb(154,117,185) 55.12%, rgb(128,39,95) 71.3%, rgb(0,0,0) 96.98%)',
        },
        logoClass: 'w-[55px] h-[55px]',
    },
    { label: 'EA Play', slug: 'ea-play', svg: 'ea-play', bg: 'bg-[#FF4747]', logoClass: 'w-[150px] h-[55px]' },
    { label: 'Steam', slug: 'steam', svg: 'steam', bg: 'bg-[#0e5d8e]', logoClass: 'w-[160px] h-[55px]' },
    { label: 'Xbox', slug: 'xbox', svg: 'xbox', bg: 'bg-[#107c10]', logoClass: 'w-[150px] h-[55px]' },
    { label: 'PlayStation', slug: 'playstation', svg: 'psn', bg: 'bg-[#0080FF]', logoClass: 'w-[140px] h-[55px]' },
    { label: 'Nintendo', slug: 'nintendo', svg: 'nintendo', bg: 'bg-[#e60012]', logoClass: 'w-[150px] h-[55px]' },
    { label: 'Epic Games', slug: 'epic-games', svg: 'epic', bg: 'bg-[#1b1775]', logoClass: 'w-[90px] h-[90px]' },
    { label: 'GOG.com', slug: 'gog', svg: 'gogcom', bg: 'bg-[#4e21be]', logoClass: 'w-[120px] h-[80px]' },
];

/* ---- Tuning ------------------------------------------------------------ */
const DURATION_MS = 40000; // time for one full pass of all platforms (higher = slower)
const HOVER_RATE = 0.15;   // speed while hovered: 0 = stop completely, 0.15 = crawl, 1 = normal
const EASE = 0.1;          // how quickly speed ramps up/down (0–1, higher = snappier)
/* ------------------------------------------------------------------------ */

// Change this to match your routing, e.g. `/games?platform=${slug}`
const platformHref = (slug) => `/platform/${slug}`;

const EDGE_FADE = 'linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)';

function PlatformCard({ label, slug, svg, bg = '', style, logoClass, hidden }) {
    return (
        <Link
            href={platformHref(slug)}
            aria-label={`Browse ${label} games`}
            aria-hidden={hidden || undefined}
            tabIndex={hidden ? -1 : undefined}
            draggable={false}
            className="group block focus:outline-none"
        >
            <div
                style={style}
                className={`
                    ${bg}
                    relative flex items-center justify-center overflow-hidden
                    h-[110px] sm:h-[130px] lg:h-[150px]
                    rounded-xl sm:rounded-2xl border border-white/10 shadow-lg shadow-black/20
                    transition-all duration-300 ease-out
                    group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/40
                    group-focus-visible:ring-2 group-focus-visible:ring-white
                `}
            >
                {/* soft highlight */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/25"
                />

                {/* shine sweep on hover */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/20 blur-md
                               opacity-0 transition-all duration-700 ease-out
                               group-hover:left-[130%] group-hover:opacity-100"
                />

                {/* Responsive logo scale lives on this wrapper so the hover scale on the svg doesn't conflict */}
                <div className="relative origin-center scale-[0.65] sm:scale-[0.82] lg:scale-100">
                    <svg
                        aria-hidden="true"
                        focusable="false"
                        className={`${logoClass} fill-current text-white drop-shadow-md
                                    transition-transform duration-300 group-hover:scale-105`}
                    >
                        <use href={`/slider-svg/platform.svg#${svg}`} />
                    </svg>
                </div>

                {/* Label: slides up on hover; always visible on touch devices (no hover) */}
                <span
                    className="pointer-events-none absolute inset-x-0 bottom-1.5 sm:bottom-2 translate-y-2 text-center
                               text-[10px] sm:text-xs font-semibold tracking-wide text-white/90 opacity-0
                               transition-all duration-300
                               group-hover:translate-y-0 group-hover:opacity-100
                               [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100"
                >
                    {label}
                </span>
            </div>
        </Link>
    );
}

export default function PlatformSlider() {
    const trackRef = useRef(null);
    const animRef = useRef(null);
    const rafRef = useRef(0);
    const [reduceMotion, setReduceMotion] = useState(false);

    // Respect the OS "reduce motion" setting
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduceMotion(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    /**
     * Seamless infinite marquee.
     * The track holds 3 identical copies of the list; sliding it left by exactly
     * one copy (-33.333%) and restarting is visually identical, so it never jumps
     * and never runs out of slides on wide screens.
     */
    useEffect(() => {
        const track = trackRef.current;
        if (!track || reduceMotion) return;

        const anim = track.animate(
            [
                { transform: 'translate3d(0,0,0)' },
                { transform: 'translate3d(-33.3333%,0,0)' },
            ],
            { duration: DURATION_MS, iterations: Infinity, easing: 'linear' }
        );
        animRef.current = anim;

        return () => {
            cancelAnimationFrame(rafRef.current);
            anim.cancel();
            animRef.current = null;
        };
    }, [reduceMotion]);

    // Smoothly ease the playback speed toward a target (no abrupt stops/starts)
    const setSpeed = useCallback((target) => {
        const anim = animRef.current;
        if (!anim) return;
        cancelAnimationFrame(rafRef.current);

        const step = () => {
            const diff = target - anim.playbackRate;
            if (Math.abs(diff) < 0.01) {
                anim.playbackRate = target;
                return;
            }
            anim.playbackRate += diff * EASE;
            rafRef.current = requestAnimationFrame(step);
        };
        step();
    }, []);

    const slow = useCallback(() => setSpeed(HOVER_RATE), [setSpeed]);
    const resume = useCallback(() => setSpeed(1), [setSpeed]);

    // 3 copies for the animated marquee; a single scrollable copy for reduced motion
    const copies = reduceMotion ? 1 : 3;

    return (
        <section className="my-6" aria-labelledby="platforms-heading">
            <h2
                id="platforms-heading"
                className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold dark:text-white"
            >
                Explore By Platforms
            </h2>

            <div
                // mouse
                onMouseEnter={slow}
                onMouseLeave={resume}
                // keyboard focus
                onFocusCapture={slow}
                onBlurCapture={resume}
                // touch: slow while a finger is down, resume on release
                onTouchStart={slow}
                onTouchEnd={resume}
                onTouchCancel={resume}
                style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}
                className={`py-3 ${reduceMotion ? 'overflow-x-auto' : 'overflow-hidden'}`}
            >
                <div ref={trackRef} className="flex w-max will-change-transform">
                    {Array.from({ length: copies }).map((_, copyIndex) => (
                        <div key={copyIndex} className="flex" aria-hidden={copyIndex > 0 || undefined}>
                            {PLATFORMS.map((platform) => (
                                <div
                                    key={`${copyIndex}-${platform.slug}`}
                                    // item widths are fixed per breakpoint; padding (not gap) keeps all copies exactly equal width
                                    className="w-[210px] sm:w-[250px] lg:w-[300px] shrink-0 pr-3 sm:pr-4 lg:pr-5"
                                >
                                    <PlatformCard {...platform} hidden={copyIndex > 0} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}