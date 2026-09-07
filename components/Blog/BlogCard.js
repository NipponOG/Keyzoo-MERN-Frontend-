import Link from "next/link";

export default function BlogCard({ post }) {
    const image =
        post.coverImage?.formats?.small?.url || post.coverImage?.url;

    return (
        <Link href={`/blog/${post.slug}`}>
            <div className="group cursor-pointer bg-purple-100/10 rounded-xl p-4">

                <div className="overflow-hidden rounded-xl aspect-[16/9]">
                    <img
                        src={image}
                        className="w-full h-full object-center group-hover:scale-105 transition"
                        alt={post.title}
                    />
                </div>

                <p className="text-indigo-400 text-sm mt-3">
                    {post.category?.name || "Guide"}
                </p>

                <h3 className="text-white font-semibold text-lg mt-2 line-clamp-1 leading-snug">
                    {post.heading_title}
                </h3>

                {/* <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                    {post.excerpt}
                </p> */}

                <div className="flex items-center gap-2 mt-2">
                    <img src="https://res.cloudinary.com/dblttl9bh/image/upload/v1777040886/download_72b365daca.png" className="w-12 h-12 rounded-full" />
                    <div className="flex flex-col"><span className="text-gray-300">By {post.author?.data?.attributes?.name || "Admin"}</span>
                        <p className="text-gray-400 text-sm">
                            {new Date(post.publishedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

            </div>
        </Link>
    );
}