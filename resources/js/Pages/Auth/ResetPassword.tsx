import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Head, useForm } from "@inertiajs/react";
import { Eye, EyeSlash } from "iconsax-react";
import { FormEventHandler, useRef, useState } from "react";

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const paswordRef = useRef<HTMLInputElement>(null);
    const confirmRef = useRef<HTMLInputElement>(null);
    const [passwordType, setPasswordType] = useState("password");
    const [confirmType, setConfirmType] = useState("password");

    const { setProcess } = useProcessIndicator()

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.store"), {
            onBefore: () => setProcess(true),
            onFinish: () => {
                setProcess(false)
                reset("password", "password_confirmation")
            },
        });
    };

    return (
        <>
            <Head title="Reset Password" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 form-input h-10 w-full"
                        autoComplete="username"
                        // onChange={(e) => setData("email", e.target.value)}
                        disabled
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <div className="relative mt-1">
                        <Input
                            id="password"
                            ref={paswordRef}
                            type={passwordType}
                            name="password"
                            value={data.password}
                            className="form-input h-10 w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-8 absolute right-1.5 top-1/2 -translate-y-1/2"
                            onClick={() => {
                                if (passwordType == "password")
                                    setPasswordType("text");
                                else if (passwordType == "text")
                                    setPasswordType("password");

                                paswordRef.current?.focus();
                            }}
                        >
                            <Eye
                                className="!size-4 transition duration-200 absolute rotate-0 scale-100 data-[type=text]:rotate-90 data-[type=text]:scale-0"
                                data-type={passwordType}
                            />
                            <EyeSlash
                                className="!size-4 transition duration-200 absolute rotate-90 scale-0 data-[type=text]:rotate-0 data-[type=text]:scale-100"
                                data-type={passwordType}
                            />
                        </Button>
                    </div>

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <div className="relative size-fit w-full mt-1">
                        <Input
                            ref={confirmRef}
                            type={confirmType}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="form-input h-10 w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                        />
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-8 absolute right-1.5 top-1/2 -translate-y-1/2"
                            onClick={() => {
                                if (confirmType == "password")
                                    setConfirmType("text");
                                else if (confirmType == "text")
                                    setConfirmType("password");

                                confirmRef.current?.focus();
                            }}
                        >
                            <Eye
                                className="!size-4 transition duration-200 absolute rotate-0 scale-100 data-[type=text]:rotate-90 data-[type=text]:scale-0"
                                data-type={confirmType}
                            />
                            <EyeSlash
                                className="!size-4 transition duration-200 absolute rotate-90 scale-0 data-[type=text]:rotate-0 data-[type=text]:scale-100"
                                data-type={confirmType}
                            />
                        </Button>
                    </div>

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Button className="ms-4 !bg-[#FF00FF]" disabled={processing}>
                        Reset Password
                    </Button>
                </div>
            </form>
        </>
    );
}
