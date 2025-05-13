import Modal, { ModalProps } from "@/Components/Modal";
import { ProfilePhoto } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {
    Combobox,
    ComboboxContent,
    ComboboxItem,
    ComboboxTrigger,
} from "@/Components/ui/combobox";
import {
    Form,
    FormControl,
    FormField,
    FormInput,
    FormInputFile,
    FormItem,
    FormLabel,
    FormMessage,
    FormSelect,
} from "@/Components/ui/form";
import { SelectItem } from "@/Components/ui/select";
import { Skeleton } from "@/Components/ui/skeleton";
import { useToast } from "@/Hooks/use-toast";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { SCHOOLYEAR, User } from "@/Types";
import { requiredError } from "@/Types/types";
import { usePage } from "@inertiajs/react";
import { Fragment, useEffect, useState } from "react";
import { z } from "zod";

const IMPORTSALNSCHEMA = z.object({
    year: z.string().min(1, requiredError("Calendar year")),
    file: z
        .instanceof(File, { message: "Please choose a file." })
        .refine(
            (file) =>
                file.type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            {
                message: "Only excel files are allowed.",
            }
        )
        .refine((file) => file.size <= 10 * 1024 * 1024, {
            message: "File size should not exceed 10MB",
        }),
});
type IFormSALN = z.infer<typeof IMPORTSALNSCHEMA>;

type Props = ModalProps & {};

const ImportSaln = ({ show, onClose }: Props) => {
    const { toast } = useToast();
    const form = useFormSubmit<IFormSALN>({
        route: route("myreports.saln.import"),
        method: "post",
        schema: IMPORTSALNSCHEMA,
        defaultValues: {
            year: "",
        },
        async: true,
        callback: {
            onSuccess: (page: any) => {
                toast({
                    title: page.props.flash.title,
                    description: page.props.flash.message,
                    status: page.props.flash.status,
                });

                if (page.props.flash.status === "success") {
                    onClose(false);
                }
            },
            onError: (error: any) => {
                if ("0" in error)
                    toast({
                        title: "Something went wrong.",
                        description: error[0],
                        status: "error",
                    });
                else {
                    for (const key in error) {
                        form.setError(key as keyof IFormSALN, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
        },
    });

    return (
        <Modal show={show} onClose={onClose} title="Import SALN" maxWidth="lg">
            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-4">
                        <FormSelect
                            form={form}
                            name="year"
                            label="Calendar year"
                            triggerClass="w-full"
                            items={
                                <Fragment>
                                    {Array.from({ length: 50 }).map(
                                        (_, index) => (
                                            <SelectItem
                                                key={index}
                                                value={(
                                                    new Date().getFullYear() -
                                                    index
                                                ).toString()}
                                            >
                                                {(
                                                    new Date().getFullYear() -
                                                    index
                                                ).toString()}
                                            </SelectItem>
                                        )
                                    )}
                                </Fragment>
                            }
                        />

                        <FormInputFile
                            form={form}
                            name="file"
                            label="Choose a file"
                        />
                    </div>

                    <div className="flex items-center mt-8 pt-4 border-t border-border">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onClose(false)}
                        >
                            Cancel
                        </Button>
                        <Button className="ml-auto">Submit</Button>
                    </div>
                </form>
            </Form>
        </Modal>
    );
};

export default ImportSaln;
