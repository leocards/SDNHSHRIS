import Header from "@/Components/Header";
import { TypographyLarge } from "@/Components/Typography";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { ArrowRight2 } from "iconsax-react";
import React, { useEffect } from "react";
import {
    getBifc,
    getRelatives,
    IFormSaln,
    SALNSCHEMA,
    SALNTYPE,
} from "./Types/type";
import { Form, FormCalendar } from "@/Components/ui/form";
import PersonalInformation from "./Partials/PersonalInformation";
import Children, { calculateAge } from "./Partials/Children";
import Assets from "./Partials/Assets";
import Liabilities from "./Partials/Liabilities";
import BusinessInterectFinancialConnections from "./Partials/BusinessInterectFinancialConnections";
import RelativeInGovernment from "./Partials/RelativeInGovernment";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Hooks/use-toast";
import { FAMILYBACKGROUNDTYPE, SPOUSETYPE } from "../PDS/Types/FamilyBackground";
import { IFormC4 } from "../PDS/Types/C4";
import { cn } from "@/Lib/utils";
import { extractDate } from "@/Types/types";

type Props = {
    address: string | null;
    saln: SALNTYPE | null;
    spouse: SPOUSETYPE | null;
    spousegoveid: IFormC4["governmentids"] | null;
    children: SALNTYPE["children"]
};

const getChildren = (data: SALNTYPE["children"] | null, defaultChildren: SALNTYPE["children"]|null|undefined) => {
    let childrens: Array<{
        name: string;
        dateofbirth: Date | null;
    }> = [{ name: "N/A", dateofbirth: null }];

    if (data) {
        if (data.length > 0) {
            childrens = [];

            data.forEach((child) => {
                childrens.push({
                    name: child.name ?? "",
                    dateofbirth: !child.name
                        ? null
                        : new Date(child.dateofbirth),
                });
            });
        }
    } else if(defaultChildren) {
        if(defaultChildren.length > 0) {
            childrens = [];

            defaultChildren.forEach((child) => {
                if((child.name && child.name.toLowerCase() != 'n/a') && calculateAge(new Date(child.dateofbirth)) < 18) {
                    childrens.push({
                        name: child.name ?? "",
                        dateofbirth: !child.name
                            ? null
                            : new Date(child.dateofbirth),
                    });
                }
            })
        }
    }
    return childrens;
};

const NewSALN: React.FC<Props> = ({ address, saln, spouse, spousegoveid, children }) => {
    const { toast } = useToast();

    const spousedateIssuedId = extractDate(saln?.spouse?.dateissued??'');

    const form = useFormSubmit<IFormSaln>({
        route: !saln ? route("saln.store") : route("saln.store", [saln?.id]),
        method: "post",
        schema: SALNSCHEMA,
        defaultValues: {
            date: saln ? new Date() : new Date(),
            isjoint: saln?.isjoint || undefined,
            asof: saln ? new Date(saln?.asof) : undefined,
            spouse: {
                familyname: saln?.spouse?.familyname ?? "",
                firstname: saln?.spouse?.firstname ?? "",
                middleinitial: saln?.spouse?.middleinitial ?? "",
                position: saln?.spouse?.position ?? "",
                office: saln?.spouse?.office ?? "",
                officeaddress: saln?.spouse?.officeaddress ?? "",
                governmentissuedid: saln?.spouse?.governmentissuedid ?? "",
                idno: saln?.spouse?.idno ?? "",
                dateissued: saln?.spouse?.dateissued
                    ? spousedateIssuedId
                        ? new Date(spousedateIssuedId)
                        : null
                    : null,
            },
            children: getChildren(saln?.children??null, children),
            assets: {
                real: saln?.assets?.real ?? [
                    {
                        description: "",
                        kind: "",
                        exactlocation: "",
                        assessedvalue: "",
                        currentfairmarketvalue: "",
                        acquisition: {
                            year: "",
                            mode: "",
                        },
                        acquisitioncost: "",
                    },
                ],
                personal: saln?.assets?.personal ?? [
                    {
                        description: "",
                        yearacquired: "",
                        acquisitioncost: "",
                    },
                ],
            },
            liabilities: saln?.liabilities ?? [
                {
                    nature: "",
                    nameofcreditors: "",
                    outstandingbalances: "",
                },
            ],
            biandfc: {
                nobiandfc: saln?.biandfc?.nobiandfc ?? false,
                bifc: saln
                    ? getBifc(saln.biandfc.bifc)
                    : [
                          {
                              name: "",
                              address: "",
                              nature: "",
                              date: null,
                          },
                      ],
            },
            relativesingovernment: {
                norelative: saln?.relativesingovernment?.norelative ?? false,
                relatives: saln
                    ? getRelatives(saln.relativesingovernment.relatives)
                    : [
                          {
                              name: "",
                              relationship: "",
                              position: "",
                              agencyandaddress: "",
                          },
                      ],
            },
        },
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
                if ("0" in error) console.log("error", error[0]);
                else {
                    for (const key in error) {
                        form.setError(key as keyof IFormSaln, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
        },
    });

    const watchFiling = form.watch('isjoint')

    useEffect(() => {
        if(watchFiling && watchFiling == 'joint') {
            form.setValue('children', getChildren(saln?.children??null, children))
        } else {
            form.setValue('children', [{ name: "N/A", dateofbirth: null }])
        }
    }, [watchFiling])

    return (
        <div>
            <Header title="New SALN" className="w-full">
                <div className="flex items-center gap-1">
                    SALN <ArrowRight2 className="size-4 [&>path]:stroke-[3]" />{" "}
                    New SALN
                    <div
                        className={cn(
                            {
                                default: "hidden",
                                pending: "text-amber-600",
                                approved: "text-green-600",
                                disapproved: "text-destructive",
                            }[saln?.status ?? "default"],
                            "text-base capitalize ml-auto"
                        )}
                    >
                        {saln?.status}
                    </div>
                </div>
            </Header>

            <div className="py-5 mt-5 text-center border-t border-border">
                <TypographyLarge className="uppercase">
                    SWORN STATEMENT OF ASSETS, LIABILITIES AND NET WORTH
                </TypographyLarge>
            </div>

            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="max-w-52 mx-auto">
                        <FormCalendar
                            form={form}
                            name="asof"
                            label="As of"
                            labelClass="text-center justify-center flex mb-1.5"
                        />
                    </div>

                    <PersonalInformation
                        form={form}
                        address={address}
                        spouse={spouse}
                        spousegoveid={spousegoveid}
                    />

                    <Children form={form} />

                    <Assets form={form} />

                    <Liabilities form={form} />

                    <BusinessInterectFinancialConnections form={form} />

                    <RelativeInGovernment form={form} />

                    <div className="mt-10 pt-4 flex items-center gap-4 border-t border-border">
                        <Button className="px-8 w-full">Submit SALN</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default NewSALN;
