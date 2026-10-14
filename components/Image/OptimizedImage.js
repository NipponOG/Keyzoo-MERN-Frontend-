import Image from "next/image";
import { useState } from "react";
import { getStrapiMedia } from "@/lib/getStrapiMedia";

const OptimizedImage = ({
    src,
    alt = "",
    width,
    height,
    fill = false,
    className = "",
    priority = false,
    sizes,
    quality,
    blur = true,
    ...props
}) => {

    const [loaded, setLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // const imageUrl = getStrapiMedia(src, {
    //     width,
    //     quality,
    // });

    // const blurUrl = blur
    //     ? getStrapiMedia(src, {
    //         blur: true,
    //     })
    //     : "";


    const fallbackImage = "/keyzoo-fallback.png";

    const rawImageUrl =
        typeof src === "string"
            ? src
            : src?.url || "";

    const imageUrl =
        imageError || !rawImageUrl
            ? fallbackImage
            : getStrapiMedia(rawImageUrl, {
                width,
                quality,
            });


    const blurUrl =
        blur && !imageError && rawImageUrl
            ? getStrapiMedia(rawImageUrl, { blur: true })
            : fallbackImage;


    const finalImageUrl = imageUrl || "/keyzoo-fallback.png";


    return (
        <div
            className={
                fill
                    ? "absolute inset-0 overflow-hidden"
                    : "relative overflow-hidden"
            }
        >
            {/* Blur placeholder */}
            {blur && blurUrl && (
                <Image
                    src={blurUrl}
                    alt=""
                    fill={fill}
                    width={!fill ? width : undefined}
                    height={!fill ? height : undefined}
                    sizes={sizes}
                    aria-hidden="true"
                    className={`
                        object-center
                        scale-110
                        blur-xl
                        transition-opacity
                        duration-500
                        ${loaded
                            ? "opacity-0"
                            : "opacity-100"
                        }
                    `}
                    // style={{
                    //     filter: "blur(20px)",
                    //     transform: "scale(1.1)",
                    // }}
                />
            )}

            {/* Real image */}
            <Image
                src={finalImageUrl}
                alt={alt}
                fill={fill}
                width={!fill ? width : undefined}
                height={!fill ? height : undefined}
                sizes={sizes}
                priority={priority}
                quality={quality}

                onLoad={() => {
                    setLoaded(true);
                }}

                onError={() => {
                    if (!imageError) {
                        setImageError(true);
                        setLoaded(false);
                    }
                }}
                className={`
                    relative
                    transition-all
                    duration-700
                    ${loaded
                        ? "scale-100 opacity-100"
                        : "scale-[1.03] opacity-0"
                    }
                    ${className}
                `}
                {...props}
            />
        </div>
    );
};

export default OptimizedImage;