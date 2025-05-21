import Modal, { ModalProps } from "@/Components/Modal";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { useEffect, useState } from "react";
import {
    ClassAssumptionDetails,
    ClassAssumptionDetailsList,
    CLASSASSUMPTIONSCHEMA,
    CLASSASSUMPTIONTYPE,
    IFormClassAssumption,
} from "./type";
import { useToast } from "@/Hooks/use-toast";
import {
    Form,
    FormCalendar,
    FormControl,
    FormField,
    FormInput,
    FormItem,
    FormLabel,
    FormMessage,
    FormSelect,
} from "@/Components/ui/form";
import { SelectItem } from "@/Components/ui/select";
import { User } from "@/Types";
import {
    Combobox,
    ComboboxContent,
    ComboboxItem,
    ComboboxTrigger,
} from "@/Components/ui/combobox";
import { ProfilePhoto } from "@/Components/ui/avatar";
import { X } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import { Add } from "iconsax-react";

type NewClassAssumptionProps = ModalProps & {
    type: "sick" | "business";
    ca?: CLASSASSUMPTIONTYPE | null;
};

const NewClassAssumption = ({
    ca,
    show,
    type,
    onClose,
}: NewClassAssumptionProps) => {
    const { toast } = useToast();

    const form = useFormSubmit<IFormClassAssumption>({
        schema: CLASSASSUMPTIONSCHEMA,
        method: "POST",
        route: ca
            ? route("classassumption.update", [ca])
            : route("classassumption.save"),
        defaultValues: {
            date: {
                from: undefined,
                to: null
            },
            details: {
                catype: undefined,
                type: undefined,
                others: "",
            },
            classloads: [
                {
                    time: "",
                    timeTo: "",
                    gradesection: "",
                    subject: "",
                    teacher: 0,
                },
            ],
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
                        form.setError(key as keyof IFormClassAssumption, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
        },
    });
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "classloads",
    });

    const watchDetails = form.watch("details.type");

    const [personnelList, setPersonnelList] = useState<PersonnelValue[]>([]);

    const onPersonnelSelect = (
        personnel?: PersonnelValue,
        previousPersonnel?: number
    ) => {
        let teacher = [...personnelList];
        let teacherIndex = teacher.findIndex((t) => t.id === personnel?.id);
        let previousTeacherIndex = teacher.findIndex(
            (t) => t.id === previousPersonnel
        );

        if (previousTeacherIndex >= 0) {
            teacher[previousTeacherIndex].checked = false;
        }

        teacher[teacherIndex].checked = true;

        setPersonnelList(teacher);
    };

    const onRemove = (index: number) => {
        let classLoads = form.getValues("classloads");

        let teacherId = classLoads[index].teacher;

        if (teacherId) {
            let teacherList = [...personnelList];

            let teacherListIndex = teacherList.findIndex(
                (t) => t.id === teacherId
            );

            teacherList[teacherListIndex].checked = false;

            setPersonnelList(teacherList);
        }

        remove(index);
    };

    useEffect(() => {
        window.axios
            .get(route("classassumption.getteachers"))
            .then((response) => {
                const data = response.data;

                setPersonnelList(data);
            });
    }, []);

    useEffect(() => {
        if(show) {
            form.reset()
            if(type) {
                form.setValue('details.catype', type)
            }

            if(ca) {
                form.setValue('date.from', new Date(ca.details.date.from))
                form.setValue('date.to', ca.details.date.to ? new Date(ca.details.date.to) : null)
                form.setValue('details.type', ca.details.details.type??'')
                form.setValue('details.others', ca.details.details.others??'')
                form.setValue('classloads', ca.details.classloads)
            }
        }
    }, [type, show])

    return (
        <Modal
            show={show}
            onClose={onClose}
            title={`Class Assumption for ${
                type === "sick" ? "Sick Leave" : "Official Business"
            }`}
            maxWidth="3xl"
        >
            <div>
                <Form {...form}>
                    <form onSubmit={form.onSubmit}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormCalendar
                                    form={form}
                                    label="Date out/absent From"
                                    name="date.from"
                                    // disableDate={(date) => {
                                    //     return (!isBefore(new Date(), date) && !isToday(date))
                                    // }}
                                />
                                <FormCalendar
                                    form={form}
                                    label="Date out/absent To"
                                    name="date.to"
                                    required={false}
                                    // disableDate={(date) => {
                                    //     return (!isBefore(new Date(), date) && !isToday(date))
                                    // }}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormSelect
                                    form={form}
                                    name="details.type"
                                    label="Select reason for out/absent"
                                    items={ClassAssumptionDetails[type].map(
                                        (data, index) => (
                                            <SelectItem
                                                key={index}
                                                value={data.type}
                                            >
                                                {data.label}
                                            </SelectItem>
                                        )
                                    )}
                                    displayValue={
                                        ClassAssumptionDetailsList[type][
                                            watchDetails as keyof (typeof ClassAssumptionDetailsList)[typeof type]
                                        ]
                                    }
                                />
                                <FormInput
                                    form={form}
                                    label="Others, please specify"
                                    name="details.others"
                                    disabled={
                                        !["slothers", "obothers"].includes(
                                            form.watch("details.type")
                                        )
                                    }
                                />
                            </div>


                            {fields.map((field, index) => (
                                <div
                                    className="grid sm:grid-cols-2 gap-4 p-2 border border-border rounded-md shadow-sm relative"
                                    key={index}
                                >
                                    {fields.length > 1 && (
                                        <Button
                                            type="button"
                                            className="size-6 absolute top-1 right-1"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => onRemove(index)}
                                        >
                                            <X />
                                        </Button>
                                    )}
                                    <FormInput
                                        form={form}
                                        label="Time from"
                                        name={"classloads." + index + ".time"}
                                        type="time"
                                    />

                                    <FormInput
                                        form={form}
                                        label="Time To"
                                        name={"classloads." + index + ".timeTo"}
                                        type="time"
                                    />

                                    <FormInput
                                        form={form}
                                        label="Grade and Section"
                                        name={
                                            "classloads." +
                                            index +
                                            ".gradesection"
                                        }
                                    />
                                    <FormInput
                                        form={form}
                                        label="Subject"
                                        name={
                                            "classloads." + index + ".subject"
                                        }
                                    />

                                    <FormComboBox
                                        key={field.id}
                                        form={form}
                                        name={
                                            "classloads." + index + ".teacher"
                                        }
                                        label="Teacher"
                                        personnelList={personnelList}
                                        onSelect={onPersonnelSelect}
                                    />
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                className="border-dashed w-full"
                                onClick={() =>
                                    append({
                                        time: "",
                                        timeTo: "",
                                        gradesection: "",
                                        subject: "",
                                        teacher: 0,
                                    })
                                }
                            >
                                <Add /> Add row
                            </Button>
                        </div>

                        <div className="flex items-center mt-10">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onClose(false)}
                            >
                                Cancel
                            </Button>
                            <Button className="ml-auto">
                                Send Class Assumption
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    );
};

