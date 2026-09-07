import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";

export default function ProductSkeleton() {
    return (
        <div className="p-1 rounded-lg bg-white dark:bg-[#1a1a1a] max-w-[260px] mx-auto">
            <div className="relative w-full aspect-[3/5] mb-2 rounded-md overflow-hidden">
                <Skeleton height="100%" />
            </div>

            <div className="px-3">
                <Skeleton height={14} width="90%" />
                <Skeleton height={12} width="60%" className="mt-2" />
                <Skeleton height={14} width="40%" className="mt-3" />
            </div>
        </div>
    );
}
