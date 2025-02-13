import StatisticsCard from "@/Components/StatisticsCard";
import { cn } from "@/Lib/utils";
import { usePage } from "@inertiajs/react";
import { Award, NoteRemove, Profile2User, RefreshSquare, TickCircle, Verify } from "iconsax-react";
import { CheckCheck } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

type Props = {
    totalpersonnel: number;
    leave: {
        approved: number;
        pending: number;
        disapproved: number;
    },
    servicecredits: number | null;
}

const DashboardStatistics = ({ totalpersonnel, leave, servicecredits }: Props) => {
    const { role, credits, splcredits } = usePage().props.auth.user;
    return (
        <div className={cn("grid gap-4 mt-4", role === "hr" || role === "teaching" ? "grid-cols-4" : "grid-cols-5")}>
            {role === "hr" ? (
                <StatisticsCard className="from-violet-700 via-violet-700 to-fuchsia-600 dark:from-violet-800/75 dark:via-violet-800/75 dark:to-fuchsia-700/75">
                    <div className="size-12 shrink-0 bg-fuchsia-200/45 dark:bg-fuchsia-300/30 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset_1px_1px_0_0_#ffffff0d]">
                        <Profile2User variant="Bulk" className="[&>path]:stroke-[2] drop-shadow-md" />
                    </div>
                    <div className="relative z-10">
                        <div className="text-base font-semibold">
                            Total Personnel
                        </div>
                        <div className="text-xl font-medium">{totalpersonnel}</div>
                    </div>
                </StatisticsCard>
            ) : (
                <Fragment>
                    {role !== "teaching" && <StatisticsCard className="from-violet-700 via-violet-700 to-fuchsia-600 dark:from-violet-800/75 dark:via-violet-800/75 dark:to-fuchsia-700/75">
                        <div className="size-12 shrink-0 bg-fuchsia-200/45 dark:bg-fuchsia-300/30 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset_1px_1px_0_0_#ffffff0d]">
                            <Verify variant="Bulk" className="[&>path]:stroke-[2] drop-shadow-md" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-base font-semibold">
                                Credits
                            </div>
                            <div className="text-xl font-medium">{credits + splcredits}</div>
                        </div>
                    </StatisticsCard>}
                    <StatisticsCard className="from-blue-600 via-blue-600 to-cyan-500 dark:from-blue-800/75 dark:via-blue-800/75 dark:to-cyan-700/75">
                        <div className="size-12 shrink-0 bg-cyan-200/45 dark:bg-cyan-300/30 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset_1px_1px_0_0_#ffffff0d]">
                            <Award variant="Bulk" className="[&>path]:stroke-[2] drop-shadow-md" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-base font-semibold">
                                Service Credits
                            </div>
                            <div className="text-xl font-medium">{(role === "teaching" ? credits : servicecredits)??"0"}</div>
                        </div>
                    </StatisticsCard>
                </Fragment>
            )}
            <StatisticsCard className="from-emerald-600 via-emerald-600 to-green-500 dark:from-emerald-800/90 dark:via-emerald-800/90 dark:to-green-700/90">
                <div className="size-12 shrink-0 bg-emerald-200/45 dark:bg-emerald-300/30 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset11p_1px_0_0_#ffffff0d]">
                    <TickCircle variant="Bulk" className="[&>path]:stroke-[2] drop-shadow-md" />
                </div>
                <div className="relative z-10">
                    <div className="text-base font-semibold">
                        Approved Leave
                    </div>
                    <div className="text-xl font-medium">{leave?.approved}</div>
                </div>
            </StatisticsCard>
            <StatisticsCard className="from-orange-600 via-orange-600 to-yellow-500 dark:from-orange-800/90 dark:via-orange-800/90 dark:to-yellow-700/90">
                <div className="size-12 shrink-0 bg-orange-200/45 dark:bg-orange-300/30 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset11p_1px_0_0_#ffffff0d]">
                    <RefreshSquare variant="Bulk" className="[&>path]:stroke-[2] drop-shadow-md" />
                </div>
                <div className="relative z-10">
                    <div className="text-base font-semibold">Pending Leave</div>
                    <div className="text-xl font-medium">{leave?.pending}</div>
                </div>
            </StatisticsCard>
            <StatisticsCard className="from-rose-600 via-rose-600 to-pink-500 dark:from-rose-800/90 dark:via-rose-800/90 dark:to-pink-700/90">
                <div className="size-12 shrink-0 bg-rose-200/45 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset11p_1px_0_0_#ffffff0d]">
                    <NoteRemove variant="Bulk" className="[&>path]:stroke-[2] drop-shadow-md" />
                </div>
                <div className="relative z-10">
                    <div className="text-base font-semibold">
                        Disapproved Leave
                    </div>
                    <div className="text-xl font-medium">{leave?.disapproved}</div>
                </div>
            </StatisticsCard>
        </div>
    );
};

export default DashboardStatistics;
