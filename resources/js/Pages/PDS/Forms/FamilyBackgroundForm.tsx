import TypographySmall, { TypographyLarge } from "@/Components/Typography";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import {
    familyBackgroundDefaults,
    FAMILYBACKGROUNDSCHEMA,
    FAMILYBACKGROUNDTYPE,
    IFormFamilyBackground,
} from "../Types/FamilyBackground";
import {
    Form,
    FormCalendar,
    FormInput,
    FormSelect,
} from "@/Components/ui/form";
import { SelectItem } from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { Add, Trash } from "iconsax-react";
import { X } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import React from "react";
import { useToast } from "@/Hooks/use-toast";
import { isFuture } from "date-fns";

type FamilyBackgroundFormProps = {
    data: FAMILYBACKGROUNDTYPE | null
}

const FamilyBackgroundForm: React.FC<FamilyBackgroundFormProps> = ({ data }) => {
    const { toast } = useToast()

    const getFamily = (type: "spouse"|"father"|"mother"|"child") => {
        const family = data?.find((f) => f.type === type)

        if(family) {

            return family.details
        } else {
            return familyBackgroundDefaults[type]
        }
    }

    const form = useFormSubmit<IFormFamilyBackground>({
        route: data && data.length > 0 ? route("pds.update.fb") : route("pds.store.fb"),
        method: "post",
        schema: FAMILYBACKGROUNDSCHEMA,
        defaultValues: {
            spouse: getFamily("spouse"),
            father: getFamily("father"),
            mother: getFamily("mother"),
            children: getFamily("child"),
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
                        form.setError(key as keyof IFormFamilyBackground, {
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
        name: "children",
    });

    return (
        <div className="px-1">
            <TypographyLarge className="italic my-3 uppercase">
                II. Family Background
            </TypographyLarge>

            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-4">
                        <div>
                            <TypographySmall className="uppercase font-bold underline">
                                Spouse Name
                            </TypographySmall>

                            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 p-1 px-0">
                                <FormInput
                                    form={form}
                                    name="spouse.familyname"
                                    label="Surname"
                                    inputClass="uppercase"
                                    required={false}
                                />
                                <FormInput
                                    form={form}
                                    name="spouse.firstname"
                                    label="First Name"
                                    inputClass="uppercase"
                                    required={false}
                                />
                                <FormInput
                                    form={form}
                                    name="spouse.middlename"
                                    label="Middle Name"
                                    inputClass="uppercase"
                                    required={false}
                                />
                                <FormSelect
                                    form={form}
                                    name="spouse.extensionname"
                                    label="Extension Name"
                                    triggerClass="uppercase"
                                    required={false}
                                    items={
                                        <>
                                            <SelectItem
                                                value="N/A"
                                                children="N/A"
                                            />
                                            <SelectItem
                                                value="Jr."
                                                children="Jr."
                                            />
                                            <SelectItem
                                                value="Sr."
                                                children="Sr."
                                            />
                                            <SelectItem
                                                value="I"
                                                children="I"
                                            />
                                            <SelectItem
                                                value="II"
                                                children="II"
                                            />
                                            <SelectItem
                                                value="III"
                                                children="III"
                                            />
                                            <SelectItem
                                                value="IV"
                                                children="IV"
                                            />
                                            <SelectItem
                                                value="V"
                                                children="V"
                                            />
                                            <SelectItem
                                                value="VI"
                                                children="VI"
                                            />
                                            <SelectItem
                                                value="VII"
                                                children="VII"
                                            />
                                            <SelectItem
                                                value="VIII"
                                                children="VIII"
                                            />
                                        </>
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 p-1 px-0 mt-2.5">
                                <FormInput
                                    form={form}
                                    name="spouse.occupation"
                                    label="Occupation"
                                    inputClass="uppercase"
                                    required={false}
                                />
                                <FormInput
                                    form={form}
                                    name="spouse.employerbusiness"
                                    label="Employer/Business Name"
                                    inputClass="uppercase"
                                    required={false}
                                />
                                <FormInput
                                    form={form}
                                    name="spouse.businessaddress"
                                    label="Business Address"
                                    inputClass="uppercase"
                                    required={false}
                                />
                                <FormInput
                                    form={form}
                                    name="spouse.telephone"
                                    label="Telephone No."
                                    inputClass="uppercase"
                                    required={false}
                                    type="number"
                                    maxLength={11}
                                />
                            </div>
                        </div>

                        <div>
                            <TypographySmall className="uppercase font-bold underline">
                                Children
                            </TypographySmall>

                            <div className="mt-3 space-y-4">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="p-4 border broder-boder rounded-md relative shadow-sm"
                                    >
                                        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2">
                                            <FormInput
                                                form={form}
                                                name={`children.${index}.name`}
                                                label="Name"
                                                itemClass="col-span-2"
                                                inputClass="uppercase"
                                            />
                                            <FormCalendar
                                                form={form}
                                                name={`children.${index}.dateofbirth`}
                                                label="Date of Birth"
                                                triggerClass="uppercase w-full"
                                                noFutureDates
                                                disableDate={(date) => isFuture(date)}
                                                itemClass=""
                                            />

                                            <Button
                                                type="button"
                                                className="absolute top-1 right-1 size-6 text-destructive"
                                                size="icon"
                                                variant="outline"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash className="[&_path]:stroke-2 !size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4">
                                <Button
                                    type="button"
                                    variant={"outline"}
                                    className="border-dashed w-full border-2 shadow-none"
                                    onClick={() =>
                                        append({
                                            name: "",
                                            dateofbirth: null,
                                        })
                                    }
                                >
                                    <Add className="" />
                                    <span>New children row</span>
                                </Button>
                            </div>
                        </div>

                        <div>
                            <TypographySmall className="uppercase font-bold underline">
                                Father's Name
                            </TypographySmall>

                            <div className="grid  grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 p-1 px-0">
                                <FormInput
                                    form={form}
                                    name="father.familyname"
                                    label="Surname"
                                    inputClass="uppercase"
                                />
                                <FormInput
                                    form={form}
                                    name="father.firstname"
                                    label="First Name"
                                    inputClass="uppercase"
                                />
                                <FormInput
                                    form={form}
                                    name="father.middlename"
                                    label="Middle Name"
                                    inputClass="uppercase"
                                    required={false}
                                />
                                <FormSelect
                                    form={form}
                                    name="father.extensionname"
                                    label="Extension Name"
                                    triggerClass="uppercase"
                                    required={false}
                                    items={
                                        <>
                                            <SelectItem
                                                value="N/A"
                                                children="N/A"
                                            />
                                            <SelectItem
                                                value="Jr."
                                                children="Jr."
                                            />
                                            <SelectItem
                                                value="Sr."
                                                children="Sr."
                                            />
                                            <SelectItem
                                                value="I"
                                                children="I"
                                            />
                                            <SelectItem
                                                value="II"
                                                children="II"
                                            />
                                            <SelectItem
                                                value="III"
                                                children="III"
                                            />
                                            <SelectItem
                                                value="IV"
                                                children="IV"
                                            />
                                            <SelectItem
                                                value="V"
                                                children="V"
                                            />
                                            <SelectItem
                                                value="VI"
                                                children="VI"
                                            />
                                            <SelectItem
                                                value="VII"
                                                children="VII"
                                            />
                                            <SelectItem
                                                value="VIII"
                                                children="VIII"
                                            />
                                        </>
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <TypographySmall className="uppercase font-bold underline">
                                Mother's Maiden Name
                            </TypographySmall>

                            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 p-1 px-0">
                                <FormInput
                                    form={form}
                                    name="mother.familyname"
                                    label="Surname"
                                    inputClass="uppercase"
                                />
                                <FormInput
                                    form={form}
                                    name="mother.firstname"
                                    label="First Name"
                                    inputClass="uppercase"
                                />
                                <FormInput
                                    form={form}
                                    name="mother.middlename"
                                    label="Middle Name"
                                    inputClass="uppercase"
                                    required={false}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center mt-8 pt-4 border-t border-border max-xs:gap-4 max-xs:[&>button]:!w-full">
                        <Button type="button" variant="outline">Cancel changes</Button>
                        <Button className="xs:ml-auto">Save changes</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default FamilyBackgroundForm;
