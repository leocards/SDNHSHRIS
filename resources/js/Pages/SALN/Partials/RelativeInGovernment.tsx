import React from "react";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import { Add, Trash } from "iconsax-react";
import { FormCheckBox, FormInput } from "@/Components/ui/form";

const RelativeInGovernment: React.FC<{ form: any }> = ({ form }) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "relativesingovernment.relatives",
    });

    return (
        <div className="mt-10">
            <div className="font-bold underline text-center">
                RELATIVES IN THE GOVERNMENT SERVICE
            </div>
            <div className="text-center text-foreground/50">
                (Within the Fourth Degree of Consanguinity or Affinity. Include
                also Bilas, Balae and Inso)
            </div>

            <div className="mx-auto w-fit mt-3">
                <FormCheckBox
                    form={form}
                    label="I/We do not know of any relative/s in the government service)"
                    name="relativesingovernment.norelative"
                />
            </div>

            <div className="mt-7">
                <div className="space-y-3">
                    {fields.map((relative, index) => (
                        <div
                            key={relative.id}
                            className="space-y-4 border rounded-md p-3 flex flex-col shadow-sm relative"
                        >
                            {fields.length > 1 && (
                                <Button
                                    className="size-6 ml-auto"
                                    variant={"ghost"}
                                    size={"icon"}
                                    type="button"
                                    onClick={() => remove(index)}
                                >
                                    <Trash className="size-4 text-destructive" />
                                </Button>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    form={form}
                                    name={`relativesingovernment.relatives.${index}.name`}
                                    label="Name of relative"
                                    inputClass="uppercase"
                                />
                                <FormInput
                                    form={form}
                                    name={`relativesingovernment.relatives.${index}.relationship`}
                                    label="Relationship"
                                    inputClass="uppercase"

                                />
                                <FormInput
                                    form={form}
                                    name={`relativesingovernment.relatives.${index}.position`}
                                    label="Position"
                                    inputClass="uppercase"
                                />

                                <FormInput
                                    form={form}
                                    name={`relativesingovernment.relatives.${index}.agencyandaddress`}
                                    label="Name of agency/office and address"
                                    inputClass="uppercase"
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
                                relationship: "",
                                position: "",
                                agencyandaddress: "",
                                relativeid: null,
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

export default RelativeInGovernment;
