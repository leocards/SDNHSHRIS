import Header, { TableHeader, TableRow } from "@/Components/Header";
import {
    PaginateProvider,
    usePagination,
} from "@/Components/Provider/paginate-provider";
import TableDataSkeletonLoader from "@/Components/TableDataSkeletonLoader";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { FilterButton, FilterItem } from "@/Components/ui/menubar";
import { PaginationData } from "@/Components/ui/pagination";
import { PAGINATEDDATA, SCHOOLYEAR } from "@/Types";
import { ArrowRight2, ClipboardTick, Edit, Eye } from "iconsax-react";
import React, { Fragment, PropsWithChildren, useState } from "react";
import Attendance from "./Attendance";
import empty from "@/Assets/empty-tardiness.svg";
import { ProfilePhoto } from "@/Components/ui/avatar";
import { format } from "date-fns";
import { usePage } from "@inertiajs/react";
import useWindowSize from "@/Hooks/useWindowResize";
import ViewAttendance from "./ViewAttendance";
import { useSidebar } from "@/Components/ui/sidebar";

export type TARDINESSTYPE = {
    id: number;
    user: {
        id: number;
        name: string;
        avatar: string;
    };
    present: number;
    absent: number;
    timetardy: number;
    undertime: number;
    schoolyear: {
        id: number;
        schoolyear: string;
    };
    month: string;
};

type TardinessProps = PropsWithChildren & {
    tardinesses: PAGINATEDDATA<TARDINESSTYPE>;
    schoolyears: Array<SCHOOLYEAR>;
};

const Tardiness: React.FC<TardinessProps> = ({ ...props }) => {
    return (
        <PaginateProvider<TARDINESSTYPE>
            url={route("personnel.tardiness")}
            pageValue={props.tardinesses}
        >
            <Main {...props} />
        </PaginateProvider>
    );
};

