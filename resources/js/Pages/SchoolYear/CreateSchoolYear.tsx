import Modal, { ModalProps } from "@/Components/Modal";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { Button } from "@/Components/ui/button";
import { Form, FormCalendar } from "@/Components/ui/form";
import { useToast } from "@/Hooks/use-toast";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { requiredError } from "@/Types/types";
import { usePage } from "@inertiajs/react";
import React, { useEffect } from "react";
import { z } from "zod";

const SCHOOLYEARSCHEMA = z
    .object({
        start: z.date({ required_error: requiredError("academic year start") }),
        end: z.date({ required_error: requiredError("academic year end") }),
        resume: z.date({
            required_error: requiredError("resumption of classes"),
        }),
    })
    .superRefine(({ start, end, resume }, ctx) => {
        if (end < start)
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                    "The academic year end must be later than the academic year start.",
                path: ["end"],
            });
        if (resume < end)
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                    "Classes must resume earlier than the academic year ends.",
                path: ["resume"],
            });
    })

type IFormSchoolYear = z.infer<typeof SCHOOLYEARSCHEMA>;

const CreateSchoolYear: React.FC<ModalProps & { edit: boolean }> = ({ show, edit, onClose }) => {
    const { toast } = useToast();
    const { setProcess } = useProcessIndicator();
    const { id, start, end, resume, schoolyear } = usePage().props.schoolyear ?? {
        id: null,
        start: "",
        end: "",
        resume: "",
        schoolyear: "",
    };

    const form = useFormSubmit<IFormSchoolYear>({
        schema: SCHOOLYEARSCHEMA,
        route: (edit && schoolyear)
            ? route("school-year.update", [id])
            : route("school-year.store"),
        method: edit?"put":"post",
        defaultValues: {
            start: edit && schoolyear ? new Date(start) : undefined,
            end: edit && schoolyear ? new Date(end) : undefined,
            resume: edit && schoolyear ? new Date(resume) : undefined,
        },
        callback: {
            onBefore: () => {
                setProcess(true);
            },
            onSuccess: (page: any) => {
                toast({
                    status: page.props.flash.status,
                    title: page.props.flash.title,
                    description: page.props.flash.message,
                });

                if (page.props.flash.status === "success") {
                    onClose();
                }
            },
            onError: (error: any) => {
                if("0" in error) {
                    toast({
                        status: "error",
                        title: "Failed to process school year",
                        description: error["0"],
                    });
                } else {
                    for (const key in error) {
                        form.setError(key as keyof IFormSchoolYear, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
            onFinish: () => { setProcess(false) }
        },
    });

    useEffect(() => {
        if(edit && schoolyear) {
            form.setValue("start", new Date(start));
            form.setValue("end", new Date(end));
            form.setValue("resume", new Date(resume));
        } else {
            form.reset();
        }

    }, [show]);

    return (
        <Modal
            onClose={onClose}
            show={show}
            title={(edit ? "Update": "Create") + " School Year"}
            maxWidth="lg"
            description={!schoolyear && "Please create a school year to start using the app."}
        >
            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-3">
                        <FormCalendar
                            form={form}
                            label="Academic Year Start"
                            name="start"
                            required
                        />
                        <FormCalendar
                            form={form}
                            label="Academic Year End"
                            name="end"
                            required
                        />
                        <FormCalendar
                            form={form}
                            label="Resumption of classes"
                            name="resume"
                            required
                        />
                    </div>

                    <div className="flex justify-between mt-7">
                        <Button
                            type="button"
                            variant="outline"
                            className="px-8"
                            onClick={() => onClose(false)}
                            disabled={!schoolyear}
                        >
                            Cancel
                        </Button>
                        <Button variant="default" className="px-8">
                            {edit ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </Form>
        </Modal>
    );
};

export default CreateSchoolYear;
