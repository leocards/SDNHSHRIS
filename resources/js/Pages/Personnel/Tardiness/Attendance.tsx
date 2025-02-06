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

const ATTENDANCESCHEMA = z.object({
    attendances: z.array(
        z.object({
            user: z.object({
                id: z.number(),
                name: z.string().min(1, requiredError("personnel")),
            }),
            present: z
                .string()
                .min(1, requiredError("no. of days present"))
                .refine((value) => {
                    if (isNaN(parseInt(value))) return false;

                    return true;
                }, "Must be a number of days present."),
            absent: z
                .string()
                .min(1, requiredError("no. of days absent"))
                .refine((value) => {
                    if (isNaN(parseInt(value))) return false;

                    return true;
                }, "Must be a number of days absent."),
            timetardy: z
                .string()
                .min(1, requiredError("no. of time tardy"))
                .refine((value) => {
                    if (isNaN(parseInt(value))) return false;

                    return true;
                }, "Must be a number of time tardy."),
            undertime: z
                .string()
                .min(1, requiredError("no. of undertime"))
                .refine((value) => {
                    if (isNaN(parseInt(value))) return false;

                    return true;
                }, "Must be a number of undertime."),
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

const Attendance: React.FC<AttendanceProps> = ({
    show,
    onClose,
    schoolyears,
    attendance,
    onSuccess,
}) => {
    const { toast } = useToast();
    const { setLabel } = useProcessIndicator();

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
                    onSuccess()
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
        if(attendance) return null

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
        <Modal show={show} onClose={onClose} title="Attendance">
            <Button variant="ghost" size="icon" className="absolute top-3 right-3" onClick={() => onClose(false)}>
                <X />
            </Button>

            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="flex items-center justify-end gap-3">
                        <div className="w-36">
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
                                onValueChange={(value) => onChangeSYandMonth(value, sy.month)}
                            />
                        </div>
                        <div className="w-36">
                            <FormSelect
                                form={form}
                                name="month"
                                label="Month"
                                required={false}
                                disabled={!!attendance}
                                onValueChange={(value) => onChangeSYandMonth(watchSy, value)}
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

                    {
                        loading ? (
                            <div className="flex items-center justify-center py-10 gap-2">
                                <span className="loading loading-spinner loading-md"></span>
                                <span>Please wait...</span>
                            </div>
                        ) : (
                            <div className="my-4 space-y-4">
                                {fields.map((field, index) => (
                                    <AttendanceRow
                                        key={field.id}
                                        form={form}
                                        name={`attendances`}
                                        index={index}
                                    />
                                ))}
                            </div>
                        )
                    }

                    <div className="border-t border-border flex items-center pt-3 mt-5">
                        <Button
                            type="button"
                            variant={"ghost"}
                            className="mr-auto px-7"
                            onClick={() => onClose(false)}
                        >
                            Cancel
                        </Button>
                        <Button>Submit Attendance</Button>
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
    let count = index + 1;

    return (
        <Card>
            <CardContent className="p-3 relative">
                <div className="flex justify-between items-center">
                    <div className="text-sm font-semibold">
                        {count}.) {form.getValues(`${name}.${index}.user.name`)}
                    </div>
                </div>
                <div className="space-y-3 mt-3">
                    <div className="grid grid-cols-2 gap-3">
                        <FormInput
                            form={form}
                            name={`${name}.${index}.present`}
                            label="No. of days present"
                        />

                        <FormInput
                            form={form}
                            name={`${name}.${index}.absent`}
                            label="No. of days absent"
                        />

                        <FormInput
                            form={form}
                            name={`${name}.${index}.timetardy`}
                            label="No. of time tardy"
                        />

                        <FormInput
                            form={form}
                            name={`${name}.${index}.undertime`}
                            label="No. of undertime"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const AttendanceRowLoader = () => {
    function generateRandomWidths(count: number = 6): string[] {
        const minWidth = 40;
        const maxWidth = 75;

        const randomWidths = Array.from({ length: count }, () => {
            const randomWidth =
                Math.random() * (maxWidth - minWidth) + minWidth;
            return `${randomWidth.toFixed(2)}%`;
        });

        return randomWidths;
    }

    return generateRandomWidths().map((width, index) => (
        <div key={index} className="flex items-center w-full gap-3">
            <div>
                <Skeleton className="size-7 rounded-full" />
            </div>
            <div className="h-10 grow flex items-center justify-start">
                <Skeleton
                    className="h-3 rounded-full"
                    style={{ width: width }}
                />
            </div>
        </div>
    ));
};

export default Attendance;
