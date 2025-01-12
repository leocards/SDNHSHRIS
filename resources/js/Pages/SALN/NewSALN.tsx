import Header from "@/Components/Header";
import { TypographyLarge } from "@/Components/Typography";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { ArrowRight2 } from "iconsax-react";
import React from "react";
import { getBifc, getRelatives, IFormSaln, SALNSCHEMA, SALNTYPE } from "./Types/type";
import { Form, FormCalendar } from "@/Components/ui/form";
import PersonalInformation from "./Partials/PersonalInformation";
import Children from "./Partials/Children";
import Assets from "./Partials/Assets";
import Liabilities from "./Partials/Liabilities";
import BusinessInterectFinancialConnections from "./Partials/BusinessInterectFinancialConnections";
import RelativeInGovernment from "./Partials/RelativeInGovernment";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Hooks/use-toast";

type Props = {
    saln: SALNTYPE;
};

const getChildren = (data: SALNTYPE["children"]) => {
    let childrens: Array<{
        name: string;
        dateofbirth: Date | null;
    }> = [{ name: "", dateofbirth: null }];

    if (data)
        if (data.length > 0) {
            childrens = [];

            data.forEach((child) => {
                childrens.push({
                    name: child.name??"",
                    dateofbirth: !child.name
                        ? null
                        : new Date(child.dateofbirth),
                });
            });
        }

    return childrens;
};

const NewSALN: React.FC<Props> = ({ saln }) => {
    const { toast } = useToast();
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
                dateissued: ((saln?.spouse?.dateissued && new Date(saln?.spouse?.dateissued)) || null) ?? null,
            },
            children: getChildren(saln?.children),
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
                bifc: saln ? getBifc(saln.biandfc.bifc) : [
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
                relatives: saln ? getRelatives(saln.relativesingovernment.relatives) : [
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

    return (
        <div>
            <Header title="New SALN">
                <div className="flex items-center gap-1">
                    SALN <ArrowRight2 className="size-4 [&>path]:stroke-[3]" />{" "}
                    New SALN
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

                    <PersonalInformation form={form} />

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
