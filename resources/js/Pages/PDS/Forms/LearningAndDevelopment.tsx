import { TypographyLarge } from "@/Components/Typography";
import { Button } from "@/Components/ui/button";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { Add, Trash } from "iconsax-react";
import React from "react";
import { defaultLD, IFormLearningAndDevelopment, LEARNINGANDDEVELOPMENTSCHEMA, LEARNINGANDEVELOPMENTTYPE } from "../Types/LearningAndDevelopment";
import { useFieldArray } from "react-hook-form";
import { Form, FormCalendar, FormInput } from "@/Components/ui/form";
import { X } from "lucide-react";
import { useToast } from "@/Hooks/use-toast";
import { isValidDate } from "@/Types/types";

type LearningAndDevelopmentProps = {
    data: LEARNINGANDEVELOPMENTTYPE | null
};

const LearningAndDevelopment: React.FC<LearningAndDevelopmentProps> = ({ data }) => {
    const { toast } = useToast()

    const form = useFormSubmit<IFormLearningAndDevelopment>({
        route: data && data.length !== 0 ? route("pds.update.landd") : route("pds.store.landd"),
        method: "POST",
        schema: LEARNINGANDDEVELOPMENTSCHEMA,
        values: { ld: data ? data.map((ld) => ({
            ldid: ld.id,
            title: ld.title,
            inclusivedates: {
                from:  isValidDate(ld.inclusivedates.from) ?  new Date(ld.inclusivedates.from) : undefined,
                to:  isValidDate(ld.inclusivedates.to) ?  new Date(ld.inclusivedates.to) : undefined,
            },
            numberofhours: ld.numofhours,
            typeofld: ld.type,
            conductedsponsoredby: ld.conductedby,
        })) : [], deletedLD: [] },
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
                        form.setError(key as keyof IFormLearningAndDevelopment, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
        },
    });

    const { fields, prepend, remove } = useFieldArray({
        control: form.control,
        name: "ld",
    })

    return (
        <div>
            <TypographyLarge className="italic my-3 uppercase">
                VII. LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS/TRAINING
                PROGRAMS ATTENDED
            </TypographyLarge>

            <div className="mb-4">
                <Button
                    type="button"
                    variant={"outline"}
                    className="border-dashed w-full border-2 shadow-none"
                    onClick={() => prepend(defaultLD)}
                >
                    <Add className="" />
                    <span>New row</span>
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="border border-border rounded-md shadow-sm p-4 relative">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                        remove(index)
                                        form.setValue('deletedLD', [
                                            ...(form.getValues('deletedLD')||[]),
                                            field.ldid!
                                        ])
                                    }}
                                    className="size-6 absolute top-1 right-1 text-destructive"
                                >
                                    <Trash className="[&_path]:stroke-2 !size-4" />
                                </Button>

                                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                                    <FormInput
                                        form={form}
                                        name={`ld.${index}.title`}
                                        label="Title of Learning and Development Intervention/Training Program (Write in full)"
                                        itemClass="xs:col-span-2"
                                        inputClass="uppercase"
                                    />
                                    <FormInput
                                        form={form}
                                        name={`ld.${index}.typeofld`}
                                        label="Type of LD (Managerial/Supervisory/Technical/etc)"
                                        inputClass="uppercase"
                                    />
                                    <FormInput
                                        form={form}
                                        name={`ld.${index}.conductedsponsoredby`}
                                        label="Conducted/Sponsored by (Write in full)"
                                        inputClass="uppercase"
                                    />
                                </div>

                                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    <FormCalendar
                                        form={form}
                                        name={`ld.${index}.inclusivedates.from`}
                                        label="From"
                                        triggerClass="uppercase"
                                    />
                                    <FormCalendar
                                        form={form}
                                        name={`ld.${index}.inclusivedates.to`}
                                        label="To"
                                        triggerClass="uppercase"
                                    />
                                    <FormInput
                                        form={form}
                                        name={`ld.${index}.numberofhours`}
                                        label="Number of Hours"
                                        inputClass="uppercase"
                                    />
                                </div>
                            </div>
                        ))}
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

export default LearningAndDevelopment;
