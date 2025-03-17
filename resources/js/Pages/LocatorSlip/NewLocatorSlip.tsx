import FilePondUploader from "@/Components/FilePondUploader";
import Modal, { ModalProps } from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormCalendar,
    FormInput,
    FormRadioGroup,
    FormRadioItem,
} from "@/Components/ui/form";
import { useToast } from "@/Hooks/use-toast";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { requiredError } from "@/Types/types";
import { isBefore, isToday } from "date-fns";
import React, { useEffect } from "react";
import { z } from "zod";
import { allowedMimeTypes } from "../ServiceRecord/NewCOC";
import TypographySmall from "@/Components/Typography";
import { cn } from "@/Lib/utils";

const LOCATORSLIPOBJECT = z
    .object({
        purposeoftravel: z
            .string()
            .min(1, requiredError("purpose of travel"))
            .default(""),
        destination: z.string().min(1, requiredError("destination")),
        type: z.enum(["business", "time"], {
            required_error: "This field is required",
            invalid_type_error: "This field is required",
        }),
        agenda: z.object({
            date: z.date({ required_error: requiredError("date of event") }),
            transaction: z.string().optional().default(""),
        }),
        memoid: z.number().optional().nullable().default(null),
    })
    .superRefine(({ memoid, type }, ctx) => {
        if (type === "business" && !memoid) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please upload a memo.",
                path: ["memoid"],
            });
        }
    });

type IFormLocatorSlip = z.infer<typeof LOCATORSLIPOBJECT>;

type NewLocatorSlipProps = ModalProps & {};

const NewLocatorSlip: React.FC<NewLocatorSlipProps> = ({ show, onClose }) => {
    const { toast } = useToast();

    const form = useFormSubmit<IFormLocatorSlip>({
        route: route("locatorslip.store"),
        method: "post",
        schema: LOCATORSLIPOBJECT,
        defaultValues: {
            purposeoftravel: "",
            destination: "",
            type: undefined,
            agenda: { date: undefined, transaction: "" },
        },
        async: true,
        callback: {
            onSuccess: (page: any) => {
                toast({
                    status: page.props.flash.status,
                    title: page.props.flash.title,
                    description: page.props.flash.message,
                });

                if (page.props.flash.status === "success") onClose(false);
            },
            onError: (error: any) => {
                if ("0" in error) console.log("error", error[0]);
                else {
                    for (const key in error) {
                        form.setError(key as keyof IFormLocatorSlip, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
        },
    });

    const handleFilepondLoad = (id: number): any => {
        form.setValue(`memoid`, id, {
            shouldDirty: true,
        });
    };

    const handleFilePondRemove = () => {
        form.setValue(`memoid`, null, { shouldDirty: true });
    };

    useEffect(() => {
        if (show) {
            form.reset();
        }
    }, [show]);

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Apply for Locator Slip"
            maxWidth="lg"
        >
            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-4">
                        <FormInput
                            form={form}
                            label="Purpose of travel"
                            name="purposeoftravel"
                        />

                        <FormInput
                            form={form}
                            label="Destination"
                            name="destination"
                        />

                        <FormCalendar
                            form={form}
                            label="Date of event"
                            name="agenda.date"
                            disableDate={(date) => {
                                return (
                                    !isBefore(new Date(), date) &&
                                    !isToday(date)
                                );
                            }}
                        />

                        <FormInput
                            form={form}
                            label="Transaction/Meeting"
                            name="agenda.transaction"
                            required={false}
                        />

                        <FormRadioGroup
                            form={form}
                            label="Please Check"
                            name="type"
                        >
                            <FormRadioItem
                                value="business"
                                label="Official Business"
                            />
                            <FormRadioItem value="time" label="Official Time" />
                        </FormRadioGroup>

                        {form.watch("type") === "business" && (
                            <div className="space-y-2">
                                <TypographySmall
                                    className={cn(
                                        "required",
                                        form.formState.errors.memoid &&
                                            "text-destructive"
                                    )}
                                >
                                    Memo
                                </TypographySmall>
                                <FilePondUploader
                                    route={route("sr.temporary")}
                                    mimetypes={allowedMimeTypes}
                                    handleLoad={handleFilepondLoad}
                                    handleRemove={handleFilePondRemove}
                                />
                                {form.formState.errors.memoid && (
                                    <TypographySmall
                                        className={cn(
                                            "text-[0.8rem] text-destructive"
                                        )}
                                    >
                                        {form.formState.errors.memoid.message}
                                    </TypographySmall>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center mt-10">
                        <Button type="button" variant="outline" onClick={() => onClose(false)}>
                            Cancel
                        </Button>
                        <Button className="ml-auto">Send Application</Button>
                    </div>
                </form>
            </Form>
        </Modal>
    );
};

export default NewLocatorSlip;
