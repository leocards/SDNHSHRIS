import Modal, { ModalProps } from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import { Printer } from "iconsax-react";
import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import logo from "@/Assets/images/sdnhs-logo.png";
import deped from "@/Assets/images/DepEd.png";
import { format } from "date-fns";
import TypographySmall from "@/Components/Typography";
import { User } from "@/Types";
import { usePage } from "@inertiajs/react";
import { usePagination } from "@/Components/Provider/paginate-provider";
import { LEAVETYPEKEYS, LEAVETYPESOBJ } from "@/Pages/Leave/Types/leavetypes";

type Props = ModalProps & {
    type: "coc" | "leave" | "pds" | "certificate";
    principal: User;
    status: "all" | "approved" | "disapproved" | "invalid";
    year: string;
};

const LogsPrint: React.FC<Props> = ({
    type,
    year,
    status,
    principal,
    show,
    onClose,
}) => {
    const { loading } = usePagination();
    const hr = usePage().props.auth.user.full_name;
    const contentRef = useRef(null);
    const handlePrint = useReactToPrint({ contentRef });
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        if (!loading) {
            window.axios
                .get(
                    route("myreports.logs.all", {
                        _query: {
                            type,
                            filterYear: year,
                            status,
                        },
                    })
                )
                .then((response) => {
                    setLogs(response.data);
                });
        }
    }, [loading]);

    return (
        <Modal show={show} onClose={onClose} maxWidth="fit">
            <div className="flex items-center">
                <Button variant="outline" onClick={() => handlePrint()}>
                    <Printer />
                    <span>Print</span>
                </Button>

                <Button
                    size="icon"
                    variant="outline"
                    className="absolute top-6 right-6"
                    onClick={() => onClose(false)}
                >
                    <X />
                </Button>
            </div>

            <div className="min-h-40">
                <Component loading={false}>
                    <div className="overflow-y-auto rounded-scrollbar overflow-x-auto w-">
                        <div
                            ref={contentRef}
                            className="w-[8.3in] shrink-0 pr int:scale-90 mx-auto px-4"
                        >
                            <style>
                                {`
                                    @media print {
                                        body {
                                            overflow: hidden;
                                            height: fit-content;
                                            margin: 0px !important;
                                        }
                                        @page {
                                            size: portrait;
                                            margin-top: 1.95rem;
                                            margin-bottom: 0.88rem;
                                        }
                                    }
                                `}
                            </style>
                            <table className="table border-none">
                                <tbody>
                                    <tr className="border-none">
                                        <td>
                                            <img
                                                src={deped}
                                                className="w-20 shrink-0 ml-auto"
                                            />
                                        </td>
                                        <td className="text-center max-w-48">
                                            <div className="leading-5">
                                                Republika ng Pilipinas <br />
                                                Kagawaran ng Edukasyon <br />
                                                Rehiyon XI <br />
                                                Sangay ng Lungsod ng Panabo{" "}
                                                <br />
                                                Lungsod ng Panabo
                                            </div>
                                            <div className="font-bold leading-5 pt-4">
                                                SOUTHERN DAVAO NATIONAL HIGH
                                                SCHOOL
                                            </div>
                                            <div className="leading-5">
                                                Southern Davao, Panabo City
                                            </div>
                                        </td>
                                        <td>
                                            <img
                                                src={logo}
                                                className="w-20 shrink-0"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="table">
                                <tbody>
                                    <tr className="border-none">
                                        <td className="text-center">
                                            <div className="leading-5 mx-auto w-fit font-bold uppercase text-[]">
                                                Logs report for {type}
                                            </div>
                                            <div className="leading-5">
                                                Calendar Year {year}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="table border border-black [&>thead>tr]:border-black mt-4 text-[10pt]">
                                <thead>
                                    <tr className="[&>th]:border-black [&>th]:border text-left text-foreground">
                                        <th className="w-12">No.</th>
                                        <th>Personnel</th>
                                        {type === "leave" && (
                                            <th className="w-[9rem] text-center">Type of Leave</th>
                                        )}
                                        <th className="w-28 text-center">
                                            Status
                                        </th>
                                        <th className="w-[13.5rem] text-center">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.length > 0 ? (
                                        logs.map((log, index) => (
                                            <tr
                                                key={index}
                                                className="[&>td]:py-2 [&>td]:border-black [&>td]:border"
                                            >
                                                <td className="w-12 text-center">
                                                    {index + 1}
                                                </td>
                                                <td>{log.details.username}</td>
                                                {type === "leave" && (
                                                    <td className="text-center capitalize w-[9rem]">
                                                        {
                                                            LEAVETYPESOBJ[
                                                                log.details
                                                                    .type as LEAVETYPEKEYS
                                                            ]
                                                        }
                                                    </td>
                                                )}
                                                <td className="text-center capitalize">
                                                    {log.status}
                                                </td>
                                                <td>
                                                    {format(
                                                        log.created_at,
                                                        "MMMM dd, y"
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="[&>td]:py-2 [&>td]:border-black [&>td]:border">
                                            <td
                                                colSpan={4}
                                                className="text-center"
                                            >
                                                No records to print.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <table className="table mt-4">
                                <tbody>
                                    <tr className="border-none">
                                        <td>
                                            <div className="w-72">
                                                <div>Prepared by:</div>
                                                <div className="pt-10 text-center">
                                                    <div className="uppercase font-bold">
                                                        {hr}
                                                    </div>
                                                    <hr className="border-black" />
                                                    <div>School HR</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="w-full"></td>
                                        <td className=" text-right">
                                            <div className="w-72">
                                                <div className="text-right">
                                                    Certified Correct and
                                                    Approved by:
                                                </div>
                                                <div className="pt-10 ml-auto text-center">
                                                    <div className="uppercase font-bold">
                                                        {principal?.full_name ??
                                                            "No principal added"}
                                                    </div>
                                                    <hr className="border-black" />
                                                    <div>
                                                        {principal?.position ??
                                                            "No principal added"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Component>
            </div>
        </Modal>
    );
};

const Component = ({
    loading,
    children,
}: {
    loading: boolean;
    children: React.ReactNode;
}) => {
    return loading ? (
        <div className="mx-auto text-center mt-24">
            <div className="loading loading-spinner loading-md mx-auto"></div>
            <div>
                <TypographySmall>Please wait a moment...</TypographySmall>
            </div>
        </div>
    ) : (
        children
    );
};

export default LogsPrint;
