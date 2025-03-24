import { eachDayOfInterval, format, isWeekend } from "date-fns";

export function countWeekdaysInRange(startDate: Date, endDate: Date): {count: number, dates: Array<Date>} {
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    const weekdays = allDays.filter((day: Date) => !isWeekend(day));
    return {
        count: weekdays.length,
        dates: weekdays
    };
}

export interface InclusiveDateInterface {
    date: string;
    checked: boolean;
}

export function formatDateRanges(
    dates: InclusiveDateInterface[],
    useRanges: boolean = true
): string {
    if (!dates.length) return "";

    // Filter, convert to Date objects, and sort
    const sortedDates: Date[] = dates
        .filter(({ checked }) => checked)
        .map(({ date }) => new Date(date))
        .sort((a, b) => a.getTime() - b.getTime());

    // Group by year and month using reduce()
    const groupedByYear = sortedDates.reduce<
        Record<string, Record<string, Date[]>>
    >((acc, date) => {
        const year = format(date, "y");
        const month = format(date, "MMM");

        acc[year] = acc[year] || {};
        acc[year][month] = acc[year][month] || [];
        acc[year][month].push(date);

        return acc;
    }, {});

    // Format date ranges or individual dates
    const formatDates = (dates: Date[]): string => {
        if (!useRanges)
            return dates.map((date) => format(date, "d")).join(", ");

        let result: string[] = [];
        let rangeStart = dates[0],
            prevDate = dates[0];

        for (let i = 1; i <= dates.length; i++) {
            if (
                i === dates.length ||
                dates[i].getTime() - prevDate.getTime() > 86_400_000
            ) {
                // 1 day in ms
                result.push(
                    rangeStart === prevDate
                        ? format(rangeStart, "d")
                        : `${format(rangeStart, "d")} - ${format(
                              prevDate,
                              "d"
                          )}`
                );
                rangeStart = dates[i];
            }
            prevDate = dates[i];
        }

        return result.join(", ");
    };

    // Construct the final formatted string
    return Object.entries(groupedByYear)
        .map(
            ([year, months]) =>
                Object.entries(months)
                    .map(([month, dates]) => `${month} ${formatDates(dates)}`)
                    .join(" - ") + `, ${year}`
        )
        .join("\n");
}
