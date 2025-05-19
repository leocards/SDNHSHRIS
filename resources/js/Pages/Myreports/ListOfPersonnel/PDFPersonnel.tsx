import { forwardRef, useMemo } from "react";
import Deped from "@/Assets/images/DepEd.png";
import SDNHSLogo from "@/Assets/images/sdnhs-logo.png";
import { FilteredListType, LIST } from "./ListOfPersonnel";
import { usePage } from "@inertiajs/react";
import { User } from "@/Types";

type Props = {
    summary: LIST;
    principal: Pick<User, "position" | "full_name">;
    schoolYear: string
};

const PDFPersonnel = forwardRef<HTMLDivElement, Props>(
    ({ summary, principal, schoolYear }, ref) => {
        const sy = schoolYear ?? usePage().props.schoolyear?.schoolyear;
        const hr = usePage().props.auth.user;
        const filteredList: FilteredListType = useMemo(() => {
            const categories = [
                "jhs",
                "shs",
                "accounting",
                "principal",
            ] as const;
            const result: FilteredListType = {
                male: { jhs: 0, shs: 0, accounting: 0, principal: 0 },
                female: { jhs: 0, shs: 0, accounting: 0, principal: 0 },
            };

            categories.forEach((category) => {
                result.male[category] = summary[category].filter(
                    (item: any) => item.gender === "male"
                ).length;
                result.female[category] = summary[category].filter(
                    (item: any) => item.gender === "female"
                ).length;
            });

            return result;
        }, [summary]);

        const empListCategory = {
            jhs: "Junior High School",
            shs: "Senior High School",
            accounting: "Accounting",
            principal: "Principal",
        };

        return (
            <div ref={ref} className="w-[8.3in] shrink-0 print:scale-90">
                <div className="flex font-arial [&>div]:grow w-full print:">
                    <div>
                        <img src={Deped} className="w-20 shrink-0 ml-auto" />
                    </div>
                    <div className="space-y-px text-center max-w-96">
                        <div className="leading-5">
                            Republika ng Pilipinas <br />
                            Kagawaran ng Edukasyon <br />
                            Rehiyon XI <br />
                            Sangay ng Lungsod ng Panabo <br />
                            Lungsod ng Panabo
                        </div>
                        <div className="font-bold leading-5 pt-4">
                            SOUTHERN DAVAO NATIONAL HIGH SCHOOL
                        </div>
                        <div className="leading-5">
                            Southern Davao, Panabo City
                        </div>
                        <div className="leading-5">SY {sy}</div>
                    </div>
                    <div>
                        <img src={SDNHSLogo} className="w-20 shrink-0" />
                    </div>
                </div>

                <div className="mt-7">
                    <table className="table border border-black [&>thead>tr]:border-black">
                        <thead>
                            <tr className="[&>th]:border-black [&>th]:border text-center text-foreground">
                                <th></th>
                                <th className="w-20">MALE</th>
                                <th className="w-20">FEMALE</th>
                                <th className="w-20 text-red-500">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(
                                [
                                    "jhs",
                                    "shs",
                                    "accounting",
                                    "principal",
                                ] as const
                            ).map((category, index) => (
                                <tr
                                    key={index}
                                    className="[&>td]:py-2 [&>td]:border-black [&>td]:border text-center"
                                >
                                    <td className="text-left uppercase">
                                        {empListCategory[category]}
                                    </td>
                                    <td>{filteredList.male[category]}</td>
                                    <td>{filteredList.female[category]}</td>
                                    <td className="text-red-500">
                                        {filteredList.male[category] +
                                            filteredList.female[category]}
                                    </td>
                                </tr>
                            ))}
                            <tr className="[&>td]:py-2 [&>td]:border-black [&>td]:border text-center">
                                <td></td>
                                <td>
                                    {Object.values(filteredList.male).reduce(
                                        (sum, value) => sum + value,
                                        0
                                    )}
                                </td>
                                <td>
                                    {Object.values(filteredList.female).reduce(
                                        (sum, value) => sum + value,
                                        0
                                    )}
                                </td>
                                <td className="text-red-500">
                                    {Object.values(filteredList.male).reduce(
                                        (sum, value) => sum + value,
                                        0
                                    ) +
                                        Object.values(
                                            filteredList.female
                                        ).reduce(
                                            (sum, value) => sum + value,
                                            0
                                        )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <table className="table border border-black [&>thead>tr]:border-black mt-4 text-[10pt]">
                    <thead>
                        <tr className="[&>th]:border-black [&>th]:border text-left text-foreground">
                            <th colSpan={3}>JUNIOR HIGH SCHOOL</th>
                        </tr>
                        <tr
                            className="[&>td]:border-black [&>td]:border text-left text-foreground"
                        >
                            <td className="w-12 text-center shrink-0">#</td>
                            <td className="w-[calc(50%-3rem)]">Personnel</td>
                            <td className="w-[calc(45%)]">Position</td>
                        </tr>
                    </thead>
                    <tbody>
                        {summary.jhs.map((jhs, index) => (
                            <tr
                                key={index}
                                className="[&>td]:py-2 [&>td]:border-black [&>td]:border"
                            >
                                <td className="w-12 text-center shrink-0">{++index}</td>
                                <td className="w-[calc(50%-3rem)]">{jhs?.name}</td>
                                <td className="w-[calc(45%)]">{jhs?.position}</td>
                            </tr>
                        ))}
                        {summary.jhs.length === 0 && (
                            <tr className="[&>td]:py-2 [&>td]:border-black [&>td]:border">
                                <td>No records for junior high school</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <table className="table border border-black [&>thead>tr]:border-black mt-4 text-[10pt] break-after-auto">
                    <thead>
                        <tr className="[&>th]:border-black [&>th]:border text-left text-foreground">
                            <th colSpan={3}>SENIOR HIGH SCHOOL</th>
                        </tr>
                        <tr
                            className="[&>td]:border-black [&>td]:border text-left text-foreground"
                        >
                            <td className="w-12 text-center shrink-0">#</td>
                            <td className="w-[calc(50%-3rem)]">Personnel</td>
                            <td className="w-[calc(45%)]">Position</td>
                        </tr>
                    </thead>
                    <tbody>
                        {summary.shs.map((shs, index) => (
                            <tr
                                key={index}
                                className="[&>td]:py-2 [&>td]:border-black [&>td]:border"
                            >
                                <td className="w-12 text-center shrink-0">{++index}</td>
                                <td className="w-[calc(50%-3rem)]">{shs?.name}</td>
                                <td className="w-[calc(45%)]">{shs?.position}</td>
                            </tr>
                        ))}
                        {summary.shs.length === 0 && (
                            <tr className="[&>td]:py-2 [&>td]:border-black [&>td]:border">
                                <td>No records for senior high school</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <table className="table border border-black [&>thead>tr]:border-black mt-4 text-[10pt] break-after-auto">
                    <thead>
                        <tr className="[&>th]:border-black [&>th]:border text-left text-foreground">
                            <th colSpan={3}>ACCOUNTING</th>
                        </tr>
                        <tr
                            className="[&>td]:border-black [&>td]:border text-left text-foreground"
                        >
                            <td className="w-12 text-center shrink-0">#</td>
                            <td className="w-[calc(50%-3rem)]">Personnel</td>
                            <td className="w-[calc(45%)]">Position</td>
                        </tr>
                    </thead>
                    <tbody>
                        {summary.accounting.map((acc, index) => (
                            <tr
                                key={index}
                                className="[&>td]:py-2 [&>td]:border-black [&>td]:border"
                            >
                                <td className="w-12 text-center shrink-0">{++index}</td>
                                <td className="w-[calc(50%-3rem)]">{acc?.name}</td>
                                <td className="w-[calc(45%)]">{acc?.position}</td>
                            </tr>
                        ))}

                        {summary.accounting.length === 0 && (
                            <tr className="[&>td]:py-2 [&>td]:border-black [&>td]:border">
                                <td>No records for accounting</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <table className="table mt-4">
                    <tbody>
                        <tr className="border-none">
                            <td className="">
                                <div className="w-72">
                                    <div className="">Prepared by:</div>
                                    <div className="pt-10 text-center">
                                        <div className="uppercase font-bold">
                                            {hr?.full_name}
                                        </div>
                                        <hr className="border-black" />
                                        <div className="">School HR</div>
                                    </div>
                                </div>
                            </td>
                            <td className="w-full"></td>
                            <td className="text-right">
                                <div className="w-72">
                                    <div className="text-right">
                                        Certified Correct and Approved by:
                                    </div>
                                    <div className="pt-10 ml-auto text-center">
                                        <div className="uppercase font-bold">
                                            {principal?.full_name??"No principal added"}
                                        </div>
                                        <hr className="border-black" />
                                        <div className="">
                                            {principal?.position??"No principal added"}
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
);

export default PDFPersonnel;
