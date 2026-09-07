// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// export default nextConfig;



/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'wise-horse-c531a7dfe7.strapiapp.com',
            },
            {
                protocol: 'https',
                hostname: 'wise-peace-adfa09b55e.strapiapp.com',
            },
            {
                protocol: 'https',
                hostname: 'active-reward-f841ad7084.media.strapiapp.com',
            },
            {
                protocol: 'https',
                hostname: 'active-reward-f841ad7084.strapiapp.com',
            },
            {
                protocol: 'https',
                hostname: 'playful-book-1c46d71b3d.media.strapiapp.com',
            },
            {
                protocol: 'https',
                hostname: 'stylish-gift-a7e817f55b.media.strapiapp.com',
            },
            {
                protocol: 'https',
                hostname: 'gmedia.playstation.com',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'static.driffle.com',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: 'driffle.com',
            },
            {
                protocol: 'https',   // Use http for local development or specific vps server
                hostname: 'database.keyzoo.shop',
            },
            {
                protocol: 'https',   // Use http for local development or specific vps server
                hostname: 'images.igdb.com',
            },
            {
                protocol: 'https',   // Use http for local development or specific vps server
                hostname: 'img.youtube.com',
            }
        ],
    },
    i18n: {
        locales: [
            "en",
            "de",
            "fr",
            "es",
            "pt",
            "it",
            "nl",
            "ja",
            "ko",
            "zh-CN",
        ],
        defaultLocale: "en",
    },
};

module.exports = nextConfig;
