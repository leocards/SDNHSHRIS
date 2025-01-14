import Modal, { ModalProps } from "@/Components/Modal";
import React, { useEffect } from "react";
import { ANNOUNCEMENT } from "./Announcement";
import { z } from "zod";
import { requiredError } from "@/Types/types";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { useToast } from "@/Hooks/use-toast";
import { Form, FormCalendar, FormInput, FormTextArea } from "@/Components/ui/form";
import { Button } from "@/Components/ui/button";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;

const ANNOUNCEMENTSCHEMA = z.object({
    title: z
        .string()
        .min(1, requiredError("title"))
        .max(255, "Title must not exceed 255 characters.")
        .default(""),
    description: z.string().min(1, requiredError("description")).default(""),
    date: z.date().nullable().default(null),
    time: z
        .string()
        .optional()
        .default(""),
});

type Props = ModalProps & {
    announcement: ANNOUNCEMENT | null;
};

type IFormAnnouncement = z.infer<typeof ANNOUNCEMENTSCHEMA>;

const NewAnnouncement: React.FC<Props> = ({ announcement, show, onClose }) => {
    const { toast } = useToast()

    const form = useFormSubmit<IFormAnnouncement>({
        route: route("announcement.store", [announcement?.id]),
        method: "post",
        schema: ANNOUNCEMENTSCHEMA,
        defaultValues: {
            title: "",
            description: "",
            date: null,
            time: "",
        },
        async: true,
        callback: {
            onSuccess: (page: any) => {
                toast({
                    status: page.props.flash.status,
                    title: page.props.flash.title,
                    description: page.props.flash.message,
                });

                if(page.props.flash.status === "success")
                    onClose(false)
            },
            onError: (error: any) => {
                if ("0" in error) console.log("error", error[0]);
                else {
                    for (const key in error) {
                        form.setError(key as keyof IFormAnnouncement, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
        },
    });


    useEffect(() => {
        if(announcement) {
            form.clearErrors()
            form.setValue('title', announcement.title)
            form.setValue('description', announcement.details.description)
            form.setValue('date', announcement.details.date?new Date(announcement.details.date):null)
            form.setValue('time', announcement.details.time??"")
        } else if(show) {
            form.reset()
        }
    }, [show])

    return (
        <Modal show={show} onClose={onClose} title="New Announcement" maxWidth="lg">
            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-4 min-h-40">
                        <FormInput
                            form={form}
                            name="title"
                            label="Title"
                        />

                        <div className="flex gap-4 [&>div]:w-full">
                            <FormCalendar
                                form={form}
                                name="date"
                                label="Date"
                                required={false}
                            />

                            <FormInput
                                form={form}
                                name="time"
                                label="Time"
                                type="time"
                                required={false}
                            />
                        </div>

                        <FormTextArea
                            form={form}
                            name="description"
                            label="Description"
                            maxHeight={1000}
                            minHeight={200}
                        />
                    </div>

                    <div className="flex items-center mt-8 pt-4 border-t border-border">
                        <Button type="button" variant="outline" onClick={() => onClose(false)}>
                            Cancel
                        </Button>
                        <Button className="ml-auto">Create Announement</Button>
                    </div>
                </form>
            </Form>
        </Modal>
    );
};

export default NewAnnouncement;
