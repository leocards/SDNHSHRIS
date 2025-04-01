import React, { useMemo } from "react";
import { CLASSASSUMPTIONTYPE, formatTimeTo12Hr } from "../type";
import { cn } from "@/Lib/utils";

type ClassLoadsProps = {
    loads: CLASSASSUMPTIONTYPE['details']['classloads']
}

const ClassLoads: React.FC<ClassLoadsProps> = ({loads}) => {
    const classloads = useMemo(() => {
        let cl = [...loads]

        cl.push(...Array((6 - cl.length) <= 0 ? 0 : 6 - cl.length).fill('').map(() => ({
            time: '', timeTo: '', gradesection: '', subject: '', teacher: 0
        })))

        return cl
    }, [loads])

    return (
        <table className="table-fixed border-collapse border border-black text-[11pt]">
            <tbody className="[&>tr]:border-black [&>tr>td]:text-center [&>tr>td]:border [&>tr>td]:border-black [&>tr>td]:w-1/5">
                <tr>
                    <td>Time</td>
                    <td>Grade & Section</td>
                    <td>Subject</td>
                    <td>Name of Teacher who will Take Over</td>
                    <td>Signature</td>
                </tr>
                {classloads.map((data, index) => (
                        <tr key={index}>
                            <td className={cn("text-[10pt]", !data.time && "text-transparent")}>{formatTimeTo12Hr(data.time) +' - '+ formatTimeTo12Hr(data.timeTo)}</td>
                            <td className={cn("text-[10pt]", !data.gradesection && "text-transparent")}>{data.gradesection}</td>
                            <td className={cn("text-[10pt]", !data.subject && "text-transparent")}>{data.subject}</td>
                            <td className={cn("text-[10pt]", !data.teacher && "text-transparent")}>{data.teacher}</td>
                            <td className="text-transparent text-[10pt]">N/A</td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );
};

export default ClassLoads;
