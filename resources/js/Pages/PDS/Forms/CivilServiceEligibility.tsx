import TypographySmall, { TypographyLarge } from "@/Components/Typography";
import { Form, FormCalendar, FormInput } from "@/Components/ui/form";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import React from "react";
import {
    CIVILSERVICEELIGIBILITYSCHEMA,
    CIVILSERVICETYPE,
    defaultCS,
    IFormCivilServiceEligibility,
} from "../Types/CivilServiceEligibility";
import { X } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useFieldArray } from "react-hook-form";
import { Add, Trash } from "iconsax-react";
import { useToast } from "@/Hooks/use-toast";

type CivilServiceEligibilityProps = {
    data: CIVILSERVICETYPE | null
}

const CivilServiceEligibility: React.FC<CivilServiceEligibilityProps> = ({ data }) => {
    const { toast } = useToast()

    const form = useFormSubmit<IFormCivilServiceEligibility>({
        route: data && data.length !== 0 ? route("pds.update.cse") : route("pds.store.cse"),
        method: "POST",
        schema: CIVILSERVICEELIGIBILITYSCHEMA,
        values: {cs: data ? data.map((cs) => ({
            csid: cs.id,
            eligibility: cs.careerservice,
            rating: cs.rating,
            dateofexaminationconferment: new Date(cs.examination),
            placeofexaminationconferment: cs.placeexamination,
            license: {
                number: cs.licensenumber,
                dateofvalidity: cs.validity ? new Date(cs.validity) : null
            }
        })) : [], deletedCS: []},
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
                        form.setError(key as keyof IFormCivilServiceEligibility, {
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
        name: "cs",
    });

    const onRemove = (index: number, id: number | null) => {
        if(id) {
            const deleted = form.getValues('deletedCS')??[]

            form.setValue('deletedCS', [...deleted, id])
        }

        remove(index)
    }

    return (
        <div className="px-1">
            <TypographyLarge className="italic my-3 uppercase">
                IV. Civil Service Eligibility
            </TypographyLarge>

            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <CSECard
                                key={field.id}
                                form={form}
                                name={`cs.${index}`}
                                onRemove={() => onRemove(index, field.csid)}
                            />
                        ))}
                    </div>

                    <div className="mt-4">
                        <Button
                            type="button"
                            variant={"outline"}
                            className="border-dashed w-full border-2 shadow-none"
                            onClick={() => append(defaultCS)}
                        >
                            <Add className="" />
                            <span>New row</span>
                        </Button>
                    </div>

                    <div className="flex items-center mt-8 pt-4 border-t border-border">
                        <Button type="button" variant="outline">Cancel changes</Button>
                        <Button className="ml-auto">Save changes</Button>
                    </div>
                </form>
            </Form>

        </div>
    );
};

const CSECard: React.FC<{
    form: any;
    name: string;
    onRemove: CallableFunction;
}> = ({ form, name, onRemove }) => {
    return (
        <div className="rounded-md border border-border p-4 space-y-4 shadow-sm relative">
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onRemove()}
                className="size-6 absolute top-1 right-1 text-destructive"
            >
                <Trash className="[&_path]:stroke-2 !size-4" />
            </Button>
            <div className="grid grid-cols-4 gap-4">
                <FormInput
                    form={form}
                    name={`${name}.eligibility`}
                    label="Career service/RA 1080 (BOARD/BAR) under special Laws/CES/CSEE Barangay Eligibility / Driver's license"
                    itemClass="col-span-3"
                />
                <FormInput
                    form={form}
                    name={`${name}.rating`}
                    label="Rating (If applicable)"
                    required={false}
                />
                <FormInput
                    form={form}
                    name={`${name}.placeofexaminationconferment`}
                    label="Place of Examination/Conferment"
                    itemClass="col-span-3"
                />
                <FormCalendar
                    form={form}
                    name={`${name}.dateofexaminationconferment`}
                    label="Date of Examination/Conferment"
                />
            </div>

            <div>
                <TypographySmall>LICENCE (If applicable)</TypographySmall>
                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        form={form}
                        name={`${name}.license.number`}
                        label="Number"
                        required={false}
                    />
                    <FormCalendar
                        form={form}
                        name={`${name}.license.dateofvalidity`}
                        label="Date of Validity"
                        required={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default CivilServiceEligibility;
