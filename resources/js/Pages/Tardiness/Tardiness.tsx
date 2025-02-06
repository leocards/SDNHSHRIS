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
import { ArrowRight2, ClipboardTick, Edit } from "iconsax-react";
import React, { Fragment, PropsWithChildren, useState } from "react";
import empty from "@/Assets/empty-tardiness.svg";
import { ProfilePhoto } from "@/Components/ui/avatar";
import { format } from "date-fns";
import { usePage } from "@inertiajs/react";

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

    const [filterSy, setFilterSy] = useState<{
        id: number;
        label: string;
    }>({
        id: schoolyears[0].id,
        label: schoolyears[0].schoolyear,
    });
    const [filterMonth, setFilterMonth] = useState(format(new Date(), "MMMM"));

    const getAttendanceForTheMonth = (month: string) => {
        return page?.data.find((t) => t.month === month)
    }

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
                    {/* <FilterButton
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
                    </FilterButton> */}
                </div>
            </div>

            <Card className="relative">
                <TableDataSkeletonLoader
                    data={["tardinesses"]}
                    length={8}
                    columns={[
                        ...Array.from({ length: 5 }).map(
                            () => "1fr"
                        ),
                    ]}
                >
                    {(column) => (
                        <Fragment>
                            <TableHeader
                                style={{ gridTemplateColumns: column }}
                            >
                                <div className="justify-center">Month</div>
                                <div className="justify-center">No. of Days Present</div>
                                <div className="justify-center">No. of Days Absent</div>
                                <div className="justify-center">No. of Time Tardy</div>
                                <div className="justify-center">No. of Undertime</div>
                            </TableHeader>
                            {page?.data.length === 0 && (
                                <div className="flex flex-col items-center absolute inset-0 justify-center">
                                    <img
                                        className="size-24 opacity-40 dark:opacity-65"
                                        src={empty}
                                    />
                                    <div className="text-sm font-medium text-foreground/50 mt-1">
                                        No recorded personnel tardiness.
                                    </div>
                                </div>
                            )}

                            {Array.from({ length: 12 }).map((_, index) => {
                                const tardiness = getAttendanceForTheMonth(format(new Date(2024, index, 1), "MMMM"))

                                return (
                                    <TableRow
                                        key={index}
                                        style={{ gridTemplateColumns: column }}
                                    >
                                        <div className="justify-center">{format(new Date(2024, index, 1), "MMMM")}</div>
                                        <div className="justify-center">{tardiness?.present??(<span className="text-foreground/30">-</span>)}</div>
                                        <div className="justify-center">{tardiness?.absent??(<span className="text-foreground/30">-</span>)}</div>
                                        <div className="justify-center">
                                            {tardiness?.timetardy??(<span className="text-foreground/30">-</span>)}
                                        </div>
                                        <div className="justify-center">{tardiness?.undertime??(<span className="text-foreground/30">-</span>)}</div>
                                    </TableRow>
                                )
                            })}
                        </Fragment>
                    )}
                </TableDataSkeletonLoader>
            </Card>

            {/* <PaginationData /> */}
        </div>
    );
};

export default Tardiness;
