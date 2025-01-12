import { DayPicker } from "react-day-picker";
import { cn } from "@/Lib/utils";
import { buttonVariants } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Props = {
    date?: { from: Date; to?: Date };
};

const CalendarView: React.FC<Props> = ({ date }) => {
    const { from = new Date(), to } = date ?? {
        from: new Date(),
        to: undefined,
    };
    const [defaultDate, setDefaultDate] = useState<Date | undefined>(from);

    return (
        <DayPicker
            mode="range"
            selected={{ from, to }}
            month={defaultDate}
            onMonthChange={(month) => {
                let currentDate = new Date().getDate();

                month.setDate(currentDate);

                setDefaultDate(month);
            }}
            fixedWeeks
            showOutsideDays={true}
            className="p-3 pt-2"
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4 grow",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                caption_dropdowns: "flex justify-center gap-1",
                nav: "space-x-1 flex items-center ml-auto gap-2 pointer-events-none",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "size-7 bg-transparent p-0 opacity-80 hover:opacity-100 pointer-events-auto"
                ),
                vhidden: "vhidden hidden",
                nav_button_previous: "absolu te left-1",
                nav_button_next: "absolu te right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                    "text-muted-foreground rounded-md w-[calc(100%/7)] font-normal text-[0.8rem]",
                row: "flex w-full mt-0.5",
                cell: "w-[calc(100%/7)] text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 [&:has([aria-selected].day-outside)]:!opacity-50",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full grow p-0 font-normal aria-selected:opacity-100 hover:bg-accent pointer-events-none"
                ),
                day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today:
                    "bg-accent border border-primary/20 text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
            }}
            components={{
                Head: () => (
                    <tbody>
                        <tr className="flex py-1 grow w-full text-[13px] text-muted-foreground">
                            <td className="w-[calc(100%/7)] text-center">
                                {" "}
                                Sun{" "}
                            </td>
                            <td className="w-[calc(100%/7)] text-center">
                                {" "}
                                Mon{" "}
                            </td>
                            <td className="w-[calc(100%/7)] text-center">
                                {" "}
                                Tue{" "}
                            </td>
                            <td className="w-[calc(100%/7)] text-center">
                                {" "}
                                Wed{" "}
                            </td>
                            <td className="w-[calc(100%/7)] text-center">
                                {" "}
                                Thu{" "}
                            </td>
                            <td className="w-[calc(100%/7)] text-center">
                                {" "}
                                Fri{" "}
                            </td>
                            <td className="w-[calc(100%/7)] text-center">
                                {" "}
                                Sat{" "}
                            </td>
                        </tr>
                    </tbody>
                ),
                IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                IconRight: ({ ...props }) => (
                    <ChevronRight className="h-4 w-4" />
                ),
            }}
        />
    );
};

export default CalendarView;
