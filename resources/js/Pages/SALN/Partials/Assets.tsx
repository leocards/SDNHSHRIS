import { Button } from "@/Components/ui/button";
import { FormInput } from "@/Components/ui/form";
import { Add } from "iconsax-react";
import { Trash2, X } from "lucide-react";
import React, { Fragment } from "react";
import { useFieldArray } from "react-hook-form";

type Props = {
    form: any;
};

const Assets = ({ form }: Props) => {
    const realAssets = useFieldArray({
        control: form.control,
        name: "assets.real",
    });

    const personalAssets = useFieldArray({
        control: form.control,
        name: "assets.personal",
    });

    return (
        <div>
            <div className="mb-4">
                <div className="underline font-bold text-center">
                    ASSETS, LIABILITIES AND NETWORTH
                </div>
                <div className="text-center text-foreground/50">
                    (Including those of the spouse and unmarried children below
                    eighteen (18) years of age living in declarant’s household)
                </div>
            </div>

            <div>1. ASSETS</div>
            <div className="mt-2 mb-3">a. Real Properties*</div>
            <div className="space-y-3">
                {realAssets.fields.map((real, index) => (
                    <div
                        key={real.id}
                        className="space-y-4 border rounded-md p-3 shadow-sm relative"
                    >
                        {realAssets.fields.length > 1 && (
                            <Button
                                className="size-6"
                                variant={"ghost"}
                                size={"icon"}
                                type="button"
                                onClick={() => realAssets.remove(index)}
                            >
                                <X className="size-4 text-destructive" />
                            </Button>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                form={form}
                                name={`assets.real.${index}.description`}
                                label={
                                    <Fragment>
                                        Description{" "}
                                        <span className="text-foreground/40">
                                            (e.g. lot, house and lot,
                                            condominium and improvements)
                                        </span>
                                    </Fragment>
                                }
                            />
                            <FormInput
                                form={form}
                                name={`assets.real.${index}.kind`}
                                label={
                                    <Fragment>
                                        Kind{" "}
                                        <span className="text-foreground/40">
                                            (e.g. residential, commercial,
                                            industrial, agricultural and mixed
                                            use)
                                        </span>
                                    </Fragment>
                                }
                            />
                        </div>

                        <div>
                            <FormInput
                                form={form}
                                name={`assets.real.${index}.exactlocation`}
                                label="Exact Location"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                form={form}
                                name={`assets.real.${index}.assessedvalue`}
                                label="Assessed Value"
                            />
                            <FormInput
                                form={form}
                                name={`assets.real.${index}.currentfairmarketvalue`}
                                label="Current Fair Market Value"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormInput
                                form={form}
                                name={`assets.real.${index}.acquisition.year`}
                                label="Acquisition year"
                                placeholder="YYYY"
                                type="number"
                                maxLength={4}
                            />
                            <FormInput
                                form={form}
                                name={`assets.real.${index}.acquisition.mode`}
                                label="Acquisition mode"
                            />
                            <FormInput
                                form={form}
                                name={`assets.real.${index}.acquisitioncost`}
                                label="Acquisition cost"
                            />
                        </div>
                    </div>
                ))}

                <Button
                    type="button"
                    variant={"outline"}
                    className="border-dashed w-full border-2 shadow-none !mt-5"
                    onClick={() =>
                        realAssets.append({
                            description: "",
                            kind: "",
                            exactlocation: "",
                            assessedvalue: "",
                            currentfairmarketvalue: "",
                            acquisition: {
                                year: "",
                                mode: "",
                            },
                            acquisitioncost: "",
                        })
                    }
                >
                    <Add className="" />
                    <span>New row</span>
                </Button>
            </div>

            <div className="mt-7 mb-3">b. Personal Properties*</div>
            <div className="space-y-3">
                {personalAssets.fields.map((personal, index) => (
                    <div
                        key={personal.id}
                        className="space-y-4 border rounded-md p-3 shadow-sm relative"
                    >
                        {personalAssets.fields.length > 1 && (
                            <Button
                                className="size-6 absolute top-1 right-1"
                                variant={"ghost"}
                                size={"icon"}
                                type="button"
                                onClick={() => personalAssets.remove(index)}
                            >
                                <Trash2 className="size-4 text-destructive" />
                            </Button>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-[1fr,10rem,13rem] gap-4">
                            <FormInput
                                form={form}
                                name={`assets.personal.${index}.description`}
                                label="Description"
                            />
                            <FormInput
                                form={form}
                                name={`assets.personal.${index}.yearacquired`}
                                label="Year acquired"
                                placeholder="YYYY"
                                type="number"
                                maxLength={4}
                            />
                            <FormInput
                                form={form}
                                name={`assets.personal.${index}.acquisitioncost`}
                                label="Acquisition cost/amount"
                            />
                        </div>
                    </div>
                ))}

                <Button
                    type="button"
                    variant={"outline"}
                    className="border-dashed w-full border-2 shadow-none !mt-5"
                    onClick={() =>
                        personalAssets.append({
                            description: "",
                            kind: "",
                            exactlocation: "",
                            assessedvalue: "",
                            currentfairmarketvalue: "",
                            acquisition: {
                                year: "",
                                mode: "",
                            },
                            acquisitioncost: "",
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

export default Assets;
