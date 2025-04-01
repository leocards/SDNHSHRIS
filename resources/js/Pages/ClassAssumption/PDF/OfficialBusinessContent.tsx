import React from "react";
import ClassLoads from "./ClassLoads";
import { ClassAssumptionDetailsList, CLASSASSUMPTIONTYPE } from "../type";
import { format } from "date-fns";
import { User } from "@/Types";
import { Check } from "lucide-react";
import { cn } from "@/Lib/utils";

type OfficialBusinessContentProps = {
    user: User;
    date: Date;
    details: CLASSASSUMPTIONTYPE['details']['details'];
    loads: CLASSASSUMPTIONTYPE['details']['classloads'];
    curriculumhead: string;
    academichead: string;
}

const OfficialBusinessContent: React.FC<OfficialBusinessContentProps> = ({
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
                                    <div className="indent-12">I regret to inform you that i will be out/absent on</div>{" "}
                                    <div className="border-b border-black w-40 mx-1 text-center">{format(date, 'MMM d')}</div>
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
                                        <Check className={cn("size-4", details.type !== "checkup" && "hidden")} />
                                    </div>
                                    <div>
                                        {
                                            ClassAssumptionDetailsList.business
                                                .checkup
                                        }
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="h-5 w-8 rounded-md border-[3px] border-black flex items-center justify-center">
                                        <Check className={cn("size-4", details.type !== "business" && "hidden")} />
                                    </div>
                                    <div>
                                        {
                                            ClassAssumptionDetailsList.business
                                                .business
                                        }
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="h-5 w-8 rounded-md border-[3px] border-black flex items-center justify-center">
                                        <Check className={cn("size-4", details.type !== "conference" && "hidden")} />
                                    </div>
                                    <div>
                                        {ClassAssumptionDetailsList.business.conference}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="h-5 w-8 rounded-md border-[3px] border-black mr-4 flex items-center justify-center">
                                        <Check className={cn("size-4", details.type !== "obothers" && "hidden")} />
                                    </div>
                                    <div>
                                        {
                                            ClassAssumptionDetailsList.business
                                                .obothers
                                        }
                                    </div>
                                    <div className="grow border-b border-black h-5 ml-1 text-center">{details.others}</div>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td className="!pt-5">
                            With this, my class loads will be taken over
                            by the following teachers in my absence, to wit:
                        </td>
                    </tr>
                </tbody>
            </table>

            <ClassLoads loads={loads} />

            <table className="table border-none">
                <tbody className="[&>tr]:border-none [&>tr>td]:p-0">
                    <tr>
                        <td>
                            <div className="flex justify-between [&>div]:w-1/2">
                                <div>
                                    <div>Respectfully yours, </div>
                                    <div className="pt-8 w-fit">
                                        <div className="border-b border-black uppercase text-center">{user.full_name}</div>
                                        <div>
                                            Signature Over Printed Name of Teacher
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="flex justify-between [&>div]:w-1/2 pt-7">
                                <div>
                                    <div>Conformed: </div>
                                    <div className="pt-8 w-fit">
                                        <div className="border-b border-black uppercase text-center">{curriculumhead}</div>
                                        <div>
                                            Signature Over Printed Name of
                                            Curriculum Head
                                        </div>
                                    </div>
                                </div>
                                <div className="pl-12">
                                    <div className="text-transparent">Conformed:</div>
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

export default OfficialBusinessContent;
