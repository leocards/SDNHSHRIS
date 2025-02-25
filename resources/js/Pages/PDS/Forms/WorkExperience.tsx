import { TypographyLarge } from "@/Components/Typography";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import {
    defaultWE,
    IFormWorkExperience,
    WORKEXPERIENCESCHEMA,
    WORKEXPERIENCETYPE,
} from "../Types/WorkExperience";
import {
    Form,
    FormCalendar,
    FormControl,
    FormField,
    FormInput,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { useFieldArray } from "react-hook-form";
import { Add, Trash } from "iconsax-react";
import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/Hooks/use-toast";
import { isValidDate } from "@/Types/types";

type WorkExperienceProps = {
    data: WORKEXPERIENCETYPE | null
}

const WorkExperience: React.FC<WorkExperienceProps> = ({ data }) => {
    const { toast } = useToast()

    const form = useFormSubmit<IFormWorkExperience>({
        route: data && data.length !== 0 ? route('pds.update.we') : route("pds.store.we"),
        method: "POST",
        schema: WORKEXPERIENCESCHEMA,
        values: { we: data ? data.map((we) => ({
            weid: we.id,
            inclusivedates: {
                from: isValidDate(we.inlcusivedates.from) ? new Date(we.inlcusivedates.from) : undefined,
                to: we.inlcusivedates.to == "Present" ? "Present" : isValidDate(we.inlcusivedates.to) ? new Date(we.inlcusivedates.to) : undefined,
            },
            positiontitle: we.positiontitle,
            department: we.department,
            monthlysalary: we.monthlysalary,
            salarygrade: we.salarygrade??"",
            statusofappointment: we.statusofappointment,
            isgovernment: we.isgovernment,
        })) : [], deletedWE: [] },
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
                        form.setError(key as keyof IFormWorkExperience, {
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
        name: "we",
    });

    return (
        <div>
            <TypographyLarge className="italic my-3 uppercase">
                V. Work Experience
                <div className="text-sm normal-case not-italic text-foreground/80">
                    (Include private employment. Start from your recent work)
                    Description of duties should be indicated in the attached
                    Work Experience sheet.
                </div>
            </TypographyLarge>

            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="border border-border rounded-md shadow-sm p-4 relative"
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    className="size-6 absolute top-1 right-1 text-destructive"
                                >
                                    <Trash className="[&_path]:stroke-2 !size-4" />
                                </Button>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        form={form}
                                        name={`we.${index}.positiontitle`}
                                        label={
                                            <span>
                                                Position Title{" "}
                                                <span className="text-xs text-foreground/70">
                                                    (Write in full/Do not
                                                    abbreviate)
                                                </span>{" "}
                                            </span>
                                        }
                                        itemClass="col-span-2"
                                        inputClass="uppercase"
                                    />
                                    <FormCalendar
                                        form={form}
                                        name={`we.${index}.inclusivedates.from`}
                                        label="From"
                                        placeholder="MM/DD/YYYY"
                                        triggerClass="uppercase"
                                    />
                                    <FormCalendar
                                        form={form}
                                        name={`we.${index}.inclusivedates.to`}
                                        label="To"
                                        placeholder="MM/DD/YYYY or PRESENT"
                                        triggerClass="uppercase"
                                        withPresent
                                    />

                                    <FormInput
                                        form={form}
                                        name={`we.${index}.department`}
                                        label={
                                            <div>
                                                <div className="required">Department/Agency/Office/Company</div>
                                                <div className="text-xs text-foreground/70">
                                                    (Write in full/Do not
                                                    abbreviate)
                                                </div>{" "}
                                            </div>
                                        }
                                        inputClass="uppercase"
                                        required={false}
                                    />

                                    <FormInput
                                        form={form}
                                        name={`we.${index}.salarygrade`}
                                        label={
                                            <div>
                                                <div className="required">Salary/Job/Pay Grade</div>
                                                <div className="text-xs text-foreground/70">
                                                    (if applicable) & Step
                                                    (Format "00-0")/Increment
                                                </div>{" "}
                                            </div>
                                        }
                                        inputClass="uppercase"
                                        required={false}
                                    />
                                </div>
                                <div className="grid grid-cols-[1fr,1fr,auto] gap-4 mt-4">
                                    <FormInput
                                        form={form}
                                        name={`we.${index}.monthlysalary`}
                                        label="Monthly salary"
                                        inputClass="uppercase"
                                        type="currency"
                                    />
                                    <FormInput
                                        form={form}
                                        name={`we.${index}.statusofappointment`}
                                        label="Status of Appointment"
                                        inputClass="uppercase"
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`we.${index}.isgovernment`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Gov't service (Y/N)
                                                </FormLabel>
                                                <FormControl>
                                                    <div {...field} className="formInput flex items-center gap-1 border border-border rounded-md p-1">
                                                        <Button
                                                            type="button"
                                                            className="h-full rounded-sm min-w-20 grow p-0"
                                                            variant={
                                                                field.value ===
                                                                "y"
                                                                    ? "default"
                                                                    : "ghost"
                                                            }
                                                            onClick={() =>
                                                                form.setValue(`we.${index}.isgovernment`, "y", { shouldDirty: true, shouldValidate: true, shouldTouch: true })
                                                            }
                                                        >
                                                            Yes
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            className="h-full rounded-sm min-w-20 grow p-0"
                                                            variant={
                                                                field.value ===
                                                                "n"
                                                                    ? "default"
                                                                    : "ghost"
                                                            }
                                                            onClick={() =>
                                                                form.setValue(`we.${index}.isgovernment`, "n", { shouldDirty: true, shouldValidate: true, shouldTouch: true })
                                                            }
                                                        >
                                                            No
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
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
                            onClick={() => append(defaultWE)}
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

export default WorkExperience;
