import Modal, { ModalProps } from "@/Components/Modal";
import { TARDINESSTYPE } from "./Tardiness";
import { z } from "zod";
import { requiredError } from "@/Types/types";
import { SCHOOLYEAR, User } from "@/Types";
import { Select, SelectItem, SelectTrigger } from "@/Components/ui/select";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import {
    Form,
    FormControl,
    FormField,
    FormInput,
    FormItem,
    FormLabel,
    FormMessage,
    FormSelect,
} from "@/Components/ui/form";
import { useFieldArray, useWatch } from "react-hook-form";
import { format } from "date-fns";
import {
    Combobox,
    ComboboxContent,
    ComboboxItem,
    ComboboxTrigger,
} from "@/Components/ui/combobox";
import { Card, CardContent } from "@/Components/ui/card";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Add, Trash } from "iconsax-react";
import { X } from "lucide-react";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { Skeleton } from "@/Components/ui/skeleton";
import { ProfilePhoto } from "@/Components/ui/avatar";
import { useToast } from "@/Hooks/use-toast";

const ATTENDANCESCHEMA = z.object({
    attendances: z.array(
        z.object({
            user: z.object({
                id: z.number(),
                name: z.string().min(1, requiredError("personnel")),
            }),
            present: z
                .string()
                .min(1, requiredError("days present"))
                .refine((value) => {
                    if (isNaN(parseInt(value))) return false;

                    return true;
                }, "Must be a number of days present."),
            absent: z
                .string()
                .min(1, requiredError("days absent"))
                .refine((value) => {
                    if (isNaN(parseInt(value))) return false;

                    return true;
                }, "Must be a number of days absent."),
        })
    ),
    sy: z.string(),
    month: z.string().min(1, requiredError("month")),
});

type IFormAttendance = z.infer<typeof ATTENDANCESCHEMA>;

type AttendanceProps = ModalProps & {
    attendance: TARDINESSTYPE | null;
    schoolyears: Array<SCHOOLYEAR>;
};

const defaultValue = {
    user: {
        id: 0,
        name: "",
    },
    present: "",
    absent: "",
};

const Attendance: React.FC<AttendanceProps> = ({
    show,
    onClose,
    schoolyears,
    attendance,
}) => {
    const { toast } = useToast();
    const { setLabel } = useProcessIndicator();

    const [sy, setSy] = useState({
        sy: attendance ? attendance.id : schoolyears[0].id,
        month: attendance ? attendance.month : format(new Date(), "MMMM")
    })

    const form = useFormSubmit<IFormAttendance>({
        route: attendance ? route('personnel.tardiness.update', [attendance.id]) : route("personnel.tardiness.store", [sy.sy, sy.month]),
        method: "post",
        schema: ATTENDANCESCHEMA,
        defaultValues: {
            attendances: attendance
                ? [] : [defaultValue],
            sy: attendance ? attendance.schoolyear.schoolyear : (schoolyears.length > 0 ? schoolyears[0].schoolyear : ""),
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
                        form.setError(
                            key as keyof IFormAttendance,
                            {
                                type: "manual",
                                message: error[key],
                            }
                        );
                    }
                }
            },
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "attendances",
    });

    const [personnels, setPersonnels] = useState<
        Array<Pick<User, "id" | "name" | "avatar">>
    >([]);
    const [loading, setLoading] = useState(false);

    const watchSy = form.watch("sy");
    const watchMonth = form.watch("month");

    useEffect(() => {
        if(attendance) {
            form.setValue('attendances', [{
                user: {
                    id: attendance.user.id!,
                    name: attendance.user.name!,
                },
                present: attendance.present.toString()!,
                absent: attendance.absent.toString()!,
            }])
        }
    }, [attendance]);

    useEffect(() => {
        let syId = schoolyears.find((sy) => sy.schoolyear === watchSy)!;

        if(syId.id != sy.sy) {
            setSy({ ...sy, sy: syId.id })
        }

        if(watchMonth != sy.month) {
            setSy({ ...sy, month: watchMonth })
        }

        if (show && syId) {
            setLoading(true);

            (async () => {
                let request = await window.axios.get<
                    Array<Pick<User, "id" | "name" | "avatar">>
                >(route("personnel.tardiness.without", [syId.id, watchMonth]));

                let response = request.data;
                setPersonnels(response);
                setLoading(false);
            })();
        }

        if (!show) {
            setTimeout(() => {
                form.reset();
            }, 500);
        }
    }, [watchSy, watchMonth, show, schoolyears]);

    return (
        <Modal show={show} onClose={onClose} title="Attendance">
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
                            />
                        </div>
                        <div className="w-36">
                            <FormSelect
                                form={form}
                                name="month"
                                label="Month"
                                required={false}
                                disabled={!!attendance}
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

                    <div className="my-4 space-y-4">
                        {fields.map((field, index) => (
                            <AttendanceRow
                                key={field.id}
                                form={form}
                                name={`attendances`}
                                index={index}
                                disabled={fields.length === 1}
                                isEdit={!!attendance}
                                removeRow={() => remove(index)}
                                personnelList={personnels}
                                loading={loading}
                            />
                        ))}
                    </div>

                    {!attendance && <div>
                        <Button
                            type="button"
                            variant={"outline"}
                            className="border-dashed w-full"
                            onClick={() => append(defaultValue)}
                        >
                            <Add className="" />
                            <span>New row</span>
                        </Button>
                    </div>}

                    <div className="border-t border-border flex items-center pt-3 mt-5">
                        {!!!attendance && <Button
                            type="button"
                            variant={"ghost"}
                            onClick={() => form.reset()}
                        >
                            Clear form
                        </Button>}
                        <Button
                            type="button"
                            variant={"ghost"}
                            className="ml-auto mr-4 px-7"
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
    loading: boolean;
    disabled: boolean;
    isEdit: boolean;
    personnelList: Array<Pick<User, "id" | "name" | "avatar">>;
    removeRow: () => void;
};

