import FilePondUploader from "@/Components/FilePondUploader";
import Modal, { ModalProps } from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormCalendar,
    FormControl,
    FormField,
    FormInput,
    FormItem,
    FormLabel,
    FormMessage,
    FormRadioGroup,
    FormRadioItem,
} from "@/Components/ui/form";
import { useToast } from "@/Hooks/use-toast";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { requiredError } from "@/Types/types";
import { eachDayOfInterval, format, isBefore, isEqual, isToday } from "date-fns";
import React, { useEffect, useMemo } from "react";
import { z } from "zod";
import { allowedMimeTypes } from "../ServiceRecord/NewCOC";
import TypographySmall from "@/Components/Typography";
import { cn } from "@/Lib/utils";
import { Input } from "@/Components/ui/input";
import { Check } from "lucide-react";

const LOCATORSLIPOBJECT = z
    .object({
        purposeoftravel: z
            .string()
            .min(1, requiredError("purpose of travel"))
            .default(""),
        destination: z.string().min(1, requiredError("destination")),
        type: z.enum(["business", "time"], {
            required_error: "This field is required",
            invalid_type_error: "This field is required",
        }),
        agenda: z.object({
            date: z.date({ required_error: requiredError("date of event/transaction/meeting") }),
            dateTo: z.date().optional().nullable().default(null),
            time: z.string().optional().default(""),
            inclusivedates: z.array(
                z.object({
                    date: z.date(),
                    checked: z.boolean(),
                })
            ).optional().default([]),
        }),
        memoid: z.number().optional().nullable().default(null),
    })
    .superRefine(({ memoid, type, agenda }, ctx) => {
        if (type === "business" && !memoid) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please upload a memo.",
                path: ["memoid"],
            });
        }

        if ((type === "time" && !agenda.time) && !agenda.dateTo) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                    "The time of event/transaction/meeting field is required.",
                path: ["agenda.time"],
            });
        }
    });

type IFormLocatorSlip = z.infer<typeof LOCATORSLIPOBJECT>;

type NewLocatorSlipProps = ModalProps & {};

