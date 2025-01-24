import Modal, { ModalProps } from "@/Components/Modal";
import { ProfilePhoto } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {
    Combobox,
    ComboboxContent,
    ComboboxItem,
    ComboboxTrigger,
} from "@/Components/ui/combobox";
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
import { SelectItem } from "@/Components/ui/select";
import { Skeleton } from "@/Components/ui/skeleton";
import { useToast } from "@/Hooks/use-toast";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { SCHOOLYEAR, User } from "@/Types";
import { requiredError } from "@/Types/types";
import { usePage } from "@inertiajs/react";
import { Fragment, useEffect, useState } from "react";
import { z } from "zod";
import { IPCRTYPE } from "./IPCR";

const IPCRSCHEMA = z.object({
    schoolyear: z.number({ required_error: requiredError("school year") }),
    personnel: z.number({ required_error: requiredError("personnel") }),
    rating: z.string().min(1, requiredError("performance rating")),
}).superRefine(({rating}, ctx) => {
    if(rating) {
        const num = parseFloat(rating)
        if(num < 1 || num > 5) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Performance rating must be between 1 and 5.",
                path: ["rating"]
            })
        }
    }
});

type IFormIPCR = z.infer<typeof IPCRSCHEMA>;

type Props = ModalProps & {
    schoolyears: SCHOOLYEAR[];
    ipcr: IPCRTYPE | null
};

const AddIpcr = ({ schoolyears, ipcr, show, onClose }: Props) => {
    const sy = usePage().props.schoolyear;
    const { toast } = useToast();
    const form = useFormSubmit<IFormIPCR>({
        route: route("myreports.ipcr.store", [ipcr?.id]),
        method: "post",
        schema: IPCRSCHEMA,
        defaultValues: {
            schoolyear: sy?.id,
            personnel: undefined,
            rating: "",
        },
        async: true,
        callback: {
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
                        form.setError(key as keyof IFormIPCR, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
        },
    });

    useEffect(() => {
        if(ipcr) {
            form.setValue('schoolyear', ipcr.schoolyear.id)
            form.setValue('personnel', ipcr.user.id)
            form.setValue('rating', ipcr.rating)
        } else {
            form.reset();
        }
    }, [show])

    return (
        <Modal show={show} onClose={onClose} title="Add Personnel IPCR" maxWidth="lg">
            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-4">
                        <FormSelect
                            form={form}
                            name="schoolyear"
                            label="School Year"
                            disabled={!!ipcr}
                            displayValue={
                                schoolyears.find(
                                    ({ id }) => id === form.watch("schoolyear")
                                )?.schoolyear ?? ""
                            }
                            items={
                                <Fragment>
                                    {schoolyears.map((sy, index) => (
                                        <SelectItem
                                            key={index}
                                            value={sy.id.toString()}
                                            children={sy.schoolyear}
                                        />
                                    ))}
                                </Fragment>
                            }
                        />

                        <FormComboBox
                            form={form}
                            name="personnel"
                            label="Personnel"
                            editIpcr={ipcr}
                            disabled={!!ipcr}
                        />

                        <FormInput
                            form={form}
                            name="rating"
                            label="Performance rating"
                            type="number"
                        />
                    </div>

                    <div className="flex items-center mt-8 pt-4 border-t border-border">
                        <Button type="button" variant="outline" onClick={() => onClose(false)}>
                            Cancel
                        </Button>
                        <Button className="ml-auto">Submit</Button>
                    </div>
                </form>
            </Form>
        </Modal>
    );
};

type PersonnelValue = Pick<User, "id" | "name" | "avatar" | "position">;

type FormComboBoxProps = {
    form: any;
    name: string;
    label: string;
    disabled?: boolean;
    editIpcr: IPCRTYPE | null
    // onValueChange: (value?: T) => void
};
const FormComboBox = ({
    form,
    name,
    label,
    disabled,
    editIpcr,
    /* onValueChange */
}: FormComboBoxProps) => {
    const sy = form.watch("schoolyear");
    const [personnels, setPesonnels] = useState<Array<PersonnelValue>>([]);
    const [selected, setSelected] = useState<PersonnelValue|undefined>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (sy) {
            setLoading(true)
            window.axios
                .get(route("myreports.ipcr.personnelWithoutIpcr", [sy]))
                .then((response) => {
                    const data = response.data;

                    setPesonnels(data);
                })
                .finally(() => setLoading(false));
        }
    }, [sy]);

    useEffect(() => {
        if(editIpcr) {
            setSelected(editIpcr?.user)
        } else {
            setSelected(undefined)
        }
    }, [editIpcr])

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="required">{label}</FormLabel>
                    <Combobox<PersonnelValue>
                        onValueChange={(value) => {
                            field.onChange(value?.id);
                            setSelected(value)
                        }}
                    >
                        <FormControl>
                            <div className="group">
                                <ComboboxTrigger
                                    disabled={disabled ?? false}
                                    className="focus:!bg-background hover:!bg-background hover:text-foreground data-[state=open]:text-primary group-aria-[invalid=true]:!text-foreground formSelect"
                                >
                                    {field.value
                                        ? selected?.name
                                        : "Select personnel"}
                                </ComboboxTrigger>
                            </div>
                        </FormControl>

                        <ComboboxContent loading={loading}>
                            {loading && <RowLoader />}
                            {personnels.map((personnel) => (
                                <ComboboxItem<PersonnelValue>
                                    key={personnel.name}
                                    value={personnel.name}
                                    stateValue={personnel}
                                    isSelected={field.value == personnel.id}
                                >
                                    <ProfilePhoto
                                        className="size-7"
                                        src={personnel?.avatar}
                                    />
                                    {personnel.name}
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

const RowLoader = () => {
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

export default AddIpcr;
