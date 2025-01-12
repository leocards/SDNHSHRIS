import TypographySmall from "@/Components/Typography";
import {
    FormCalendar,
    FormInput,
    FormRadioGroup,
    FormRadioItem,
} from "@/Components/ui/form";
import { usePage } from "@inertiajs/react";
import React from "react";

type Props = {
    form: any;
};

const PersonalInformation: React.FC<Props> = ({ form }) => {
    const user = usePage().props.auth.user;
    return (
        <div>
            <div className="flex flex-col items-center gap-2 mt-4">
                <div className="flex items-center">
                    <div className="flex items-center gap-3.5">
                        <FormRadioGroup
                            form={form}
                            label={
                                <span className="">
                                    <b>Note:</b> Husband and wife who are both
                                    public officials and employees may file the
                                    required statements jointly or separately.
                                </span>
                            }
                            name="isjoint"
                            labelClass="text-center"
                            className="justify-center"
                        >
                            <FormRadioItem value="joint" label="Joint Filing" />
                            <FormRadioItem
                                value="separate"
                                label="Separate Filing"
                            />
                            <FormRadioItem
                                value="not"
                                label="Not Applicable"
                            />
                        </FormRadioGroup>
                    </div>
                </div>
            </div>

            <div className="space-y-2.5 mt-5">
                <TypographySmall className="uppercase">
                    Declarant
                </TypographySmall>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4 [&>div]:h-12 [&>div]:flex [&>div]:flex-col">
                    <div>
                        <div className="text-center grow">
                            <div className="line-clamp-1">{user.lastname}</div>
                        </div>
                        <hr className="border-black/40" />
                        <div className="text-foreground/40 text-center">
                            (Family Name)
                        </div>
                    </div>
                    <div>
                        <div className="text-center grow">
                            <div className="line-clamp-1">{user.firstname}</div>
                        </div>
                        <hr className="border-black/40" />
                        <div className="text-foreground/40 text-center">
                            (First Name)
                        </div>
                    </div>
                    <div>
                        <div className="text-center grow">
                            <div className="line-clamp-1">
                                {user.middlename?.charAt(0)}
                            </div>
                        </div>
                        <hr className="border-black/40" />
                        <div className="text-foreground/40 text-center">
                            (M.I.)
                        </div>
                    </div>
                </div>
                <div className="h-12 flex flex-col">
                    <div className="text-center grow">
                        <div className="line-clamp-1">{}</div>
                    </div>
                    <hr className="border-black/40" />
                    <div className="text-foreground/40 text-center">
                        (Address)
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4 [&>div]:h-12 [&>div]:flex [&>div]:flex-col">
                    <div>
                        <div className="text-center grow">
                            <div className="line-clamp-1">{user.position}</div>
                        </div>
                        <hr className="border-black/40" />
                        <div className="text-foreground/40 text-center">
                            (Position)
                        </div>
                    </div>
                    <div>
                        <div className="text-center grow">
                            <div className="line-clamp-1">
                                SOUTHERN DAVAO NHS
                            </div>
                        </div>
                        <hr className="border-black/40" />
                        <div className="text-foreground/40 text-center">
                            (Agency/Office/School)
                        </div>
                    </div>
                    <div>
                        <div className="text-center grow">
                            <div className="line-clamp-1">
                                SOUTHERN DAVAO, PANABO CITY
                            </div>
                        </div>
                        <hr className="border-black/40" />
                        <div className="text-foreground/40 text-center">
                            (Office address)
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2 mt-5">
                <TypographySmall className="uppercase">Spouse</TypographySmall>
                <div className="grid sm:grid-cols-3 gap-2.5 sm:gap-4">
                    <FormInput
                        form={form}
                        name="spouse.familyname"
                        label="Family Name"
                        required={false}
                    />
                    <FormInput
                        form={form}
                        name="spouse.firstname"
                        label="First Name"
                        required={false}
                    />
                    <FormInput
                        form={form}
                        name="spouse.middleinitial"
                        label="M.I."
                        required={false}
                    />
                </div>
                <div className="grid sm:grid-cols-3 gap-2.5 sm:gap-4">
                    <FormInput
                        form={form}
                        name="spouse.position"
                        label="Position"
                        required={false}
                    />
                    <FormInput
                        form={form}
                        name="spouse.office"
                        label="Agency/Office/School"
                        required={false}
                    />
                    <FormInput
                        form={form}
                        name="spouse.officeaddress"
                        label="Office address"
                        required={false}
                    />
                </div>

                <div className="grid sm:grid-cols-3 gap-2.5 sm:gap-4">
                    <FormInput
                        form={form}
                        name="spouse.governmentissuedid"
                        label="Government Issued Id"
                        required={false}
                    />
                    <FormInput
                        form={form}
                        name="spouse.idno"
                        label="ID No"
                        required={false}
                    />
                    <FormCalendar
                        form={form}
                        name="spouse.dateissued"
                        label="Date Issued"
                        required={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonalInformation;
