import Header from "@/Components/Header";
import TypographySmall, { TypographyLarge } from "@/Components/Typography";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { DepartmentsType } from "@/Types";
import { convertToAbbreviation, Departments } from "@/Types/types";
import { usePage } from "@inertiajs/react";
import { ArrowRight2 } from "iconsax-react";
import { Fragment, PropsWithChildren, useEffect, useRef } from "react";
import { defaultLeave, IFormLeave, LEAVESCHEMA } from "./Types/LeaveFormSchema";
import { useToast } from "@/Hooks/use-toast";
import {
    Form,
    FormCalendar,
    FormInput,
    FormRadioGroup,
    FormRadioItem,
    FormSelect,
} from "@/Components/ui/form";
import { SelectItem } from "@/Components/ui/select";
import { LEAVETYPEKEYSARRAY, LEAVETYPESOBJ } from "./Types/leavetypes";
import { Button } from "@/Components/ui/button";
import {
    eachDayOfInterval,
    isBefore,
    isToday,
    isTomorrow,
    isWeekend,
    isYesterday,
} from "date-fns";
import { countWeekdaysInRange } from "./Types/Methods";
import FilePondUploader from "@/Components/FilePondUploader";
import { cn } from "@/Lib/utils";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import { FilePond, registerPlugin } from "react-filepond";

