import { TypographyLarge } from "@/Components/Typography";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import {
    defaultVW,
    IformVoluntaryWork,
    VOLUNTARYWORK,
    VOLUNTARYWORKTYPE,
} from "../Types/VoluntaryWork";
import { useFieldArray } from "react-hook-form";
import { Form, FormCalendar, FormInput } from "@/Components/ui/form";
import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";
import { Add, Trash } from "iconsax-react";
import { useToast } from "@/Hooks/use-toast";
import { useEffect } from "react";
import { isValidDate } from "@/Types/types";

type VoluntaryWorkProps = {
    data: VOLUNTARYWORKTYPE | null
};

const VoluntaryWork: React.FC<VoluntaryWorkProps> = ({ data }) => {
    const { toast } = useToast()

    useEffect(() => {
        console.log('updated', data)
    }, [data])

    const form = useFormSubmit<IformVoluntaryWork>({
        route: data ? route("pds.update.vw") : route("pds.store.vw"),
        method: "POST",
        schema: VOLUNTARYWORK,
        values: { vw: data ? data.map((vw) => ({
            vwid: vw.id,
            nameandaddress: vw.organization,
            inclusivedates: {
                from: isValidDate(vw.inclusivedates.from) ? new Date(vw.inclusivedates.from) : undefined,
                to: isValidDate(vw.inclusivedates.to) ? new Date(vw.inclusivedates.to) : undefined
            },
            numberofhours: vw.numberofhours,
            positionornatureofwork: vw.position
        })) : [], deletedVW: [] },
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
                        form.setError(key as keyof IformVoluntaryWork, {
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
        name: "vw",
    });

    return (
        <div>
            <TypographyLarge className="italic my-3 uppercase">
                VI. VOLUNTARY WORK OR INVOLVEMENT IN CIVIC / NON-GOVERNMENT /
                PEOPLE / VOLUNTARY ORGANIZATION/S
            </TypographyLarge>

            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="border border-border rounded-md shadow-sm p-4 relative">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    className="size-6 absolute top-1 right-1 text-destructive"
                                >
                                    <Trash className="[&_path]:stroke-2 !size-4" />
                                </Button>

                                <div className="grid grid-cols-3 gap-4">
                                    <FormInput
                                        form={form}
                                        name={`vw.${index}.nameandaddress`}
                                        label="Name & Address of Organization"
                                        itemClass="col-span-3"
                                        inputClass="uppercase"
                                    />

                                    <FormCalendar
                                        form={form}
                                        name={`vw.${index}.inclusivedates.from`}
                                        label="From"
                                        triggerClass="uppercase"
                                    />

                                    <FormCalendar
                                        form={form}
                                        name={`vw.${index}.inclusivedates.to`}
                                        label="To"
                                        triggerClass="uppercase"
                                    />

                                    <FormInput
                                        form={form}
                                        name={`vw.${index}.numberofhours`}
                                        label="Number of Hours"
                                        inputClass="uppercase"
                                    />

                                    <FormInput
                                        form={form}
                                        name={`vw.${index}.positionornatureofwork`}
                                        label="Position/Nature of Work"
                                        inputClass="uppercase"
                                        itemClass="col-span-3"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        <Button
                            type="button"
                            variant={"outline"}
                            className="border-dashed w-full border-2 shadow-none"
                            onClick={() => append(defaultVW)}
                        >
                            <Add className="" />
                            <span>New row</span>
                        </Button>
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

export default VoluntaryWork;
