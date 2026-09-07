export default function BlockRenderer({ blocks }) {
    if (!blocks) return null;

    return (
        <div className="space-y-8 text-gray-200 leading-relaxed">

            {blocks.map((block, index) => {
                switch (block.__component) {

                    // 🧠 HEADING
                    case "blog.heading":
                        return (
                            <h2 key={index} className="text-2xl font-bold text-white mt-8">
                                {block.heading_title}
                            </h2>
                        );

                    // 📝 TEXT
                    case "blog.text-block":
                        return (
                            <div
                                key={index}
                                className="prose prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: block.text }}
                            />
                        );

                    // 🖼 IMAGE (FULL WIDTH LIKE YOUR SCREENSHOT)
                    case "blog.image": {
                        const image =
                            block.image?.formats?.large?.url || block.image?.url;

                        return (
                            <div key={index} className="my-6">
                                <img
                                    src={image}
                                    className="w-full rounded-xl border border-gray-800"
                                    alt="blog"
                                />
                                {block.caption && (
                                    <p className="text-sm text-gray-400 mt-2">
                                        {block.caption}
                                    </p>
                                )}
                            </div>
                        );
                    }

                    // 🔥 STEP BLOCK (MATCH YOUR STYLE)
                    case "blog.step": {
                        const image =
                            block.image?.formats?.large?.url || block.image?.url;

                        return (
                            <div key={index} className="space-y-4">

                                {/* Step title */}
                                <h3 className="text-lg font-semibold text-white">
                                    {block.stepNumber}. {block.title}
                                </h3>

                                {/* Step description */}
                                <div
                                    className="prose prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: block.description,
                                    }}
                                />

                                {/* Step image */}
                                {image && (
                                    <img
                                        src={image}
                                        className="w-full rounded-xl border border-gray-800"
                                        alt={block.title}
                                    />
                                )}
                            </div>
                        );
                    }

                    default:
                        return null;
                }
            })}

        </div>
    );
}