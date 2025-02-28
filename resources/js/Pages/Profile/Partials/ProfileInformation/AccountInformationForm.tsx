import TypographySmall from "@/Components/Typography";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormCalendar,
    FormInput,
    FormSelect,
} from "@/Components/ui/form";
import { Label } from "@/Components/ui/label";
import { SelectItem } from "@/Components/ui/select";
import { cn } from "@/Lib/utils";
import { User, DepartmentsType } from "@/Types";
import {
    Departments,
    PersonnelPosition,
    requiredError,
} from "@/Types/types";
import { isFuture } from "date-fns";
import { PasswordCheck } from "iconsax-react";
import { AtSign } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import { z } from "zod";

export const ACCOUNTSCHEMA = z.object({
    personal: z.object({
        firstname: z.string().min(1, requiredError("first name")).default(""),
        lastname: z.string().min(1, requiredError("last name")).default(""),
        middlename: z.string().optional().default(""),
        extensionname: z.string(),
        birthday: z
            .date({ required_error: requiredError("birthday") })
            .optional()
            .refine((attribute) => {
                if (!attribute) return false;

                return true;
            }, requiredError("birthday")),
        gender: z
            .enum(["male", "female"], {
                required_error: requiredError("gender"),
            })
            .optional()
            .refine((attribute) => {
                if (!attribute) return false;

                return true;
            }, requiredError("gender")),
    }),
    contact: z.object({
        email: z
            .string()
            .min(1, requiredError("email"))
            .email("Must be a valid email.")
            .default(""),
        mobilenumber: z
            .string()
            .min(10, "Must be 10 digits.")
            .max(10, "Must be 10 digits.")
            .regex(/^[1-9]\d*$/, {
                message: "Must be a valid mobile number",
            })
            .optional(),
    }),
    personnel: z.object({
        ispersonnel: z.boolean().default(true),
        personnelid: z
            .string()
            .min(1, requiredError("'DepEd Employee No.'"))
            .max(7, "Maximum required digits is 7")
            .default(""),
        datehired: z
            .date({ required_error: requiredError("date hired") })
            .optional()
            .refine((attribute) => {
                if (!attribute) return false;

                return true;
            }, requiredError("date hired")),
        role: z.enum(["hr", "principal", "teaching", "non-teaching"], {
            required_error: requiredError("user role"),
        }),
        department: z
            .enum(["junior", "senior", "accounting", "N/A", "deped"], {
                required_error: requiredError("department"),
            })
            .optional()
            .refine((attribute) => {
                if (!attribute) return false;

                return true;
            }, requiredError("department")),
        position: z
            .enum(PersonnelPosition, {
                required_error: requiredError("position"),
            })
            .optional()
            .refine((attribute) => {
                if (!attribute) return false;

                return true;
            }, requiredError("position")),
        credits: z.string().optional().default('0'),
        splcredits: z.string().optional().default('0'),
    }),
    password: z
        .string()
        .min(8, "Password must have atleast 8 characters.")
        .default("12345678"),
});

export type IFormAccount = z.infer<typeof ACCOUNTSCHEMA>;

interface Props {
    user?: User | null;
    form: any;
    disablePersonnelForm?: boolean;
    disableCredentials?: boolean;
    isProfile: boolean;
    withClear?: boolean;
    hasPrincipal?: boolean;
    onFormSubmit?: () => void;
    cancelButton?: React.ReactNode;
}

