import { TypographyLarge } from "@/Components/Typography";
import { Button } from "@/Components/ui/button";
import {
    CustomFormProps,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { cn } from "@/Lib/utils";
import React from "react";
import { useFieldArray } from "react-hook-form";
import {
    defaultOI,
    IFormOtherInformation,
    OTHERINFORMATIONSCHEMA,
    OTHERINFORMATIONTYPE,
} from "../Types/OtherInformation";
import { Add, Trash } from "iconsax-react";
import { useToast } from "@/Hooks/use-toast";

type OtherInformationProps = {
    data: OTHERINFORMATIONTYPE | null
};

const OtherInformation: React.FC<OtherInformationProps> = ({ data }) => {
    const { toast } = useToast()

    const getOtherInformation = (type: "skills" | "recognition" | "association") => {
        let oi = data?.find((oi) => oi.type === type)

        if(oi)
            return oi.details
        else
            return []
    }

    const form = useFormSubmit<IFormOtherInformation>({
        route: data && data.length !== 0 ? route('pds.update.oi') : route("pds.store.oi"),
        method: "POST",
        schema: OTHERINFORMATIONSCHEMA,
        values: {
            skills: getOtherInformation("skills"),
            nonacademicrecognition: getOtherInformation("recognition"),
            membership: getOtherInformation("association"),
        },
        async: true,
        callback: {
            onSuccess: (page: any) => {
                toast({
                    title: page?.props?.flash?.title,
                    description: page?.props?.flash?.message,
                    status: page?.props?.flash?.status,
                });
            },
            onError: (error: any) => {
                if ("0" in error)
                    toast({
                        title: "Error",
                        description: error[0],
                        status: "error",
                    });
                else {
                    for (const key in error) {
                        form.setError(key as keyof IFormOtherInformation, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
        },
    });

    return (
        <div>
            <TypographyLarge className="italic my-3 uppercase">
                VIII. OTHER INFORMATION
            </TypographyLarge>

            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-4">
                        <OtherInformations form={form} name="skills" />
                        <div className="h-px bg-border w-full lg:hidden" />
                        <OtherInformations form={form} name="nonacademicrecognition" />
                        <div className="h-px bg-border w-full lg:hidden" />
                        <OtherInformations form={form} name="membership" />
                    </div>

                    <div className="flex items-center mt-8 pt-4 border-t border-border max-xs:gap-4 max-xs:[&>button]:!w-full">
                        <Button type="button" variant="outline">
                            Cancel changes
                        </Button>
                        <Button className="xs:ml-auto">Save changes</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

const OtherInformations: React.FC<{
    form: any;
    name: "skills" | "nonacademicrecognition" | "membership";
}> = ({ form, name }) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: name,
    });

    return (
        <div className="px-1">
            <TypographyLarge className="col-span-3 text-[14px]">
                {name === "skills"
                    ? "Special skills & Hobbies"
                    : name === "nonacademicrecognition"
                    ? "Non-academics distinction/recognition (Write in full)"
                    : "Membership in Association/Organization (Write in full)"}
            </TypographyLarge>

            <div className="mt-3 space-y-3">
                {fields.map((field, index) => (
                    <FormInput
                        key={field.id}
                        form={form}
                        name={`${name}.${index}.detail`}
                        label=""
                        disabled={false}
                        onRemove={() => remove(index)}
                    />
                ))}
            </div>

            <div className="mt-4">
                <Button
                    type="button"
                    variant={"outline"}
                    className="border-dashed w-full border-2 shadow-none"
                    onClick={() => append(defaultOI)}
                >
                    <Add className="" />
                    <span>New row</span>
                </Button>
            </div>
        </div>
    );
};

const FormInput: React.FC<
    Pick<CustomFormProps, "form" | "label" | "name" | "disabled"> & {
        onRemove: () => void;
    }
> = ({ form, name, label, disabled, ...props }) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <div className={cn("relative group")}>
                        <FormControl>
                            <Input
                                {...field}
                                className="formInput pr-10"
                                disabled={disabled}
                            />
                        </FormControl>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-8 absolute right-1 top-1/2 -translate-y-1/2 text-destructive"
                            disabled={disabled}
                            onClick={props.onRemove}
                        >
                            <Trash className="[&_path]:stroke-2 !size-4" />
                        </Button>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default OtherInformation;
