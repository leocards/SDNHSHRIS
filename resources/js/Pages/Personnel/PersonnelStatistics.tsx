import StatisticsCard from "@/Components/StatisticsCard";
import { Profile2User, SecurityUser, TagUser, Verify } from "iconsax-react";
import React from "react";

type Props = {
    jhs: number
    shs: number
    accounting: number
}

const PersonnelStatistics = (props: Props) => {
    return (
        <div className="grid grid-cols-4 gap-4 mt-4">
            <StatisticsCard className="from-rose-600 via-rose-600 to-pink-500 dark:from-rose-800/90 dark:via-rose-800/90 dark:to-pink-700/90">
                <div className="size-12 shrink-0 bg-rose-200/45 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset11p_1px_0_0_#ffffff0d]">
                    <Profile2User variant="Bulk" className="[&>path]:stroke-[2] drop-shadow-md" />
                </div>
                <div className="relative z-10">
                    <div className="text-base font-semibold">
                        Junior High School
                    </div>
                    <div className="text-xl font-medium">{props.jhs}</div>
                </div>
            </StatisticsCard>
            <StatisticsCard className="from-emerald-600 via-emerald-600 to-green-500 dark:from-emerald-800/90 dark:via-emerald-800/90 dark:to-green-700/90">
                <div className="size-12 shrink-0 bg-emerald-200/45 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset11p_1px_0_0_#ffffff0d]">
                    <Profile2User variant="Bulk" className="[&>path]:stroke-[2] drop-shadow-md" />
                </div>
                <div className="relative z-10">
                    <div className="text-base font-semibold">
                        Senior High School
                    </div>
                    <div className="text-xl font-medium">{props.shs}</div>
                </div>
            </StatisticsCard>
            <StatisticsCard className="from-blue-600 via-blue-600 to-cyan-500 dark:from-blue-800/90 dark:via-blue-800/90 dark:to-cyan-700/90">
                <div className="size-12 shrink-0 bg-blue-200/45 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset11p_1px_0_0_#ffffff0d]">
                    <TagUser variant="Bulk" className="[&>path]:stroke-[2] drop-shadow-md" />
                </div>
                <div className="relative z-10">
                    <div className="text-base font-semibold">
                        Accounting
                    </div>
                    <div className="text-xl font-medium">{props.accounting}</div>
                </div>
            </StatisticsCard>
            <StatisticsCard className="from-purple-600 via-purple-600 to-fuchsia-500 dark:from-purple-800/90 dark:via-purple-800/90 dark:to-fuchsia-700/90">
                <div className="size-12 shrink-0 bg-purple-200/45 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset11p_1px_0_0_#ffffff0d]">
                    <SecurityUser variant="Bulk" className="[&>path]:stroke-[2] drop-shadow-md" />
                </div>
                <div className="relative z-10">
                    <div className="text-base font-semibold">
                        Administator/s
                    </div>
                    <div className="text-xl font-medium">1</div>
                </div>
            </StatisticsCard>
        </div>
    );
};

export default PersonnelStatistics;
