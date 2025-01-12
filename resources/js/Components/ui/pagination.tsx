import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/Lib/utils";
import { Button, ButtonProps, buttonVariants } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import { PAGINATEDDATA } from "@/Types";
import { usePagination } from "../Provider/paginate-provider";
import { TooltipLabel } from "./tooltip";
import TypographySmall from "../Typography";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
    />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
    />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = React.PropsWithChildren &
    ButtonProps & {
        isActive?: boolean;
        className?: string;
        icon?: React.ReactNode;
    };

const PaginationLink = ({
    className,
    isActive,
    size = "icon",
    ...props
}: PaginationLinkProps) => (
    <Button
        aria-current={isActive ? "page" : undefined}
        className={cn(
            isActive && "dark:bg-white/5",
            className
        )}
        size={size}
        variant={isActive ? "outline" : "ghost"}
        {...props}
    />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
    className,
    icon,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to previous page"
        // size="default"
        className={cn(
            // "gap-1 pl-2.5 [@media(max-width:360px)]:px-2.5",
            className
        )}
        {...props}
    >
        {icon ? icon : <ChevronLeft className="h-4 w-4" />}
        {/* <span className="[@media(max-width:360px)]:hidden">Previous</span> */}
    </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
    className,
    icon,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to next page"
        // size="default"
        className={cn(
            // "gap-1 pr-2.5 [@media(max-width:360px)]:px-2.5",
            className
        )}
        {...props}
    >
        {/* <span className="[@media(max-width:360px)]:hidden">Next</span> */}
        {icon ? icon : <ChevronRight className="h-4 w-4" />}
    </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
    className,
    ...props
}: React.ComponentProps<"span">) => (
    <span
        aria-hidden
        className={cn("flex h-9 w-9 items-center justify-center", className)}
        {...props}
    >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">More pages</span>
    </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

const PaginationData = () => {
    const { page, onNavigatePage } = usePagination();
    const [links, setLinks] = React.useState<Array<{ active: boolean; label: StaticRange; url: string | null }>>()
    const [{ from, to, total }, setPageSets] = React.useState({
        from: page?.from,
        to: page?.to,
        total: page?.total,
    });

    React.useEffect(() => {
        if (page) {
            setPageSets({
                from: page?.from,
                to: page?.to,
                total: page?.total,
            });
            setLinks(page.links.slice(1, -1))
        }
    }, [page]);

    return (
        <Pagination className="mt-4 items-center px-2">
            <div className="h-9 items-center bor der border-border rounded-md flex">
                {total == 0 || !total ? (
                    <TypographySmall>0 records</TypographySmall>
                ) : (
                    <TypographySmall>
                        {from}-{to} of {total} records
                    </TypographySmall>
                )}
            </div>
            <PaginationContent className="ml-auto">
                <small className="text-sm font-medium leading-none mr-4">
                    Page {page?.current_page??1} of {page?.last_page??1}
                </small>
                <PaginationItem>
                    <TooltipLabel label="First page">
                        <PaginationPrevious
                            disabled={!page?.prev_page_url}
                            onClick={() => onNavigatePage('first')}
                            icon={<ChevronsLeft />}
                            isActive
                        />
                    </TooltipLabel>
                </PaginationItem>
                <PaginationItem>
                    <TooltipLabel label="Previous">
                        <PaginationPrevious
                            disabled={!page?.prev_page_url}
                            onClick={() => onNavigatePage('prev')}
                            isActive
                        />
                    </TooltipLabel>
                </PaginationItem>
                <PaginationItem>
                    <TooltipLabel label="Next">
                        <PaginationNext
                            disabled={!page?.next_page_url}
                            onClick={() => onNavigatePage('next')}
                            isActive
                        />
                    </TooltipLabel>
                </PaginationItem>
                <PaginationItem>
                    <TooltipLabel label="Last page">
                        <PaginationPrevious
                            disabled={!page?.next_page_url}
                            onClick={() => onNavigatePage('last')}
                            icon={<ChevronsRight />}
                            isActive
                        />
                    </TooltipLabel>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
    PaginationData,
};
