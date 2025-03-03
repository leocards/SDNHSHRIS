import TypographySmall from "@/Components/Typography";
import {
    FormCalendar,
    FormInput,
    FormRadioGroup,
    FormRadioItem,
} from "@/Components/ui/form";
import { IFormC4 } from "@/Pages/PDS/Types/C4";
import { SPOUSETYPE } from "@/Pages/PDS/Types/FamilyBackground";
import { usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { SALNTYPE } from "../Types/type";

type Props = {
    form: any;
    address: string | null;
    spouse: SPOUSETYPE|null;
    spousegoveid: IFormC4['governmentids'] | null
};

const PersonalInformation: React.FC<Props> = ({ form, address, spouse, spousegoveid }) => {
    const user = usePage().props.auth.user;

    const watchFiling = form.watch('isjoint')

    const onJointFiling = (filing: SALNTYPE['isjoint']) => {
        if(spouse && ['joint'].includes(filing) && !/^(na|n\/a)$/i.test(spouse.familyname)) {
            form.setValue('spouse', {
                familyname: spouse.familyname,
                firstname: spouse.firstname,
                middleinitial: spouse.middlename?.[0]??"",
                position: spouse.occupation,
                office: spouse.employerbusiness,
                officeaddress: spouse.businessaddress,
                governmentissuedid: spousegoveid ? spousegoveid.governmentissuedid : "",
                idno: spousegoveid ? spousegoveid.licensepassportid : "",
                dateissued: spousegoveid ? new Date(spousegoveid.issued) : null,
            })
        } else if(filing === 'not') {
            form.setValue('spouse', {
                familyname: '',
                firstname: '',
                middleinitial: '',
                position: '',
                office: '',
                officeaddress: '',
                governmentissuedid: '',
                idno: '',
                dateissued: null,
            })
        } else {
            form.setValue('spouse', {
                familyname: '',
                firstname: '',
                middleinitial: '',
                position: '',
                office: '',
                officeaddress: '',
                governmentissuedid: '',
                idno: '',
                dateissued: null,
            })

            form.setValue('children', [{ name: "N/A", dateofbirth: null }])
        }
    }

    return (
        <div>
            <div className="flex flex-col items-center gap-2 mt-4">
                <div className="flex items-center">
                    <div className="flex items-center gap-3.5 text-center">
                        <FormRadioGroup
                            form={form}
                            label={
                                <span>
                                    <b>Note:</b> Husband and wife who are both
                                    public officials and employees may file the
                                    required statements jointly or separately.
                                </span>
                            }
                            name="isjoint"
                            labelClass="text-center"
                            className="justify-center"
                            onValueChange={(value) => onJointFiling(value as SALNTYPE['isjoint'])}
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
                <div className="grid lg:grid-cols-3 gap-2.5 sm:gap-4 [&>div]:h-12 [&>div]:flex [&>div]:flex-col">
                    <div>
                        <div className="text-center grow">
                            <div className="line-clamp-1 uppercase">{user.lastname}</div>
                        </div>
                        <hr className="border-black/40" />
                        <div className="text-foreground/40 text-center">
                            (Family Name)
                        </div>
                    </div>
                    <div>
                        <div className="text-center grow">
                            <div className="line-clamp-1 uppercase">{user.firstname}</div>
                        </div>
                        <hr className="border-black/40" />
                        <div className="text-foreground/40 text-center">
                            (First Name)
                        </div>
                    </div>
                    <div>
                        <div className="text-center grow">
                            <div className="line-clamp-1 uppercase">
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
                        <div className="line-clamp-1 uppercase">{address}</div>
                    </div>
                    <hr className="border-black/40" />
                    <div className="text-foreground/40 text-center">
                        (Address)
                    </div>
                </div>
                <div className="grid lg:grid-cols-3 gap-2.5 sm:gap-4 [&>div]:h-12 [&>div]:flex [&>div]:flex-col">
                    <div>
                        <div className="text-center grow">
                            <div className="line-clamp-1 uppercase">{user.position}</div>
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

            {watchFiling !== "separate" && (<div className="space-y-2 mt-5">
                <TypographySmall className="uppercase">Spouse</TypographySmall>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
                    <FormInput
                        form={form}
                        name="spouse.familyname"
                        label="Family Name"
                        required={false}
                        inputClass="uppercase"
                    />
                    <FormInput
                        form={form}
                        name="spouse.firstname"
                        label="First Name"
                        required={false}
                        inputClass="uppercase"
                    />
                    <FormInput
                        form={form}
                        name="spouse.middleinitial"
                        label="M.I."
                        required={false}
                        inputClass="uppercase"
                    />

                    <FormInput
                        form={form}
                        name="spouse.position"
                        label="Position"
                        required={false}
                        inputClass="uppercase"
                    />
                    <FormInput
                        form={form}
                        name="spouse.office"
                        label="Agency/Office/School"
                        required={false}
                        inputClass="uppercase"
                    />
                    <FormInput
                        form={form}
                        name="spouse.officeaddress"
                        label="Office address"
                        required={false}
                        inputClass="uppercase"
                    />

                    <FormInput
                        form={form}
                        name="spouse.governmentissuedid"
                        label="Government Issued Id"
                        required={false}
                        inputClass="uppercase"
                    />
                    <FormInput
                        form={form}
                        name="spouse.idno"
                        label="ID No"
                        required={false}
                        inputClass="uppercase"
                    />
                    <FormCalendar
                        form={form}
                        name="spouse.dateissued"
                        label="Date Issued"
                        required={false}
                        triggerClass="uppercase"
                    />
                </div>
            </div>)}
        </div>
    );
};

export default PersonalInformation;
