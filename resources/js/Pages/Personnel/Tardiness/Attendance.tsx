import Modal, { ModalProps } from "@/Components/Modal";
import { TARDINESSTYPE } from "./Tardiness";
import { z } from "zod";
import { requiredError } from "@/Types/types";
import { SCHOOLYEAR, User } from "@/Types";
import { SelectItem } from "@/Components/ui/select";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { Form, FormInput, FormSelect } from "@/Components/ui/form";
import { useFieldArray, useWatch } from "react-hook-form";
import { format } from "date-fns";
import { Card, CardContent } from "@/Components/ui/card";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Add, Trash } from "iconsax-react";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { Skeleton } from "@/Components/ui/skeleton";
import { useToast } from "@/Hooks/use-toast";
import { X } from "lucide-react";
import { TableHeader, TableRow } from "@/Components/Header";
import { useSidebar } from "@/Components/ui/sidebar";
import useWindowSize from "@/Hooks/useWindowResize";

const ATTENDANCESCHEMA = z.object({
    attendances: z.array(
        z.object({
            user: z.object({
                id: z.number(),
                name: z.string().min(1, ""),
            }),
            present: z
                .string()
                .min(1, "")
                .refine((value) => {
                    if (isNaN(parseInt(value))) return false;

                    return true;
                }, ""),
            absent: z
                .string()
                .min(1, "")
                .refine((value) => {
                    if (isNaN(parseInt(value))) return false;

                    return true;
                }, ""),
            timetardy: z
                .string()
                .min(1, "")
                .refine((value) => {
                    if (isNaN(parseInt(value))) return false;

                    return true;
                }, ""),
            undertime: z
                .string()
                .min(1, "")
                .refine((value) => {
                    if (isNaN(parseInt(value))) return false;

                    return true;
                }, ""),
        })
    ),
    sy: z.string(),
    month: z.string().min(1, requiredError("month")),
});

type IFormAttendance = z.infer<typeof ATTENDANCESCHEMA>;

type AttendanceProps = ModalProps & {
    attendance: TARDINESSTYPE | null;
    schoolyears: Array<SCHOOLYEAR>;
    onSuccess: CallableFunction;
};

const Columns = ["1fr", ...Array(4).fill("minmax(5rem,1fr)")].join(" ");
const ColumnsMobile = [...Array(4).fill("minmax(5rem,1fr)")].join(" ");

