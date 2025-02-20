import StatisticsCard from "@/Components/StatisticsCard";
import { useSidebar } from "@/Components/ui/sidebar";
import { cn } from "@/Lib/utils";
import { usePage } from "@inertiajs/react";
import {
    Award,
    NoteRemove,
    Profile2User,
    RefreshSquare,
    TickCircle,
    Verify,
} from "iconsax-react";
import { CheckCheck } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

type Props = {
    totalpersonnel: number;
    leave: {
        approved: number;
        pending: number;
        disapproved: number;
    };
    servicecredits: number | null;
};

const DashboardStatistics = ({
    totalpersonnel,
    leave,
    servicecredits,
}: Props) => {
    const { role, credits, splcredits } = usePage().props.auth.user;
    const { state, isMobile } = useSidebar();

    return (
        <div
            className={cn(
                "grid gap-4 mt-4",
                role === "hr" || role === "teaching"
                    ? state === "collapsed" || isMobile
                    ? "grid-cols-4 [@media(max-width:755px)]:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]"
                    : "grid-cols-4 [@media(max-width:1162px)]:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]"
                    : (state === "collapsed" || isMobile
                    ? "grid-cols-5 [@media(max-width:755px)]:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]"
                    : "grid-cols-5 [@media(max-width:1300px)]:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]")
            )}
        >
            {role === "hr" ? (
                <StatisticsCard
                    label="Total Personnel"
                    data={totalpersonnel}
                    className="from-violet-700 via-violet-700 to-fuchsia-600 dark:from-violet-800/75 dark:via-violet-800/75 dark:to-fuchsia-700/75"
                    iconClass="bg-fuchsia-200/45 dark:bg-fuchsia-300/30 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset_1px_1px_0_0_#ffffff0d]"
                >
                    <Profile2User
                        variant="Bulk"
                        className="[&>path]:stroke-[2] drop-shadow-md"
                    />
                </StatisticsCard>
            ) : (
                <Fragment>
                    {role !== "teaching" && (
                        <StatisticsCard
                            label="Credits"
                            data={credits + splcredits}
                            className="from-violet-700 via-violet-700 to-fuchsia-600 dark:from-violet-800/75 dark:via-violet-800/75 dark:to-fuchsia-700/75"
                            iconClass="bg-fuchsia-200/45 dark:bg-fuchsia-300/30 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset_1px_1px_0_0_#ffffff0d]"
                        >
                            <Verify
                                variant="Bulk"
                                className="[&>path]:stroke-[2] drop-shadow-md"
                            />
                        </StatisticsCard>
                    )}
                    <StatisticsCard
                        label="Service Credits"
                        data={
                            (role === "teaching" ? credits : servicecredits) ??
                            "0"
                        }
                        className="from-blue-600 via-blue-600 to-cyan-500 dark:from-blue-800/75 dark:via-blue-800/75 dark:to-cyan-700/75"
                        iconClass="bg-cyan-200/45 dark:bg-cyan-300/30 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset_1px_1px_0_0_#ffffff0d]"
                    >
                        <Award
                            variant="Bulk"
                            className="[&>path]:stroke-[2] drop-shadow-md"
                        />
                    </StatisticsCard>
                </Fragment>
            )}
            <StatisticsCard
                label="Approved Leave"
                data={leave?.approved}
                className="from-emerald-600 via-emerald-600 to-green-500 dark:from-emerald-800/90 dark:via-emerald-800/90 dark:to-green-700/90"
                iconClass="bg-emerald-200/45 dark:bg-emerald-300/30 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset11p_1px_0_0_#ffffff0d]"
            >
                <TickCircle
                    variant="Bulk"
                    className="[&>path]:stroke-[2] drop-shadow-md"
                />
            </StatisticsCard>
            <StatisticsCard
                label="Pending Leave"
                data={leave?.pending}
                className="from-orange-600 via-orange-600 to-yellow-500 dark:from-orange-800/90 dark:via-orange-800/90 dark:to-yellow-700/90"
                iconClass="bg-orange-200/45 dark:bg-orange-300/30 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset11p_1px_0_0_#ffffff0d]"
            >
                <RefreshSquare
                    variant="Bulk"
                    className="[&>path]:stroke-[2] drop-shadow-md"
                />
            </StatisticsCard>
            <StatisticsCard
                label="Disapproved Leave"
                data={leave?.disapproved}
                className="from-rose-600 via-rose-600 to-pink-500 dark:from-rose-800/90 dark:via-rose-800/90 dark:to-pink-700/90"
                iconClass="bg-rose-200/45 rounded-full flex items-center justify-center backdrop-blur-md [box-shadow:_inset11p_1px_0_0_#ffffff0d]"
            >
                <NoteRemove
                    variant="Bulk"
                    className="[&>path]:stroke-[2] drop-shadow-md"
                />
            </StatisticsCard>
        </div>
    );
};

export default DashboardStatistics;