const Main: React.FC<TardinessProps> = ({ schoolyears }) => {
    const { page, onQuery } = usePagination<TARDINESSTYPE>();
    const { props } = usePage();
    const { width } = useWindowSize();
    const { state } = useSidebar()

    const [filterSy, setFilterSy] = useState<{
        id: number;
        label: string;
    }>({
        id: schoolyears[0].id,
        label: schoolyears[0].schoolyear,
    });
    const [filterMonth, setFilterMonth] = useState(format(new Date(), "MMMM"));
    const [showAttendace, setShowAttendance] = useState(false);
    const [attendance, setAttendance] = useState<TARDINESSTYPE | null>(null);
    const [viewAttendance, setViewAttendance] = useState(false);

    return (
        <div>
            <Header title="New Personnel" className="mb-2">
                <div className="flex items-center gap-1">
                    Personnel{" "}
                    <ArrowRight2 className="size-4 [&>path]:stroke-[3]" />{" "}
                    Tardiness
                </div>
            </Header>

            <div className="flex items-center justify-between mt-5 mb-4">
                <div className="flex gap-3">
                    <FilterButton
                        isDirty={filterSy.id != props.schoolyear?.id}
                        filter={filterSy.label}
                        tooltipLabel="Filter by school year"
                        onClearFilter={() => {
                            if (filterSy.id != props.schoolyear?.id) {
                                setFilterSy({
                                    id: props.schoolyear?.id!,
                                    label: props.schoolyear?.schoolyear!,
                                });
                                onQuery({
                                    sy: props.schoolyear?.id!,
                                    month: filterMonth,
                                });
                            }
                        }}
                    >
                        {schoolyears.map(({ schoolyear }, index) => (
                            <FilterItem
                                key={index}
                                value={schoolyear}
                                activeFilter={filterSy.label}
                                children={schoolyear}
                                onClick={(value) => {
                                    let selectedFilter = schoolyears.find(
                                        (sy) => sy.schoolyear == value
                                    )!;

                                    if (selectedFilter.id != filterSy.id) {
                                        setFilterSy({
                                            id: selectedFilter?.id,
                                            label: selectedFilter?.schoolyear,
                                        });
                                        onQuery({
                                            sy: selectedFilter?.id!,
                                            month: filterMonth,
                                        });
                                    }
                                }}
                            />
                        ))}
                    </FilterButton>
                    <FilterButton
                        isDirty={filterMonth != format(new Date(), "MMMM")}
                        filter={filterMonth}
                        tooltipLabel="Filter by month"
                        onClearFilter={() => {
                            if (filterMonth != format(new Date(), "MMMM")) {
                                setFilterMonth(format(new Date(), "MMMM"));
                                onQuery({
                                    sy: filterSy.id,
                                    month: format(new Date(), "MMMM"),
                                });
                            }
                        }}
                    >
                        {Array.from({ length: 12 }).map((_, index) => (
                            <FilterItem
                                key={index}
                                value={format(new Date(2024, index, 1), "MMMM")}
                                activeFilter={filterMonth}
                                onClick={(value) => {
                                    if (value != filterMonth) {
                                        setFilterMonth(value);
                                        onQuery({
                                            sy: filterSy.id,
                                            month: value,
                                        });
                                    }
                                }}
                            >
                                {format(new Date(2024, index, 1), "MMMM")}
                            </FilterItem>
                        ))}
                    </FilterButton>
                </div>

                <Button onClick={() => setShowAttendance(true)}>
                    <ClipboardTick className="[&>path]:stroke-[1]" />
                    <div className="max-sm:hidden">Attendance</div>
                </Button>
            </div>

            <Card className="min-h-[27rem] relative">
                <TableDataSkeletonLoader
                    data={["tardinesses"]}
                    length={8}
                    columns={
                        width <= 710
                            ? ["1fr", "7rem"]
                            : state === "expanded" && width <= 920 ? ["1fr", "7rem"] : [
                                  "minmax(6rem,1fr)",
                                  ...Array.from({ length: 4 }).map(
                                      () => "minmax(7rem,12rem)"
                                  ),
                                  "5rem",
                              ]
                    }
                >
                    {(column) => (
                        <Fragment>
                            <TableHeader
                                style={{ gridTemplateColumns: column }}
                                className=""
                            >
                                <div>Name</div>
                                <div className="[@media(max-width:711px)]:!hidden data-[sidebarstate=expanded]:[@media(max-width:920px)]:!hidden" data-sidebarstate={state}>
                                    No. of Days Present
                                </div>
                                <div className="[@media(max-width:711px)]:!hidden data-[sidebarstate=expanded]:[@media(max-width:920px)]:!hidden" data-sidebarstate={state}>
                                    No. of Days Absent
                                </div>
                                <div className="[@media(max-width:711px)]:!hidden data-[sidebarstate=expanded]:[@media(max-width:920px)]:!hidden" data-sidebarstate={state}>
                                    No. of Time Tardy
                                </div>
                                <div className="[@media(max-width:711px)]:!hidden data-[sidebarstate=expanded]:[@media(max-width:920px)]:!hidden" data-sidebarstate={state}>
                                    No. of Undertime
                                </div>
                                <div className="justify-center [@media(max-width:711px)]:!hidden data-[sidebarstate=expanded]:[@media(max-width:920px)]:!hidden" data-sidebarstate={state}>
                                    Edit
                                </div>
                                <div className="justify-center [@media(min-width:711px)]:!hidden data-[sidebarstate=expanded]:[@media(max-width:920px)]:!flex" data-sidebarstate={state}>
                                    Action
                                </div>
                            </TableHeader>
                            {page?.data.length === 0 && (
                                <div className="flex flex-col items-center absolute inset-0 justify-center">
                                    <img
                                        className="size-24 opacity-40 dark:opacity-65"
                                        src={empty}
                                    />
                                    <div className="text-sm font-medium text-foreground/50 mt-1 text-center">
                                        No recorded personnel tardiness <br />{" "}
                                        for the month of{" "}
                                        {filterMonth.toLowerCase()}.
                                    </div>
                                </div>
                            )}

                            {page?.data.map((tardiness, index) => (
                                <TableRow
                                    key={index}
                                    style={{ gridTemplateColumns: column }}
                                >
                                    <div className="gap-2">
                                        <ProfilePhoto
                                            src={tardiness?.user?.avatar}
                                        />
                                        <div className="line-clamp-1 break-words">
                                            {tardiness?.user?.name}
                                        </div>
                                    </div>
                                    <div className="[@media(max-width:711px)]:!hidden data-[sidebarstate=expanded]:[@media(max-width:920px)]:!hidden" data-sidebarstate={state}>
                                        {tardiness?.present}
                                    </div>
                                    <div className="[@media(max-width:711px)]:!hidden data-[sidebarstate=expanded]:[@media(max-width:920px)]:!hidden" data-sidebarstate={state}>
                                        {tardiness?.absent}
                                    </div>
                                    <div className="[@media(max-width:711px)]:!hidden data-[sidebarstate=expanded]:[@media(max-width:920px)]:!hidden" data-sidebarstate={state}>
                                        {tardiness?.timetardy}
                                    </div>
                                    <div className="[@media(max-width:711px)]:!hidden data-[sidebarstate=expanded]:[@media(max-width:920px)]:!hidden" data-sidebarstate={state}>
                                        {tardiness?.undertime}
                                    </div>
                                    <div className="justify-center [@media(max-width:711px)]:gap-2 data-[sidebarstate=expanded]:[@media(max-width:920px)]:gap-2" data-sidebarstate={state}>
                                        <Button
                                            className="size-8"
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                setShowAttendance(true)
                                            }
                                            onMouseOver={() =>
                                                setAttendance(tardiness)
                                            }
                                        >
                                            <Edit className="!size-4" />
                                        </Button>

                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="size-8 data-[sidebarstate=collapsed]:[@media(min-width:711px)]:hidden data-[sidebarstate=expanded]:[@media(min-width:920px)]:hidden"
                                            data-sidebarstate={state}
                                            onClick={() => setViewAttendance(true)}
                                            onMouseOver={() =>
                                                setAttendance(tardiness)
                                            }
                                        >
                                            <Eye />
                                        </Button>
                                    </div>
                                </TableRow>
                            ))}
                        </Fragment>
                    )}
                </TableDataSkeletonLoader>
            </Card>

            <PaginationData />

            <Attendance
                attendance={attendance}
                schoolyears={schoolyears}
                show={showAttendace}
                onClose={() => {
                    setShowAttendance(false);
                    setTimeout(() => {
                        setAttendance(null);
                    }, 500);
                }}
                onSuccess={() =>
                    onQuery({ sy: filterSy.id, month: filterMonth })
                }
            />

            <ViewAttendance
                show={viewAttendance}
                onClose={setViewAttendance}
                attendance={attendance}
            />
        </div>
    );
};

export default Tardiness;
