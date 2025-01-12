import Header from "@/Components/Header";
import { Head, usePage } from "@inertiajs/react";
import { format } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import DashboardStatistics from "./DashboardStatistics";
import ActiveLeave from "./ActiveLeave";
import Announcement, { ANNOUNCEMENT } from "./Announcement";
import LeaveApplicationGraph from "./LeaveApplicationGraph";
import GenderDemographic from "./GenderDemographic";
import PersonnelPerformance from "./PersonnelPerformance";
import { cn } from "@/Lib/utils";
import YearlyPerformanceGraph from "./YearlyPerformanceGraph";
import { SCHOOLYEAR, User } from "@/Types";
import { LEAVETYPEKEYS } from "../Leave/Types/leavetypes";
import { APPLICATIONFORLEAVETYPES } from "../Leave/PDF/type";
import { ACTIVELEAVETYPE, GENDERPROPORTIONTYPE, LEAVEAPPLICATIONS, OUTSTANDINGPERSONNEL, PERSONNELPERFORMANCETYPE } from "./type";

type Props = {
    totalpersonnel: number;
    leave: {
        approved: number;
        pending: number;
        disapproved: number;
    };
    announcements: ANNOUNCEMENT[];
    activeleave: ACTIVELEAVETYPE[];
    schoolyears: SCHOOLYEAR[];
    personnelperformance: PERSONNELPERFORMANCETYPE[];
    outstandingpersonnel: OUTSTANDINGPERSONNEL;
    genderProportion: GENDERPROPORTIONTYPE;
    leaveapplications: LEAVEAPPLICATIONS;
    servicecredits: number | null
};

function Dashboard({
    totalpersonnel,
    leave,
    genderProportion,
    outstandingpersonnel,
    personnelperformance,
    leaveapplications,
    announcements,
    schoolyears,
    activeleave,
    servicecredits,
}: Props) {
    const user = usePage().props.auth.user;
    const [dateTime, setDateTime] = useState({
        date: format(new Date(), "LLLL d, y"),
        time: format(new Date(), "hh:mm aaa"),
    });

    useEffect(() => {
        let timeInterval = Math.abs((new Date().getSeconds() - 60) * 1000);

        const setTimePerMinute = () => {
            setDateTime({
                date: format(new Date(), "LLLL d, y"),
                time: format(new Date(), "hh:mm aaa"),
            });
        };

        const setIntervalDateTime = setInterval(setTimePerMinute, timeInterval);

        return () => clearInterval(setIntervalDateTime);
    }, [dateTime]);

    return (
        <Fragment>
            <Head title="Dashboard" />

            <div className="leading-tight">
                <Header>Welcome, {`${user.firstname} ${user.lastname}`}</Header>
                <div className="text-sm font-medium">{dateTime.date}</div>
                <div className="text-sm font-medium">{dateTime.time}</div>
            </div>

            <DashboardStatistics
                totalpersonnel={totalpersonnel}
                leave={leave}
                servicecredits={servicecredits}
            />

            <div className="grid grid-cols-[1fr,29rem] gap-4 my-4 [&>div]:h-[26rem]">
                <ActiveLeave activeleave={activeleave} />
                <Announcement announcements={announcements} />
            </div>

            <LeaveApplicationGraph leave={leaveapplications} schoolyears={schoolyears} />

            <YearlyPerformanceGraph performance={personnelperformance} />

            <div
                className={cn(
                    "grid-cols-[25rem,1fr] gap-4 mt-4 [&>div]:h-[26rem]",
                    user.role == "hr" ? "grid" : "hidden"
                )}
            >
                <GenderDemographic gender={genderProportion} />
                <PersonnelPerformance performance={outstandingpersonnel} />
            </div>
        </Fragment>
    );
}

export default Dashboard;
