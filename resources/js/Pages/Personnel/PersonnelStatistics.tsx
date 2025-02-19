import StatisticsCard from "@/Components/StatisticsCard";
import { Profile2User, SecurityUser, TagUser, Verify } from "iconsax-react";
import React from "react";

type Props = {
    jhs: number;
    shs: number;
    accounting: number;
};

const PersonnelStatistics = (props: Props) => {
    return (
        <div className="grid max-sm:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] grid-cols-4 gap-4 mt-4">
            <StatisticsCard
                label="Junior High School"
                data={props.jhs}
                iconClass="bg-rose-200/45 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset11p_1px_0_0_#ffffff0d]"
                className="from-rose-600 via-rose-600 to-pink-500 dark:from-rose-800/90 dark:via-rose-800/90 dark:to-pink-700/90"
            >
                <Profile2User
                    variant="Bulk"
                    className="[&>path]:stroke-[2] drop-shadow-md"
                />
            </StatisticsCard>
            <StatisticsCard
                label="Senior High School"
                iconClass="bg-emerald-200/45 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset11p_1px_0_0_#ffffff0d]"
                data={props.shs}
                className="from-emerald-600 via-emerald-600 to-green-500 dark:from-emerald-800/90 dark:via-emerald-800/90 dark:to-green-700/90"
            >
                <Profile2User
                    variant="Bulk"
                    className="[&>path]:stroke-[2] drop-shadow-md"
                />
            </StatisticsCard>
            <StatisticsCard
                label="Accounting"
                iconClass="bg-blue-200/45 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset11p_1px_0_0_#ffffff0d]"
                data={props.accounting}
                className="from-blue-600 via-blue-600 to-cyan-500 dark:from-blue-800/90 dark:via-blue-800/90 dark:to-cyan-700/90"
            >
                <TagUser
                    variant="Bulk"
                    className="[&>path]:stroke-[2] drop-shadow-md"
                />
            </StatisticsCard>
            <StatisticsCard
                label="Administator/s"
                iconClass="bg-purple-200/45 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset11p_1px_0_0_#ffffff0d]"
                data={1}
                className="from-purple-600 via-purple-600 to-fuchsia-500 dark:from-purple-800/90 dark:via-purple-800/90 dark:to-fuchsia-700/90"
            >
                <SecurityUser
                    variant="Bulk"
                    className="[&>path]:stroke-[2] drop-shadow-md"
                />
            </StatisticsCard>
        </div>
    );
};

export default PersonnelStatistics;
