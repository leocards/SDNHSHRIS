import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { requiredError } from "@/Types/types";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import {
    Form,
    FormControl,
    FormField,
    FormInput,
    FormItem,
    FormLabel,
} from "@/Components/ui/form";
import { AtSign, Check, Lock } from "lucide-react";
import { BorderBeam } from "@/Components/ui/border-beam";
import AnimatedShinyText from "@/Components/ui/animated-shiny-text";
import { PasswordCheck } from "iconsax-react";
import { useToast } from "@/Hooks/use-toast";
import sdnhslogo from "@/Assets/images/sdnhs-logo.png";

const LOGINSCHEMA = z.object({
    email: z.string().min(1, requiredError("email")).email().default(""),
    password: z
        .string()
        .min(8, "Password must be atleast 8 characters.")
        .default(""),
    remember: z.boolean().default(false),
});

type IFormLogin = z.infer<typeof LOGINSCHEMA>;

type Props = {
    status?: string;
    canResetPassword?: boolean;
};

export default function Login({ status }: Props) {
    const [processing, setProcessing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [redirecting, setRedirecting] = useState(false);
    const { toast } = useToast();

    const { data, setData, onSubmit, errors, ...form } =
        useFormSubmit<IFormLogin>({
            schema: LOGINSCHEMA,
            route: route("login"),
            method: "post",
            defaultValues: {
                email: "",
                password: "",
                remember: false,
            },
            callback: {
                onBefore: () => {
                    setProcessing(true);
                },
                onSuccess: (page: any) => {
                    const flash = page?.props.flash;
                    if (flash.status === "success") {
                        setIsAuthenticated(true);
                        setTimeout(() => {
                            setRedirecting(true);
                        }, 1200);
                    } else {
                        const { title, message, status } = page.props.flash;
                        toast({
                            title,
                            description: message,
                            status,
                        });
                        setProcessing(false);
                    }
                },
                onError: (error: any) => {
                    for (const key in error) {
                        form.setError(key as keyof IFormLogin, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                    setProcessing(false);
                },
            },
        });

    useEffect(() => {
        if (redirecting) {
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1500);
        }
    }, [redirecting]);

    return (
        <div className="w-full [@media(min-width:1050px)]:h-[21.75rem]">
            {processing && (
                <div className="h-full flex items-center justify-center [@media(max-width:1050px)]:py-12">
                    {!redirecting && (
                        <div className="flex flex-col items-center [@media(max-width:1050px)]:my-auto">
                            <div className="rounded-full flex items-center justify-center size-12 relative">
                                <Lock
                                    className="size-5 absolute rotate-0 scale-100 transition-all duration-300 data-[auth=true]:rotate-90 data-[auth=true]:scale-0"
                                    data-auth={isAuthenticated}
                                />
                                <Check
                                    className="size-5 text-green-600 absolute rotate-90 scale-0 transition-all duration-300 data-[auth=true]:rotate-0 data-[auth=true]:scale-100"
                                    data-auth={isAuthenticated}
                                />
                                <BorderBeam
                                    size={isAuthenticated ? 500 : 60}
                                    duration={3}
                                    colorFrom={
                                        isAuthenticated ? "#16a34a" : "#ffaa40"
                                    }
                                    colorTo={
                                        isAuthenticated ? "#16a34a" : "#9c40ff"
                                    }
                                />
                            </div>
                            {!isAuthenticated && (
                                <AnimatedShinyText className="mt-2">
                                    <span>Authenticating</span>
                                </AnimatedShinyText>
                            )}
                            {isAuthenticated && (
                                <div className="mt-2 text-green-600">
                                    Successfull Login
                                </div>
                            )}
                        </div>
                    )}

                    {redirecting && (
                        <div className="flex flex-col items-center">
                            <span className="loading loading-dots loading-md"></span>
                            <AnimatedShinyText>Redirecting</AnimatedShinyText>
                        </div>
                    )}
                </div>
            )}

            {!processing && (
                <div className="">
                    <div className="size-fit p-1 rounded-full bg-white mx-auto shadow-lg mb-3 [@media(min-width:1050px)]:hidden">
                        <img
                            src={sdnhslogo}
                            alt="sdnhs-log"
                            className="size-16 sm:size-20"
                        />
                    </div>

                    <div className="mx-auto flex flex-col items-center mb-2">
                        <div className="text-lg sm:text-2xl font-semibold">
                            Log in to your account.
                        </div>
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={onSubmit} className="w-full">
                            <div>
                                <FormInput
                                    form={form}
                                    name="email"
                                    label="Email"
                                    icon={<AtSign className="size-4" />}
                                />
                            </div>

                            <div className="mt-4">
                                <FormInput
                                    form={form}
                                    name="password"
                                    label="Password"
                                    type="password"
                                    icon={<PasswordCheck className="size-5" />}
                                />
                            </div>

                            <div className="mt-4 block">
                                <FormField
                                    control={form.control}
                                    name="remember"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-2 !mt-5">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                    disabled={processing}
                                                />
                                            </FormControl>
                                            <FormLabel className="!mt-0">
                                                Remember me
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="mt-7 space-y-4">
                                <Button
                                    className="h-11 w-full shadow-md !bg-[#FF00FF] text-fuchsia-900 font-semibold"
                                    disabled={processing}
                                >
                                    Log in
                                </Button>

                                <div className="w-fit mx-auto">
                                    <Link
                                        href={route("password.request")}
                                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none"
                                        disabled={processing}
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            )}
        </div>
    );
}
