// lib/breadcrumbs.js

function formatBreadcrumbLabel(value) {
    if (!value) return "";

    return String(value)
        .toLowerCase()
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getProductBreadcrumbs({ pathname, product }) {
    if (!product) {
        return [];
    }

    // Normal product
    if (pathname === "/product/[slug]") {
        return [
            {
                label: "Home",
                href: "/",
            },
            {
                label: "Store",
                href: "/store",
            },
            {
                label: formatBreadcrumbLabel(product.item_type) || "Games",
                href: "/store?productType=game",
            },
            {
                label: formatBreadcrumbLabel(product.title),
            },
        ];
    }

    // PSN Product
    if (pathname === "/store/category/product/psn/[slug]") {
        return [
            {
                label: "Home",
                href: "/",
            },
            {
                label: "Products",
                href: "/store",
            },
            {
                label: "PlayStation",
                href: "/store/category/product/psn",
            },
            {
                label: product.title,
            },
        ];
    }

    // Xbox Product
    if (pathname === "/store/category/product/xbox/[slug]") {
        return [
            {
                label: "Home",
                href: "/",
            },
            {
                label: "Products",
                href: "/store",
            },
            {
                label: "Xbox",
                href: "/store/category/product/xbox",
            },
            {
                label: product.title,
            },
        ];
    }

    // PSN Gift Card
    if (pathname === "/store/category/gift-card/psn/[slug]") {
        return [
            {
                label: "Home",
                href: "/",
            },
            {
                label: "Gift Cards",
                href: "/store/category/gift-card",
            },
            {
                label: "PlayStation",
                href: "/store/category/gift-card/psn",
            },
            {
                label: product.title,
            },
        ];
    }

    // Xbox Gift Card

    // Fallback
    return [
        {
            label: "Home",
            href: "/",
        },
        {
            label: product.title,
        },
    ];
}