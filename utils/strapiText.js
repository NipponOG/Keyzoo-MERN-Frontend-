// utils/strapiText.js
export function blocksToText(blocks) {
    if (!blocks) return "";

    if (typeof blocks === "string") return blocks;

    if (Array.isArray(blocks)) {
        return blocks
            .map(block =>
                block.children?.map(child => child.text).join("")
            )
            .join("\n");
    }

    return "";
}
