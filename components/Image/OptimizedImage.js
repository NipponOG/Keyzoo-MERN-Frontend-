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

    const imageUrl = getStrapiMedia(src, {
        width,
        quality,
    });

    const blurUrl = blur
        ? getStrapiMedia(src, {
            blur: true,
        })
        : "";

    if (!imageUrl) {
        return null;
    }

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
                        object-cover
                        scale-110
                        blur-xl
                        transition-opacity
                        duration-500
                        ${loaded
                            ? "opacity-0"
                            : "opacity-100"
                        }
                    `}
                />
            )}

            {/* Real image */}
            <Image
                src={imageUrl}
                alt={alt}
                fill={fill}
                width={!fill ? width : undefined}
                height={!fill ? height : undefined}
                sizes={sizes}
                priority={priority}
                quality={quality}
                onLoad={() => setLoaded(true)}
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