import { User } from "@/Types";
import { LEAVETYPEKEYS } from "../Leave/Types/leavetypes";

export type ACTIVELEAVETYPE = {
    id: number;
    user: User;
    type: LEAVETYPEKEYS;
    from: string;
    to: string;
};

export type PERSONNELPERFORMANCETYPE = {
    sy: string;
    rating: number;
};

export type OUTSTANDINGPERSONNEL = {
    outstanding: any[];
    leastperforming: any[];
};

export type GENDERPROPORTIONTYPE = {
    PT1: {
        female: number;
        male: number;
    };
    PT2: {
        female: number;
        male: number;
    };
    PT3: {
        female: number;
        male: number;
    };
};

export type LEAVEAPPLICATIONS = {
    approved: any;
    disapproved: any;
    appliedleaves: Array<{ type: LEAVETYPEKEYS }>
};

export const getTimeRemains = ({ from, to }: { from: Date; to?: Date }) => {
    let { days, hours, minutes, seconds, isToday } = getRemainingTime(from);
    let endDate = to ? getRemainingTime(to) : null;

    if (days > 0) {
        return `${days}d and ${hours}hr${hours > 1 && "s"} `;
    } else if (hours > 0) {
        return `${hours}hr${hours > 1 && "s"} and ${minutes}min`;
    } else if (minutes > 0) {
        return `${minutes} min `;
    } else if (seconds > 0) {
        return `a minute `;
    } else if(isToday) {
        return `active`;
    } else if(endDate) {
        if (endDate.seconds > 0 || endDate.isToday) return `active`;
    }
};

export function getRemainingTime(targetDate: Date): {
    days: number, hours: number, minutes: number, seconds: number, isToday: boolean
} {
    const now = new Date();
    const timeDifference = targetDate.getTime() - now.getTime();

    if (timeDifference <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isToday: new Date(now.getTime()).setHours(0,0,0,0) == new Date(targetDate.getTime()).setHours(0,0,0,0)
        }
    } else {
        return {
            days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
            isToday: new Date(now.getTime()).setHours(0,0,0,0) == new Date(targetDate.getTime()).setHours(0,0,0,0)
        }
    }
}
