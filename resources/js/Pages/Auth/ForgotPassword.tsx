import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { useToast } from "@/Hooks/use-toast";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });
    const { toast } = useToast()

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.email"), {
            onSuccess: (page) => {
                if(page.props.flash.status === "error") {
                    const { title, message, status } = page.props.flash
                    toast({
                        title, description: message, status
                    })
                }
            }
        });
    };

    return (
        <>
            <Head title="Forgot Password" />

            <div className="mb-4 text-sm text-gray-600">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that will
                allow you to choose a new one.
            </div>

            {(status && status != "error") && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    placeholder="Email address"
                    className="mt-1 form-input h-10 w-full"
                    onChange={(e) => setData("email", e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex items-center justify-between w-full">
                    <Button type="button" variant={"ghost"} disabled={processing} onClick={() => router.get('/')}>
                        Cancel
                    </Button>

                    <Button className="ms-4 !bg-[#FF00FF] text-fuchsia-900" disabled={processing}>
                        Reset Password
                    </Button>
                </div>
            </form>
        </>
    );
}
