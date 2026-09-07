import { Skeleton } from "@/components/ui/skeleton";

export default function ProductPageSkeleton() {
    return (
        <div className="min-h-screen p-4 lg:p-6">
            <div className="max-w-[1500px] mx-auto">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-5">
                    <Skeleton className="h-4 w-12 bg-white/10" />
                    <Skeleton className="h-4 w-3 bg-white/10" />
                    <Skeleton className="h-4 w-20 bg-white/10" />
                    <Skeleton className="h-4 w-3 bg-white/10" />
                    <Skeleton className="h-4 w-28 bg-white/10" />
                    <Skeleton className="h-4 w-3 bg-white/10" />
                    <Skeleton className="h-4 w-[240px] max-w-[40vw] bg-white/10" />
                </div>

                {/* Main product layout */}
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-[240px_1fr_320px] xl:grid-cols-[260px_1fr_360px] 2xl:grid-cols-[260px_1fr_380px] gap-4 lg:gap-6 xl:gap-8">

                    {/* Cover */}
                    <div className="w-full flex justify-center lg:justify-start">
                        <Skeleton
                            className="
                w-full
                max-w-[240px]
                lg:max-w-[220px]
                xl:max-w-[240px]
                2xl:max-w-[260px]
                aspect-[260/360]
                rounded-xl
                bg-white/10
              "
                        />
                    </div>

                    {/* Main info */}
                    <div className="flex flex-col gap-4 w-full">

                        {/* Title */}
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-[85%] bg-white/10" />
                            <Skeleton className="h-6 w-[55%] bg-white/10" />
                        </div>

                        {/* Tags + rating */}
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-7 w-24 rounded-full bg-white/10" />
                            <Skeleton className="h-7 w-28 rounded-full bg-white/10" />
                            <Skeleton className="h-6 w-32 bg-white/10" />
                        </div>

                        <div className="border-t border-neutral-800 mt-2" />

                        {/* Feature grid */}
                        <div className="bg-[#171717] border border-white/10 rounded-2xl p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3"
                                    >
                                        <Skeleton className="h-12 w-12 rounded-xl shrink-0 bg-white/10" />

                                        <div className="flex-1 space-y-2 pt-1">
                                            <Skeleton className="h-4 w-[75%] bg-white/10" />
                                            <Skeleton className="h-3 w-[45%] bg-white/10" />
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>

                        {/* Region selector */}
                        <div className="bg-[#171717] border border-white/10 rounded-2xl p-5 flex items-center gap-5">
                            <Skeleton className="h-5 w-28 bg-white/10" />
                            <Skeleton className="h-[54px] flex-1 rounded-xl bg-white/10" />
                        </div>

                    </div>

                    {/* Pricing */}
                    <div className="w-full lg:max-w-[320px] xl:max-w-[360px] 2xl:max-w-[380px] mx-auto">
                        <div className="bg-gradient-to-br from-[#111] to-[#1a1a1a] p-4 rounded-2xl border border-neutral-800">

                            <Skeleton className="h-3 w-28 bg-white/10" />

                            <Skeleton className="h-8 w-32 mt-2 bg-white/10" />

                            <div className="flex gap-2 mt-2">
                                <Skeleton className="h-4 w-16 bg-white/10" />
                                <Skeleton className="h-4 w-20 bg-white/10" />
                            </div>

                            <Skeleton className="h-16 w-full rounded-lg mt-4 bg-white/10" />

                            <div className="flex gap-3 mt-4">
                                <Skeleton className="h-12 w-12 rounded-lg bg-white/10" />
                                <Skeleton className="h-12 flex-1 rounded-lg bg-white/10" />
                            </div>

                            <Skeleton className="h-16 w-full rounded-xl mt-5 bg-white/10" />

                            <div className="grid grid-cols-3 gap-1 mt-5">
                                <Skeleton className="h-16 rounded-l-lg bg-white/10" />
                                <Skeleton className="h-16 bg-white/10" />
                                <Skeleton className="h-16 rounded-r-lg bg-white/10" />
                            </div>

                        </div>
                    </div>

                </div>

                {/* Editions */}
                <div className="bg-[#171717] border border-white/10 rounded-2xl p-5 mt-6">
                    <Skeleton className="h-5 w-36 bg-white/10" />

                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="w-full sm:w-[180px] h-[90px] rounded-xl bg-white/10"
                            />
                        ))}
                    </div>
                </div>

                {/* Gallery */}
                <div className="bg-[#1a1a1a] p-4 rounded-xl mt-6 border border-[#2a2a2a]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="h-[250px] rounded-xl bg-white/10"
                            />
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="bg-[#1a1a1a] p-4 lg:p-6 rounded-xl mt-6 border border-[#2a2a2a]">
                    <Skeleton className="h-6 w-48 bg-white/10" />

                    <div className="space-y-3 mt-5">
                        <Skeleton className="h-4 w-full bg-white/10" />
                        <Skeleton className="h-4 w-[95%] bg-white/10" />
                        <Skeleton className="h-4 w-[88%] bg-white/10" />
                        <Skeleton className="h-4 w-[72%] bg-white/10" />
                    </div>
                </div>

                {/* System requirements */}
                <div className="bg-[#1a1a1a] p-4 lg:p-6 rounded-xl mt-6 border border-[#2a2a2a]">
                    <Skeleton className="h-5 w-48 bg-white/10" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="flex gap-3">
                                <Skeleton className="h-10 w-10 rounded-lg bg-white/10" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-3 w-[45%] bg-white/10" />
                                    <Skeleton className="h-4 w-[75%] bg-white/10" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}