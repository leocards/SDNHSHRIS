import Modal, { ModalProps } from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { useToast } from "@/Hooks/use-toast";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { cn } from "@/Lib/utils";
import { User } from "iconsax-react";
import { ImageUp, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

const PROFILEPHOTOSCHEMA = z.object({
    image: z
        .instanceof(File, { message: "Please choose a file." })
        .refine((file) => allowedMimeTypes.includes(file.type), {
            message: "Only JPEG, JPG, and PNG files are allowed.",
        })
        .refine((file) => file.size <= 10 * 1024 * 1024, {
            message: "File size should not exceed 10MB",
        }),
});

type IFormProfilePhoto = z.infer<typeof PROFILEPHOTOSCHEMA>;

type Props = ModalProps & {};

const UploadProfilePhoto = ({ show, onClose }: Props) => {
    const { toast } = useToast();
    const form = useFormSubmit<IFormProfilePhoto>({
        route: route("profile.profile.upload"),
        method: "post",
        schema: PROFILEPHOTOSCHEMA,
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
        },
    });
    const avatarRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const imageFile = form.watch("image");

    useEffect(() => {
        if (imageFile instanceof File) {
            const previewUrl = URL.createObjectURL(imageFile);
            console.log("Preview URL created:", previewUrl);
            setPreview(previewUrl);

            return () => URL.revokeObjectURL(previewUrl);
        }
        if (!imageFile) {
            setPreview(null);
        }
    }, [imageFile]);

    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="">
                                        <Input
                                            type="file"
                                            accept="image/jpg,image/jpeg,image/png"
                                            className="form-input hidden"
                                            onBlur={field.onBlur}
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];
                                                if (file) {
                                                    field.onChange(file);
                                                }
                                            }}
                                            name={field.name}
                                            ref={(el) => {
                                                field.ref(el);
                                                avatarRef.current = el;
                                            }}
                                        />

                                        <div className="mx-auto flex flex-col rounded-full size-52 bg-accen border-4 overflow-hidden">
                                            <img
                                                src={preview ? preview : ""}
                                                alt=""
                                                onLoad={(e) => console.log(e)}
                                                className={cn(
                                                    "object-cover w-full h-full",
                                                    !preview && "hidden"
                                                )}
                                            />
                                            {!preview && (
                                                <User
                                                    className="size-20 mx-auto my-auto opacity-15"
                                                    strokeWidth={1.2}
                                                />
                                            )}
                                        </div>
                                        <div className="mx-auto w-fit mt-3 flex gap-2">
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="outline"
                                                className="size-8 hover:bg-transparent"
                                                onClick={() => form.reset()}
                                                disabled={!!!preview}
                                            >
                                                <X className="size-5" />
                                            </Button>

                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="outline"
                                                className="size-8 hover:bg-transparent"
                                                onClick={() =>
                                                    avatarRef.current?.click()
                                                }
                                            >
                                                <ImageUp className="size-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-center" />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-between mt-10">
                        <Button
                            type="button"
                            variant={"outline"}
                            onClick={() => onClose(false)}
                        >
                            <span>Cancel</span>
                        </Button>
                        <Button>
                            <span>Upload</span>
                        </Button>
                    </div>
                </form>
            </Form>
        </Modal>
    );
};

export default UploadProfilePhoto;
