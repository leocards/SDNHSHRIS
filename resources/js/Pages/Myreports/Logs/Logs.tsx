import Empty from "@/Components/Empty";
import Header, { TableHeader, TableRow } from "@/Components/Header";
import {
    PaginateProvider,
    usePagination,
} from "@/Components/Provider/paginate-provider";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import TableDataSkeletonLoader from "@/Components/TableDataSkeletonLoader";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { FilterButton, FilterItem } from "@/Components/ui/menubar";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { PAGINATEDDATA, User } from "@/Types";
import { format } from "date-fns";
import { Eye, Printer } from "iconsax-react";
import React, { Fragment, useEffect, useState } from "react";
import empty from "@/Assets/empty-file.svg";
import LogsPrint from "./LogsPrint";
import { TypographyStatus } from "@/Components/Typography";
import ViewPdsLogs from "./ViewPdsLogs";
import ViewLeaveLogs from "./ViewLeaveLogs";
import ViewCOCLogs from "./ViewCOCLogs";
import ViewCertificateLogs from "./ViewCertificateLogs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { cn } from "@/Lib/utils";
import { LEAVETYPEKEYS, LEAVETYPESOBJ } from "@/Pages/Leave/Types/leavetypes";

type LOGSTYPE = {
    id: number;
    name: string;
    avatar: string | null;
    logs: Array<{
        id: number;
        type: string;
        details: any;
        status: string;
        created_at: string;
    }>;
};

type Props = {
    logs: PAGINATEDDATA<LOGSTYPE>;
    years: number[];
    principal: User;
};

const Logs = (props: Props) => {
    return (
        <PaginateProvider<LOGSTYPE>
            pageValue={props.logs}
            url={route("myreports.logs")}
        >
            <Main {...props} />
        </PaginateProvider>
    );
};

const Main: React.FC<Props> = ({ years, principal }) => {
    const { page, onQuery } = usePagination<LOGSTYPE>();

    const [yearList, setYearList] = useState(years);
    const [type, setType] = useState<"leave" | "pds" | "coc" | "certificate">(
        "leave"
    );
    const [filterYear, setFilterYear] = useState(
        yearList.length > 0 ? yearList[0].toString() : ""
    );
    const [status, setStatus] = useState<
        "all" | "approved" | "disapproved" | "invalid"
    >("all");
    const [print, setPrint] = useState(false);
    const [selected, setSelected] = useState<number | null>(null);

    const onFilterType = (value: any) => {
        setType(value);
        setSelected(null);
        onQuery({ type: value, status, filterYear });
    };

    const onFilterYear = (value?: string) => {
        let yearvalue = value;

        if (!yearvalue)
            yearList.length > 0
                ? (yearvalue = yearList[0].toString())
                : (yearvalue = "");

        setFilterYear(yearvalue);
        onQuery({ type, status, filterYear: yearvalue });
    };

    const onFilterStatus = (value: any) => {
        setStatus(value ?? "all");
        onQuery({ type, status: value ?? "all", filterYear });
    };

    const Columns = ["3rem", "1fr"];

    useEffect(() => {
        if (type) {
            window.axios
                .get(route("myreports.logs.years", [type]))
                .then((response) => {
                    let year = response.data;
                    setYearList(year);
                    setFilterYear(year.length > 0 ? year[0].toString() : "");
                });
        }
    }, [type]);

    return (
        <div className="max-w-5xl mx-auto">
            <Header title="Logs">Logs</Header>

            <Tabs
                defaultValue={type}
                className="overflow-hidden grow flex items-center mb-5 mt-4"
                onValueChange={onFilterType}
            >
                <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 bg-primary/15 text-primary/60">
                    <TabsTrigger value="leave">Leave</TabsTrigger>
                    <TabsTrigger value="pds">PDS</TabsTrigger>
                    <TabsTrigger value="coc">COC</TabsTrigger>
                    <TabsTrigger value="certificate">Certificate</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="flex gap-3 items-center my-5 w-fit ml-auto">
                <FilterButton
                    isDirty={
                        yearList.length > 0
                            ? filterYear != yearList[0].toString()
                            : false
                    }
                    filter={filterYear}
                    onClearFilter={onFilterYear}
                    disabled={yearList.length === 0}
                >
                    {yearList.map((year, index) => (
                        <FilterItem
                            key={index}
                            value={year.toString()}
                            onClick={onFilterYear}
                            activeFilter={filterYear}
                        >
                            {year}
                        </FilterItem>
                    ))}
                </FilterButton>

                <FilterButton
                    isDirty={status != "all"}
                    filter={status}
                    onClearFilter={onFilterStatus}
                    filterValueClass="capitalize"
                    disabled={yearList.length === 0}
                >
                    <FilterItem
                        value={"all"}
                        onClick={onFilterStatus}
                        activeFilter={status}
                    >
                        All
                    </FilterItem>
                    <FilterItem
                        value={"approved"}
                        onClick={onFilterStatus}
                        activeFilter={status}
                    >
                        Approved
                    </FilterItem>
                    {type !== "coc" ? (
                        <FilterItem
                            value={"disapproved"}
                            onClick={onFilterStatus}
                            activeFilter={status}
                        >
                            Dispproved
                        </FilterItem>
                    ) : (
                        <FilterItem
                            value={"invalid"}
                            onClick={onFilterStatus}
                            activeFilter={status}
                        >
                            Invalid
                        </FilterItem>
                    )}
                </FilterButton>

                <Button
                    disabled={yearList.length === 0}
                    variant="outline"
                    onClick={() => setPrint(true)}
                >
                    <Printer />
                    Print
                </Button>
            </div>

            <Card className="min-h-[27rem] relative">
                <TableDataSkeletonLoader
                    data="logs"
                    columns={Columns}
                    length={8}
                >
                    {(column) => (
                        <Fragment>
                            <TableHeader
                                style={{ gridTemplateColumns: column }}
                            >
                                <div></div>
                                <div className="!pl-4">Personnel Name</div>
                            </TableHeader>
                            {page?.data.length === 0 && (
                                <Empty
                                    src={empty}
                                    label={`No recorded logs.`}
                                />
                            )}
                            <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                            >
                                {type === "pds" && (
                                    <PDSData
                                        buttonColumn={column}
                                        onView={setSelected}
                                    />
                                )}
                                {type === "leave" && <LeaveData buttonColumn={column} onView={setSelected} />}
                                {type === "coc" && (
                                    <COCData
                                        buttonColumn={column}
                                        onView={setSelected}
                                    />
                                )}
                                {type === "certificate" && (
                                    <CertificateData
                                        buttonColumn={column}
                                        onView={setSelected}
                                    />
                                )}
                            </Accordion>
                        </Fragment>
                    )}
                </TableDataSkeletonLoader>
            </Card>

            <LogsPrint
                show={print}
                onClose={setPrint}
                type={type}
                year={filterYear}
                status={status}
                principal={principal}
            />

            {type === "leave" ? (
                <div>
                    <ViewLeaveLogs
                        leaveid={selected}
                        show={!!selected}
                        onClose={() => setSelected(null)}
                    />
                </div>
            ) : type === "pds" ? (
                <div>
                    <ViewPdsLogs
                        userid={selected}
                        show={!!selected}
                        onClose={() => setSelected(null)}
                    />
                </div>
            ) : type === "coc" ? (
                <div>
                    <ViewCOCLogs
                        cocid={selected}
                        show={!!selected}
                        onClose={() => setSelected(null)}
                    />
                </div>
            ) : (
                <div>
                    <ViewCertificateLogs
                        certificate={selected}
                        show={!!selected}
                        onClose={() => setSelected(null)}
                    />
                </div>
            )}
        </div>
    );
};

