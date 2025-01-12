import TypographySmall, { TypographyLarge } from "@/Components/Typography";
import { Form, FormInput } from "@/Components/ui/form";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import React from "react";
import { useFieldArray } from "react-hook-form";
import {
    EDUCATIONALBACKGROUNDSCHEMA,
    EDUCATIONALBACKGROUNDTYPE,
    IFormEducationalBackground,
} from "../Types/EducationalBackground";
import { Button } from "@/Components/ui/button";
import { Add, Trash } from "iconsax-react";
import { cn } from "@/Lib/utils";
import { useToast } from "@/Hooks/use-toast";

type EducationalBackgroundProps = {
    data: EDUCATIONALBACKGROUNDTYPE | null;
};

const EducationalBackground: React.FC<EducationalBackgroundProps> = ({
    data,
}) => {
    const { toast } = useToast();

    const getEducation = (
        type:
            | "elementary"
            | "secondary"
            | "senior"
            | "vocational"
            | "college"
            | "graduate"
    ) => {
        const education = data?.find((e) => e.type === type);

        if (education) {
            return education.details;
        }

        return [];
    };

    const form = useFormSubmit<IFormEducationalBackground>({
        route: data ? route("pds.update.eb") : route("pds.store.eb"),
        method: "POST",
        schema: EDUCATIONALBACKGROUNDSCHEMA,
        defaultValues: {
            elementary: getEducation("elementary"),
            secondary: getEducation("secondary"),
            senior: getEducation("senior"),
            vocational: getEducation("vocational"),
            college: getEducation("college"),
            graduatestudies: getEducation("graduate"),
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
                        form.setError(key as keyof IFormEducationalBackground, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
        },
    });

    return (
        <div className="px-1">
            <TypographyLarge className="italic my-3 uppercase">
                III. Educational Background
            </TypographyLarge>

            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-4">
                        <Education
                            form={form}
                            name="elementary"
                            edLevel="Elementary"
                        />

                        <Education
                            form={form}
                            name="secondary"
                            edLevel="Secondary"
                        />

                        <Education
                            form={form}
                            name="vocational"
                            edLevel="VOCATIONAL/TRADE COURSE"
                        />

                        <Education
                            form={form}
                            name="college"
                            edLevel="College"
                        />

                        <Education
                            form={form}
                            name="graduatestudies"
                            edLevel="Graduate Studies"
                        />
                    </div>

                    <div className="flex items-center mt-8 pt-4 border-t border-border">
                        <Button type="button" variant="outline">
                            Cancel changes
                        </Button>
                        <Button className="ml-auto">Save changes</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

const Education: React.FC<{ form: any; name: string; edLevel: string }> = ({
    form,
    name,
    edLevel,
}) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: name,
    });

    return (
        <div className="rounded-md border border-border p-4 shadow-sm">
            <TypographySmall className="uppercase font-bold underline">
                {edLevel}
            </TypographySmall>

            <div className="divide-y divide-border space-y-4">
                {fields.map((field, index) => (
                    <div className="relative pt-3">
                        <Button
                            type="button"
                            className="absolute top-1 right-1 size-6 text-destructive"
                            size="icon"
                            variant="outline"
                            onClick={() => remove(index)}
                        >
                            <Trash className="[&_path]:stroke-2 !size-4" />
                        </Button>
                        <div
                            className={cn(
                                "space-y-3",
                                fields.length > 1 && index > 0 && "pt-4"
                            )}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    form={form}
                                    name={`${name}.${index}.nameofschool`}
                                    label="Name of School (write in full)"
                                />
                                <FormInput
                                    form={form}
                                    name={`${name}.${index}.basiceddegreecourse`}
                                    label="Basic Education/Degree/Course (write in full)"
                                />
                            </div>

                            <div
                                key={field.id}
                                className="grid grid-cols-[8rem,8rem,1fr,8rem,1fr] gap-4"
                            >
                                <FormInput
                                    form={form}
                                    name={`${name}.${index}.period.from`}
                                    label="From"
                                />
                                <FormInput
                                    form={form}
                                    name={`${name}.${index}.period.to`}
                                    label="To"
                                />
                                <FormInput
                                    form={form}
                                    name={`${name}.${index}.highestlvl`}
                                    label="Highest Level/Units Earned"
                                />
                                <FormInput
                                    form={form}
                                    name={`${name}.${index}.yeargraduated`}
                                    label="Year Graduated"
                                />
                                <FormInput
                                    form={form}
                                    name={`${name}.${index}.scholarshiphonor`}
                                    label="Scholarship/Academic Honors Received"
                                />
                            </div>
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
                            ebid: null,
                            nameofschool: "",
                            basiceddegreecourse: "",
                            period: {
                                from: "",
                                to: "",
                            },
                            highestlvl: "",
                            yeargraduated: "",
                            scholarshiphonor: "",
                        })
                    }
                >
                    <Add className="" />
                    <span>New row</span>
                </Button>
            </div>
        </div>
    );
};

export default EducationalBackground;
