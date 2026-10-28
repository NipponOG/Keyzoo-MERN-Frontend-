/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();
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
                hostname: 'ucarecdn.com',
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

module.exports = removeImports(nextConfig);


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs/config");

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "tony-uw",
  project: "keyzoo-frontend",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
