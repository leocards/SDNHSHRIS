import { Button } from "@/Components/ui/button";
import { FormCalendar, FormInput } from "@/Components/ui/form";
import { Label } from "@/Components/ui/label";
import { cn } from "@/Lib/utils";
import { Add, Trash } from "iconsax-react";
import { X } from "lucide-react";
import React from "react";
import { useFieldArray } from "react-hook-form";

type Props = {
    form: any;
};

function calculateAge(birthdate: Date): number {
    const today = new Date();
    const birthYear = birthdate.getFullYear();
    const birthMonth = birthdate.getMonth();
    const birthDay = birthdate.getDate();

    let age = today.getFullYear() - birthYear;

    // Adjust if the birthday hasn't happened yet this year
    if (
        today.getMonth() < birthMonth ||
        (today.getMonth() === birthMonth && today.getDate() < birthDay)
    ) {
        age--;
    }

    return age;
}

const Children = ({ form }: Props) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "children",
    });

    return (
        <div className="my-10">
            <div className="font-bold underline text-center mb-4">
                UNMARRIED CHILDREN BELOW EIGHTEEN (18) YEARS OF AGE LIVING IN
                DECLARANT’S HOUSEHOLD
            </div>

            <div className="space-y-4">
                <div className="space-y-3">
                    {fields.map((child, index) => (
                        <div key={child.id} className={cn("border rounded-md p-3 shadow-sm relative flex flex-col")}>
                            {fields.length > 1 && (
                                <Button
                                    type="button"
                                    className="size-6 ml-auto"
                                    variant={"ghost"}
                                    size={"icon"}
                                    onClick={() => remove(index)}
                                >
                                    <Trash className="size-4 text-destructive" />
                                </Button>
                            )}

                            <div className="grid sm:grid-cols-[1fr,auto,auto] grid-cols-1 max-sm:gap-2.5 gap-4">
                                <div className="">
                                    <FormInput
                                        form={form}
                                        name={`children.${index}.name`}
                                        label="Name"
                                    />
                                </div>
                                <div className="">
                                    <FormCalendar
                                        form={form}
                                        name={`children.${index}.dateofbirth`}
                                        required={false}
                                        label="Date of birth"
                                    />
                                </div>
                                <div className="space-y-1.5 text-center">
                                    <Label className="">Age</Label>
                                    <div className="h-10 w-12 py-2 shadow-sm border rounded-md">
                                        {form.watch('children.'+index+".dateofbirth") && calculateAge(form.watch('children.'+index+".dateofbirth"))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Button
                    type="button"
                    variant={"outline"}
                    className="border-dashed w-full border-2 shadow-none"
                    onClick={() => append({ name: "", dateofbirth: "", age: "" })}
                >
                    <Add className="" />
                    <span>New row</span>
                </Button>
            </div>
        </div>
    );
};

export default Children;
