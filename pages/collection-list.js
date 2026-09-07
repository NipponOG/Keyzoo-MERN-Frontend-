// pages/explore.js
import { useState } from "react"
import Head from "next/head"
import AZNav from "@/components/AZNav"
import AZDirectoryPublication from "@/components/AZDirectoryPublication"
import { azData } from "@/data/azData"

export default function ExplorePage() {
  const [search, setSearch] = useState("")
  const [activeLetter, setActiveLetter] = useState("A")

  return (
    <>
      <Head>
        <title>Explore Games & Categories | Keyzoo</title>
      </Head>

      <section className="min-h-screen text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-semibold tracking-tight">
              Explore Games & Categories
            </h1>

            {/* Search */}
            <div className="w-full max-w-md">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search games, publishers, categories..."
                className="
                  w-full rounded-lg
                  bg-[#111] border border-white/10
                  px-4 py-2.5 text-lg
                  text-white placeholder:text-white/40
                  focus:outline-none focus:ring-1 focus:ring-white/20
                "
              />
            </div>
          </div>

          {/* Sticky A–Z Nav */}
          <AZNav 
          activeLetter={activeLetter}
          data={azData}
          />

          {/* Directory */}
          <AZDirectoryPublication
            data={azData}
            search={search}
            onActiveChange={setActiveLetter}
          />

        </div>
      </section>
    </>
  )
}
