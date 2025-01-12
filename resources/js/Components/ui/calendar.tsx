import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DropdownProps } from "react-day-picker";

import { cn } from "@/Lib/utils";
import { buttonVariants } from "@/Components/ui/button";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "./menubar";
import { ScrollArea } from "./scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    fromYear = 1960,
    toYear = new Date().getFullYear() + 2,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            fromYear={fromYear}
            toYear={toYear}
            captionLayout="dropdown-buttons"
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center gap-",
                caption_label: "text-sm font-medium",
                caption_dropdowns: "flex justify-center gap-0.5",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "size-7 p-0 opacity-50 hover:opacity-100"
                ),
                vhidden: "vhidden hidden",
                nav_button_previous: "absolute left-0",
                nav_button_next: "absolute right-0",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-0.5",
                cell: cn(
                    "h-8 w-9 relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
                    props.mode === "range"
                        ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                        : "[&:has([aria-selected])]:rounded-md"
                ),
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "size-8 w-9 p-0 font-normal aria-selected:opacity-100"
                ),
                day_range_start: "day-range-start",
                day_range_end: "day-range-end",
                day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside:
                    "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                Dropdown: ({
                    value,
                    onChange,
                    children,
                    ...props
                }: DropdownProps) => {
                    const options = React.Children.toArray(
                        children
                    ) as React.ReactElement<
                        React.HTMLProps<HTMLOptionElement>
                    >[];
                    const selected = options.find(
                        (child) => child.props.value === value
                    );
                    const handleChange = (value: string) => {
                        const changeEvent = {
                            target: { value },
                        } as React.ChangeEvent<HTMLSelectElement>;
                        onChange?.(changeEvent);
                    };

                    if (options.length != 12) {
                        options.sort(
                            (a: any, b: any) => b.props.value - a.props.value
                        );
                    }

                    return (
                        <Select
                            onValueChange={handleChange}
                            defaultValue={selected?.props.value?.toString()}
                            watchDefault={!!!selected?.props.value?.toString()}

                        >
                            <SelectTrigger className="text-sm px-1.5 py-1 min-w-16 !h-fit gap-1 shadow-none" value={selected?.props?.children} />
                            <SelectContent className="pr-0">
                                <div className="space-y-[2px]">
                                    {options.map((option, id: number) => (
                                        <SelectItem
                                            value={
                                                option.props.value?.toString()!
                                            }
                                            key={`${option.props.value}-${id}`}
                                        >
                                            {option.props.children}
                                        </SelectItem>
                                    ))}
                                </div>
                            </SelectContent>
                        </Select>
                    );
                },
                IconLeft: ({ className, ...props }) => (
                    <ChevronLeft
                        className={cn("h-4 w-4", className)}
                        {...props}
                    />
                ),
                IconRight: ({ className, ...props }) => (
                    <ChevronRight
                        className={cn("h-4 w-4", className)}
                        {...props}
                    />
                ),
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
