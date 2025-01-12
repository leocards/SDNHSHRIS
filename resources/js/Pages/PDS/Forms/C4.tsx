import { useFormSubmit } from "@/Hooks/useFormSubmit";
import React, { useEffect } from "react";
import {
    C4SCHEMA,
    C4Type,
    C4TYPE,
    defaults,
    getC4,
    IFormC4,
    referenceDefault,
} from "../Types/C4";
import {
    Form,
    FormCalendar,
    FormInput,
    FormRadioGroup,
    FormRadioItem,
} from "@/Components/ui/form";
import { useFieldArray } from "react-hook-form";
import { cn } from "@/Lib/utils";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Hooks/use-toast";

type C4Props = {
    data: C4TYPE | null;
};

const C4: React.FC<C4Props> = ({ data }) => {
    const { toast } = useToast();

    const form = useFormSubmit<IFormC4>({
        route: data && data.length !== 0 ? route("pds.update.c4") : route("pds.store.c4"),
        method: "post",
        schema: C4SCHEMA,
        defaultValues: {
            "34": getC4(data, "34", defaults['34']),
            "35": getC4(data, "35", defaults['35']),
            "36": getC4(data, "36", defaults['36']),
            "37": getC4(data, "37", defaults['37']),
            "38": getC4(data, "38", defaults['38']),
            "39": getC4(data, "39", defaults['39']),
            "40": getC4(data, "40", defaults['40']),
            "41": getC4(data, "41", defaults['41']),
            governmentids: getC4(data, "governmentId", defaults['governmentId']),
        },
        async: true,
        callback: {
            onSuccess: (page: any) => {
                toast({
                    title: page?.props?.flash?.title,
                    description: page?.props?.flash?.message,
                    status: page?.props?.flash?.status,
                });
            },
            onError: (error: any) => {
                if ("0" in error)
                    toast({
                        title: "Error",
                        description: error[0],
                        status: "error",
                    });
                else {
                    for (const key in error) {
                        form.setError(key as keyof IFormC4, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
        },
    });

    const { fields } = useFieldArray({
        control: form.control,
        name: "41",
    });

    const watchQ34b = form.watch("34.choiceb.choices");
    const watchQ35a = form.watch("35.choicea.choices");
    const watchQ35b = form.watch("35.choiceb.choices");
    const watchQ36 = form.watch("36.choices");
    const watchQ37 = form.watch("37.choices");
    const watchQ38a = form.watch("38.choicea.choices");
    const watchQ38b = form.watch("38.choiceb.choices");
    const watchQ39 = form.watch("39.choices");
    const watchQ40a = form.watch("40.choicea.choices");
    const watchQ40b = form.watch("40.choiceb.choices");
    const watchQ40c = form.watch("40.choicec.choices");

    useEffect(() => {
        if (watchQ34b === "n") {
            form.setValue("34.choiceb.details", "");
        } else {
            form.setValue(
                "34.choiceb.details",
                getC4(data,"34", defaults['34'].choiceb.details, "choiceb.details"),
                {
                    shouldDirty: true,
                }
            );
        }
    }, [watchQ34b]);
    useEffect(() => {
        if (watchQ35a === "n") {
            form.setValue("35.choicea.details", "");
        } else {
            form.setValue(
                "35.choicea.details",
                getC4(data,"35", defaults['35'].choicea.details, "choicea.details"),
                {
                    shouldDirty: true,
                }
            );
        }
    }, [watchQ35a]);
    useEffect(() => {
        if (watchQ35b === "n") {
            form.setValue("35.choiceb.datefiled", null);
            form.setValue("35.choiceb.statusofcase", "");
        } else {
            form.setValue(
                "35.choiceb.datefiled",
                getC4(data,
                    "35",
                    defaults['35'].choiceb.datefiled,
                    "choiceb.datefiled"
                ) ? new Date(getC4(data,"35", defaults['35'].choiceb.datefiled, "choiceb.datefiled")) : null,
                {
                    shouldDirty: true,
                }
            );
            form.setValue(
                "35.choiceb.statusofcase",
                getC4(data,
                    "35",
                    defaults['35'].choiceb.statusofcase,
                    "choiceb.statusofcase"
                ),
                {
                    shouldDirty: true,
                }
            );
        }

    }, [watchQ35b]);
    useEffect(() => {
        if (watchQ36 === "n") {
            form.setValue("36.details", "");
        } else {
            form.setValue(
                "36.details",
                getC4(data,"36", defaults['36'].details, "details"),
                {
                    shouldDirty: true,
                }
            );
        }
    }, [watchQ36]);
    useEffect(() => {
        if (watchQ37 === "n") {
            form.setValue("37.details", "");
        } else {
            form.setValue(
                "37.details",
                getC4(data,"37", defaults['37'].details, "details"),
                {
                    shouldDirty: true,
                }
            );
        }
    }, [watchQ37]);
    useEffect(() => {
        if (watchQ38a === "n") {
            form.setValue("38.choicea.details", "");
        } else {
            form.setValue(
                "38.choicea.details",
                getC4(data,"38", defaults['38'].choicea.details, "choicea.details"),
                {
                    shouldDirty: true,
                }
            );
        }
    }, [watchQ38a]);
    useEffect(() => {
        if (watchQ38b === "n") {
            form.setValue("38.choiceb.details", "");
        } else {
            form.setValue(
                "38.choiceb.details",
                getC4(data,"38", defaults['38'].choiceb.details, "choiceb.details"),
                {
                    shouldDirty: true,
                }
            );
        }
    }, [watchQ38b]);
    useEffect(() => {
        if (watchQ39 === "n") {
            form.setValue("39.details", "");
        } else {
            form.setValue(
                "39.details",
                getC4(data,"39", defaults['39'].details, "details"),
                {
                    shouldDirty: true,
                }
            );
        }
    }, [watchQ39]);
    useEffect(() => {
        if (watchQ40a === "n") {
            form.setValue("40.choicea.details", "");
        } else {
            form.setValue(
                "40.choicea.details",
                getC4(data,"40", defaults['40'].choicea.details, "choicea.details"),
                {
                    shouldDirty: true,
                }
            );
        }
    }, [watchQ40a]);
    useEffect(() => {
        if (watchQ40b === "n") {
            form.setValue("40.choiceb.details", "");
        } else {
            form.setValue(
                "40.choiceb.details",
                getC4(data,"40", defaults['40'].choiceb.details, "choiceb.details"),
                {
                    shouldDirty: true,
                }
            );
        }
    }, [watchQ40b]);
    useEffect(() => {
        if (watchQ40c === "n") {
            form.setValue("40.choicec.details", "");
        } else {
            form.setValue(
                "40.choicec.details",
                getC4(data,"40", defaults['40'].choicec.details, "choicec.details"),
                {
                    shouldDirty: true,
                }
            );
        }
    }, [watchQ40c]);

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    {/* Q34 */}
                    <div className="space-y-2 p-0.5">
                        <div className="flex item-start gap-3">
                            <span>&#8226;</span>
                            Are you related by consanguinity or affinity to the
                            appointing or recommending authority, or to the
                            chief of bureau or office or to the person who has
                            immediate supervision over you in the Office, Bureau
                            or Department where you will be apppointed,
                        </div>
                        <div className="pl-10 space-y-4">
                            <FormRadioGroup
                                form={form}
                                name="34.choicea.choices"
                                label="a. within the third degree?"
                                labelClass="text-base font-normal"
                            >
                                <FormRadioItem value="y" label="Yes" />
                                <FormRadioItem value="n" label="No" />
                            </FormRadioGroup>
                            <FormRadioGroup
                                form={form}
                                name="34.choiceb.choices"
                                label="b. within the fourth degree (for Local Government Unit - Career Employees)?"
                                labelClass="text-base font-normal"
                            >
                                <FormRadioItem value="y" label="Yes" />
                                <FormRadioItem value="n" label="No" />
                            </FormRadioGroup>
                            <FormInput
                                form={form}
                                name="34.choiceb.details"
                                label="If YES, give details:"
                                itemClass="w-72"
                                disabled={watchQ34b === "n" || !watchQ34b}
                                required={watchQ34b === "y"}
                            />
                        </div>
                    </div>

                    {/* Q35 */}
                    <div className="space-y-4 p-0.5 mt-7">
                        <div className="space-y-4">
                            <div className="flex item-start gap-3">
                                <span>&#8226;</span>
                                <FormRadioGroup
                                    form={form}
                                    name="35.choicea.choices"
                                    label="a. Have you ever been found guilty of any administrative offense?"
                                    labelClass="text-base font-normal"
                                >
                                    <FormRadioItem value="y" label="Yes" />
                                    <FormRadioItem value="n" label="No" />
                                </FormRadioGroup>
                            </div>
                            <div className="pl-5">
                                <FormInput
                                    form={form}
                                    name="35.choicea.details"
                                    label="If YES, give details:"
                                    itemClass="w-72"
                                    disabled={watchQ35a === "n" || !watchQ35a}
                                    required={watchQ35a === "y"}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex item-start gap-3 pl-5">
                                <FormRadioGroup
                                    form={form}
                                    name="35.choiceb.choices"
                                    label="b. Have you been criminally charged before any court?"
                                    labelClass="text-base font-normal"
                                >
                                    <FormRadioItem value="y" label="Yes" />
                                    <FormRadioItem value="n" label="No" />
                                </FormRadioGroup>
                            </div>
                            <div className="pl-5">
                                <div>If YES, give details:</div>
                                <div className="w-72 mb-3">
                                    <FormCalendar
                                        form={form}
                                        name="35.choiceb.datefiled"
                                        label="Date Filed:"
                                        disabled={
                                            watchQ35b === "n" || !watchQ35b
                                        }
                                        required={watchQ35b === "y"}
                                    />
                                </div>
                                <FormInput
                                    form={form}
                                    name="35.choiceb.statusofcase"
                                    label="Status of Case/s:"
                                    itemClass="w-72"
                                    disabled={watchQ35b === "n" || !watchQ35b}
                                    required={watchQ35b === "y"}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Q36 */}
                    <div className="space-y-4 p-0.5 mt-7">
                        <div className="flex item-start gap-3">
                            <span>&#8226;</span>
                            <FormRadioGroup
                                form={form}
                                name="36.choices"
                                label="Have you ever been convicted of any crime or violation of any law, decree, ordinance or regulation by any court or tribunal?"
                                labelClass="text-base font-normal"
                            >
                                <FormRadioItem value="y" label="Yes" />
                                <FormRadioItem value="n" label="No" />
                            </FormRadioGroup>
                        </div>
                        <div className="pl-5">
                            <FormInput
                                form={form}
                                name="36.details"
                                label="If YES, give details:"
                                itemClass="w-72"
                                disabled={watchQ36 === "n" || !watchQ36}
                                required={watchQ36 === "y"}
                            />
                        </div>
                    </div>

                    {/* Q37 */}
                    <div className="space-y-4 p-0.5 mt-7">
                        <div className="flex item-start gap-3">
                            <span>&#8226;</span>
                            <FormRadioGroup
                                form={form}
                                name="37.choices"
                                label="Have you ever been separated from the service in any of the following modes: resignation, retirement, dropped from the rolls, dismissal, termination, end of term, finished contract or phased out (abolition) in the public or private sector?"
                                labelClass="text-base font-normal"
                            >
                                <FormRadioItem value="y" label="Yes" />
                                <FormRadioItem value="n" label="No" />
                            </FormRadioGroup>
                        </div>
                        <div className="pl-5">
                            <FormInput
                                form={form}
                                name="37.details"
                                label="If YES, give details:"
                                itemClass="w-72"
                                disabled={watchQ37 === "n" || !watchQ37}
                                required={watchQ37 === "y"}
                            />
                        </div>
                    </div>

                    {/* Q38 */}
                    <div className="space-y-4 p-0.5 mt-7">
                        <div className="flex item-start gap-3">
                            <span>&#8226;</span>
                            <FormRadioGroup
                                form={form}
                                name="38.choicea.choices"
                                label="a. Have you ever been a candidate in a national or local election (except Barangay election)?"
                                labelClass="text-base font-normal"
                            >
                                <FormRadioItem value="y" label="Yes" />
                                <FormRadioItem value="n" label="No" />
                            </FormRadioGroup>
                        </div>
                        <div className="pl-5">
                            <FormInput
                                form={form}
                                name="38.choicea.details"
                                label="If YES, give details:"
                                itemClass="w-72"
                                disabled={watchQ38a === "n" || !watchQ38a}
                                required={watchQ38a === "y"}
                            />
                        </div>

                        <div className="flex item-start gap-3 pl-5">
                            <FormRadioGroup
                                form={form}
                                name="38.choiceb.choices"
                                label="b. Have you resigned from the government service during the three (3)-month period before the last election to promote/actively campaign for a national or local candidate?"
                                labelClass="text-base font-normal"
                            >
                                <FormRadioItem value="y" label="Yes" />
                                <FormRadioItem value="n" label="No" />
                            </FormRadioGroup>
                        </div>
                        <div className="pl-5">
                            <FormInput
                                form={form}
                                name="38.choiceb.details"
                                label="If YES, give details:"
                                itemClass="w-72"
                                disabled={watchQ38b === "n" || !watchQ38b}
                                required={watchQ38b === "y"}
                            />
                        </div>
                    </div>

                    {/* Q39 */}
                    <div className="space-y-4 p-0 5 mt-7">
                        <div className="flex item-start gap-3">
                            <span>&#8226;</span>
                            <FormRadioGroup
                                form={form}
                                name="39.choices"
                                label="Have you acquired the status of an immigrant or permanent resident of another country?"
                                labelClass="text-base font-normal"
                            >
                                <FormRadioItem value="y" label="Yes" />
                                <FormRadioItem value="n" label="No" />
                            </FormRadioGroup>
                        </div>
                        <div className="pl-5">
                            <FormInput
                                form={form}
                                name="39.details"
                                label="If YES, give details (country):"
                                itemClass="w-72"
                                disabled={watchQ39 === "n" || !watchQ39}
                                required={watchQ39 === "y"}
                            />
                        </div>
                    </div>

                    {/* Q40 */}
                    <div className="space-y-4 p-0.5 mt-7">
                        <div className="flex item-start gap-3">
                            <span>&#8226;</span>
                            Pursuant to: (a) Indigenous People's Act (RA 8371);
                            (b) Magna Carta for Disabled Persons (RA 7277); and
                            (c) Solo Parents Welfare Act of 2000 (RA 8972),
                            please answer the following items:
                        </div>
                        <div className="pl-5 space-y-6">
                            <div className="space-y-4">
                                <FormRadioGroup
                                    form={form}
                                    name="40.choicea.choices"
                                    label="a. Are you a member of any indigenous group?"
                                    labelClass="text-base font-normal"
                                >
                                    <FormRadioItem value="y" label="Yes" />
                                    <FormRadioItem value="n" label="No" />
                                </FormRadioGroup>
                                <FormInput
                                    form={form}
                                    name="40.choicea.details"
                                    label="IIf YES, give details (country):"
                                    itemClass="w-72"
                                    disabled={watchQ40a === "n" || !watchQ40a}
                                    required={watchQ40a === "y"}
                                />
                            </div>
                            <div className="space-y-4">
                                <FormRadioGroup
                                    form={form}
                                    name="40.choiceb.choices"
                                    label="b. Are you a person with disability?"
                                    labelClass="text-base font-normal"
                                >
                                    <FormRadioItem value="y" label="Yes" />
                                    <FormRadioItem value="n" label="No" />
                                </FormRadioGroup>
                                <FormInput
                                    form={form}
                                    name="40.choiceb.details"
                                    label="IIf YES, give details (country):"
                                    itemClass="w-72"
                                    disabled={watchQ40b === "n" || !watchQ40b}
                                    required={watchQ40b === "y"}
                                />
                            </div>
                            <div className="space-y-4">
                                <FormRadioGroup
                                    form={form}
                                    name="40.choicec.choices"
                                    label="c. Are you a solo parent?"
                                    labelClass="text-base font-normal"
                                >
                                    <FormRadioItem value="y" label="Yes" />
                                    <FormRadioItem value="n" label="No" />
                                </FormRadioGroup>
                                <FormInput
                                    form={form}
                                    name="40.choicec.details"
                                    label="IIf YES, give details (country):"
                                    itemClass="w-72"
                                    disabled={watchQ40c === "n" || !watchQ40c}
                                    required={watchQ40c === "y"}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Q41 */}
                    <div className="space-y-4 mt-7">
                        <div className="flex item-start gap-3">
                            <span>&#8226;</span>
                            REFERENCES
                            <span className="text-destructive">
                                (Person not related by consanguinity or affinity
                                to applicant /appointee)
                            </span>
                        </div>
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="border border-border rounded-md shadow-sm p-4"
                            >
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <FormInput
                                            form={form}
                                            name={cn(`41.${index}.name`)}
                                            label="Name"
                                            required={false}
                                        />
                                    </div>
                                    <div>
                                        <FormInput
                                            form={form}
                                            name={cn(`41.${index}.address`)}
                                            label="Address"
                                            required={false}
                                        />
                                    </div>
                                    <div>
                                        <FormInput
                                            form={form}
                                            name={cn(`41.${index}.telno`)}
                                            label="Tel. No."
                                            required={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Government ID's */}
                    <div className="space-y-4 mt-7">
                        <div>
                            Government Issued ID (i.e.Passport, GSIS, SSS, PRC,
                            Driver's License, etc.) PLEASE INDICATE ID Number
                            and Date of Issuance
                        </div>
                        <div className="grid grid-cols-3 gap-4 px-1">
                            <FormInput
                                form={form}
                                name="governmentids.governmentissuedid"
                                label="Government Issued ID:"
                            />
                            <FormInput
                                form={form}
                                name="governmentids.licensepassportid"
                                label="ID/License/Passport No.:"
                            />
                            <FormInput
                                form={form}
                                name="governmentids.issued"
                                label="Date/Place of Issuance:"
                            />
                        </div>
                    </div>

                    <div className="flex items-center mt-8 pt-4 border-t border-border">
                        <Button type="button" variant="outline">
                            Cancel changes
                        </Button>
                        <Button className="ml-auto">Save changes</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default C4;
