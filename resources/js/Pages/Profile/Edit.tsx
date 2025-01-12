import { PageProps } from "@/Types";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/ProfileInformation/UpdateProfileInformation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Head } from "@inertiajs/react";
import Settings from "./Partials/Settings";

function Edit({
    mustVerifyEmail,
    status,
    tab,
}: PageProps<{
    mustVerifyEmail: boolean;
    status?: string;
    tab?: "account" | "password" | "settings";
}>) {

    return (
        <div className="py-8">
            <Head title="Account" />
            <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                <Tabs defaultValue={tab ?? "account"} className="divide-y">
                    <TabsList className="rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 bg-primary/15 text-primary/60">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account" className="">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </TabsContent>
                    <TabsContent value="password" className="pt-4">
                        <UpdatePasswordForm className="max-w-xl" />
                    </TabsContent>
                    <TabsContent value="settings" className="pt-4">
                        <Settings />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default Edit;