const Attendance: React.FC<AttendanceProps> = ({
    show,
    onClose,
    schoolyears,
    attendance,
    onSuccess,
}) => {
    const { toast } = useToast();
    const { setLabel } = useProcessIndicator();
    const { isMobile } = useSidebar();

    const [sy, setSy] = useState({
        sy: attendance ? attendance.id : schoolyears[0].id,
        month: attendance ? attendance.month : format(new Date(), "MMMM"),
    });

    const form = useFormSubmit<IFormAttendance>({
        route: attendance
            ? route("personnel.tardiness.update", [attendance.id])
            : route("personnel.tardiness.store", [sy.sy, sy.month]),
        method: "post",
        schema: ATTENDANCESCHEMA,
        defaultValues: {
            attendances: [],
            sy: attendance
                ? attendance.schoolyear.schoolyear
                : schoolyears.length > 0
                ? schoolyears[0].schoolyear
                : "",
            month: attendance ? attendance.month : format(new Date(), "MMMM"),
        },
        callback: {
            onBefore: () => attendance && setLabel("Updating..."),
            onSuccess: (page: any) => {
                toast({
                    title: page.props.flash.title,
                    description: page.props.flash.message,
                    status: page.props.flash.status,
                });

                if (page.props.flash.status === "success") {
                    onClose(false);
                    onSuccess();
                }
            },
            onError: (error: any) => {
                if ("0" in error)
                    toast({
                        title: "Something went wrong.",
                        description: error[0],
                        status: "error",
                    });
                else {
                    for (const key in error) {
                        form.setError(key as keyof IFormAttendance, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
        },
    });

    const { fields, replace } = useFieldArray({
        control: form.control,
        name: "attendances",
    });
    const [loading, setLoading] = useState(false);

    const watchSy = form.watch("sy");
    const watchMonth = form.watch("month");

    const onChangeSYandMonth = async (shoolYear: string, month: string) => {
        if (attendance) return null;

        setLoading(true);
        let syId = schoolyears.find((sy) => sy.schoolyear == shoolYear)!;

        let request = await window.axios.get<IFormAttendance["attendances"]>(
            route("personnel.tardiness.without", [syId?.id, month])
        );

        let response = request.data;
        replace(response);
        setLoading(false);
    };

    useEffect(() => {
        if (attendance) {
            form.setValue("attendances", [
                {
                    user: {
                        id: attendance.user.id!,
                        name: attendance.user.name!,
                    },
                    present: attendance.present.toString()!,
                    absent: attendance.absent.toString()!,
                    timetardy: attendance.timetardy.toString()!,
                    undertime: attendance.undertime.toString()!,
                },
            ]);
        }
    }, [attendance]);

    useEffect(() => {
        let syId = schoolyears.find((sy) => sy.schoolyear === watchSy)!;

        if (syId.id != sy.sy) {
            setSy({ ...sy, sy: syId.id });
        }

        if (watchMonth != sy.month) {
            setSy({ ...sy, month: watchMonth });
        }

        if (!show) {
            setTimeout(() => {
                form.reset();
            }, 500);
        }
    }, [watchSy, watchMonth, show, schoolyears]);

    return (
        <Modal show={show} onClose={onClose} title="Attendance" maxWidth="4xl">
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3"
                onClick={() => onClose(false)}
            >
                <X />
            </Button>

            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="flex items-center justify-end [@media(max-width:410px)]:flex-col gap-3">
                        <div className="[@media(min-width:410px)]:w-36 w-full">
                            <FormSelect
                                form={form}
                                name="sy"
                                label="School Year"
                                required={false}
                                disabled={!!attendance}
                                items={
                                    <>
                                        {schoolyears?.map(
                                            ({ schoolyear }, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={schoolyear}
                                                    children={schoolyear}
                                                />
                                            )
                                        )}
                                    </>
                                }
                                onValueChange={(value) =>
                                    onChangeSYandMonth(value, sy.month)
                                }
                            />
                        </div>
                        <div className="[@media(min-width:410px)]:w-36 w-full">
                            <FormSelect
                                form={form}
                                name="month"
                                label="Month"
                                required={false}
                                disabled={!!attendance}
                                onValueChange={(value) =>
                                    onChangeSYandMonth(watchSy, value)
                                }
                                items={
                                    <>
                                        {Array.from({ length: 12 }).map(
                                            (_, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={format(
                                                        new Date(
                                                            2024,
                                                            index,
                                                            1
                                                        ),
                                                        "MMMM"
                                                    )}
                                                    children={format(
                                                        new Date(
                                                            2024,
                                                            index,
                                                            1
                                                        ),
                                                        "MMMM"
                                                    )}
                                                />
                                            )
                                        )}
                                    </>
                                }
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-10 gap-2">
                            <span className="loading loading-spinner loading-md"></span>
                            <span>Please wait...</span>
                        </div>
                    ) : (
                        <div className="[@media(min-width:410px)]:divide-y border-border [@media(max-width:410px)]:mt-5 [@media(max-width:410px)]:space-y-4">
                            <TableHeader
                                style={{
                                    gridTemplateColumns: isMobile
                                        ? ColumnsMobile
                                        : Columns,
                                }}
                                className="text-sm border-b-0 [&>div]:brea [@media(max-width:410px)]:hidden"
                            >
                                <div className="max-md:!hidden">Personnel</div>
                                <div>No. of days present</div>
                                <div>No. of days absent</div>
                                <div>No. of time tardy</div>
                                <div>No. of undertime</div>
                            </TableHeader>
                            {fields.map((field, index) => (
                                <AttendanceRow
                                    key={field.id}
                                    form={form}
                                    name={`attendances`}
                                    index={index}
                                />
                            ))}
                        </div>
                    )}

                    <div className="border-t border-border flex items-center [@media(max-width:410px)]:flex-col-reverse pt-3 mt-5 [@media(max-width:410px)]:gap-3">
                        <Button
                            type="button"
                            variant={"ghost"}
                            className="mr-auto px-7 [@media(max-width:410px)]:w-full"
                            onClick={() => onClose(false)}
                        >
                            Cancel
                        </Button>
                        <Button className="[@media(max-width:410px)]:w-full" disabled={fields.length === 0}>Submit Attendance</Button>
                    </div>
                </form>
            </Form>
        </Modal>
    );
};

type AttendanceRowProps = {
    form: any;
    name: string;
    index: number;
};

const AttendanceRow: React.FC<AttendanceRowProps> = ({ form, name, index }) => {
    const { isMobile } = useSidebar();
    const { width } = useWindowSize()

    return (
        <Card className="[@media(min-width:410px)]:rounded-none [@media(min-width:410px)]:border-0 shadow-none">
            <CardContent className="relative m-0 [@media(min-width:410px)]:p-0 [@media(max-width:410px)]:p-2">
                <div className="text-sm font-semibold md:!hidden pl-2 pt-1">
                    {form.getValues(`${name}.${index}.user.name`)}
                </div>
                <div className="space-y-3">
                    <TableRow
                        style={{
                            gridTemplateColumns: isMobile
                                ? width <= 410 ? ["1fr"].join(" ") : ColumnsMobile
                                : Columns,
                        }}
                        className="[@media(max-width:410px)]:hover:bg-transparent [@media(max-width:410px)]:[&>div:not(:last-child)]:!pb-0"
                    >
                        <div className="text-sm font-semibold max-md:!hidden">
                            {form.getValues(`${name}.${index}.user.name`)}
                        </div>
                        <div className="[@media(max-width:410px)]:flex [&_div]:w-full">
                            <FormInput
                                form={form}
                                name={`${name}.${index}.present`}
                                label={width <= 410 ? "No. of days present" : ""}
                                type="number"
                                maxLength={4}
                                isStrictNumber
                            />
                        </div>

                        <div className="[@media(max-width:410px)]:flex [&_div]:w-full">
                            <FormInput
                                form={form}
                                name={`${name}.${index}.absent`}
                                label={width <= 410 ? "No. of days absent" : ""}
                                type="number"
                                maxLength={4}
                                isStrictNumber
                            />
                        </div>

                        <div className="[@media(max-width:410px)]:flex [&_div]:w-full">
                            <FormInput
                                form={form}
                                name={`${name}.${index}.timetardy`}
                                label={width <= 410 ? "No. of time tardy" : ""}
                                type="number"
                                maxLength={4}
                                isStrictNumber
                            />
                        </div>

                        <div className="[@media(max-width:410px)]:flex [&_div]:w-full">
                            <FormInput
                                form={form}
                                name={`${name}.${index}.undertime`}
                                label={width <= 410 ? "No. of undertime" : ""}
                                type="number"
                                maxLength={4}
                                isStrictNumber
                            />
                        </div>
                    </TableRow>
                </div>
            </CardContent>
        </Card>
    );
};

export default Attendance;
