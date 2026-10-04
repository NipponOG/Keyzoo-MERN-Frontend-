export function buildAZMap(items) {
    const map = {}

    for (let i = 65; i <= 90; i++) {
        map[String.fromCharCode(i)] = []
    }

    items.forEach((item) => {
        const letter = item.title?.[0]?.toUpperCase()

        if (map[letter]) {
            map[letter].push({
                title: item.title,
                slug: item.slug,
                type: item.type,
            })
        }
    })

    return map
}