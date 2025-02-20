import FilePondUploader from "@/Components/FilePondUploader";
import Modal, { ModalProps } from "@/Components/Modal";
import TypographySmall from "@/Components/Typography";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormCalendar,
    FormInput,
    FormSelect,
} from "@/Components/ui/form";
import { SelectItem } from "@/Components/ui/select";
import { useToast } from "@/Hooks/use-toast";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { cn } from "@/Lib/utils";
import { requiredError } from "@/Types/types";
import { Fragment, useEffect, useState } from "react";
import { z } from "zod";
import COCForm from "./COCPartial/COCForm";
import { useFieldArray } from "react-hook-form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Add } from "iconsax-react";

export const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
];

const COC = z
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
        numofhours: z.string().optional().default(""),
    })
    .superRefine(
        (
            { memofileid, coafileid, dtrfileid, from, to, session, numofhours },
            ctx
        ) => {
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
                    message: requiredError("Certificate of Appearance"),
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

            if(!session)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: requiredError("session"),
                    path: ["session"],
                });

            if (session === "halfday" && !numofhours)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: requiredError("number of hours"),
                    path: ["numofhours"],
                });
        }
    );

const defaultCOC = {
    name: "",
    memofileid: null,
    coafileid: null,
    dtrfileid: null,
    from: null,
    to: null,
    numofhours: "",
    session: null,
};

const COCSCHEMA = z.object({ coc: z.array(COC) });

type IFormCOC = z.infer<typeof COCSCHEMA>;

type Props = ModalProps;

const NewCOC: React.FC<Props> = ({ show, onClose }) => {
    const { toast } = useToast();

    const form = useFormSubmit<IFormCOC>({
        route: route("sr.store.coc"),
        method: "post",
        schema: COCSCHEMA,
        defaultValues: { coc: [defaultCOC] },
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

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "coc",
    });

    useEffect(() => {
        if (!show) {
            setTimeout(() => {
                form.reset();
            }, 500);
        }
    }, [show]);

    return (
        <Modal show={show} onClose={onClose} title="Upload COC">
            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <COCForm key={field.id} form={form} index={index} />
                        ))}
                    </div>

                    <div className="mt-4">
                        <Button
                            type="button"
                            variant={"outline"}
                            className="border-dashed w-full border-2 shadow-none"
                            onClick={() => append(defaultCOC)}
                        >
                            <Add className="" />
                            <span>New row</span>
                        </Button>
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
