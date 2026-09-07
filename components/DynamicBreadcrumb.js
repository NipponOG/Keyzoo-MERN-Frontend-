import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DynamicBreadcrumb({ items = [] }) {
    return (
        <Breadcrumb className="mb-5">
            <BreadcrumbList>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <BreadcrumbItem key={`${item.label}-${index}`}>
                            {isLast ? (
                                <BreadcrumbPage className="min-w-[360px] truncate text-[var(--keyzoo-text)]">
                                    {item.label}
                                </BreadcrumbPage>
                            ) : (
                                <>
                                    <BreadcrumbLink asChild>
                                        <Link
                                            href={item.href}
                                            className="
                        text-[var(--keyzoo-text-muted)]
                        transition-colors
                        hover:text-[var(--keyzoo-primary-light)]
                      "
                                        >
                                            {item.label}
                                        </Link>
                                    </BreadcrumbLink>

                                    <BreadcrumbSeparator className="text-[var(--keyzoo-text-disabled)]" />
                                </>
                            )}
                        </BreadcrumbItem>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}