type PersonnelValue = Pick<User, "id" | "name" | "avatar"> & {
    checked: boolean;
};

type FormComboBoxProps = {
    form: any;
    name: string;
    label: string;
    disabled?: boolean;
    personnelList: PersonnelValue[];
    onSelect?: (personnel?: PersonnelValue, previousPersonnel?: number) => void;
};
const FormComboBox = ({
    form,
    name,
    label,
    disabled,
    personnelList,
    onSelect,
}: FormComboBoxProps) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="col-span-full">
                    <FormLabel className="required">{label}</FormLabel>
                    <Combobox<PersonnelValue>
                        onValueChange={(value) => {
                            field.onChange(value?.id);
                            onSelect?.(value, field.value);
                        }}
                    >
                        <FormControl>
                            <div className="group">
                                <ComboboxTrigger
                                    disabled={disabled ?? false}
                                    className="focus:!bg-background hover:!bg-background hover:text-foreground data-[state=open]:text-primary group-aria-[invalid=true]:!text-foreground formSelect"
                                >
                                    {field.value
                                        ? personnelList.find(
                                              (pl) => pl.id == field.value
                                          )?.name
                                        : "Select personnel"}
                                </ComboboxTrigger>
                            </div>
                        </FormControl>

                        <ComboboxContent>
                            {personnelList.map((personnel) => (
                                <ComboboxItem<PersonnelValue>
                                    key={personnel.name}
                                    value={personnel.name}
                                    stateValue={personnel}
                                    isSelected={field.value == personnel.id}
                                    disabled={
                                        personnel.checked &&
                                        field.value != personnel.id
                                    }
                                >
                                    <div className="flex items-center w-full gap-3">
                                        <ProfilePhoto
                                            className="size-7"
                                            src={personnel?.avatar}
                                        />
                                        {personnel.name}
                                    </div>
                                </ComboboxItem>
                            ))}
                        </ComboboxContent>
                    </Combobox>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default NewClassAssumption;
