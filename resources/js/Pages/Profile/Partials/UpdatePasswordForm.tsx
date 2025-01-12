import { Button } from "@/Components/ui/button";
import { Form, FormInput } from "@/Components/ui/form";
import { useToast } from "@/Hooks/use-toast";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { cn } from "@/Lib/utils";
import { requiredError } from "@/Types/types";
import { PasswordCheck } from "iconsax-react";
import { FormEventHandler, useRef } from "react";
import { z } from "zod";

const PASSWORDSCHEMA = z.object({
    current_password: z.string().min(1, requiredError("current password")),
    password: z.string().min(1, requiredError("password")),
    password_confirmation: z
        .string()
        .min(1, requiredError("password confirmation")),
});

type IFormPassword = z.infer<typeof PASSWORDSCHEMA>;

export default function UpdatePasswordForm({
    className = "",
}: {
    className?: string;
}) {
    const { toast } = useToast()

    const { onSubmit, ...form } = useFormSubmit<IFormPassword>({
        schema: PASSWORDSCHEMA,
        route: route("password.update"),
        method: "put",
        async: true,
        callback: {
            onSuccess: (page: any) => {
                toast({
                    status: page.props.flash.status,
                    title: page.props.flash.title,
                    description: page.props.flash.message,
                });
            },
            onError: (error: any) => {
                if("0" in error)
                    console.log('error', error[0])
                else {
                    for (const key in error) {
                        form.setError(key as keyof IFormPassword, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            }
        },
        defaultValues: {
            current_password: "",
            password: "",
            password_confirmation: ""
        }
    });

    return (
        <section className={cn("mx-auto", className)}>
            <header>
                <h2 className="text-lg font-medium">Update Password</h2>

                <p className="mt-1 text-sm">
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>
            <Form {...form}>
                <form onSubmit={onSubmit} className="mt-6 space-y-6">
                    <div>
                        <FormInput
                            form={form}
                            label="Current Password"
                            name="current_password"
                            password
                            icon={<PasswordCheck className="size-5" />}
                        />
                    </div>

                    <div>
                        <FormInput
                            form={form}
                            label="Password"
                            name="password"
                            password
                            icon={<PasswordCheck className="size-5" />}
                        />

                        <div className='mt-2'>
                            <p className="mt-1 text-sm text-foreground/60">
                                Make sure your password contains the following:
                            </p>
                            <p className="mt-1 text-sm text-foreground/60">
                                <span>&#8226;</span> Must be at least 8 characters long.
                            </p>
                            <p className="mt-1 text-sm text-foreground/60">
                                <span>&#8226;</span> Must contains at least one uppercase and lowercase letter.
                            </p>
                            <p className="mt-1 text-sm text-foreground/60">
                                <span>&#8226;</span> Must contain numbers.
                            </p>
                            <p className="mt-1 text-sm text-foreground/60">
                                <span>&#8226;</span> Must contain symbols ex. & $ * @ etc..
                            </p>
                            <p className="mt-1 text-sm text-foreground/60">
                                <span>&#8226;</span> Avoid common password.
                            </p>
                        </div>
                    </div>

                    <div>
                        <FormInput
                            form={form}
                            label="Password Confirm"
                            name="password_confirmation"
                            password
                            icon={<PasswordCheck className="size-5" />}
                        />
                    </div>

                    <div className="flex">
                        <Button className="ml-auto">Save changes</Button>
                    </div>
                </form>
            </Form>
        </section>
    );
}