type LogsListCardProps = {
    children: (page: LOGSTYPE, column: string) => React.ReactNode;
    headers: string[];
    headerColumn: string[];
    buttonColumn: string;
};
const LogsListCard: React.FC<LogsListCardProps> = ({
    children,
    headers,
    headerColumn,
    buttonColumn,
}) => {
    const { page } = usePagination<LOGSTYPE>();

    return page?.data?.map((log, index) => (
        <AccordionItem value={log.id.toString()} key={index}>
            <AccordionTrigger className="px-4">
                <div
                    className="grid"
                    style={{ gridTemplateColumns: buttonColumn }}
                >
                    <div>{index + 1}</div>
                    <div>{log.name}</div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="group-data-[state=open]/accordion:border-border border-transparent border-t pb-0 transition">
                <TableHeader
                    style={{ gridTemplateColumns: headerColumn?.join(" ") }}
                    className="bg-accent/40"
                >
                    {headers.map((header, index) => (
                        <div key={index} className={cn("justify-center")}>
                            {header}
                        </div>
                    ))}
                </TableHeader>
                {children(log, headerColumn.join(" "))}
            </AccordionContent>
        </AccordionItem>
    ));
};

const PDSData = ({
    buttonColumn,
    onView,
}: {
    onView: CallableFunction;
    buttonColumn: string;
}) => {
    return (
        <LogsListCard
            buttonColumn={buttonColumn}
            headers={["Status", "Date", "View"]}
            headerColumn={Array(3).fill("1fr")}
        >
            {(pdsLog, column) =>
                pdsLog.logs?.map((log, index) => (
                    <TableRow
                        key={index}
                        style={{ gridTemplateColumns: column }}
                        className="hover:bg-background"
                    >
                        <div className="capitalize justify-center">
                            <TypographyStatus
                                status={
                                    log.status as
                                        | "approved"
                                        | "disapproved"
                                        | "invalid"
                                        | "pending"
                                }
                            >
                                {log.status}
                            </TypographyStatus>
                        </div>
                        <div className="justify-center">
                            {format(log.created_at, "MMMM dd, y")}
                        </div>
                        <div className="justify-center">
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-7"
                                onClick={() => onView(log.details.userid)}
                            >
                                <Eye />
                            </Button>
                        </div>
                    </TableRow>
                ))
            }
        </LogsListCard>
    );
};

