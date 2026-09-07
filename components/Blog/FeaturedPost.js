import Image from "next/image";

export default function FeaturedPost() {

    return (
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[16/6] cursor-pointer group">
            <Image
                src="https://res.cloudinary.com/dblttl9bh/image/upload/v1776782558/samurai_atsu_ghost_6200x2880_19072_c6949ecdbf.jpg"
                alt="image"
                fill
                priority
                quality={100}
                sizes="(max-width: 768px) 100vw, 1200px"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition"
            />
        </div>
    );
}