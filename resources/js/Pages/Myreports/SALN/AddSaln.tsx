import Modal, { ModalProps } from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Hooks/use-toast";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { requiredError } from "@/Types/types";
import React, { Fragment, useEffect, useState } from "react";
import { z } from "zod";
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
    FormRadioGroup,
    FormRadioItem,
    FormSelect,
} from "@/Components/ui/form";
import { SelectItem } from "@/Components/ui/select";
import { Skeleton } from "@/Components/ui/skeleton";
import { User } from "@/Types";
import { SALNREPORTTYPE } from "./SALN";
import { ProfilePhoto } from "@/Components/ui/avatar";

const SALNSCHEMA = z.object({
    year: z.string().min(1, requiredError("calendar year")),
    personnel: z.number({ required_error: requiredError("personnel") }),
    networth: z.string().min(1, requiredError("networth")),
    filing: z.enum(["joint", "separate", "not"]),
    spouse: z.string().optional().default(''),
});
type IFormSALN = z.infer<typeof SALNSCHEMA>;

type Props = ModalProps & {
    saln: SALNREPORTTYPE | null;
    year: string;
};

const AddSaln = ({ saln, year, show, onClose }: Props) => {
    const { toast } = useToast();
    const form = useFormSubmit<IFormSALN>({
        route: route("myreports.saln.store", [saln?.id]),
        method: "post",
        schema: SALNSCHEMA,
        defaultValues: {
            year: year,
            networth: '',
            spouse: '',
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
                        form.setError(key as keyof IFormSALN, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
        },
    });

    useEffect(() => {
        if(saln) {
            form.setValue('year', saln.year)
            form.setValue('personnel', saln.user.id)
            form.setValue('networth', saln.details.networth)
            form.setValue('filing', saln.details.filing)
            form.setValue('spouse', saln.details.spouse??"")
        } else {
            form.reset()
            if(year) {
                form.setValue('year', year)
            }
        }
    }, [show])

    useEffect(() => {
        if(!saln && year) {
            form.setValue('year', year)
        }
    }, [year])

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Add Personnel SALN"
            maxWidth="lg"
        >
            <div className="w-full">
                <Form {...form}>
                    <form onSubmit={form.onSubmit} className="w-full space-y-4">
                        <FormSelect
                            form={form}
                            name="year"
                            label="Calendar year"
                            triggerClass="w-full"
                            items={
                                <Fragment>
                                    {Array.from({ length: 50 }).map(
                                        (_, index) => (
                                            <SelectItem
                                                key={index}
                                                value={(
                                                    new Date().getFullYear() -
                                                    index
                                                ).toString()}
                                            >
                                                {(
                                                    new Date().getFullYear() -
                                                    index
                                                ).toString()}
                                            </SelectItem>
                                        )
                                    )}
                                </Fragment>
                            }
                        />

                        <FormComboBox
                            form={form}
                            name="personnel"
                            label="Personnel"
                            editsaln={saln}
                        />

                        <FormInput
                            form={form}
                            name="networth"
                            label="Networth"
                            type="currency"
                        />

                        <FormInput
                            form={form}
                            name="spouse"
                            label="If spouse is with government service, Please indicate Name of Spouse/Employer/Address"
                            required={false}
                        />

                        <FormRadioGroup
                            form={form}
                            name="filing"
                            label="Filing option"
                        >
                            <FormRadioItem value="joint" label="Joint Filing" />
                            <FormRadioItem value="separate" label="Separate Filing" />
                            <FormRadioItem value="not" label="Not Applicable" />
                        </FormRadioGroup>

                        <div className="flex border-t border-border pt-4 !mt-7">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onClose(false)}
                            >
                                Cancel
                            </Button>
                            <Button className="ml-auto">Submit</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    );
};

type PersonnelValue = Pick<User, "id" | "name" | "avatar" | "position">;

type FormComboBoxProps = {
    form: any;
    name: string;
    label: string;
    disabled?: boolean;
    editsaln: SALNREPORTTYPE | null;
    // onValueChange: (value?: T) => void
};
const FormComboBox = ({
    form,
    name,
    label,
    disabled,
    editsaln,
}: /* onValueChange */
FormComboBoxProps) => {
    const year = form.watch("year");
    const [personnels, setPesonnels] = useState<Array<PersonnelValue>>([]);
    const [selected, setSelected] = useState<PersonnelValue | undefined>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (year) {
            setLoading(true);
            window.axios
                .get(route("myreports.saln.personnelWithoutSaln", [year]))
                .then((response) => {
                    const data = response.data;

                    setPesonnels(data);
                })
                .finally(() => setLoading(false));
        }
    }, [year]);

    useEffect(() => {
        if (editsaln) {
            setSelected(editsaln?.user);
        } else {
            setSelected(undefined);
        }
    }, [editsaln]);

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
                            setSelected(value);
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

export default AddSaln;
