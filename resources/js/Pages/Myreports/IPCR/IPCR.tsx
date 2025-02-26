import Header, { TableHeader, TableRow } from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { FilterButton, FilterItem } from "@/Components/ui/menubar";
import { Deferred, usePage } from "@inertiajs/react";
import { Add, Edit, Import, Printer } from "iconsax-react";
import React, { Fragment, useEffect, useState } from "react";
import empty from "@/Assets/empty-file.svg";
import { SCHOOLYEAR, User } from "@/Types";
import AddIpcr from "./AddIpcr";
import TableDataSkeletonLoader, {
    Loader,
} from "@/Components/TableDataSkeletonLoader";
import ImportIpcr from "./ImportIpcr";
import PrintIPCR from "./PrintIPCR";

export type IPCRTYPE = {
    id: number;
    user: Pick<User, "id" | "name" | "avatar" | "position">;
    schoolyear: SCHOOLYEAR;
    rating: string;
    created_at: string;
    updated_at: string;
};

type Props = {
    schoolyears: SCHOOLYEAR[];
    ipcr: IPCRTYPE[];
    hr: string;
    principal: Pick<User, "full_name"|"position">;
};

const Columns = [
    "3rem",
    "1fr",
    "minmax(5rem,10rem)",
    "minmax(5rem,7rem)",
    "minmax(5rem,12rem)",
    "5rem",
];

export const equivalent = (rate: number | null): string => {
    if (rate)
        if (rate >= 4.5 && rate <= 5) {
            return "Outstanding";
        } else if (rate >= 3.5 && rate <= 4.499) {
            return "Very Satisfactory";
        } else if (rate >= 2.5 && rate <= 3.499) {
            return "Satisfactory";
        } else if (rate >= 1.5 && rate <= 2.499) {
            return "Moderate";
        } else if (rate >= 1 && rate <= 1.499) {
            return "Fair";
        } else {
            return "Poor";
        }

    return "";
};

const IPCR = ({ schoolyears, ipcr, principal, hr }: Props) => {
    const sy = usePage().props.schoolyear;
    const [filter, setFilter] = useState<string>(sy?.schoolyear ?? "");
    const [addIpcr, setAddIpcr] = useState(false);
    const [importIpcr, setImportIpcr] = useState(false);
    const [printIpcr, setPrintIpcr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<IPCRTYPE|null>(null)

    const [ipcrList, setIpcrList] = useState<IPCRTYPE[]>([]);

    const onFilter = (value: string) => {
        setFilter(value);
        setLoading(true);

        let id = schoolyears.find(({ schoolyear }) => schoolyear === value);

        window.axios
            .get(route("myreports.ipcr", { _query: { filter: id } }))
            .then((response) => {
                const data = response.data;

                setIpcrList(data);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (ipcr) {
            setIpcrList(ipcr);
        }
    }, [ipcr]);

    return (
        <div>
            <Header title="IPCR Report" children="IPCR Report" />

            <div className="flex gap-3 items-center mt-5 w-fit ml-auto">
                <FilterButton
                    isDirty={filter != sy?.schoolyear}
                    filter={filter}
                    onClearFilter={() => {
                        onFilter(sy?.schoolyear ?? "");
                    }}
                >
                    {schoolyears.map((sys, index) => (
                        <FilterItem
                            key={index}
                            value={sys?.schoolyear}
                            onClick={onFilter}
                            activeFilter={filter}
                        >
                            {sys?.schoolyear}
                        </FilterItem>
                    ))}
                </FilterButton>
                <Button
                    className=""
                    variant="outline"
                    onClick={() => setPrintIpcr(true)}
                >
                    <Printer />
                    Print
                </Button>
                <Button
                    className=""
                    variant="outline"
                    onClick={() => setImportIpcr(true)}
                >
                    <Import />
                    Import
                </Button>
                <Button className="" onClick={() => setAddIpcr(true)}>
                    <Add />
                    Add IPCR
                </Button>
            </div>

            <Card className="mt-5 rounded-lg relative">
                <Deferred
                    data="ipcr"
                    fallback={
                        <Loader
                            gridtemplatecolumns={[
                                "3rem",
                                "1fr",
                                "minmax(5rem,10rem)",
                                "minmax(5rem,7rem)",
                                "minmax(5rem,12rem)",
                                "5rem",
                            ].join(" ")}
                            length={10}
                        />
                    }
                >
                    <div className="overflow-y-auto grow relative min-h-[30rem] max-h-[38rem] grid grid-rows-[auto,1fr]">
                        {!loading && (
                            <TableHeader
                                style={{
                                    gridTemplateColumns: Columns.join(" "),
                                }}
                                className="text-[15px]"
                            >
                                <div className="justify-center">No.</div>
                                <div>Name of Personnel</div>
                                <div className="justify-center">Position</div>
                                <div className="justify-center text-center">
                                    Performance Rating
                                </div>
                                <div className="justify-center">
                                    Adjectival Equivalent
                                </div>
                                <div className="justify-center">Edit</div>
                            </TableHeader>
                        )}
                        {ipcrList?.length === 0 && !loading && (
                            <div className="flex flex-col items-center absolute inset-0 justify-center">
                                <img
                                    className="size-24 opacity-40 dark:opacity-65"
                                    src={empty}
                                />
                                <div className="text-sm font-medium text-foreground/50 mt-1">
                                    No recorded ratings.
                                </div>
                            </div>
                        )}
                        <div>
                            {!loading &&
                                ipcrList?.map((performancerating, index) => (
                                    <TableRow
                                        key={index}
                                        style={{
                                            gridTemplateColumns:
                                                Columns.join(" "),
                                        }}
                                    >
                                        <div className="justify-center">
                                            {index + 1}
                                        </div>
                                        <div className="uppercase">
                                            {performancerating?.user?.name}
                                        </div>
                                        <div className="justify-center">
                                            {performancerating?.user?.position}
                                        </div>
                                        <div className="justify-center text-center">
                                            {performancerating?.rating}
                                        </div>
                                        <div className="justify-center">
                                            {equivalent(
                                                parseInt(
                                                    performancerating?.rating
                                                )
                                            )}
                                        </div>
                                        <div className="justify-center">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="size-7"
                                                onClick={() => {
                                                    setAddIpcr(true)
                                                    setSelected(performancerating)
                                                }}
                                            >
                                                <Edit />
                                            </Button>
                                        </div>
                                    </TableRow>
                                ))}
                        </div>

                        {loading && (
                            <Loader
                                gridtemplatecolumns={[
                                    "3rem",
                                    "1fr",
                                    "minmax(5rem,10rem)",
                                    "minmax(5rem,7rem)",
                                    "minmax(5rem,12rem)",
                                    "5rem",
                                ].join(" ")}
                                length={10}
                            />
                        )}
                    </div>
                </Deferred>
            </Card>

            <AddIpcr
                show={addIpcr}
                onClose={() => {
                    setAddIpcr(false)
                    setTimeout(() => {
                        setSelected(null)
                    }, 500);
                }}
                schoolyears={schoolyears}
                ipcr={selected}
            />

            <ImportIpcr schoolyears={schoolyears} show={importIpcr} onClose={setImportIpcr} />

            <PrintIPCR show={printIpcr} onClose={setPrintIpcr} ipcr={ipcrList} hr={hr} principal={principal} year={filter}/>
        </div>
    );
};

export default IPCR;
