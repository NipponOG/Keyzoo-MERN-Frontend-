import React from 'react'
import LegalPageLayout from "@/components/LegalPageLayout"
import { fetchFromStrapi } from "@/lib/strapi"

export async function getServerSideProps() {
    const res = await fetchFromStrapi(
        "api/privacy-policies?populate=*"
    )

    const page = res?.data?.[0] || null

    if (!page) return { notFound: true }

    return {
        props: {
            page,
        },
    }
}

const privacyPolicy = ({ page }) => {
    return (
        <LegalPageLayout
            title={page.title}
            tagline={page.tagline}
            content={page.content}
            lastUpdated={page.updatedAt?.split("T")[0]}
            seo={{
                seo_title: page.seo_title,
                seo_description: page.seo_description,
            }}
        />
    )
}

export default privacyPolicy