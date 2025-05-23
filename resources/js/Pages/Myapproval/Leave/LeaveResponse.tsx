import Modal, { ModalProps } from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import { Form, FormCalendar, FormTextArea } from "@/Components/ui/form";
import { useToast } from "@/Hooks/use-toast";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { cn } from "@/Lib/utils";
import { APPLICATIONFORLEAVETYPES } from "@/Pages/Leave/PDF/type";
import { APPROVALTYPE } from "@/Types";
import { requiredError } from "@/Types/types";
import { usePage } from "@inertiajs/react";
import { isWeekend } from "date-fns";
import React, { Fragment, useEffect } from "react";
import { z } from "zod";

const RESPONSESCHEMA = z
    .object({
        response: z.enum(["approved", "disapproved"]),
        message: z.string().optional().default(""),
        detailsofleave: z.string().optional().default(''),
        from: z.date().nullable().default(null),
        to: z.date().optional().nullable().default(null)
    })
    .superRefine((res, ctx) => {
        if (res.response === "disapproved" && !res.message) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: requiredError("message"),
                path: ["message"],
            });
        }

        if(['monitization', 'terminal'].includes(res.detailsofleave) && !res.from) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: requiredError("from"),
                path: ["from"],
            });
        }
    });

type IFormResponse = z.infer<typeof RESPONSESCHEMA>;

type Props = ModalProps & {
    leave: APPLICATIONFORLEAVETYPES;
    response: "approved" | "disapproved" | null;
};

const LeaveResponse: React.FC<Props> = ({ leave, response, show, onClose }) => {
    const { toast } = useToast();

    const form = useFormSubmit<IFormResponse>({
        route: route("myapproval.leave.approval", [leave.id]),
        method: "post",
        schema: RESPONSESCHEMA,
        defaultValues: {
            response: undefined,
            message: '',
            detailsofleave: leave.details??'',
            from: null,
            to: null
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
                        form.setError(key as keyof IFormResponse, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
        },
    });

    const watchDateFrom = form.watch('from')

    useEffect(() => {
        if(watchDateFrom) {
            if(parseInt(leave.daysapplied) > 1) {
                function addBusinessDays(startDate: Date, daysToAdd: number): Date {
                    const resultDate = new Date(startDate);

                    for (let i = 0; i < daysToAdd; ) {
                        resultDate.setDate(resultDate.getDate() + 1);
                        const dayOfWeek = resultDate.getDay();

                        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
                            i++; // Only count business days
                        }
                    }

                    return resultDate;
                }

                let days = new Date(watchDateFrom)
                form.setValue('to', addBusinessDays(days, (parseInt(leave.daysapplied) - 1)))
            }
        } else {
            form.setValue('to', null)
        }
    }, [watchDateFrom])

    useEffect(() => {
        if (show) {
            form.setValue("response", response ?? "approved");
        } else {
            form.reset();
        }
    }, [show]);

    return (
        <Modal show={show} onClose={onClose} title="Leave Response" maxWidth="lg">
            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    {response === "disapproved" ? (
                        <DisapproveResponse form={form} leave={leave} />
                    ) : (
                        <div>
                            <div>
                                Confirm Application for leave of{" "}
                                {leave?.firstname + " " + leave?.lastname} ?
                            </div>

                            {['monitization', 'terminal'].includes(leave.details) && <div className="mt-4 space-y-3">
                                <FormCalendar
                                    form={form}
                                    name="from"
                                    label="From"
                                    disableDate={(date) => isWeekend(date)}
                                />
                                <FormCalendar
                                    form={form}
                                    name="to"
                                    label="To"
                                    required={false}
                                    disabled
                                />
                            </div>}
                        </div>
                    )}

                    <div className="flex items-center mt-8 pt-4 border-t border-border">
                        <Button type="button" variant="outline" onClick={() => onClose(false)}>
                            Cancel
                        </Button>
                        <Button
                            className={cn(
                                "ml-auto capitalize",
                                response === "disapproved"
                                    ? "bg-destructive hover:bg-destructive/90"
                                    : "bg-green-600 hover:bg-green-500"
                            )}
                        >
                            {response}
                        </Button>
                    </div>
                </form>
            </Form>
        </Modal>
    );
};

const DisapproveResponse = ({
    form,
    leave,
}: {
    form: any;
    leave: APPLICATIONFORLEAVETYPES;
}) => {
    const user = usePage().props.auth.user;

    return (
        <Fragment>
            <div className="mb-4">
                Dear {leave?.firstname + " " + leave?.lastname},
            </div>

            <div className="mb-4">
                We regret to inform you that your application for leave has been
                rejected.
            </div>

            <div className="mb-4">
                <FormTextArea
                    form={form}
                    name="message"
                    label="Message"
                    minHeight={100}
                    maxHeight={500}
                />
            </div>

            <div className="mb-4">
                Thank you for your understanding and cooperation.
            </div>

            <div className="mb-4">{user.firstname + " " + user.lastname}</div>
        </Fragment>
    );
};

export default LeaveResponse;
