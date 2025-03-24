import { format, isValid, parse } from "date-fns";

export const PersonnelPosition = [
    "Teacher I",
    "Teacher II",
    "Teacher III",
    "Teacher IV",
    "Master Teacher I",
    "Master Teacher II",
    "Master Teacher III",
    "ADAS I",
    "ADAS II",
    "ADAS III",
    "Principal I",
    "Principal II",
    "Principal III",
    "Principal IV",
    "Principal V",
    "HR",
    "N/A"
] as const;

export const Departments: Record<string, string> = {
    "junior": "Junior High School",
    "senior": "Senior High School",
    "accounting": "Accounting",
    "N/A": "N/A",
    "deped": "DepEd"
}

export const GradeLevels = ['7','8','9','10','11','12'];
export const CurriculumnHeads = GradeLevels;
export const AcademicHeads = ['junior','senior'];

export const requiredError = (field: string) => `The ${field} field is required.`;

export function getQueryParam(url: string | null, param: string): string | null {
    if (url)
        try {
            const urlObj = new URL(url);
            return urlObj.searchParams.get(param);
        } catch (error) {
            console.error("Invalid URL", error);
            return null;
        }
    else return null
}

export const getNestedError = (errors: any, path: string) => {
    return !!!path.split('.').reduce((obj, key) => obj?.[key], errors);
}

export type PERSONNELPOSITIONS = typeof PersonnelPosition[number];

export type ConditionalExclude<T, K extends keyof T, Condition extends boolean> = Condition extends true
    ? Omit<T, K>
    : T;

export function checkDateFormat(input: string, formatDate: string = 'P') {
    // Regex to match a full date (YYYY-MM-DD)
    const fullDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    const fullDateRegex2 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/;
    const fullDateRegex3 = /^\d{4}-\d{2}-\d{2}$/;

    // Regex to match a year (YYYY)
    const yearRegex = /^\d{4}$/;

    if (fullDateRegex.test(input) || fullDateRegex2.test(input) || fullDateRegex3.test(input)) {
        return format(input, formatDate);
    } else if (yearRegex.test(input)) {
        return input;
    } else {
        return input;
    }
}

export function isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
}

export const formatDateRange = (dateRange: {
    from: string;
    to: string;
}): string => {
    const { from, to } = dateRange;

    const fromFormatted = format(from, "MMM d, yyyy");

    if (!to) {
        // Single date
        return fromFormatted;
    } else if (format(from, "yyyy") === format(to, "yyyy")) {
        if (format(from, "MMM") === format(to, "MMM")) {
            // Same month and year
            return `${format(from, "MMM d")} - ${format(to, "d, yyyy")}`;
        } else {
            // Same year, different month
            return `${format(from, "MMM d")} - ${format(
                to,
                "MMM d, yyyy"
            )}`;
        }
    } else {
        // Different years
        return `${fromFormatted} - ${format(to, "MMMM d, yyyy")}`;
    }
};

export type PDSTABSTYPE = "C1" | "C2" | "C3" | "C4"

export function prependIfNotEmpty(variable: string | null | undefined, prefix: string): string {
    return variable && variable.trim() !== "" ? prefix + variable : variable || "";
}

export const getTimeFromNow = (date: string | number | Date): string => {
    // Convert the given date-time string to a Date object
    const givenDate = new Date(date);

    // Get the current date-time
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const timeDifferenceMs = currentDate.getTime() - givenDate.getTime();

    // Convert milliseconds to seconds
    const timeDifferenceSeconds = Math.floor(timeDifferenceMs / 1000);

    // Convert to other time units
    const secondsInYear = 365.25 * 24 * 3600; // Account for leap years
    const secondsInMonth = secondsInYear / 12; // Average month length
    const secondsInWeek = 7 * 24 * 3600;
    const secondsInDay = 24 * 3600;

    const years = Math.floor(timeDifferenceSeconds / secondsInYear);
    const months = Math.floor(timeDifferenceSeconds / secondsInMonth);
    const weeks = Math.floor((timeDifferenceSeconds % secondsInMonth) / secondsInWeek);
    const days = Math.floor((timeDifferenceSeconds % secondsInWeek) / secondsInDay);
    const hours = Math.floor((timeDifferenceSeconds % secondsInDay) / 3600);
    const minutes = Math.floor((timeDifferenceSeconds % 3600) / 60);
    const seconds = timeDifferenceSeconds % 60;

    // Change the condition checks to reflect the correct time difference
    if (years > 0) return years + 'y';
    else if (months > 0) return months + 'mo';
    else if (weeks > 0) return weeks + 'w';
    else if (days > 0) return days + 'd';
    else if (hours > 0) return hours + 'h';
    else if (minutes > 0) return minutes + 'm';
    else return 'Just now';
}

export function formatDateToCustomISO(date: Date) {
    const isoString = date.toISOString(); // Example: "2025-02-17T11:39:44.123Z"
    const microseconds = "000000"; // JS only provides milliseconds, so manually add microseconds
    return isoString.replace(/\.\d+Z$/, `.${microseconds}Z`);
}

export function extractDate(str: string): string | null {
    if(!str) return null
    // Regex to match:
    // - Numeric formats: YYYY-MM-DD, YYYY/MM/DD, MM/DD/YYYY, MM-DD-YYYY, MM-DD-YY, MM/DD/YY
    // - Textual formats: Feb. 23, 2025, February 23, 2025, Feb-23-25, etc.
    const datePattern = /(\d{4}[-\/]\d{2}[-\/]\d{2})|(\d{2}[-\/]\d{2}[-\/]\d{4})|(\d{2}[-\/]\d{2}[-\/]\d{2})|((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[.\- ]?\s?\d{1,2}[,.\- ]\s?\d{2,4})/i;

    const match = str.match(datePattern);

    if (match) {
        return match[0];
    }
    return null;
}

export function convertToAbbreviation(input: string) {
    const patterns = [
        { regex: /^Teacher (\w+)$/i, prefix: "T" },
        { regex: /^Master Teacher (\w+)$/i, prefix: "MT" },
        { regex: /^ADAS (\w+)$/i, prefix: "ADAS" },
        { regex: /^Principal (\w+)$/i, prefix: "P" }
    ];

    for (const { regex, prefix } of patterns) {
        const match = input.match(regex);
        if (match) {
            return `${prefix}-${match[1].toUpperCase()}`;
        }
    }

    return input; // Return the original input if no match is found
}
