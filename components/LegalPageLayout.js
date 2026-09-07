import Head from "next/head"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function LegalPageLayout({
    title,
    tagline,
    content,
    seo,
    lastUpdated
}) {
    return (
        <>
            <Head>
                <title>{seo?.seo_title || title}</title>
                {seo?.seo_description && (
                    <meta name="description" content={seo.seo_description} />
                )}
            </Head>

            <section className="text-white">
                <div className="max-w-7xl mx-auto px-4 py-10">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {title}
                        </h1>

                        {/* {tagline && (<h3 className="mt-2 text-lg text-white/70">
                            {tagline}
                        </h3>)} */}

                        {lastUpdated && (
                            <p className="mt-2 text-sm text-white/50">
                                Last updated: {lastUpdated}
                            </p>
                        )}
                    </div>

                    {/* Document Container */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">

                        {/* Main Legal Content */}
                        <div className="bg-[#1e1e1e] border-none outline-none border-white/10 rounded-xl p-6 md:p-8">
                            <article
                                className="
                                    prose prose-invert max-w-none
                                    prose-h2:text-lg
                                    prose-h2:font-semibold
                                    prose-h2:mt-8
                                    prose-h2:mb-3
                                    prose-p:text-white/80
                                    prose-li:text-white/80
                                    prose-strong:text-white
                                "
                            >
                                <ReactMarkdown
                                    components={{
                                        h2: ({ node, ...props }) => <h2 className="text-md font-bold mt-6 mb-2" {...props} />,    //importent but if you add h2 on heading description
                                        h3: ({ node, ...props }) => <h3 className="text-md font-bold mt-6 mb-2 underline" {...props} />,    //importent but if you add h2 on heading description
                                        strong: ({ node, ...props }) => <strong className="text-md font-bold text-white" {...props} />,    //importent but if you add h2 on heading description
                                        ul: ({ node, ...props }) => <ul className="list-disc pl-10 text-justify" {...props} />,   //importent
                                        li: ({ node, ...props }) => <li className="mb-3.5" {...props} />,   //importent
                                        p: ({ node, ...props }) => <p className="mb-2 leading-relaxed text-[#bfbfbf] text-justify" {...props} />,   //importent
                                    }}
                                >
                                    {content}
                                </ReactMarkdown>
                            </article>
                        </div>

                        {/* Sidebar */}
                        <aside className="hidden lg:block sticky top-24 h-fit">
                            <div className="rounded-xl border-none outline-none border-white/10 bg-[#1e1e1e] p-5">
                                <p className="text-sm font-medium mb-3">
                                    Legal Information
                                </p>

                                <ul className="space-y-2 text-sm text-white/70">
                                    <li>• This agreement is legally binding</li>
                                    <li>• Subject to updates without notice</li>
                                    <li>• Applies to all users</li>
                                    <li>• Contact support for clarification</li>
                                </ul>
                            </div>
                        </aside>

                    </div>
                </div>
            </section>
        </>
    )
}
