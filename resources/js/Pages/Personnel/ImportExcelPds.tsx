import React from "react";
import Modal from "@/Components/Modal";
import {
    Form,
    FormInputFile,
} from "@/Components/ui/form";
import { z } from "zod";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Hooks/use-toast";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { TypographyLarge } from "@/Components/Typography";

const IMPORTEXCELPDSSCHEMA = z.object({
    file: z
        .instanceof(File, {
            message: "Please import excel file format.",
        })
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

type IFormImportExcelPds = z.infer<typeof IMPORTEXCELPDSSCHEMA>;

const ImportExcelPds: React.FC<{
    show: boolean;
    onClose: (close: false) => void;
    user: { id: number; name: string } | null;
    personal?: boolean;
}> = ({ user, show, onClose, personal }) => {
    const { toast } = useToast();

    const form = useFormSubmit<IFormImportExcelPds>({
        route: route("pds.import", [user?.id ?? 0]),
        method: "post",
        schema: IMPORTEXCELPDSSCHEMA,
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
                        title: "Error!",
                        description: error[0],
                        status: "error",
                    });

                console.log(error)
            },
        },
    });

    return (
        <Modal
            show={show}
            onClose={() => null}
            closeable={false}
            dialogStyle="mt-[20vh]"
            maxWidth="lg"
        >
            <TypographyLarge className="font-bold text-xl mb-6 px-1">Import PDS {!personal && `for ${user?.name}`}</TypographyLarge>

            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <FormInputFile
                        form={form}
                        name="file"
                        label="Upload excel file"
                    />

                    <div className="mt-10 flex">
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => onClose(false)}
                            disabled={form.processing}
                        >
                            <span>Cancel</span>
                        </Button>
                        <Button
                            className="gap-3 ml-auto"
                            disabled={form.processing}
                        >
                            <span>Upload</span>
                        </Button>
                    </div>
                </form>
            </Form>
        </Modal>
    );
};

export default ImportExcelPds;
