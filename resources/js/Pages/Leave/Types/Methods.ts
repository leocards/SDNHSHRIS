import { eachDayOfInterval, isWeekend } from "date-fns";

export function countWeekdaysInRange(startDate: Date, endDate: Date): {count: number, dates: Array<Date>} {
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    const weekdays = allDays.filter((day: Date) => !isWeekend(day));
    return {
        count: weekdays.length,
        dates: weekdays
    };
}