const AccountInformationForm: React.FC<Props> = ({
    user,
    disablePersonnelForm,
    disableCredentials,
    isProfile,
    withClear = true,
    onFormSubmit,
    form,
    hasPrincipal,
    cancelButton,
    ...props
}) => {
    const watchDepartment = form.watch(
        "personnel.department"
    ) as DepartmentsType;
    const watchRole = form.watch("personnel.role");

    const [positions, setPositions] = useState<Array<string>>([]);

    useEffect(() => {
        if (watchRole === "principal") {
            form.setValue("personnel.department", "deped");
            setPositions([...PersonnelPosition].slice(10, 15));
        } else if (watchRole === "non-teaching") {
            form.setValue("personnel.department", "accounting");
            setPositions([...PersonnelPosition].slice(7, 10));
        } else {
            form.setValue("personnel.department", undefined);
        }
        form.setValue("personnel.position", undefined);

        if (watchRole == "teaching") {
            setPositions([...PersonnelPosition].slice(0, 7));
        }

        if(!isProfile) {
            if(watchRole !== "teaching"){
                form.setValue("personnel.credits", '30');
                form.setValue("personnel.splcredits", '15');
            } else {
                form.setValue("personnel.credits", '0');
                form.setValue("personnel.splcredits", '0');
            }
        }
    }, [watchRole]);

    return (
        <div>
            <div className="mb-4">
                <TypographySmall>
                    Required fields are marked with (
                    <span className="required mr-0.5"></span>)
                </TypographySmall>
            </div>
            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-4 relative">
                        <Label
                            children="Personal Information"
                            className="text-base bg-background pr-3 before:absolute before:w-full before:h-px before:bg-border before:top-3 before:-z-10"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <FormInput
                                form={form}
                                name="personal.lastname"
                                label="Last Name"
                            />
                            <FormInput
                                form={form}
                                name="personal.firstname"
                                label="First Name"
                            />
                            <FormInput
                                form={form}
                                name="personal.middlename"
                                label="Middel Name"
                                required={false}
                            />

                            <FormSelect
                                form={form}
                                name="personal.extensionname"
                                label="Extension Name"
                                items={
                                    <>
                                        <SelectItem
                                            value="N/A"
                                            children="N/A"
                                        />
                                        <SelectItem
                                            value="Jr."
                                            children="Jr."
                                        />
                                        <SelectItem
                                            value="Sr."
                                            children="Sr."
                                        />
                                        <SelectItem value="I" children="I" />
                                        <SelectItem value="II" children="II" />
                                        <SelectItem
                                            value="III"
                                            children="III"
                                        />
                                        <SelectItem value="IV" children="IV" />
                                        <SelectItem value="V" children="V" />
                                        <SelectItem value="VI" children="VI" />
                                        <SelectItem
                                            value="VII"
                                            children="VII"
                                        />
                                        <SelectItem
                                            value="VIII"
                                            children="VIII"
                                        />
                                    </>
                                }
                            />
                            <FormSelect
                                form={form}
                                name="personal.gender"
                                label="Gender"
                                triggerClass="capitalize"
                                items={
                                    <>
                                        <SelectItem
                                            value="male"
                                            children="Male"
                                        />
                                        <SelectItem
                                            value="female"
                                            children="Female"
                                        />
                                    </>
                                }
                            />
                            <FormCalendar
                                form={form}
                                name="personal.birthday"
                                label="Birthday"
                                onCancel={() =>
                                    form.setValue(
                                        "personal.birthday",
                                        user
                                            ? new Date(user.birthday)
                                            : undefined
                                    )
                                }
                                noFutureDates
                                disableDate={(date) => isFuture(date)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 relative mt-5">
                        <Label
                            children="Contact Information"
                            className="text-base bg-background pr-3 before:absolute before:w-full before:h-px before:bg-border before:top-3 before:-z-10"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                form={form}
                                name="contact.email"
                                label="Email"
                                icon={<AtSign className="size-4" />}
                            />
                            <FormInput
                                form={form}
                                name="contact.mobilenumber"
                                label="Mobile number"
                                type="number"
                                required={false}
                                maxLength={10}
                                icon={
                                    <div className="font-medium !opacity-100 text-sm">
                                        +63
                                    </div>
                                }
                            />
                        </div>
                    </div>

                    {!disablePersonnelForm && (
                        <div className="space-y-4 relative mt-5">
                            <Label
                                children="Personnel Information"
                                className="text-base bg-background pr-3 before:absolute before:w-full before:h-px before:bg-border before:top-3 before:-z-10"
                            />

                            <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", (!user || !isProfile || watchRole === "teaching") ? 'md:grid-cols-3' : watchRole != "teaching" && 'md:grid-cols-4')}>
                                <FormSelect
                                    form={form}
                                    name="personnel.role"
                                    label="User Role"
                                    triggerClass={cn(
                                        form.watch("personnel.role") != "hr"
                                            ? "capitalize"
                                            : "uppercase"
                                    )}
                                    items={
                                        <>
                                            {!hasPrincipal && (
                                                <SelectItem
                                                    value="principal"
                                                    children="Principal"
                                                />
                                            )}
                                            <SelectItem
                                                value="teaching"
                                                children="Teaching"
                                                disabled={!hasPrincipal}
                                            />
                                            <SelectItem
                                                value="non-teaching"
                                                children="Non-teaching"
                                                disabled={!hasPrincipal}
                                            />
                                        </>
                                    }
                                />
                                <FormInput
                                    form={form}
                                    name="personnel.personnelid"
                                    label="DepEd Employee No."
                                    type="number"
                                    maxLength={7}
                                />
                                <FormCalendar
                                    form={form}
                                    name="personnel.datehired"
                                    label="Date Hired"
                                    onCancel={() =>
                                        form.setValue(
                                            "personnel.datehired",
                                            user
                                                ? user.birthday
                                                    ? new Date(user.birthday)
                                                    : undefined
                                                : undefined
                                        )
                                    }
                                />

                                <FormSelect
                                    form={form}
                                    name="personnel.department"
                                    label="Department"
                                    disabled={
                                        watchRole == "principal" || !watchRole
                                    }
                                    displayValue={
                                        watchDepartment
                                            ? Departments[watchDepartment]
                                            : undefined
                                    }
                                    watchDefault
                                    items={
                                        <>
                                            {watchRole == "principal" && (
                                                <SelectItem
                                                    value="N/A"
                                                    children="N/A"
                                                />
                                            )}
                                            {watchRole == "teaching" && (
                                                <SelectItem
                                                    value="junior"
                                                    children="Junior High School"
                                                />
                                            )}
                                            {watchRole == "teaching" && (
                                                <SelectItem
                                                    value="senior"
                                                    children="Senior High School"
                                                />
                                            )}
                                            {watchRole == "non-teaching" && (
                                                <SelectItem
                                                    value="accounting"
                                                    children="Accounting"
                                                />
                                            )}
                                        </>
                                    }
                                />
                                <FormSelect
                                    form={form}
                                    name="personnel.position"
                                    label="Position"
                                    items={positions.map((position, index) => (
                                        <SelectItem
                                            key={index}
                                            value={position}
                                            children={position}
                                        />
                                    ))}
                                    disabled={!watchRole}
                                />
                                {(!isProfile && !user && watchRole != "teaching") && (
                                    <Fragment>
                                        <FormInput
                                            form={form}
                                            name="personnel.credits"
                                            label="Credits"
                                            type="number"
                                            required={false}
                                        />
                                        <FormInput
                                            form={form}
                                            name="personnel.splcredits"
                                            label="SPL Credits"
                                            type="number"
                                            required={false}
                                        />
                                    </Fragment>
                                )}
                            </div>
                        </div>
                    )}

                    {!disableCredentials && (
                        <div className="space-y-4 relative mt-5">
                            <Label
                                children="User Credentials"
                                className="text-base bg-background pr-3 before:absolute before:w-full before:h-px before:bg-border before:top-3 before:-z-10"
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormInput
                                    form={form}
                                    name="contact.email"
                                    label="Email"
                                    disabled
                                    icon={<AtSign className="size-4" />}
                                />
                                <FormInput
                                    form={form}
                                    name="password"
                                    label="Password"
                                    type="password"
                                    icon={<PasswordCheck className="size-5" />}
                                />
                            </div>
                        </div>
                    )}

                    <div className="border-t border-border mt-5 pt-3 flex">
                        {withClear && (
                            <Button
                                type="button"
                                variant={"ghost"}
                                className=""
                                onClick={() => form.reset()}
                            >
                                Clear form
                            </Button>
                        )}
                        {cancelButton && cancelButton}
                        <Button className="ml-auto">Save changes</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AccountInformationForm;
