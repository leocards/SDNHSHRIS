import React from "react";
import logo from "@/Assets/images/sdnhs-logo.png";
import { User } from "@/Types";

type Props = {
    principal: Pick<User, "full_name" | "position">;
};

const Footer: React.FC<Props> = ({ principal }) => {
    return (
        <div className="">
            <table className="table">
                <tbody className="[&>tr]:border-none [&>tr>td]:p-0">
                    <tr>
                        <td>
                            <div className="text-center mt-16 relative">
                                <div className="relative w-fit mx-auto">
                                    <div className="uppercase absolute -top-10 -left-28">APPROVED:</div>
                                    <div className="uppercase font-bold">{principal.full_name}</div>
                                    <div className="">{principal.position}</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table className="table border-t border-black mt-5">
                <tbody className="[&>tr]:border-none">
                    <tr>
                        <td className="w-[6.5rem]">
                            <img src={logo} className="w-24 shrink-0" />
                        </td>
                        <td className="pl-0">
                            <div className="font-calibri text-[11pt] font-semibold leading-4">
                                <div>SOUTHERN DAVAO NATIONAL HIGH SCHOOL</div>
                                <div>Barangay Southern Davao, Panabo City, Davao del Norte</div>
                                <div>09302206174 / 09272506495</div>
                                <a className="text-blue-600 underline">southerndavao.nhs@deped.gov.ph</a>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Footer;
