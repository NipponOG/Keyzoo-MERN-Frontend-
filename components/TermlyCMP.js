'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function TermlyCMP({ websiteUUID, autoBlock = true }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (!websiteUUID) {
            console.warn('⚠️ Termly WEBSITE UUID missing')
            return
        }

        if (document.getElementById('termly-cmp')) return

        const script = document.createElement('script')
        script.id = 'termly-cmp'
        script.src = 'https://app.termly.io/embed.min.js'
        script.async = true
        script.setAttribute('data-website-uuid', websiteUUID)
        if (autoBlock) {
            script.setAttribute('data-auto-block', 'on')
        }

        document.head.appendChild(script)
    }, [websiteUUID, autoBlock])

    // Re-init on route change
    useEffect(() => {
        window.Termly?.initialize?.()
    }, [pathname, searchParams])

    return null
}
