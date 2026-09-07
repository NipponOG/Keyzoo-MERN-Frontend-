// this file is used to load media files (images, audio, video) using cloudinary and also strapi media library

export function getStrapiMedia(url) {
    if (!url) return null;

    // If already absolute (Cloudinary or external)
    if (url.startsWith("http") || url.startsWith("https")) {
        return url;
    }

    // If relative (Strapi local upload)
    return `${process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL}${url}`;
}

// export function getStrapiMedia(url, options = {}) {
//     if (!url) return null;

//     const {
//         width = 1200,
//         height = 600,
//         brightness = 10,
//         contrast = 10,
//         saturation = 10,
//     } = options;

//     // If Cloudinary or external
//     if (url.startsWith("http")) {
//         // Apply Cloudinary transformations
//         return url.replace(
//             "/upload/",
//             `/upload/f_auto,q_auto,c_fill,w_${width},h_${height},e_brightness:${brightness},e_contrast:${contrast},e_saturation:${saturation}/`
//         );
//     }

//     // If local Strapi image
//     return `${process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL}${url}`;
// }
