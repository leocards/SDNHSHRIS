import Header from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { Printer } from "iconsax-react";
import React, { Fragment, useMemo, useState } from "react";
import PrintPersonnel from "./PrintPersonnel";
import { User } from "@/Types";

export type LIST = {
    jhs: any[];
    shs: any[];
    accounting: any[];
    principal: User[];
};

export type FilteredListType = {
    male: { [key in keyof any]: number };
    female: { [key in keyof any]: number };
};

type Props = {
    list: LIST;
};

const ListOfPersonnel = ({ list }: Props) => {
    const [print, setPrint] = useState(false);
    const filteredList: FilteredListType = useMemo(() => {
        const categories = ["jhs", "shs", "accounting", "principal"] as const;
        const result: FilteredListType = {
            male: { jhs: 0, shs: 0, accounting: 0, principal: 0 },
            female: { jhs: 0, shs: 0, accounting: 0, principal: 0 },
        };

        categories.forEach((category) => {
            result.male[category] = list[category].filter(
                (item: any) => item.gender === "male"
            ).length;
            result.female[category] = list[category].filter(
                (item: any) => item.gender === "female"
            ).length;
        });

        return result;
    }, [list]);

    const empListCategory = {
        jhs: "Junior High School",
        shs: "Senior High School",
        accounting: "Accounting",
        principal: "Principal",
    };

    return (
        <div>
            <Header title="List of Presonnel">List of Personnel</Header>
            <div className="mt-8">
                <div>
                    <div className="flex justify-end mb-4">
                        <Button
                            className="h-8 gap-2"
                            variant="ghost"
                            onClick={() => setPrint(true)}
                        >
                            <Printer className="size-4" strokeWidth={2.3} />
                            <span className="sm:block hidden">Print</span>
                        </Button>
                    </div>

                    <div className="border mb-4 divide-y rounded-md [&>div>div:nth-child(4)]:text-red-500">
                        <div className="divide-x grid grid-cols-[1fr,repeat(3,5rem)] text-center [&>div]:p-1.5 font-semibold">
                            <div></div>
                            <div>MALE</div>
                            <div>FEMALE</div>
                            <div>TOTAL</div>
                        </div>
                        {(
                            ["jhs", "shs", "accounting", "principal"] as const
                        ).map((category) => {
                            return (
                                <div
                                    key={category}
                                    className="divide-x grid grid-cols-[1fr,repeat(3,5rem)] text-center [&>div]:p-1.5"
                                >
                                    <div className="text-left uppercase">
                                        {empListCategory[category]}
                                    </div>
                                    <div>{filteredList.male[category]}</div>
                                    <div>{filteredList.female[category]}</div>
                                    <div>
                                        {filteredList.male[category] +
                                            filteredList.female[category]}
                                    </div>
                                </div>
                            );
                        })}
                        <div className="divide-x grid grid-cols-[1fr,repeat(3,5rem)] text-center [&>div]:p-1.5">
                            <div></div>
                            <div>
                                {Object.values(filteredList.male).reduce(
                                    (sum, value) => sum + value,
                                    0
                                )}
                            </div>
                            <div>
                                {Object.values(filteredList.female).reduce(
                                    (sum, value) => sum + value,
                                    0
                                )}
                            </div>
                            <div>
                                {Object.values(filteredList.male).reduce(
                                    (sum, value) => sum + value,
                                    0
                                ) +
                                    Object.values(filteredList.female).reduce(
                                        (sum, value) => sum + value,
                                        0
                                    )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg overflow-hidden mb-10">
                        <div className="bg-zinc-200 dark:bg-white/10 p-2 font-semibold rounded-t-lg flex items-center">
                            <div>Junior High School</div>
                        </div>
                        <div className="border rounded-b-lg max-h-[35rem] overflow-y-auto rounded-scrollbar [&::-webkit-scrollbar]:!bg-zinc-100">
                            <div className="grid grid-cols-[3rem,1fr,1fr] [&>div]:p-2 font-medium sticky top-0 bg-background border-b">
                                <div className="text-right pr-1 border-r">
                                    #
                                </div>
                                <div className="pl-2 border-r">Personnel</div>
                                <div className="pl-2">Position</div>
                            </div>
                            <div className="divide-y">
                                {list.jhs.map(({ name, position }, index) => (
                                    <Fragment key={index}>
                                        <div className="grid grid-cols-[3rem,1fr,1fr] [&>div]:p-2">
                                            <div className="text-right pr-1 border-r">
                                                {++index}
                                            </div>
                                            <div className="pl-2 border-r">{name}</div>
                                            <div className="pl-2">{position}</div>
                                        </div>
                                    </Fragment>
                                ))}
                                {list.jhs.length === 0 && (
                                    <div className="py-2 text-center text-secondary-foreground/30">
                                        No records
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-10">
                        <div className="bg-zinc-200 dark:bg-white/10 p-2 font-semibold rounded-t-lg">
                            Senior High School
                        </div>
                        <div className="border rounded-b-lg max-h-[35rem] overflow-y-auto rounded-scrollbar [&::-webkit-scrollbar]:!bg-zinc-100">
                            <div className="grid grid-cols-[3rem,1fr,1fr] [&>div]:p-2 font-medium sticky top-0 bg-background border-b">
                                <div className="text-right pr-1 border-r">
                                    #
                                </div>
                                <div className="pl-2 border-r">Personnel</div>
                                <div className="pl-2">Position</div>
                            </div>
                            <div className="divide-y">
                                {list.shs.map(({ name, position }, index) => (
                                    <Fragment key={index}>
                                        <div className="grid grid-cols-[3rem,1fr,1fr] [&>div]:p-2">
                                            <div className="text-right pr-1 border-r">
                                                {++index}
                                            </div>
                                            <div className="pl-2 border-r">{name}</div>
                                            <div className="pl-2">{position}</div>
                                        </div>
                                    </Fragment>
                                ))}
                                {list.shs.length === 0 && (
                                    <div className="py-2 text-center text-secondary-foreground/30">
                                        No records
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-10">
                        <div className="bg-zinc-200 dark:bg-white/10 p-2 font-semibold rounded-t-lg">
                            Accounting
                        </div>
                        <div className="border rounded-b-lg max-h-[35rem] overflow-y-auto rounded-scrollbar [&::-webkit-scrollbar]:!bg-zinc-100">
                            <div className="grid grid-cols-[3rem,1fr,1fr] [&>div]:p-2 font-medium sticky top-0 bg-background border-b">
                                <div className="text-right pr-1 border-r">
                                    #
                                </div>
                                <div className="pl-2 border-r">Personnel</div>
                                <div className="pl-2">Position</div>
                            </div>
                            <div className="divide-y">
                                {list.accounting.map(({ name, position }, index) => (
                                    <Fragment key={index}>
                                        <div className="grid grid-cols-[3rem,1fr,1fr] [&>div]:p-2">
                                            <div className="text-right pr-1 border-r">
                                                {++index}
                                            </div>
                                            <div className="pl-2 border-r">{name}</div>
                                            <div className="pl-2">{position}</div>
                                        </div>
                                    </Fragment>
                                ))}
                                {list.jhs.length === 0 && (
                                    <div className="py-2 text-center text-secondary-foreground/30">
                                        No records
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PrintPersonnel
                show={print}
                onClose={setPrint}
                list={list}
            />
        </div>
    );
};

export default ListOfPersonnel;
