import { memo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Cpu, HardDrive, Laptop, MemoryStick, Monitor, StickyNote, Volume2 } from "lucide-react";
import { getStrapiMedia } from "@/lib/getStrapiMedia";
import { CARD, MUTED, SECTION } from "./shared";

/* -------------------------------------------------------------------------- */
/*  Markdown (one shared component map instead of three copies)                */
/* -------------------------------------------------------------------------- */

const MD_COMPONENTS = {
    h2: ({ node, ...props }) => <h2 className="mb-2 mt-6 text-base font-bold" {...props} />,
    h3: ({ node, ...props }) => <h3 className="mb-2 mt-4 text-sm font-bold" {...props} />,
    strong: ({ node, ...props }) => (
        <strong className="font-bold text-gray-900 dark:text-white" {...props} />
    ),
    ul: ({ node, ...props }) => <ul className="mb-2 list-disc pl-5" {...props} />,
    ol: ({ node, ...props }) => <ol className="mb-2 list-decimal pl-5" {...props} />,
    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
    p: ({ node, ...props }) => (
        <p className="mb-2 leading-relaxed text-gray-600 dark:text-[#bfbfbf]" {...props} />
    ),
    a: ({ node, ...props }) => (
        <a
            className="text-blue-600 underline dark:text-[#359dff]"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
        />
    ),
};

const Markdown = memo(function Markdown({ children }) {
    return <ReactMarkdown components={MD_COMPONENTS}>{children}</ReactMarkdown>;
});

/* -------------------------------------------------------------------------- */
/*  Description                                                                */
/* -------------------------------------------------------------------------- */

const COLLAPSED_HEIGHT = 260;

export function ProductDescription({ product }) {
    const [expanded, setExpanded] = useState(false);
    // null = not measured yet (treated as collapsed so long text doesn't flash open)
    const [canExpand, setCanExpand] = useState(null);
    const bodyRef = useRef(null);

    useEffect(() => {
        const el = bodyRef.current;
        if (el) setCanExpand(el.scrollHeight > COLLAPSED_HEIGHT + 40);
        setExpanded(false);
    }, [product.slug]);

    const tags = Array.isArray(product.Tags) ? product.Tags : [];
    const clamped = !expanded && canExpand !== false;

    return (
        <section
            id="product-description"
            className={`${CARD} ${SECTION} relative scroll-mt-28 p-3 text-xs lg:p-4 lg:text-sm`}
        >
            <div
                ref={bodyRef}
                style={clamped ? { maxHeight: COLLAPSED_HEIGHT } : undefined}
                className={clamped ? "overflow-hidden" : ""}
            >
                <h2 className="mb-3 text-lg font-bold lg:mb-4 lg:text-xl">Product description</h2>
                <div className="mb-5 text-lg font-semibold">{product.title}</div>

                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                        {tags.map((tag, i) => (
                            <span
                                key={tag.id ?? i}
                                className="flex h-[35px] min-w-[100px] items-center justify-center rounded-2xl bg-gray-100 px-4 transition-all hover:bg-gray-200 dark:bg-[#2a2a2a] dark:hover:bg-[#333]"
                            >
                                {tag.Tags}
                            </span>
                        ))}
                    </div>
                )}

                {product.description && (
                    <div className="mt-5">
                        <Markdown>{product.description}</Markdown>
                    </div>
                )}

                {product.descriptionkey && (
                    <>
                        <div className="mt-5 font-bold">Key features</div>
                        <div className="mt-2 text-[0.875rem] leading-5">
                            <Markdown>{product.descriptionkey}</Markdown>
                        </div>
                    </>
                )}

                {product.editiondescription && (
                    <>
                        <div className="mt-5 font-bold">{product.editiontitle}</div>
                        <div className="mt-2 text-[0.875rem] leading-5">
                            <Markdown>{product.editiondescription}</Markdown>
                        </div>
                    </>
                )}
            </div>

            {clamped && canExpand && (
                <div className="pointer-events-none absolute inset-x-0 bottom-12 h-28 bg-gradient-to-t from-white to-transparent dark:from-[#171717]" />
            )}

            {canExpand && (
                <button
                    type="button"
                    onClick={() => setExpanded((e) => !e)}
                    aria-expanded={expanded}
                    className="relative z-10 mt-4 cursor-pointer text-[0.95rem] font-medium text-gray-600 transition hover:text-gray-900 dark:text-white/80 dark:hover:text-white"
                >
                    {expanded ? "Read less" : "Read more"}
                </button>
            )}
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*  System requirements                                                        */
/* -------------------------------------------------------------------------- */

