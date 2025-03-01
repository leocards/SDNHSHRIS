import React from "react";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import { Add, Trash } from "iconsax-react";
import {
    FormCalendar,
    FormCheckBox,
    FormControl,
    FormField,
    FormInput,
    FormItem,
    FormLabel,
} from "@/Components/ui/form";
import { Checkbox } from "@/Components/ui/checkbox";

const BusinessInterectFinancialConnections: React.FC<{ form: any }> = ({
    form,
}) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "biandfc.bifc",
    });

    return (
        <div className="mt-10">
            <div className="font-bold underline text-center">
                BUSINESS INTERESTS AND FINANCIAL CONNECTIONS
            </div>
            <div className="text-center text-foreground/50">
                (of Declarant /Declarant’s spouse/ Unmarried Children Below
                Eighteen (18) years of Age Living in Declarant’s Household)
            </div>

            <div className="mx-auto w-fit mt-3">
                <FormCheckBox
                    form={form}
                    name="biandfc.nobiandfc"
                    label="I/We do not have any business interest or financial connection"
                />
            </div>

            <div className="mt-7">
                <div className="space-y-3">
                    {fields.map((bifc, index) => (
                        <div
                            key={bifc.id}
                            className="space-y-4 border rounded-md p-3 shadow-sm relative"
                        >
                            {fields.length > 1 && (
                                <Button
                                    className="size-6 absolute top-1 right-1"
                                    variant={"ghost"}
                                    size={"icon"}
                                    type="button"
                                    onClick={() => remove(index)}
                                >
                                    <Trash className="size-4" />
                                </Button>
                            )}

                            <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-4">
                                <FormInput
                                    form={form}
                                    name={`biandfc.bifc.${index}.name`}
                                    label="Name of entity/business enterprise"
                                    inputClass="uppercase"
                                />
                                <FormInput
                                    form={form}
                                    name={`biandfc.bifc.${index}.address`}
                                    label="Business address"
                                    inputClass="uppercase"
                                />
                                <FormInput
                                    form={form}
                                    name={`biandfc.bifc.${index}.nature`}
                                    label="Nature of business interest &/or financial connection"
                                    inputClass="uppercase"
                                />

                                <FormCalendar
                                    form={form}
                                    name={`biandfc.bifc.${index}.date`}
                                    label="Date of acquisition of interest or connection"
                                    required={false}
                                    triggerClass="uppercase"
                                />
                            </div>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant={"outline"}
                        className="border-dashed w-full border-2 shadow-none"
                        onClick={() =>
                            append({
                                name: "",
                                address: "",
                                nature: "",
                                date: "",
                                bifcid: null,
                            })
                        }
                    >
                        <Add className="" />
                        <span>New row</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BusinessInterectFinancialConnections;
