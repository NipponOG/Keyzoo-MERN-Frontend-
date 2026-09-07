// lib/buildAZMap.js
export function buildAZMap(products) {
    const map = {}

    for (let i = 65; i <= 90; i++) {
        map[String.fromCharCode(i)] = []
    }

    products.forEach((p) => {
        const letter = p.title?.[0]?.toUpperCase()
        if (map[letter]) {
            map[letter].push({
                title: p.title,
                slug: p.slug,
            })
        }
    })

    return map
}
