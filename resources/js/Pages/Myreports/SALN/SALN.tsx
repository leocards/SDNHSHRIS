import Header, { TableHeader, TableRow } from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { FilterButton, FilterItem } from "@/Components/ui/menubar";
import { SCHOOLYEAR, User } from "@/Types";
import { Deferred, usePage } from "@inertiajs/react";
import { Add, Edit, Import, Printer } from "iconsax-react";
import React, { useEffect, useState } from "react";
import PrintSALN from "./PrintSALN";
import AddSaln from "./AddSaln";
import { Card } from "@/Components/ui/card";
import { Loader } from "@/Components/TableDataSkeletonLoader";
import empty from "@/Assets/empty-file.svg";
import { toNumber } from "./type";
import ImportSaln from "./ImportSaln";

export type SALNREPORTTYPE = {
    id: number;
    user: User & {
        pds_personal_information: any;
    };
    details: any;
    year: string;
    created_at: string;
    updated_at: string;
};

const Columns = ["3rem", "1fr", "1fr", "1fr", "1fr", "1fr", "6rem", "5rem"];

type Props = {
    saln: SALNREPORTTYPE[];
    principal: User;
    years: string[];
};

const SALN = ({ principal, saln, years }: Props) => {
    const sy = usePage().props.schoolyear;
    const [filter, setFilter] = useState<string>(
        years.length > 0 ? years[0] : ""
    );
    const [importSaln, setImportSaln] = useState(false);
    const [addSaln, setAddSaln] = useState(false);
    const [printSaln, setPrintSaln] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<SALNREPORTTYPE | null>(null);

    const [salnList, setSalnList] = useState<SALNREPORTTYPE[]>([]);

    const onFilter = (value: string) => {
        setFilter(value);
        setLoading(true);

        window.axios
            .get(route("myreports.saln", { _query: { filter: value } }))
            .then((response) => {
                const data = response.data;

                setSalnList(data);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (saln) {
            setSalnList(saln);
        }
    }, [saln]);
    return (
        <div>
            <Header title="SALN Report">SALN Report</Header>

            <div className="flex gap-3 items-center mt-5 w-fit ml-auto mb-4">
                <FilterButton
                    isDirty={filter != (years?.length > 0 ? years[0] : "")}
                    filter={filter}
                    onClearFilter={() => {
                        onFilter(years?.length > 0 ? years[0] : "");
                    }}
                >
                    {years?.map((year, index) => (
                        <FilterItem
                            key={index}
                            value={year}
                            onClick={onFilter}
                            activeFilter={filter}
                        >
                            {year}
                        </FilterItem>
                    ))}
                </FilterButton>
                <Button
                    className=""
                    variant="outline"
                    onClick={() => setPrintSaln(true)}
                >
                    <Printer />
                    Print
                </Button>
                <Button
                    className=""
                    variant="outline"
                    onClick={() => setImportSaln(true)}
                >
                    <Import />
                    Import
                </Button>
                <Button className="" onClick={() => setAddSaln(true)}>
                    <Add />
                    Add SALN
                </Button>
            </div>

            <Card>
                <Deferred
                    data="saln"
                    fallback={
                        <Loader
                            gridtemplatecolumns={[
                                "3rem",
                                "1fr",
                                "minmax(5rem,10rem)",
                                "minmax(5rem,7rem)",
                                "minmax(5rem,12rem)",
                                "5rem",
                            ]}
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
                                <div className="justify-center"></div>
                                <div>Name of Personnel</div>
                                <div className="justify-center">TIN</div>
                                <div className="justify-center">Position</div>
                                <div className="justify-center">Networth</div>
                                <div className="justify-center text-center">
                                    Name of Spouse/Employer/Address
                                </div>
                                <div className="justify-center">
                                    Joint Filing
                                </div>
                                <div className="justify-center">Edit</div>
                            </TableHeader>
                        )}
                        {salnList?.length === 0 && !loading && (
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
                                salnList?.map((item, index) => (
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
                                            {item?.user?.name}
                                        </div>
                                        <div className="justify-center">
                                            {
                                                item?.user
                                                    ?.pds_personal_information
                                                    ?.tin
                                            }
                                        </div>
                                        <div className="justify-center">
                                            {item?.user?.position}
                                        </div>
                                        <div className="justify-center text-center">
                                            &#8369;{" "}
                                            {Number(toNumber(item?.details.networth)).toLocaleString()}
                                        </div>
                                        <div className="justify-center">
                                            <div className="line-clamp-1">{item?.details?.spouse}</div>
                                        </div>
                                        <div className="justify-center">
                                            {item?.details?.filing == "joint"
                                                ? "/"
                                                : ""}
                                        </div>
                                        <div className="justify-center">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="size-7"
                                                onClick={() => {
                                                    setAddSaln(true);
                                                    setSelected(item);
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
                                ]}
                                length={10}
                            />
                        )}
                    </div>
                </Deferred>
            </Card>

            <PrintSALN
                show={printSaln}
                onClose={setPrintSaln}
                principal={principal}
                saln={salnList}
                year={filter}
            />
            <AddSaln
                show={addSaln}
                onClose={() => {
                    setAddSaln(false);
                    setTimeout(() => {
                        setSelected(null);
                    }, 500);
                }}
                saln={selected}
                year={filter}
            />

            <ImportSaln show={importSaln} onClose={setImportSaln} />
        </div>
    );
};

export default SALN;
