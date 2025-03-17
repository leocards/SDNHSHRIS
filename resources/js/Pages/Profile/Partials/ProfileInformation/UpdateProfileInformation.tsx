import { ProfilePhoto } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { cn } from "@/Lib/utils";
import { usePage } from "@inertiajs/react";
import { Camera, Edit } from "iconsax-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import AccountInformationForm, {
    ACCOUNTSCHEMA,
    IFormAccount,
} from "./AccountInformationForm";
import { TooltipLabel } from "@/Components/ui/tooltip";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { useToast } from "@/Hooks/use-toast";
import UploadProfilePhoto from "../UploadProfilePhoto";
import { ADDRESSTYPE } from "@/Pages/PDS/Types/PersonalInformation";
import { Departments } from "@/Types/types";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
    address,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
    address: {
        permanent: ADDRESSTYPE;
        residential: ADDRESSTYPE;
    };
}) {
    const { toast } = useToast();
    const user = usePage().props.auth.user;
    const [show, setShow] = useState(false);
    const [uploadProfile, setUploadProfile] = useState(false);

    const form = useFormSubmit<Omit<IFormAccount, "personnel">>({
        schema: ACCOUNTSCHEMA.omit({ personnel: true }),
        route: route("profile.update"),
        method: "post",
        async: true,
        defaultValues: {
            personal: {
                firstname: user?.firstname ?? "",
                lastname: user?.lastname ?? "",
                middlename: user?.middlename ?? "",
                extensionname: user?.extensionname ?? "",
                gender: user?.gender ?? undefined,
                birthday: user?.birthday ? new Date(user?.birthday) : undefined,
            },
            contact: {
                email: user?.email ?? "",
                mobilenumber: user?.mobilenumber,
            },
        },
        callback: {
            onSuccess: (page: any) => {
                toast({
                    status: page.props.flash.status,
                    title: page.props.flash.title,
                    description: page.props.flash.message,
                });
            },
            onError: (error: any) => {
                if ("0" in error) console.log("error", error[0]);
                else {
                    for (const key in error) {
                        form.setError(
                            key as keyof Omit<IFormAccount, "personnel">,
                            {
                                type: "manual",
                                message: error[key],
                            }
                        );
                    }
                }
            },
        },
    });

    return show ? (
        <div className="pt-4">
            <div className="font-semibold text-xl">Update Profile</div>
            <AccountInformationForm
                form={form}
                user={user}
                isProfile
                disableCredentials
                disablePersonnelForm
                withClear={false}
                cancelButton={
                    <Button variant="outline" onClick={() => setShow(false)}>
                        Cancel
                    </Button>
                }
            />
        </div>
    ) : (
        <div className={cn("max-w-3xl mx-auto", className)}>
            <div className="">
                <div className="rounded-b-lg h-14 -h-48 -bg-zinc-100 -dark:bg-zinc-800 relative overflow-hidden hidden">
                    <div className="absolute -bottom-0 left-0 w-full h-full -bg-gradient-to-t from-black opacity-10 blur-[2px]" />
                    <div className="absolute bottom-2 right-2 hidden">
                        <Button className="" variant="outline">
                            <Camera className="-mt-px" />
                            <span>Edit cover photo</span>
                        </Button>
                    </div>
                </div>
                <div className="relative grid grid-cols-1 lg:grid-cols-[188px,1fr,auto] mt-3 lg:mt-10">
                    <div></div>
                    <div className="p-1.5 relative max-lg:w-fit lg:absolute lg:-top-8 lg:left-10 bg-background rounded-full max-lg:mx-auto">
                        <ProfilePhoto
                            src={user.avatar}
                            className="size-32 object-cover"
                            active={false}
                            fallbackSize={40}
                        />
                        <div className="absolute bottom-2 right-2">
                            <TooltipLabel label="Change profile">
                                <Button
                                    className="rounded-full ring ring-background hover:bg-zinc-200 dark:hover:bg-white/20"
                                    size="icon"
                                    variant="secondary"
                                    onClick={() => setUploadProfile(true)}
                                >
                                    <Camera className="-mt-px" />
                                </Button>
                            </TooltipLabel>
                        </div>
                    </div>
                    <div className="py-4 max-lg:mx-auto text-center lg:text-left">
                        <div className="font-semibold text-lg">
                            {user && `${user.firstname} ${user.lastname}`}
                        </div>
                        {user && `${user.email}`}
                    </div>
                    <div className="size-fit m-auto">
                        <Button onClick={() => setShow(true)}>
                            <Edit />
                            Edit
                        </Button>
                    </div>
                </div>
            </div>
            <div className="mt-8 lg:mt-14 pt-4 space-y-8">
                <div className="relative">
                    <Label
                        children="Personal Information"
                        className="text-base bg-background pr-3 before:absolute before:w-full before:h-px before:bg-border before:top-3 before:-z-10"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-lg:gap-4 mt-2">
                        <div className="">
                            <Label
                                children="Last Name"
                                className="text-foreground/60"
                            />
                            <div>{user.lastname}</div>
                        </div>
                        <div className="">
                            <Label
                                children="First Name"
                                className="text-foreground/60"
                            />
                            <div>{user.firstname}</div>
                        </div>
                        <div className="">
                            <Label
                                children="Middle Name"
                                className="text-foreground/60"
                            />
                            <div>{user.middlename ?? "N/A"}</div>
                        </div>

                        <div className="lg:mt-5">
                            <Label
                                children="Extension Name"
                                className="text-foreground/60"
                            />
                            <div>{user.extensionname ?? "N/A"}</div>
                        </div>

                        <div className="lg:mt-5">
                            <Label
                                children="Gender"
                                className="text-foreground/60"
                            />
                            <div className="capitalize">{user.gender}</div>
                        </div>

                        <div className="lg:mt-5">
                            <Label
                                children="Birth date"
                                className="text-foreground/60"
                            />
                            <div>{format(user.birthday, "MMMM d, y")}</div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <Label
                        children="Contact Information"
                        className="text-base bg-background pr-3 before:absolute before:w-full before:h-px before:bg-border before:top-3 before:-z-10"
                    />

                    <div className="grid  [@media(min-width:870px)]:grid-cols-2 [@media(max-width:870px)]:gap-4 mt-2">
                        <div className="">
                            <Label
                                children="Email"
                                className="text-foreground/60"
                            />
                            <div>{user.email}</div>
                        </div>
                        <div className="">
                            <Label
                                children="Mobile Number"
                                className="text-foreground/60"
                            />
                            <div>{user.mobilenumber ?? "N/A"}</div>
                        </div>
                    </div>

                    {user.role !== 'hr' && (<div className="mt-6">
                        <Label
                            children="Residential Address"
                            className="text-foreground/80 italic"
                        />
                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
                            <div className="">
                                <Label
                                    children="House/Block/Lot No."
                                    className="text-foreground/60"
                                />
                                <div>
                                    {address?.residential?.houselotblockno}
                                </div>
                            </div>
                            <div className="">
                                <Label
                                    children="Street"
                                    className="text-foreground/60"
                                />
                                <div>{address?.residential?.street}</div>
                            </div>
                            <div className="">
                                <Label
                                    children="Subdivision/Village"
                                    className="text-foreground/60"
                                />
                                <div>{address?.residential?.subdivision}</div>
                            </div>

                            <div className="">
                                <Label
                                    children="Barangay"
                                    className="text-foreground/60"
                                />
                                <div>{address?.residential?.barangay}</div>
                            </div>

                            <div className="">
                                <Label
                                    children="City/Municipality"
                                    className="text-foreground/60"
                                />
                                <div className="capitalize">
                                    {address?.residential?.citymunicipality}
                                </div>
                            </div>

                            <div className="">
                                <Label
                                    children="Province"
                                    className="text-foreground/60"
                                />
                                <div>{address?.residential?.province}</div>
                            </div>

                            <div className="">
                                <Label
                                    children="ZIP Code"
                                    className="text-foreground/60"
                                />
                                <div>{address?.residential?.zipcode}</div>
                            </div>
                        </div>
                    </div>)}

                    {user.role !== 'hr' && (<div className="mt-6">
                        <Label
                            children="Permanent Address"
                            className="text-foreground/80 italic"
                        />
                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
                            <div className="">
                                <Label
                                    children="House/Block/Lot No."
                                    className="text-foreground/60"
                                />
                                <div>{address?.permanent?.houselotblockno}</div>
                            </div>
                            <div className="">
                                <Label
                                    children="Street"
                                    className="text-foreground/60"
                                />
                                <div>{address?.permanent?.street}</div>
                            </div>
                            <div className="">
                                <Label
                                    children="Subdivision/Village"
                                    className="text-foreground/60"
                                />
                                <div>{address?.permanent?.subdivision}</div>
                            </div>

                            <div className="">
                                <Label
                                    children="Barangay"
                                    className="text-foreground/60"
                                />
                                <div>{address?.permanent?.barangay}</div>
                            </div>

                            <div className="">
                                <Label
                                    children="City/Municipality"
                                    className="text-foreground/60"
                                />
                                <div className="capitalize">
                                    {address?.permanent?.citymunicipality}
                                </div>
                            </div>

                            <div className="">
                                <Label
                                    children="Province"
                                    className="text-foreground/60"
                                />
                                <div>{address?.permanent?.province}</div>
                            </div>

                            <div className="">
                                <Label
                                    children="ZIP Code"
                                    className="text-foreground/60"
                                />
                                <div>{address?.permanent?.zipcode}</div>
                            </div>
                        </div>
                    </div>)}
                </div>

                <div className="relative">
                    <Label
                        children="Personnel Information"
                        className="text-base bg-background pr-3 before:absolute before:w-full before:h-px before:bg-border before:top-3 before:-z-10"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 max-sm:gap-4 mt-2">
                        <div className="">
                            <Label
                                children="Personnel Id"
                                className="text-foreground/60"
                            />
                            <div>{user.personnelid}</div>
                        </div>
                        <div className="">
                            <Label
                                children="Date Hired"
                                className="text-foreground/60"
                            />
                            <div>{format(user.hiredate, "MMMM d, y")}</div>
                        </div>
                        <div className="">
                            <Label
                                children="User Role"
                                className="text-foreground/60"
                            />
                            <div className="capitalize">
                                {user.role ?? "N/A"}
                            </div>
                        </div>

                        <div className="sm:mt-5">
                            <Label
                                children="Department"
                                className="text-foreground/60"
                            />
                            <div>
                                {user.role === "hr" || user.role === "principal"
                                    ? "N/A"
                                    : Departments[user.department] ?? "N/A"}
                            </div>
                        </div>

                        <div className="sm:mt-5">
                            <Label
                                children="Position"
                                className="text-foreground/60"
                            />
                            <div className="capitalize">
                                {user.position ?? "HR"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <UploadProfilePhoto
                show={uploadProfile}
                onClose={setUploadProfile}
            />
        </div>
    );
}
