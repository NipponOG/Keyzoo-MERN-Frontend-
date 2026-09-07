import { useState } from "react";
import BlogCard from "@/components/Blog/BlogCard";
import FeaturedPost from "@/components/Blog/FeaturedPost";
import CategoryTabs from "@/components/Blog/CategoryTabs";

// if mo author use this
export async function getServerSideProps() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}api/blogs?populate=*`
    );

    const data = await res.json();

    return {
        props: {
            posts: data.data || [],
        },
    };
}

// export async function getServerSideProps() {
//     const [blogsRes, authorsRes] = await Promise.all([
//         fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}api/blogs?populate=*`),
//         fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}api/authors?populate=*`)
//     ]);

//     const [blogsData, authorsData] = await Promise.all([
//         blogsRes.json(),
//         authorsRes.json()
//     ]);

//     return {
//         props: {
//             posts: blogsData.data || [],
//             authors: authorsData.data || [],
//         },
//     };
// }

export default function BlogPage({ posts }) {
    const [filtered, setFiltered] = useState(posts);

    // const featured = posts.find((p) => p.featured);

    const categories = [
        { name: "Steam", slug: "steam" },
        { name: "PlayStation", slug: "psn" },
        { name: "Xbox", slug: "xbox" },
    ];

    const handleFilter = (slug) => {
        if (slug === "all") return setFiltered(posts);

        setFiltered(posts.filter((p) => p.category?.slug === slug));
    };

    return (
        <div className="min-h-screen px-6 py-10">
            {/* Featured */}
            <FeaturedPost />

            {/* Tabs */}
            <CategoryTabs categories={categories} onChange={handleFilter} />

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                {filtered.map((post) => (
                    <BlogCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}