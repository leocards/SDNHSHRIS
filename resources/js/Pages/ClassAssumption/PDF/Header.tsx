import React from "react";
import deped from "@/Assets/images/DepEd.png";
import { User } from "@/Types";

type Props = {
    principal: Pick<User, "full_name" | "position">;
};

const Header: React.FC<Props> = ({ principal }) => {
    return (
        <div>
            <table className="table border-b border-black">
                <tbody className="[&>tr]:border-none">
                    <tr>
                        <td className="p-0">
                            <img
                                src={deped}
                                className="w-[4.5rem] shrink-0 mx-auto"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="py-0 pt-2">
                            <div className="text-center font-old-english text-[11pt] mb-2.5">
                                Republic of the Philippines
                            </div>
                            <div className="text-center font-semibold font-old-english text-[14pt] mb-2">
                                Department of Education
                            </div>
                            <div className="text-center font-serif font-semibold text-[10pt]">
                                REGION XI
                            </div>
                            <div className="text-center font-serif font-semibold text-[10pt]">
                                DIVISION OF PANABO CITY
                            </div>
                            <div className="text-center font-serif font-semibold text-[10pt]">
                                SOUTHERN DAVAO NATIONAL HIGH SCHOOL
                            </div>
                            <div className="text-center font-serif font-semibold text-[10pt]">
                                BRGY. SOUTHERN DAVAO, PANABO CITY
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table className="table border-none mt-3">
                <tbody className="[&>tr]:border-none">
                    <tr>
                        <td className="text-[18pt] font-bold text-center">
                            CLASS ASSUMPTION
                        </td>
                    </tr>
                    <tr>
                        <td className="p-0">
                            <div className="">
                                <div className="uppercase font-bold font-a rial">
                                    {principal.full_name}
                                </div>
                                <div>{principal.position}</div>
                                <div className="normal-case">
                                    Southern Davao NHS
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Header;
