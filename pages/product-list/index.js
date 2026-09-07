import { useEffect, useState } from "react"
import Head from "next/head"
import AZNav from "@/components/AZNav"
import AZDirectoryProduct from "@/components/AZDirectoryProduct"
import { buildAZMap } from "@/lib/buildAZMap"

export default function ProductCollectionListPage() {
    const [search, setSearch] = useState("")
    const [activeLetter, setActiveLetter] = useState("A")
    const [azData, setAzData] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch(
                // `${process.env.NEXT_PUBLIC_STRAPI_URL}/products?fields[0]=title&fields[1]=slug&pagination[pageSize]=1000`
                `${process.env.NEXT_PUBLIC_STRAPI_URL}api/products?fields[0]=title&fields[1]=slug&pagination[pageSize]=1000`
            )
            const json = await res.json()

            const products = json?.data || []
            setAzData(buildAZMap(products))
            setLoading(false)
        }

        fetchProducts()
    }, [])

    return (
        <>
            <Head>
                <title>All Products A–Z | Keyzoo</title>
            </Head>

            <section className="min-h-screen text-white">
                <div className="mx-auto max-w-7xl px-6 py-16">

                    {/* Header */}
                    <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            All Listed Products 
                        </h1>

                        <div className="w-full max-w-md">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products…"
                                className="w-full rounded-lg bg-[#111] border border-white/10 px-4 py-2.5 text-lg text-white placeholder:text-white/40 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Sticky A–Z Nav */}
                    {!loading && (
                        <AZNav
                            activeLetter={activeLetter}
                            data={azData}
                        />
                    )}

                    {/* Directory */}
                    {!loading && (
                        <AZDirectoryProduct
                            data={azData}
                            search={search}
                            onActiveChange={setActiveLetter}
                            type="product"
                        />
                    )}

                </div>
            </section>
        </>
    )
}
