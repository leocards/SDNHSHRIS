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

type LOGSTYPE = {
    id: number;
    type: string;
    details: any;
    status: string;
    created_at: string;
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

    const { setProcess } = useProcessIndicator();
    const [yearList, setYearList] = useState(years);
    const [type, setType] = useState<"leave" | "pds" | "coc" | "certificate">("leave");
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
        setSelected(null)
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

    const Columns = [
        "3rem",
        "1fr",
        "minmax(4rem,7rem)",
        "minmax(5rem,14rem)",
        "4rem",
    ];

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
        <div>
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
                                <div>Personnel Name</div>
                                <div>Status</div>
                                <div className="justify-center">Date</div>
                                <div className="justify-center">View</div>
                            </TableHeader>
                            {page?.data.length === 0 && (
                                <Empty
                                    src={empty}
                                    label={`No recorded logs.`}
                                />
                            )}
                            {type === "pds" && <PDSData column={column} onView={setSelected} />}
                            {type === "leave" && <LeaveData column={column} onView={setSelected} />}
                            {type === "coc" && <COCData column={column} onView={setSelected} />}
                            {type === "certificate" && <CertificateData column={column} onView={setSelected} />}
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
                <div><ViewLeaveLogs leaveid={selected} show={!!selected} onClose={() => setSelected(null)} /></div>
            ) : type === "pds" ? (
                <div>
                    <ViewPdsLogs userid={selected} show={!!selected} onClose={() => setSelected(null)} />
                </div>
            ) : type === "coc" ? (
                <div>
                    <ViewCOCLogs cocid={selected} show={!!selected} onClose={() => setSelected(null)} />
                </div>
            ) : (
                <div>
                    <ViewCertificateLogs certificate={selected} show={!!selected} onClose={() => setSelected(null)} />
                </div>
            )}
        </div>
    );
};

const PDSData = ({ column, onView }: { column: string; onView: CallableFunction }) => {
    const { page } = usePagination<LOGSTYPE>();

    return page?.data?.map((log, index) => (
        <TableRow
            key={index}
            style={{ gridTemplateColumns: column }}
            className="hover:bg-background"
        >
            <div className="justify-center">{index + 1}</div>
            <div>{log.details.username}</div>
            <div className="capitalize">
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
                {format(log.created_at, "MMM dd, y hh:ii aaa")}
            </div>
            <div className="justify-center">
                <Button variant="outline" size="icon" className="size-7" onClick={() => onView(log.details.userid)}>
                    <Eye />
                </Button>
            </div>
        </TableRow>
    ));
};

const LeaveData = ({ column, onView }: { column: string; onView?: CallableFunction }) => {
    const { page } = usePagination<LOGSTYPE>();

    return page?.data?.map((log, index) => (
        <TableRow
            key={index}
            style={{ gridTemplateColumns: column }}
            className="hover:bg-background"
        >
            <div className="justify-center">{index + 1}</div>
            <div>{log.details.username}</div>
            <div className="capitalize">
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
                {format(log.created_at, "MMM dd, y hh:ii aaa")}
            </div>
            <div className="justify-center">
                <Button variant="outline" size="icon" className="size-7" onClick={() => onView?.(log.details.leaveid)}>
                    <Eye />
                </Button>
            </div>
        </TableRow>
    ));
};

const COCData = ({ column, onView }: { column: string; onView?: CallableFunction }) => {
    const { page } = usePagination<LOGSTYPE>();

    return page?.data?.map((log, index) => (
        <TableRow
            key={index}
            style={{ gridTemplateColumns: column }}
            className="hover:bg-background"
        >
            <div className="justify-center">{index + 1}</div>
            <div>{log.details.username}</div>
            <div className="capitalize">
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
                {format(log.created_at, "MMM dd, y hh:ii aaa")}
            </div>
            <div className="justify-center">
                <Button variant="outline" size="icon" className="size-7" onClick={() => onView?.(log.details.cocid)}>
                    <Eye />
                </Button>
            </div>
        </TableRow>
    ));
};

const CertificateData = ({ column, onView }: { column: string; onView?: CallableFunction }) => {
    const { page } = usePagination<LOGSTYPE>();

    return page?.data?.map((log, index) => (
        <TableRow
            key={index}
            style={{ gridTemplateColumns: column }}
            className="hover:bg-background"
        >
            <div className="justify-center">{index + 1}</div>
            <div>{log.details.username}</div>
            <div className="capitalize">
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
                {format(log.created_at, "MMM dd, y hh:ii aaa")}
            </div>
            <div className="justify-center">
                <Button variant="outline" size="icon" className="size-7" onClick={() => onView?.(log.details.certificateid)}>
                    <Eye />
                </Button>
            </div>
        </TableRow>
    ));
};

export default Logs;
