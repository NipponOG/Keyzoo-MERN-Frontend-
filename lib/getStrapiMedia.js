export const getStrapiMedia = (
    url,
    options = {}
) => {
    if (!url) return "";

    // Support old Strapi-style media objects
    if (typeof url === "object") {
        url =
            url.url ||
            url?.data?.attributes?.url ||
            "";

        if (!url) return "";
    }

    // Make sure we only work with strings
    if (typeof url !== "string") {
        return "";
    }

    const {
        blur = false,
        width,
        quality = "auto",
    } = options;

    // CLOUDINARY
    if (url.includes("res.cloudinary.com")) {
        const [base, rest] =
            url.split("/image/upload/");

        if (!rest) return url;

        // BLUR PLACEHOLDER
        if (blur) {
            return `${base}/image/upload/e_blur:1000,q_1,w_50/${rest}`;
        }

        // MAIN IMAGE OPTIMIZATION
        return `${base}/image/upload/f_auto,q_${quality},dpr_auto,e_auto_color,e_brightness:35,e_saturation:60,e_vibrance:70,e_contrast:35,e_sharpen:200${width ? `,w_${width}` : ""
            }/${rest}`;
    }

    // ABSOLUTE URL
    if (url.startsWith("http")) {
        return url;
    }

    // Legacy/local path
    if (
        process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL
    ) {
        return `${process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL}${url}`;
    }

    return url;
};