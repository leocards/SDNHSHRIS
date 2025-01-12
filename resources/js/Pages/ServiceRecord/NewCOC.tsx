import FilePondUploader from "@/Components/FilePondUploader";
import Modal, { ModalProps } from "@/Components/Modal";
import TypographySmall from "@/Components/Typography";
import { Button } from "@/Components/ui/button";
import { Form, FormCalendar, FormInput, FormSelect } from "@/Components/ui/form";
import { SelectItem } from "@/Components/ui/select";
import { useToast } from "@/Hooks/use-toast";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { cn } from "@/Lib/utils";
import { requiredError } from "@/Types/types";
import { Fragment, useEffect, useState } from "react";
import { z } from "zod";

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

const COCSCHEMA = z
    .object({
        name: z.string().optional().default(""),
        memofileid: z.number().nullable().default(null),
        coafileid: z.number().nullable().default(null),
        dtrfileid: z.number().nullable().default(null),
        from: z.date().nullable().default(null),
        to: z.date().nullable().default(null),
        session: z
            .enum(["halfday", "fullday"], {
                invalid_type_error: requiredError("session"),
            })
            .nullable(),
        numofhours: z
            .string()
            .min(1, requiredError("number of hours"))
            .default(""),
    })
    .superRefine(({ memofileid, coafileid, dtrfileid, from, to }, ctx) => {
        if (!memofileid) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: requiredError("MEMO"),
                path: ["memofileid"],
            });
        }

        if (!coafileid) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: requiredError("Certificate of Attendance"),
                path: ["coafileid"],
            });
        }

        if (!dtrfileid) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: requiredError("DTR"),
                path: ["dtrfileid"],
            });
        }

        if (!from) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: requiredError('"from"'),
                path: ["from"],
            });
        }

        if (to && from) {
            from.setHours(0, 0, 0, 0);
            to.setHours(0, 0, 0, 0);

            if (to.getTime() === from.getTime()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "'from' and 'to' must not be the same.",
                    path: ["to"],
                });
            }

            if (to.getTime() < from.getTime()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "'to' must be ahead of 'from'.",
                    path: ["to"],
                });
            }
        }
    });

type IFormCOC = z.infer<typeof COCSCHEMA>;

type Props = ModalProps;

const NewCOC: React.FC<Props> = ({ show, onClose }) => {
    const { toast } = useToast();
    const [errors, setErrors] = useState<any>(null);

    const form = useFormSubmit<IFormCOC>({
        route: route("sr.store.coc"),
        method: "post",
        schema: COCSCHEMA,
        defaultValues: {
            name: "",
            memofileid: null,
            coafileid: null,
            dtrfileid: null,
            from: null,
            to: null,
            numofhours: "",
        },
        async: true,
        callback: {
            onSuccess: (page: any) => {
                toast({
                    title: page.props.flash.title,
                    description: page.props.flash.message,
                    status: page.props.flash.status,
                });

                if (page.props.flash.status === "success") onClose(false);
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
                        form.setError(key as keyof IFormCOC, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
        },
    });

    const watchSession = form.watch('session')

    useEffect(() => {
        if(watchSession === "halfday") {
            form.setValue('to', null)
        }
    }, [watchSession])

    useEffect(() => {
        if (!show) {
            setTimeout(() => {
                form.reset();
            }, 500);
        }
    }, [show]);

    useEffect(() => {
        const formErrors = form.formState.errors;

        if (formErrors) {
            setErrors(formErrors);
        }
    }, [form.formState.errors]);

    return (
        <Modal show={show} onClose={onClose} title="Upload COC">
            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-4">
                        <FormInput
                            form={form}
                            name="name"
                            label="Name/Title"
                            required={false}
                            placeholder="(Optional)"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormCalendar
                                form={form}
                                name="from"
                                label="From"
                            />
                            <FormCalendar
                                form={form}
                                name="to"
                                label="To"
                                required={false}
                                disabled={watchSession === "halfday"}
                                triggerClass="disabled:opacity-100 disabled:text-foreground/20"
                            />
                            <FormSelect
                                form={form}
                                name={`session`}
                                label="Session"
                                displayValue={(watchSession === "halfday" ? "Half-day":!watchSession ? "" :"Full-day")}
                                items={
                                    <Fragment>
                                        <SelectItem value="halfday" children="Half-day" />
                                        <SelectItem value="fullday" children="Full-day" />
                                    </Fragment>
                                }
                            />
                            <FormInput
                                form={form}
                                name="numofhours"
                                label="Number of hours"
                            />
                        </div>

                        <div className="space-y-2">
                            <TypographySmall
                                className={cn(
                                    "required",
                                    errors?.coafileid && "text-destructive"
                                )}
                            >
                                Certificate of Attendance
                            </TypographySmall>
                            <FilePondUploader
                                route={route("sr.temporary")}
                                mimetypes={allowedMimeTypes}
                                handleLoad={(id) => {
                                    form.setValue("coafileid", id, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    });
                                }}
                                handleRemove={() => {
                                    form.setValue("coafileid", null, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    });
                                }}
                            />
                            {errors?.coafileid && (
                                <TypographySmall
                                    className={cn(
                                        "text-[0.8rem] text-destructive"
                                    )}
                                >
                                    {errors?.coafileid?.message}
                                </TypographySmall>
                            )}
                        </div>

                        <div className="space-y-2">
                            <TypographySmall
                                className={cn(
                                    "required",
                                    errors?.dtrfileid && "text-destructive"
                                )}
                            >
                                DTR
                            </TypographySmall>
                            <FilePondUploader
                                route={route("sr.temporary")}
                                mimetypes={allowedMimeTypes}
                                handleLoad={(id) => {
                                    form.setValue("dtrfileid", id, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    });
                                }}
                                handleRemove={() => {
                                    form.setValue("dtrfileid", null, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    });
                                }}
                            />
                            {errors?.dtrfileid && (
                                <TypographySmall
                                    className={cn(
                                        "text-[0.8rem] text-destructive"
                                    )}
                                >
                                    {errors?.dtrfileid?.message}
                                </TypographySmall>
                            )}
                        </div>

                        <div className="space-y-2">
                            <TypographySmall
                                className={cn(
                                    "required",
                                    errors?.memofileid && "text-destructive"
                                )}
                            >
                                MEMO
                            </TypographySmall>
                            <FilePondUploader
                                route={route("sr.temporary")}
                                mimetypes={allowedMimeTypes}
                                handleLoad={(id) => {
                                    form.setValue("memofileid", id, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    });
                                }}
                                handleRemove={() => {
                                    form.setValue("memofileid", null, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    });
                                }}
                            />
                            {errors?.memofileid && (
                                <TypographySmall
                                    className={cn(
                                        "text-[0.8rem] text-destructive"
                                    )}
                                >
                                    {errors?.memofileid?.message}
                                </TypographySmall>
                            )}
                        </div>
                    </div>

                    <div className="mt-7 pt-4 flex items-center gap-4 border-t border-border">
                        <Button
                            type="button"
                            variant="outline"
                            className="mr-auto"
                            onClick={() => onClose(false)}
                        >
                            Cancel
                        </Button>
                        <Button className="px-8">Save</Button>
                    </div>
                </form>
            </Form>
        </Modal>
    );
};

export default NewCOC;
