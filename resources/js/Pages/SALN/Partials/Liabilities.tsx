import React from "react";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Add, Trash } from "iconsax-react";
import { FormInput } from "@/Components/ui/form";

const Liabilities: React.FC<{ form: any }> = ({ form }) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "liabilities",
    });

    return (
        <div className="mt-10">
            <div>2. LIABILITIES</div>

            <div className="space-y-3 mt-3">
                {fields.map((personal, index) => (
                    <div
                        key={personal.id}
                        className="space-y-4 border rounded-md p-3 shadow-sm relative"
                    >
                        {fields.length > 1 && (
                            <Button
                                className="size-6 top-1 right-1"
                                variant={"ghost"}
                                size={"icon"}
                                type="button"
                                onClick={() => remove(index)}
                            >
                                <Trash className="size-4 text-destructive" />
                            </Button>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-[1fr,10rem,13rem] gap-4">
                            <FormInput
                                form={form}
                                name={`liabilities.${index}.nature`}
                                label="Nature"
                            />
                            <FormInput
                                form={form}
                                name={`liabilities.${index}.nameofcreditors`}
                                label="Name of creditors"
                            />
                            <FormInput
                                form={form}
                                name={`liabilities.${index}.outstandingbalances`}
                                label="Outstanding balance"
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
                            nature: "",
                            nameofcreditors: "",
                            outstandingbalances: "",
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

export default Liabilities;
