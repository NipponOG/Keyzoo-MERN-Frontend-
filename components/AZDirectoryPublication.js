// components/AZDirectory.js
import { useEffect, useRef } from "react"
import Link from "next/link"

export default function AZDirectory({ data, search, onActiveChange }) {
  const observer = useRef(null)

  useEffect(() => {
    const sections = document.querySelectorAll("[data-letter]")

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onActiveChange(entry.target.dataset.letter)
          }
        })
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0
      }
    )

    sections.forEach((s) => observer.current.observe(s))
    return () => observer.current.disconnect()
  }, [onActiveChange])

  return (
    <div className="space-y-24">
      {Object.entries(data).map(([letter, items]) => {
        const filtered = items.filter((item) =>
          item.toLowerCase().includes(search.toLowerCase())
        )

        if (!filtered.length) return null

        return (
          <section
            key={letter}
            id={`section-${letter}`}
            data-letter={letter}
          >
            <h2 className="mb-9 text-xl font-semibold tracking-wide">
              {letter}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-24">
              {filtered.map((name) => (
                <Link
                  key={name}
                  href="#"
                  className="text-white/80 hover:text-white transition text-lg"
                >
                  {name}
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
