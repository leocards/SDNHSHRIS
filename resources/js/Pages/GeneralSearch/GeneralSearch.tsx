import Header, { TableHeader, TableRow } from "@/Components/Header";
import {
    PaginateProvider,
    usePagination,
} from "@/Components/Provider/paginate-provider";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import TableDataSkeletonLoader from "@/Components/TableDataSkeletonLoader";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { PaginationData } from "@/Components/ui/pagination";
import useDebounce from "@/Hooks/useDebounce";
import { PAGINATEDDATA, User } from "@/Types";
import { Departments } from "@/Types/types";
import { router } from "@inertiajs/react";
import { SearchNormal1 } from "iconsax-react";
import { X } from "lucide-react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import empty from "@/Assets/empty-personnel.svg";
import useWindowSize from "@/Hooks/useWindowResize";
import { useSidebar } from "@/Components/ui/sidebar";
import { cn } from "@/Lib/utils";

type GENERALSEARCHTYPE = User & { sr: number | null};

type Props = {
    user: PAGINATEDDATA<GENERALSEARCHTYPE>;
};

const GeneralSearch = (props: Props) => {
    return (
        <PaginateProvider<GENERALSEARCHTYPE>
            pageValue={props.user}
            url={route("general-search")}
        >
            <Main />
        </PaginateProvider>
    );
};

const Main = () => {
    const { page, onQuery } = usePagination<GENERALSEARCHTYPE>();
    const { setProcess } = useProcessIndicator();

    const searchRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 700);

    const { width } = useWindowSize()
    const { state, isMobile } = useSidebar()

    useEffect(() => {
        onQuery({ search });
    }, [debouncedSearch]);

    return (
        <div>
            <Header title="General Search" children="General Search" />
            <div className="my-5 relative">
                <Input
                    ref={searchRef}
                    className="formInput pr-11"
                    placeholder="Search name, certificate, etc."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                    onClick={() => {
                        search && setSearch("");
                        searchRef.current?.focus();
                    }}
                    variant="ghost"
                    size="icon"
                    className="size-7 absolute top-1/2 -translate-y-1/2 right-1.5"
                >
                    <SearchNormal1
                        data-search={search ? true : undefined}
                        className="absolute !size-4 scale-100 rotate-0 data-[search]:scale-0 data-[search]:rotate-90 transition duration-300"
                    />
                    <X
                        data-search={search ? true : undefined}
                        className="absolute scale-0 rotate-90 data-[search]:rotate-0 data-[search]:scale-100 transition duration-300"
                    />
                </Button>
            </div>

            <Card className="min-h-[27rem] relative">
                <TableDataSkeletonLoader
                    data="user"
                    columns={`1fr ${state === "expanded" ? (width <= 485 ? "":"9rem") : "9rem"} ${state === "expanded" ? (width <= 1012 ? "":"12rem 6rem") : (width > 1012 ? "12rem 6rem": width <= 856 ? "" : "12rem 6rem")} 5rem`}
                    length={8}
                >
                    {(column) => (
                        <Fragment>
                            <TableHeader
                                style={{ gridTemplateColumns: column }}
                            >
                                <div>Personnel Name</div>
                                <div className="justify-center data-[sidebarstate=expanded]:[@media(max-width:485px)]:!hidden data-[sidebarstate=collapsed]:[@media(max-width:485px)]:!hidden" data-sidebarstate={state}>Position</div>
                                <div className="justify-center data-[sidebarstate=expanded]:[@media(max-width:1012px)]:!hidden data-[sidebarstate=collapsed]:[@media(max-width:856px)]:!hidden" data-sidebarstate={state}>Department</div>
                                <div className="justify-center data-[sidebarstate=expanded]:[@media(max-width:1012px)]:!hidden data-[sidebarstate=collapsed]:[@media(max-width:856px)]:!hidden" data-sidebarstate={state}>Credits</div>
                                <div></div>
                            </TableHeader>
                            {page?.data.length === 0 && (
                                <div className="flex flex-col items-center absolute inset-0 justify-center">
                                    <img
                                        className="size-24 opacity-40 dark:opacity-65"
                                        src={empty}
                                    />
                                    <div className="text-sm font-medium text-foreground/50 mt-1 text-center">
                                        No available personnel data.
                                    </div>
                                </div>
                            )}
                            {page?.data?.map((data, index) => (
                                <TableRow
                                    key={index}
                                    style={{ gridTemplateColumns: column }}
                                >
                                    <div className="uppercase">{data.name}</div>
                                    <div className="justify-center data-[sidebarstate=expanded]:[@media(max-width:485px)]:!hidden data-[sidebarstate=collapsed]:[@media(max-width:485px)]:!hidden" data-sidebarstate={state}>
                                        {data.position}
                                    </div>
                                    <div className="justify-center data-[sidebarstate=expanded]:[@media(max-width:1012px)]:!hidden data-[sidebarstate=collapsed]:[@media(max-width:856px)]:!hidden" data-sidebarstate={state}>
                                        {data.department == "N/A"
                                            ? "-"
                                            : Departments[data.department]}
                                    </div>
                                    <div className="justify-center data-[sidebarstate=expanded]:[@media(max-width:1012px)]:!hidden data-[sidebarstate=collapsed]:[@media(max-width:856px)]:!hidden" data-sidebarstate={state}>
                                        {data.credits + (data.role != 'teaching' ? (data.sr??0) : 0)}
                                    </div>
                                    <div className="justify-center">
                                        <Button
                                            variant="link"
                                            onClick={() =>
                                                router.get(
                                                    route(
                                                        "general-search.view",
                                                        [data.id]
                                                    ),
                                                    {},
                                                    {
                                                        onBefore: () =>
                                                            setProcess(true),
                                                    }
                                                )
                                            }
                                        >
                                            View
                                        </Button>
                                    </div>
                                </TableRow>
                            ))}
                        </Fragment>
                    )}
                </TableDataSkeletonLoader>
            </Card>

            <PaginationData />
        </div>
    );
};

export default GeneralSearch;
