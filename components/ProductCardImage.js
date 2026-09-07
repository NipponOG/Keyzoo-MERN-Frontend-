import { useState } from "react";
import Image from "next/image";

export default function ProductCardImage({
    imgUrl,
    blurUrl,
    title,
    available,
}) {

    const [loaded, setLoaded] = useState(false);

    return (
        <>
            {/* BLUR IMAGE */}
            <Image
                src={blurUrl}
                alt=""
                fill
                className={`
          object-cover scale-110 blur-xl
          transition-opacity duration-500
          ${loaded ? "opacity-0" : "opacity-100"}
        `}
            />

            {/* REAL IMAGE */}
            <Image
                src={imgUrl}
                alt={title}
                fill
                onLoad={() => setLoaded(true)}
                className={`object-center transition-all duration-700 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
          ${available === false
                        ? "grayscale opacity-60"
                        : ""}
        `}
            />
        </>
    );
}