const LeaveData = ({
    buttonColumn,
    onView,
}: {
    buttonColumn: string;
    onView?: CallableFunction;
}) => {
    return (
        <LogsListCard
            buttonColumn={buttonColumn}
            headers={["Type of leave", "Status", "Date", "View"]}
            headerColumn={Array(4).fill("1fr")}
        >
            {(leaveLog, column) =>
                leaveLog?.logs?.map((log, index) => (
                    <TableRow
                        key={index}
                        style={{ gridTemplateColumns: column }}
                        className="hover:bg-background"
                    >
                        <div className="justify-center">
                            {LEAVETYPESOBJ[log.details.type as LEAVETYPEKEYS]}
                        </div>
                        <div className="capitalize justify-center">
                            <TypographyStatus
                                status={
                                    log.status as
                                        | "approved"
                                        | "disapproved"
                                        | "invalid"
                                        | "pending"
                                }
                            >
                                {log.status}
                            </TypographyStatus>
                        </div>
                        <div className="justify-center">
                            {format(log.created_at, "MMMM dd, y")}
                        </div>
                        <div className="justify-center">
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-7"
                                onClick={() => onView?.(log.details.leaveid)}
                            >
                                <Eye />
                            </Button>
                        </div>
                    </TableRow>
                ))
            }
        </LogsListCard>
    );
};

const COCData = ({
    buttonColumn,
    onView,
}: {
    buttonColumn: string;
    onView?: CallableFunction;
}) => {
    return (
        <LogsListCard
            buttonColumn={buttonColumn}
            headers={["Status", "Date", "View"]}
            headerColumn={Array(3).fill("1fr")}
        >
            {(cdLog, column) =>
                cdLog.logs?.map((log, index) => (
                    <TableRow
                        key={index}
                        style={{ gridTemplateColumns: column }}
                        className="hover:bg-background"
                    >
                        <div className="capitalize justify-center">
                            <TypographyStatus
                                status={
                                    log.status as
                                        | "approved"
                                        | "disapproved"
                                        | "invalid"
                                        | "pending"
                                }
                            >
                                {log.status}
                            </TypographyStatus>
                        </div>
                        <div className="justify-center">
                            {format(log.created_at, "MMMM dd, y")}
                        </div>
                        <div className="justify-center">
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-7"
                                onClick={() => onView?.(log.details.cocid)}
                            >
                                <Eye />
                            </Button>
                        </div>
                    </TableRow>
                ))
            }
        </LogsListCard>
    );
};

const CertificateData = ({
    buttonColumn,
    onView,
}: {
    buttonColumn: string;
    onView?: CallableFunction;
}) => {
    return (
        <LogsListCard
            buttonColumn={buttonColumn}
            headers={["Status", "Date", "View"]}
            headerColumn={Array(3).fill("1fr")}
        >
            {(cdLog, column) =>
                cdLog.logs?.map((log, index) => (
                    <TableRow
                        key={index}
                        style={{ gridTemplateColumns: column }}
                        className="hover:bg-background"
                    >
                        <div className="capitalize justify-center">
                            <TypographyStatus
                                status={
                                    log.status as
                                        | "approved"
                                        | "disapproved"
                                        | "invalid"
                                        | "pending"
                                }
                            >
                                {log.status}
                            </TypographyStatus>
                        </div>
                        <div className="justify-center">
                            {format(log.created_at, "MMMM dd, y")}
                        </div>
                        <div className="justify-center">
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-7"
                                onClick={() =>
                                    onView?.(log.details.certificateid)
                                }
                            >
                                <Eye />
                            </Button>
                        </div>
                    </TableRow>
                ))
            }
        </LogsListCard>
    );

    // return page?.data?.map((log, index) => (
    //     <TableRow
    //         key={index}
    //         style={{ gridTemplateColumns: column }}
    //         className="hover:bg-background"
    //     >
    //         <div className="justify-center">{index + 1}</div>
    //         <div>{log.details.username}</div>
    //         <div className="capitalize">
    //             <TypographyStatus
    //                 status={
    //                     log.status as
    //                         | "approved"
    //                         | "disapproved"
    //                         | "invalid"
    //                         | "pending"
    //                 }
    //             >
    //                 {log.status}
    //             </TypographyStatus>
    //         </div>
    //         <div className="justify-center">
    //             {format(log.created_at, "MMMM dd, y")}
    //         </div>
    //         <div className="justify-center">
    //             <Button variant="outline" size="icon" className="size-7" onClick={() => onView?.(log.details.certificateid)}>
    //                 <Eye />
    //             </Button>
    //         </div>
    //     </TableRow>
    // ));
};

export default Logs;
