import Modal, { ModalProps } from "@/Components/Modal";
import { useToast } from "@/Hooks/use-toast";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { requiredError } from "@/Types/types";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { usePage } from "@inertiajs/react";
import { useFieldArray } from "react-hook-form";
import { Form, FormCalendar, FormInput, FormSelect } from "@/Components/ui/form";
import { Button } from "@/Components/ui/button";
import { Add, Trash } from "iconsax-react";
import TypographySmall from "@/Components/Typography";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import { SelectItem } from "@/Components/ui/select";
import { cn } from "@/Lib/utils";

const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
];

const SERVICERECORD = z.object({
    name: z
        .string()
        .min(1, requiredError("certificate name"))
        .default(""),
    fileid: z.number().nullable(),
    venue: z.string().min(1, requiredError("venue")),
    organizer: z.string().min(1, requiredError("organizer")),
    session: z.enum(['halfday', 'fullday'], {
        invalid_type_error: requiredError('session')
    }).nullable(),
    from: z.date({ required_error: requiredError("from") }).nullable(),
    to: z.date().optional().nullable().default(null),
}).superRefine((sr, ctx) => {
    if(!sr.fileid) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please provide certificate.",
            path: ['fileid']
        })
    }

    if(!sr.session) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: requiredError('session'),
            path: ['session']
        })
    }

    if(!sr.from) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: requiredError('"from"'),
            path: ['from']
        })
    }

    if(sr.to && sr.from) {
        sr.from.setHours(0, 0, 0, 0);
        sr.to.setHours(0, 0, 0, 0);

        if(sr.to.getTime() === sr.from.getTime()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "'from' and 'to' must not be the same.",
                path: ['to']
            })
        }

        if(sr.to.getTime() < sr.from.getTime()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "'to' must be ahead of 'from'.",
                path: ['to']
            })
        }
    }
});

const defaultSR = {
    name: "",
    fileid: null,
    venue: "",
    organizer: "",
    from: null,
    to: null,
    session: null
}

const SERVICERECORDSCHEMA = z.object({ sr: z.array(SERVICERECORD) });

type IFormServiceRecord = z.infer<typeof SERVICERECORDSCHEMA>

type Props = ModalProps & {}

type ServiceRecordCardProps = {
    form: any;
    index: number;
    onRemove: CallableFunction;
}

const NewCertificate: React.FC<Props> = ({ show, onClose }) => {
    const { toast } = useToast()

    const form = useFormSubmit<IFormServiceRecord>({
        route: route("sr.store"),
        method: "post",
        schema: SERVICERECORDSCHEMA,
        defaultValues: {
            sr: [defaultSR],
        },
        async: true,
        callback: {
            onSuccess: (page: any) => {
                toast({
                    title: page.props.flash.title,
                    description: page.props.flash.message,
                    status: page.props.flash.status,
                });

                if(page.props.flash.status === "success")
                    onClose(false)
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
                        form.setError(key as keyof IFormServiceRecord, {
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
        name: "sr"
    })

    useEffect(() => {
        if(!show) {
            setTimeout(() => form.reset(), 500)
        }
    }, [show])

    return (
        <Modal
            show={show}
            onClose={onClose}
            maxWidth="3xl"
            title="Upload Certificate"
        >
            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-4">
                    {fields.map((field, index) => (
                        <ServiceRecordCard
                            key={field.id}
                            form={form}
                            index={index}
                            onRemove={() => remove(index)}
                        />
                    ))}
                    </div>

                    <div className="mt-4">
                        <Button
                            type="button"
                            variant={"outline"}
                            className="border-dashed w-full border-2 shadow-none"
                            onClick={() => append(defaultSR)}
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

const ServiceRecordCard: React.FC<ServiceRecordCardProps> = ({
    form, index, onRemove
}) => {
    const page = usePage()
    const pondRef = useRef<FilePond|null>(null)

    const watchSession = form.watch(`sr.${index}.session`)

    registerPlugin(
        FilePondPluginFileValidateType,
        FilePondPluginFileValidateSize
    )

    const handleFilepondLoad = (load: any): any => {
        const response = JSON.parse(load)

        if(response.status === 'success')
            form.setValue(`sr.${index}.fileid`, response.file.id, { shouldDirty: true })

        return null
    }

    const handleFilepondError = (error: any) => {
        // console.log(error)
    }

    const handleFilePondRemove = () => {
        form.setValue(`sr.${index}.fileid`, null, { shouldDirty: true })
    }

    useEffect(() => {
        if(watchSession === "halfday") {
            form.setValue(`sr.${index}.to`, null)
        }
    }, [watchSession])

    return (
        <div className={cn("relative p-4 border border-border rounded-md space-y-3", form.formState.errors?.sr?.[0] && "!border-destructive")}>
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onRemove()}
                className="size-6 absolute top-1 right-1 text-destructive"
            >
                <Trash className="[&_path]:stroke-2 !size-4" />
            </Button>
            <div className="grid grid-cols-2 gap-4">
                <FormInput
                    form={form}
                    name={`sr.${index}.name`}
                    label="Certificate Name"
                />

                <FormInput
                    form={form}
                    name={`sr.${index}.organizer`}
                    label="Organizer"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormInput
                    form={form}
                    name={`sr.${index}.venue`}
                    label="Venue"
                />

                <FormSelect
                    form={form}
                    name={`sr.${index}.session`}
                    label="Session"
                    displayValue={(watchSession === "halfday" ? "Half-day":watchSession==="fullday"?"Whole-day":"")}
                    items={
                        <Fragment>
                            <SelectItem value="halfday" children="Half-day" />
                            <SelectItem value="fullday" children="Whole-day" />
                        </Fragment>
                    }
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormCalendar
                    form={form}
                    name={`sr.${index}.from`}
                    label="From"
                />
                <FormCalendar
                    form={form}
                    name={`sr.${index}.to`}
                    label="To"
                    required={false}
                    disabled={watchSession === 'halfday'}
                    triggerClass="disabled:opacity-100 disabled:text-foreground/20"
                />
            </div>

            <div className="size-full pt-2">
                <FilePond
                    ref={pondRef}
                    name="file"
                    maxFiles={1}
                    className="filepond--pane filepond--drop-label"
                    credits={false}
                    maxFileSize={"10mb"}
                    allowFileTypeValidation
                    acceptedFileTypes={allowedMimeTypes}
                    server={{
                        timeout: 7000,
                        process: {
                            url: route('sr.temporary'),
                            method: "POST",
                            headers: {
                                'X-CSRF-TOKEN': page.props.ct,
                            },
                            withCredentials: false,
                            onload: handleFilepondLoad,
                            onerror: handleFilepondError,
                        },
                    }}
                    onremovefile={handleFilePondRemove}
                />
                {
                    (form.formState.errors?.sr?.[index]?.fileid) && (
                        <TypographySmall className="text-destructive font-medium">{form.formState.errors.sr[index].fileid.message}</TypographySmall>
                    )
                }
            </div>

        </div>
    )
}

export default NewCertificate;