const REQ_FIELDS = [
    { key: "os", label: "OS", Icon: Laptop },
    { key: "processor", label: "Processor", Icon: Cpu },
    { key: "memory", label: "Memory", Icon: MemoryStick },
    { key: "graphics", label: "Graphics", Icon: Monitor },
    { key: "storage", label: "Storage", Icon: HardDrive },
    { key: "sound", label: "Sound card", Icon: Volume2 },
    { key: "additional_notes", label: "Additional notes", Icon: StickyNote },
];

const hasRows = (data) => REQ_FIELDS.some(({ key }) => data?.[key]);

export function hasRequirements(product) {
    return hasRows(product.minimumRequirement) || hasRows(product.recommendedRequirement);
}

function RequirementGrid({ title, data, className = "" }) {
    const rows = REQ_FIELDS.filter(({ key }) => data?.[key]);
    if (!rows.length) return null;

    return (
        <div className={className}>
            <h3 className="text-base font-semibold lg:text-lg">{title}</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {rows.map(({ key, label, Icon }) => (
                    <div key={key} className="flex max-w-[400px] items-start gap-2 lg:gap-3">
                        <Icon className="h-5 w-5 shrink-0 text-blue-500 lg:h-6 lg:w-6" aria-hidden="true" />
                        <div>
                            <p className={`font-medium ${MUTED}`}>{label}:</p>
                            <p className="mt-2">{data[key]}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function SystemRequirements({ product }) {
    if (!hasRequirements(product)) return null;

    return (
        <section
            id="system-requirements"
            className={`${CARD} ${SECTION} scroll-mt-28 p-4 text-xs lg:p-6 lg:text-sm`}
        >
            {product.workPlatform && (
                <div className="mb-5 flex items-center gap-2">
                    <span className={`text-[14px] ${MUTED}`}>System:</span>
                    <span className="rounded-[20px] bg-gray-100 px-2 py-1.5 text-[14px] font-medium dark:bg-[#2f2f2f] lg:px-3">
                        {product.workPlatform}
                    </span>
                </div>
            )}

            <RequirementGrid title="Minimum system requirements" data={product.minimumRequirement} />
            <RequirementGrid
                title="Recommended system requirements"
                data={product.recommendedRequirement}
                className="mt-8 lg:mt-10"
            />
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*  Other details + languages                                                  */
/* -------------------------------------------------------------------------- */

export function OtherDetails({ product }) {
    const ageUrl = getStrapiMedia(product.age?.url);

    const facts = [
        ["Release date", product.releaseDate],
        ["Publishers", product.publisher],
        ["Developers", product.developer],
    ].filter(([, value]) => value);

    const languages = [
        ["Interface", product.interface_language?.interface],
        ["Full audio", product.audio_language?.audio],
        ["Subtitles", product.subtitles_language?.subtitles],
    ].filter(([, value]) => value);

    if (!facts.length && !ageUrl && !languages.length) return null;

    return (
        <section className={`${CARD} ${SECTION} p-4 text-xs lg:p-6 lg:text-sm`}>
            <h2 className="text-sm font-semibold lg:text-base">Other details</h2>

            {(facts.length > 0 || ageUrl) && (
                <dl className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
                    {facts.map(([label, value]) => (
                        <div key={label}>
                            <dt className={`mb-1 ${MUTED}`}>{label}</dt>
                            <dd>{value}</dd>
                        </div>
                    ))}
                    {ageUrl && (
                        <div>
                            <dt className={`mb-1 ${MUTED}`}>Age rating</dt>
                            <dd>
                                <Image src={ageUrl} alt="Age rating" width={32} height={32} className="h-8 w-8" />
                            </dd>
                        </div>
                    )}
                </dl>
            )}

            {languages.length > 0 && (
                <>
                    <hr className="my-4 border-gray-200 dark:border-[#333]" />
                    <h2 className="text-sm font-semibold lg:text-base">Languages support</h2>

                    <dl className="mt-3 divide-y divide-gray-200 dark:divide-[#333]">
                        {languages.map(([label, value]) => (
                            <div key={label} className="py-3 first:pt-0 last:pb-0">
                                <dt className={`mb-1 text-[16px] ${MUTED}`}>{label}:</dt>
                                <dd>{value}</dd>
                            </div>
                        ))}
                    </dl>
                </>
            )}
        </section>
    );
}