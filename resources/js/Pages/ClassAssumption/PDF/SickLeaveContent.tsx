import { format } from "date-fns";
import React from "react";
import { ClassAssumptionDetailsList, CLASSASSUMPTIONTYPE } from "../type";
import ClassLoads from "./ClassLoads";
import { User } from "@/Types";
import { Check } from "lucide-react";
import { cn } from "@/Lib/utils";

type SickLeaveContentProps = {
    user: User;
    date: Date;
    details: CLASSASSUMPTIONTYPE['details']['details'];
    loads: CLASSASSUMPTIONTYPE['details']['classloads'];
    curriculumhead: string;
    academichead: string;
}

const SickLeaveContent: React.FC<SickLeaveContentProps> = ({
    user, date, details, loads, curriculumhead, academichead
}) => {
    return (
        <div>
            <table className="table border-none mt-3">
                <tbody className="[&>tr]:border-none [&>tr>td]:px-0">
                    <tr>
                        <td className="p-0 pt-2">Madam:</td>
                    </tr>
                    <tr className="">
                        <td className="p-0">
                            <div className="space-y-2 mt-4">
                                <div className="flex">
                                    <div className="">
                                        This is to inform your good office that
                                        Mr./Ms. Mrs.
                                    </div>{" "}
                                    <div className="border-b border-black grow ml-0.5 uppercase text-center">
                                        {user.full_name}
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="">is absent today, </div>{" "}
                                    <div className="border-b border-black w-40 mx-1 text-center">{format(date, "MMM d")}</div>
                                    , {format(date, "y")} due to (plese
                                    check):
                                </div>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td className="p-0 pt-2">
                            <div className="pl-12 space-y-1">
                                <div className="flex gap-4 items-center">
                                    <div className="h-5 w-8 rounded-md border-[3px] border-black flex items-center justify-center">
                                        <Check className={cn("size-4", details.type !== "illness" && "hidden")} />
                                    </div>
                                    <div>
                                        {
                                            ClassAssumptionDetailsList.sick
                                                .illness
                                        }
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="h-5 w-8 rounded-md border-[3px] border-black flex items-center justify-center">
                                        <Check className={cn("size-4", details.type !== "hospitalization" && "hidden")} />
                                    </div>
                                    <div>
                                        {
                                            ClassAssumptionDetailsList.sick
                                                .hospitalization
                                        }
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="h-5 w-8 rounded-md border-[3px] border-black flex items-center justify-center">
                                        <Check className={cn("size-4", details.type !== "death" && "hidden")} />
                                    </div>
                                    <div>
                                        {ClassAssumptionDetailsList.sick.death}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="h-5 w-8 rounded-md border-[3px] border-black mr-4 flex items-center justify-center">
                                        <Check className={cn("size-4", details.type !== "slothers" && "hidden")} />
                                    </div>
                                    <div>
                                        {
                                            ClassAssumptionDetailsList.sick
                                                .slothers
                                        }
                                    </div>
                                    <div className="grow border-b border-black h-5 ml-1 text-center">{details.others}</div>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td className="!pt-5">
                            With this, his/ her class loads will be taken over
                            by the following teachers in his/ her absence, to
                            wit:
                        </td>
                    </tr>
                </tbody>
            </table>

            <ClassLoads loads={loads} />

            <table className="table">
                <tbody className="[&>tr]:border-none [&>tr>td]:p-0">
                    <tr>
                        <td>
                            <div className="flex justify-between [&>div]:w-1/2">
                                <div>
                                    <div>Respectfully yours,</div>
                                    <div className="pt-8 w-fit">
                                        <div className="border-b border-black uppercase text-center">{curriculumhead}</div>
                                        <div>
                                            Signature Over Printed Name of
                                            Curriculum Head
                                        </div>
                                    </div>
                                </div>
                                <div className="pl-12">
                                    <div>Conformed:</div>
                                    <div className="pt-8 w-fit">
                                        <div className="border-b border-black uppercase text-center">{academichead}</div>
                                        <div>
                                            Signature Over Printed Name of
                                            Academic Head
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SickLeaveContent;
