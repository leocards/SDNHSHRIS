import { forwardRef } from "react";
import Deped from "@/Assets/images/DepEd.png";
import SDNHSLogo from "@/Assets/images/sdnhs-logo.png";
import { cn } from "@/Lib/utils";
import { equivalent, IPCRTYPE } from "./IPCR";
import { User } from "@/Types";

type Props = {
    ipcr: Array<IPCRTYPE>;
    principal: Pick<User, "full_name"|"position">;
    hr: string;
    year: string
};

function groupItems(items: Array<IPCRTYPE>) {
    const firstGroupSize = 32;
    const subsequentGroupSize = 44;

    // Add unique id to each item
    const itemsWithIds = items.map((item, index) => ({
        ...item,
        counter: index + 1, // Add id starting from 1
    }));

    // Step 1: Extract the first group (28 items)
    const firstGroup = itemsWithIds.slice(0, firstGroupSize);

    // Step 2: Extract the remaining items and group them in chunks of 36
    const remainingItems = itemsWithIds.slice(firstGroupSize);

    const groups = [firstGroup]; // Start with the first group

    for (let i = 0; i < remainingItems.length; i += subsequentGroupSize) {
        const chunk = remainingItems.slice(i, i + subsequentGroupSize);
        groups.push(chunk);
    }

    return groups;
}

const PDFIPCR = forwardRef<HTMLDivElement, Props>(({ ipcr, principal, hr, year }, ref) => {
    let IPCRList = groupItems([...ipcr]);

    const getSALNLength = (): string => {
        if(IPCRList.length === 1 && IPCRList[0].length > 27) {
            return "break-before-page pt-12"
        }

        if(IPCRList.length > 1 && IPCRList[IPCRList.length - 1].length > 37)
            return "break-before-page pt-12"

        return ""
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
                    <div className="font-bold leading-5">
                        SOUTHERN DAVAO NATIONAL HIGH SCHOOL
                    </div>
                    <div className="leading-5">Southern Davao, Panabo City</div>

                    <div className="font-bold leading-5 pt-5">
                        LIST OF TEACHERS WITH THEIR IPCR RATING
                    </div>
                    <div className="leading-5">S.Y. {year}</div>
                </div>
                <div>
                    <img src={SDNHSLogo} className="w-20 shrink-0" />
                </div>
            </div>

            {IPCRList.map((item, index) => {
                if (index === 0) {
                    return (
                        <div key={index} className="border border-black mt-4 divide-y divide-black font-['Times_New_Roman']">
                            <div className="grid grid-cols-[2.5rem,1fr,8rem,7rem,7rem] divide-x divide-black [&>div]:justify-center text-center [&>div]:flex [&>div]:items-center">
                                <div>
                                    <div>No.</div>
                                </div>
                                <div>
                                    <div>Name of Personnel</div>
                                </div>
                                <div>
                                    <div>Position</div>
                                </div>
                                <div>
                                    <div>
                                        Performance Rating <br /> (SY {year})
                                    </div>
                                </div>
                                <div>
                                    <div>Adjectival Equivalent</div>
                                </div>
                            </div>

                            {item.map((ratings, indx) => (
                                <div key={indx} className="grid grid-cols-[2.5rem,1fr,8rem,7rem,7rem] divide-x divide-black [&>div]:py-px [&>div]:px-0.5 text-center">
                                    <div>{ratings.counter}</div>
                                    <div className="text-left">{ratings.user.name}</div>
                                    <div>{ratings.user.position}</div>
                                    <div>{ratings.rating}</div>
                                    <div>{equivalent(ratings.rating?+ratings.rating:null)}</div>
                                </div>
                            ))}
                        </div>
                    );
                } else {
                    return (
                        <div key={index} className={cn(item.length <= 15 ? "print:pt-5" : item.length <= 20 && "print:pt-1")}>
                            <div className={cn("border border-black mt-4 divide-y divide-black font-['Times_New_Roman']")}>
                                {item.map((ratings, indx) => (
                                    <div key={indx} className="grid grid-cols-[2.5rem,1fr,8rem,7rem,7rem] divide-x divide-black [&>div]:py-px [&>div]:px-0.5 text-center">
                                        <div>{ratings.counter}</div>
                                        <div className="text-left">{ratings.user?.name}</div>
                                        <div>{ratings.user.position}</div>
                                        <div>{ratings.rating}</div>
                                        <div>{equivalent(ratings.rating? +ratings.rating : null)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }
            })}

            <div className={cn("grid grid-cols-2 font-['Times_New_Roman'] mt-8", getSALNLength())}>
                <div>
                    <div className="">Prepared by:</div>
                    <div className="pt-10 w-96 text-center">
                        <div className="uppercase font-bold">{hr}</div>
                        <hr className="border-black" />
                        <div className="">School HR</div>
                    </div>
                </div>

                <div>
                    <div className="text-right">Certified Correct and Approved by:</div>
                    <div className="pt-10 w-72 ml-auto text-center">
                        <div className="uppercase font-bold">{principal?.full_name||"No principal added"}</div>
                        <hr className="border-black" />
                        <div className="">{principal?.position||"No principal added"}</div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default PDFIPCR;
