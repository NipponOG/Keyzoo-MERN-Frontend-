import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import useFavorites, { toFavoriteItem } from "@/hook/useFavorites";

// Route of your FavoritesPage. Change if it lives somewhere else.
const FAVORITES_HREF = "/favorites";

export default function WishlistButton({ product, className = "" }) {
    const router = useRouter();
    const { isFavorite, toggle, refresh } = useFavorites();

    const item = useMemo(() => toFavoriteItem(product), [product]);
    const active = isFavorite(item._id);

    // If this product is already saved, keep its saved price / stock up to date
    useEffect(() => {
        if (active) refresh(item);
    }, [active, item, refresh]);

    const handleClick = () => {
        const nowSaved = toggle(item);

        if (nowSaved) {
            toast.success("Added to favorites", {
                action: { label: "View", onClick: () => router.push(FAVORITES_HREF) },
            });
        } else {
            toast("Removed from favorites");
        }
    };

    const label = active ? "Remove from favorites" : "Add to favorites";

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-pressed={active}
            aria-label={label}
            title={label}
            className={`group flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all duration-200
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 active:scale-90
                        ${active
                    ? "border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20"
                    : "border-white/10 bg-white/5 hover:border-rose-400/50 hover:bg-rose-500/10"
                } ${className}`}
        >
            <Heart
                aria-hidden="true"
                className={`h-5 w-5 transition-all duration-200 ${active
                        ? "scale-110 fill-rose-500 text-rose-500"
                        : "text-gray-400 group-hover:text-rose-400"
                    }`}
            />
        </button>
    );
}