const ApplyLeave = () => {
    const { toast } = useToast();
    const user = usePage().props.auth.user;
    const form = useFormSubmit<IFormLeave>({
        route: route("leave.apply.store"),
        method: "post",
        schema: LEAVESCHEMA,
        defaultValues: defaultLeave,
        async: true,
        callback: {
            onSuccess: (page: any) => {
                toast({
                    status: page.props.flash.status,
                    title: page.props.flash.title,
                    description: page.props.flash.message,
                });
            },
            onError: (error: any) => {
                if ("0" in error) console.log("error", error[0]);
                else {
                    for (const key in error) {
                        form.setError(key as keyof IFormLeave, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
        },
    });

    const watchLeaveType = form.watch("type");
    const watchDetails = form.watch("details");
    const watchDatesFrom = form.watch("from");
    const watchDatesTo = form.watch("to");

    registerPlugin(
        FilePondPluginFileValidateType,
        FilePondPluginFileValidateSize
    );

    const handleFilepondLoad = (id: number): any => {
        form.setValue(`medical`, id, { shouldDirty: true });
    };

    const handleFilePondRemove = () => {
        form.setValue(`medical`, null, { shouldDirty: true });
    };

    useEffect(() => {
        form.setValue("details", null);
        form.setValue("detailsinput", "");
        if(!['vacation', 'sick', 'spl', 'study'].includes(watchLeaveType??''))
            form.clearErrors("details")
    }, [watchLeaveType]);

    useEffect(() => {
        if (watchDatesFrom && !watchDatesTo && watchLeaveType === "maternity") {
            // set 105 days on maternity
            const dateTo = new Date(watchDatesFrom).setDate(
                new Date(watchDatesFrom).getDate() + 104
            );
            const days = eachDayOfInterval({
                start: watchDatesFrom,
                end: dateTo,
            });

            form.setValue("daysapplied", days.length.toString(), {
                shouldValidate: true,
            });
            form.setValue("to", new Date(dateTo));
        } else if (
            watchDatesFrom &&
            !watchDatesTo &&
            watchLeaveType !== "maternity"
        ) {
            form.setValue("daysapplied", "1", {
                shouldValidate: true,
            });
        } else if (
            watchDatesFrom &&
            watchDatesTo &&
            watchLeaveType !== "maternity"
        ) {
            const weeks = countWeekdaysInRange(
                new Date(watchDatesFrom),
                new Date(watchDatesTo)
            );
            form.setValue("daysapplied", weeks.count.toString(), {
                shouldValidate: true,
            });
        }
    }, [watchDatesFrom, watchDatesTo]);

    useEffect(() => {
        if(watchDetails) {
            if (
                !["shospital", "spatient", "vabroad"].includes(watchDetails)
            ) {
                form.setValue("detailsinput", "");
            }

            if(watchDetails === "monitization" || watchDetails === "terminal") {
                form.setValue("from", null)
                form.setValue("daysapplied", "")
            }
        }
    }, [watchDetails]);

    return (
        <div>
            <Header title="Apply Leave">
                <div className="flex items-center gap-1">
                    {user.role == "principal" && "My"} Leave{" "}
                    <ArrowRight2 className="size-4 [&>path]:stroke-[3]" />{" "}
                    Application for Leave
                </div>
            </Header>

            <div className="py-5 mt-5 text-center border-t border-border">
                <TypographyLarge className="uppercase">
                    Application for Leave
                </TypographyLarge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-4 pt-5 mb-4">
                {[
                    user.lastname,
                    user.firstname,
                    user.middlename ?? "N/A",
                    (user.role === "principal" ? 'SOUTHERN DAVAO NHS' : 'SOUTHERN DAVAO NHS'),
                ].map((name, index) => (
                    <div key={index} className="space-y-1.5">
                        <TypographySmall>
                            {index === 0
                                ? "Last Name"
                                : index === 1
                                ? "First Name"
                                : index === 2
                                ? "Middle Name"
                                : "Office/Department"}
                        </TypographySmall>
                        <div className="rounded-md border border-border shadow-sm h-10 px-3 text-sm flex items-center text-muted-foreground dark:bg-white/5 overflow-hidden">
                            <div className="line-clamp-1 h-fit text-nowrap whitespace-nowrap">{name}</div>
                        </div>
                    </div>
                ))}
            </div>

            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-1.5 sm:gap-4">
                            <FormCalendar
                                form={form}
                                name="filingfrom"
                                label="Date of filing"
                            />
                            {/* <FormCalendar
                                form={form}
                                name="filingto"
                                label="Date of filing to"
                                required={false}
                                disabled={!watchDateFiledFrom}
                                triggerClass="disabled:!opacity-100 disabled:text-foreground/40"
                            /> */}
                            <div className="space-y-1.5">
                                <TypographySmall>Position</TypographySmall>
                                <div className="rounded-md border border-border shadow-sm h-10 px-3 text-sm flex items-center text-muted-foreground dark:bg-white/5">
                                    {convertToAbbreviation(user.position)}
                                </div>
                            </div>
                            <FormInput
                                form={form}
                                name="salary"
                                label="Salary"
                                type="currency"
                            />
                        </div>

                        <div className="!mt-7">
                            <TypographySmall
                                children="Types of leave to be availed"
                                className="uppercase"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2  gap-1.5 sm:gap-4 mt-2">
                                <FormSelect
                                    form={form}
                                    name="type"
                                    label="Type of Leave"
                                    displayValue={
                                        watchLeaveType
                                            ? LEAVETYPESOBJ[
                                                  watchLeaveType ?? "others"
                                              ]
                                            : ""
                                    }
                                    onValueChange={() => {
                                        form.setValue("from", null);
                                        form.setValue("to", null);
                                        form.setValue("daysapplied", "");
                                    }}
                                    items={
                                        <Fragment>
                                            {LEAVETYPEKEYSARRAY.map(
                                                (type, index) => (
                                                    <SelectItem
                                                        key={index}
                                                        value={type}
                                                        children={
                                                            LEAVETYPESOBJ[type]
                                                        }
                                                        disabled={
                                                            (type ===
                                                                "paternity" && user.gender ===
                                                                "female") ||
                                                            (user.gender ===
                                                                "male" &&
                                                                (type ===
                                                                    "slbw" || type ===
                                                                    "maternity")) ||
                                                            ((type ===
                                                                "vacation" || type === "spl") &&
                                                                user.role ===
                                                                    "teaching")
                                                        }
                                                    />
                                                )
                                            )}
                                        </Fragment>
                                    }
                                />

                                <FormInput
                                    form={form}
                                    name="others"
                                    label={
                                        <span>
                                            Others:{" "}
                                            <span className="text-xs">
                                                (if type of leave is others)
                                            </span>
                                        </span>
                                    }
                                    disabled={watchLeaveType !== "others"}
                                />
                            </div>
                        </div>

                        {watchLeaveType && (
                            <Fragment>
                                <div className="!mt-7">
                                    <TypographySmall
                                        children="Details of leave"
                                        className="uppercase"
                                    />

                                    <div className="mt-2 space-y-4">
                                        {watchLeaveType !== "slbw" && (
                                            <FormRadioGroup
                                                form={form}
                                                name="details"
                                                label={""}
                                                required={false}
                                                labelClass="italic"
                                                position="vertical"
                                            >
                                                {/* Vacation Leave */}
                                                {(watchLeaveType == "vacation" || watchLeaveType == "spl") && (
                                                    <DetailsOFLeaveItems
                                                        label="In case of Vacation/Special Privilege Leave:"
                                                    >
                                                        <div className="flex gap-10">
                                                            <FormRadioItem
                                                                value="vphilippines"
                                                                label="Whithin the Philippines"
                                                            />
                                                            <FormRadioItem
                                                                value="vabroad"
                                                                label="Abroad (specify)"
                                                            />
                                                        </div>
                                                    </DetailsOFLeaveItems>
                                                )}

                                                {/* Sick Leave */}
                                                {watchLeaveType == "sick" && (
                                                    <DetailsOFLeaveItems label="In case of Sick Leave:">
                                                        <div className="flex gap-10">
                                                            <FormRadioItem
                                                                value="shospital"
                                                                label="In Hospital (Specify Illness)"
                                                            />
                                                            <FormRadioItem
                                                                value="spatient"
                                                                label="Out Patient (Specify Illness)"
                                                            />
                                                        </div>
                                                    </DetailsOFLeaveItems>
                                                )}

                                                {/* Study Leave */}
                                                {(watchLeaveType == "study" || (watchLeaveType == "others" && user.role != "teaching")) && (
                                                    <DetailsOFLeaveItems label="In case of Study Leave:" required={watchLeaveType != "others"}>
                                                        <div className="flex gap-10">
                                                            <FormRadioItem
                                                                value="degree"
                                                                label="Completion of Master's Degree"
                                                            />
                                                            <FormRadioItem
                                                                value="examreview"
                                                                label="BAR/Board Examination Review"
                                                            />
                                                        </div>
                                                    </DetailsOFLeaveItems>
                                                )}

                                                {/* Other Purposes */}
                                                {!["vacation", "sick", "study", "spl"].includes(watchLeaveType ?? "") && (
                                                    <DetailsOFLeaveItems label="Other purpose:" required={false}>
                                                        <div className="flex gap-10">
                                                            <FormRadioItem
                                                                value="monitization"
                                                                label="Monetization of Leave Credits"
                                                            />
                                                            <FormRadioItem
                                                                value="terminal"
                                                                label="Terminal Leave"
                                                            />
                                                        </div>
                                                    </DetailsOFLeaveItems>
                                                )}
                                            </FormRadioGroup>
                                        )}

                                        {[
                                            "slbw",
                                            "vacation",
                                            "sick",
                                            "spl"
                                        ].includes(watchLeaveType ?? "") && (
                                            <FormInput
                                                form={form}
                                                name="detailsinput"
                                                label={
                                                    watchLeaveType === "slbw" &&
                                                    "In case of Special Leave Benefits for Women:"
                                                }
                                                labelClass="italic"
                                                itemClass="max-w-96"
                                                disabled={
                                                    (!["vabroad", "shospital", "spatient"].includes( watchDetails ?? "" ) &&
                                                    watchLeaveType !== "slbw")
                                                }
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="!mt-7">
                                    <TypographySmall
                                        children="Inclusive Dates"
                                        className="uppercase"
                                    />

                                    <div className="mt-3 grid sm:grid-cols-2 [@media(min-width:870px)]:grid-cols-3 gap-4">
                                        {!['monitization', 'terminal'].includes(watchDetails??'') && <>
                                            <FormCalendar
                                                form={form}
                                                name="from"
                                                label="From"
                                                disableDate={(date) => {
                                                    let toDay = date;
                                                    let now = new Date();
                                                    toDay.setHours(0, 0, 0, 0);
                                                    now.setHours(0, 0, 0, 0);
                                                    if (
                                                        watchLeaveType !==
                                                            "maternity" &&
                                                        watchLeaveType != "sick"
                                                    ) {
                                                        return (
                                                            isWeekend(date) ||
                                                            toDay.getTime() <
                                                                now.getTime()
                                                        );
                                                    } else if (
                                                        watchLeaveType == "sick"
                                                    )
                                                        return (
                                                            isWeekend(date) ||
                                                            !(
                                                                // isYesterday(date) ||
                                                                (
                                                                    isToday(date) ||
                                                                    toDay.getTime() <
                                                                        now.getTime()
                                                                )
                                                            )
                                                        );
                                                    else return false;
                                                }}
                                            />
                                            <FormCalendar
                                                form={form}
                                                name="to"
                                                label="To"
                                                required={false}
                                                triggerClass="disabled:!opacity-100 disabled:text-muted-foreground"
                                                disabled={!watchDatesFrom}
                                                disableDate={(date) => {
                                                    let toDay = date;
                                                    let from = watchDatesFrom!;
                                                    let now = new Date();
                                                    toDay.setHours(0, 0, 0, 0);
                                                    now.setHours(0, 0, 0, 0);
                                                    from.setHours(0, 0, 0, 0);

                                                    if (
                                                        watchLeaveType !==
                                                        "maternity"
                                                    ) {
                                                        return (
                                                            isWeekend(date) ||
                                                            toDay.getTime() <=
                                                                from.getTime()
                                                        );
                                                    } else return false;
                                                }}
                                            />
                                        </>}
                                        <FormInput
                                            form={form}
                                            name="daysapplied"
                                            label="Number of days applied"
                                            disabled={!['monitization', 'terminal'].includes(watchDetails??'')}
                                            type="number"
                                            maxLength={5}
                                            isStrictNumber
                                        />
                                    </div>
                                </div>

                                <div className="!mt-7">
                                    <FormRadioGroup
                                        form={form}
                                        name="commutation"
                                        label={"Commutation"}
                                        labelClass="uppercase"
                                    >
                                        <FormRadioItem
                                            value="not"
                                            label="Not Requested"
                                        />
                                        <FormRadioItem
                                            value="requested"
                                            label="Requested"
                                        />
                                    </FormRadioGroup>
                                </div>
                            </Fragment>
                        )}
                    </div>

                    {watchLeaveType == "maternity" && (
                        <div className="mt-5 space-y-1.5">
                            <TypographySmall
                                className={cn(
                                    "required",
                                    form.formState?.errors?.medical &&
                                        "text-destructive"
                                )}
                            >
                                Medical
                            </TypographySmall>
                            <FilePondUploader
                                route={route("sr.temporary")}
                                handleLoad={handleFilepondLoad}
                                handleRemove={handleFilePondRemove}
                                mimetypes={[
                                    "image/jpeg",
                                    "image/jpg",
                                    "image/png",
                                ]}
                            />
                            <TypographySmall className="text-[0.8rem] text-destructive">
                                {form.formState?.errors?.medical?.message}
                            </TypographySmall>
                        </div>
                    )}

                    <div className="flex items-center mt-8 pt-4 border-t border-border">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                        <Button className="ml-auto">Send Application</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

const DetailsOFLeaveItems = ({
    label,
    children,
    required = true,
}: PropsWithChildren & { label: string; required?: boolean }) => {
    return (
        <div className={cn("space-y-2")}>
            <TypographySmall className={cn(required && "required")}>{label}</TypographySmall>
            {children}
        </div>
    );
};

export default ApplyLeave;