const NewLocatorSlip: React.FC<NewLocatorSlipProps> = ({ show, onClose }) => {
    const { toast } = useToast();

    const form = useFormSubmit<IFormLocatorSlip>({
        route: route("locatorslip.store"),
        method: "post",
        schema: LOCATORSLIPOBJECT,
        defaultValues: {
            purposeoftravel: "",
            destination: "",
            type: undefined,
            agenda: { date: undefined, dateTo: null, time: "", inclusivedates: [] },
        },
        async: true,
        callback: {
            onSuccess: (page: any) => {
                toast({
                    status: page.props.flash.status,
                    title: page.props.flash.title,
                    description: page.props.flash.message,
                });

                if (page.props.flash.status === "success") onClose(false);
            },
            onError: (error: any) => {
                if ("0" in error) console.log("error", error[0]);
                else {
                    for (const key in error) {
                        form.setError(key as keyof IFormLocatorSlip, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
        },
    });

    const watchType = form.watch("type");
    const watchDateFrom = form.watch("agenda.date");
    const watchDateTo = form.watch("agenda.dateTo");
    const watchInclusivedates = form.watch("agenda.inclusivedates");

    const disableInclusiveDates = useMemo(() => {
        if(watchInclusivedates) {
            let dates = [...watchInclusivedates]
            let checkedDates = dates.filter((dates) => dates.checked);

            return checkedDates.length === 2
        }
    }, [watchInclusivedates])

    const handleFilepondLoad = (id: number): any => {
        form.setValue(`memoid`, id, {
            shouldDirty: true,
        });
    };

    const handleFilePondRemove = () => {
        form.setValue(`memoid`, null, { shouldDirty: true });
    };

    const onSelectDates = (dateFrom?: Date, dateTo?: Date) => {
        if (dateFrom && dateTo) {
            let dates = eachDayOfInterval({ start: dateFrom, end: dateTo });

            form.setValue(
                "agenda.inclusivedates",
                dates.map((date) => ({
                    date: date,
                    checked:
                        watchInclusivedates?.find((d) => isEqual(date, d.date))
                            ?.checked ?? true,
                }))
            );
            form.setValue("agenda.time", '');
        } else {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            let time = `${hours}:${minutes}`;

            form.setValue('agenda.inclusivedates', [])
            if(!dateFrom) {
                form.setValue('agenda.dateTo', null)
                form.setValue('agenda.date', now)
                form.setValue("agenda.time", time);
            }

            if(!dateTo) {
                form.setValue("agenda.time", time);
            }

        }
    };

    const onExcludeDate = (index: number, check: boolean) => {
        let inclusiveDate = form.getValues("agenda.inclusivedates");

        if (inclusiveDate) {
            // uncheck the date to exclude
            inclusiveDate[index].checked = !check;
            // get the checked dates of inclusive dates
            let checkedDates = inclusiveDate.filter((dates) => dates.checked);

            if (checkedDates.length > 1) {
                // get the last Date
                let lastCheckedDate = checkedDates[checkedDates.length - 1];
                // get the first Date
                let firstCheckedDate = checkedDates[0];
                // assign the first checked date as inclusive dates from
                form.setValue("agenda.date", firstCheckedDate.date);
                // assign the last checked date as inclusive dates to
                form.setValue("agenda.dateTo", lastCheckedDate.date);
            } else {
                form.setValue("agenda.dateTo", null);

                if (checkedDates.length === 1) {
                }
            }

            // update the inclusive dates
            form.setValue("agenda.inclusivedates", inclusiveDate);
        }
    };

    useEffect(() => {
        if (show) {
            form.reset();
        }
    }, [show]);

    useEffect(() => {
        if (watchType && watchType === "time") {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            let time = `${hours}:${minutes}`;
            form.setValue("agenda.date", new Date(), {
                shouldValidate: true
            });

            if(!watchDateTo)
                form.setValue("agenda.time", time);

            form.setValue("memoid", null);
        } else if (watchType && watchType === "business") {
            form.setValue("agenda.time", "");
        }
    }, [watchType]);

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Apply for Locator Slip"
            maxWidth="lg"
        >
            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-4">
                        <FormInput
                            form={form}
                            label="Purpose of travel"
                            name="purposeoftravel"
                        />

                        <FormInput
                            form={form}
                            label="Destination"
                            name="destination"
                        />

                        <FormRadioGroup
                            form={form}
                            label="Please Check"
                            name="type"
                        >
                            <FormRadioItem
                                value="business"
                                label="Official Business"
                            />
                            <FormRadioItem value="time" label="Official Time" />
                        </FormRadioGroup>

                        <div>
                            <TypographySmall
                                className={cn(
                                    "required",
                                    form.formState.errors?.agenda?.date &&
                                        "text-destructive"
                                )}
                            >
                                Date of Event/Transaction/Meeting
                            </TypographySmall>
                            <div
                                className={cn(
                                    "grid gap-4 [@media(min-width:556px)]:grid-cols-2"
                                )}
                            >
                                <FormCalendar
                                    form={form}
                                    label={"From"}
                                    name="agenda.date"
                                    disableDate={(date) => {
                                        return (
                                            !isBefore(new Date(), date) &&
                                            !isToday(date)
                                        );
                                    }}
                                    required={false}
                                    onSelect={(date) => onSelectDates(date, watchDateTo??undefined)}
                                    disabled={!watchType}
                                />
                                <FormCalendar
                                    form={form}
                                    label="To"
                                    name="agenda.dateTo"
                                    disableDate={(date) => {
                                        return !isBefore(watchDateFrom, date);
                                    }}
                                    required={false}
                                    onSelect={(date) => onSelectDates(watchDateFrom, date)}
                                    disabled={!watchDateFrom}
                                />
                            </div>

                            <div className="mt-4">
                                {(watchInclusivedates?.length || 0) > 0 && (
                                    <div className="border border-border rounded-md shadow-sm w-fit">
                                        <div className="text-sm font-medium pb-0 p-2 px-3">
                                            Dates Included
                                        </div>
                                        <div className="text-muted-foreground text-sm px-3">
                                            Select dates to exclude
                                        </div>
                                        <div className="p-2 px-3 flex flex-wrap gap-2">
                                            {watchInclusivedates?.map(
                                                (incDate, index) => (
                                                    <Button
                                                        key={index}
                                                        type="button"
                                                        variant={
                                                            incDate.checked
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        className="p-2 px-3 gap-2"
                                                        onClick={() =>
                                                            onExcludeDate(
                                                                index,
                                                                incDate.checked
                                                            )
                                                        }
                                                        disabled={
                                                            disableInclusiveDates &&
                                                            incDate.checked
                                                        }
                                                    >
                                                        <span>
                                                            {format(
                                                                incDate.date,
                                                                "MMM-d"
                                                            )}
                                                        </span>
                                                        {incDate.checked && (
                                                            <Check />
                                                        )}
                                                    </Button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {watchType === "time" &&
                            !form.watch("agenda.dateTo") && (
                                <FormField
                                    control={form.control}
                                    name="agenda.time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel children="Time of Event/Transaction/Meeting" />
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="time"
                                                    className="formInput"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                        {watchType === "business" && (
                            <div className="space-y-2">
                                <TypographySmall
                                    className={cn(
                                        "required",
                                        form.formState.errors.memoid &&
                                            "text-destructive"
                                    )}
                                >
                                    Memo
                                </TypographySmall>
                                <FilePondUploader
                                    route={route("sr.temporary")}
                                    mimetypes={allowedMimeTypes}
                                    handleLoad={handleFilepondLoad}
                                    handleRemove={handleFilePondRemove}
                                />
                                {form.formState.errors.memoid && (
                                    <TypographySmall
                                        className={cn(
                                            "text-[0.8rem] text-destructive"
                                        )}
                                    >
                                        {form.formState.errors.memoid.message}
                                    </TypographySmall>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center mt-10">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onClose(false)}
                        >
                            Cancel
                        </Button>
                        <Button className="ml-auto">Send Application</Button>
                    </div>
                </form>
            </Form>
        </Modal>
    );
};

export default NewLocatorSlip;