const AttendanceRow: React.FC<AttendanceRowProps> = ({
    form,
    name,
    index,
    disabled,
    removeRow,
    loading,
    personnelList,
    isEdit,
}) => {
    let count = index + 1;

    const watchAttendances = useWatch({
        control: form.control,
        name: "attendances",
    });

    let list = useMemo<Array<Pick<User, "id" | "name" | "avatar">>>(() => {
        return personnelList.filter(
            ({ id }) =>
                !watchAttendances.some(
                    (att: any, indx: number) =>
                        id === att?.user.id && indx != index
                )
        );
    }, [personnelList, watchAttendances]);

    return (
        <Card>
            <CardContent className="p-3 relative">
                <div className="flex justify-between items-center">
                    <div className="text-sm">{count}.</div>
                    <Button
                        type="button"
                        disabled={disabled && isEdit}
                        variant="outline"
                        size="icon"
                        onClick={() => (!disabled || !isEdit) && removeRow()}
                        className="size-7 abs olute top-1 right-1"
                    >
                        <Trash className="text-destructive" />
                    </Button>
                </div>
                <div className="space-y-3">
                    <FormField
                        control={form.control}
                        name={`${name}.${index}.user.name`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required">
                                    Personnel
                                </FormLabel>
                                <Combobox<{ id: number; name: string }>
                                    onValueChange={(value) => {
                                        field.onChange(value?.name);
                                        form.setValue(
                                            `${name}.${index}.user.id`,
                                            value?.id
                                        );
                                    }}
                                >
                                    <FormControl>
                                        <div className="group">
                                            <ComboboxTrigger disabled={isEdit} className="focus:!bg-background hover:!bg-background hover:text-foreground data-[state=open]:text-primary group-aria-[invalid=true]:!text-foreground formSelect">
                                                {field.value
                                                    ? field.value
                                                    : "Select personnel"}
                                            </ComboboxTrigger>
                                        </div>
                                    </FormControl>
                                    <ComboboxContent loading={loading}>
                                        {loading ? (
                                            <AttendanceRowLoader />
                                        ) : (
                                            list.map((personnel) => (
                                                <ComboboxItem
                                                    key={personnel.name}
                                                    value={personnel.name}
                                                    stateValue={personnel}
                                                    isSelected={
                                                        field.value ==
                                                        personnel.name
                                                    }
                                                >
                                                    <ProfilePhoto className="size-7" src={personnel?.avatar} />
                                                    {personnel.name}
                                                </ComboboxItem>
                                            ))
                                        )}
                                    </ComboboxContent>
                                </Combobox>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name={`${name}.${index}.present`}
                            render={({ field }) => (
                                <FormItem className="grow">
                                    <FormLabel className="required">
                                        Days present
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="formInput"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`${name}.${index}.absent`}
                            render={({ field }) => (
                                <FormItem className="grow">
                                    <FormLabel className="required">
                                        Days absent
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="formInput"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
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
