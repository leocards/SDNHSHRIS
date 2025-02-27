import TypographySmall, { TypographyLarge } from "@/Components/Typography";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import {
    IFormPersonalInformation,
    PERSONALINFORMATIONSCHEMA,
    PERSONALINFORMATIONTYPE,
} from "../Types/PersonalInformation";
import {
    Form,
    FormCalendar,
    FormControl,
    FormField,
    FormInput,
    FormItem,
    FormLabel,
    FormRadioGroup,
    FormRadioItem,
    FormSelect,
} from "@/Components/ui/form";
import { SelectItem } from "@/Components/ui/select";
import React, { Fragment, useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { usePage } from "@inertiajs/react";
import { Checkbox } from "@/Components/ui/checkbox";
import { useWatch } from "react-hook-form";
import { cn } from "@/Lib/utils";
import { COUNTRIES } from "@/Types/country";
import { useToast } from "@/Hooks/use-toast";

const PersonalInformationForm: React.FC<{
    data: PERSONALINFORMATIONTYPE | null;
}> = ({ data }) => {
    const user = usePage().props.auth.user;
    const { toast } = useToast();

    const getAddress = (address: {
        pdspi_id: number;
        type: "residential" | "permanent";
        same: boolean;
        houselotblockno: string;
        street: string;
        subdivision: string;
        barangay: string;
        citymunicipality: string;
        province: string;
        zipcode: string;
    }|null) => {
        if (address?.type === "permanent") {
            return {
                pdspi_id: address?.pdspi_id ?? null,
                province: address?.province ?? "",
                citymunicipality: address?.citymunicipality ?? "",
                barangay: address?.barangay ?? "",
                subdivision: address?.subdivision ?? "",
                street: address?.street ?? "",
                houselotblockno: address?.houselotblockno ?? "",
                zipcode: address?.zipcode ?? "",
                isSameResidential: address?.same ?? false
            };
        } else {

            return {
                pdspi_id: address?.pdspi_id ?? null,
                province: address?.province ?? "",
                citymunicipality: address?.citymunicipality ?? "",
                barangay: address?.barangay ?? "",
                subdivision: address?.subdivision ?? "",
                street: address?.street ?? "",
                houselotblockno: address?.houselotblockno ?? "",
                zipcode: address?.zipcode ?? "",
            };
        }

    };

    const form = useFormSubmit<IFormPersonalInformation>({
        route: data ? route("pds.update.pi") : route("pds.store.pi"),
        method: "post",
        schema: PERSONALINFORMATIONSCHEMA,
        async: true,
        defaultValues: {
            firstname: user?.firstname ?? "",
            lastname: user?.lastname ?? "",
            middlename: user?.middlename ?? "",
            extensionname: user?.extensionname ?? "N/A",
            dateofbirth: user?.birthday ? new Date(user?.birthday) : undefined,
            placeofbirth: data?.placeofbirth || "",
            gender: user?.gender ?? undefined,
            height: data?.height ?? "",
            weight: data?.weight ?? "",
            bloodtype: data?.bloodtype ?? undefined,
            civilstatus: {
                status: data?.civilstatus?.status ?? undefined,
                others: data?.civilstatus?.others ?? "",
            },
            gsis: data?.gsis ?? "",
            pagibig: data?.pagibig ?? "",
            philhealth: data?.philhealth ?? "",
            sss: data?.sss ?? "",
            tin: data?.tin ?? "",
            agencyemployee: data?.agencyemployee ?? "",
            citizenship: {
                citizen: data?.citizenship.citizen ?? undefined,
                dual: {
                    by: data?.citizenship?.dual?.by ?? null,
                    country: data?.citizenship?.dual?.country ?? "",
                },
            },
            residentialaddress: getAddress(data?.addresses ? data?.addresses[0] : null),
            permanentaddress: getAddress(data?.addresses ? data?.addresses[1] : null),
            telephone: data?.telephone ?? "",
            mobile: data?.mobile.toString() ?? "",
            email: data?.email ?? "",
        },
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
                        form.setError(key as keyof IFormPersonalInformation, {
                            type: "manual",
                            message: error[key],
                        });
                    }
                }
            },
        },
    });

    const watchCivilStatus = form.watch("civilstatus.status");
    const watchIsSameResidential = form.watch(
        "permanentaddress.isSameResidential"
    );
    const watchResidentialAddress = useWatch({
        control: form.control,
        name: "residentialaddress",
    });

    useEffect(() => {
        if (watchCivilStatus !== "others") {
            form.setValue("civilstatus.others", "");
        }
    }, [watchCivilStatus]);

    useEffect(() => {
        if (watchIsSameResidential) {
            form.setValue(
                "permanentaddress",
                {
                    ...watchResidentialAddress,
                    isSameResidential: true,
                },
                {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                }
            );
        }
    }, [watchResidentialAddress, watchIsSameResidential]);

    useEffect(() => {
        if (form.getValues("citizenship.citizen") === "filipino") {
            form.setValue(
                "citizenship.dual",
                { by: null, country: "" },
                { shouldDirty: true, shouldValidate: true }
            );
        }
    }, [form.watch("citizenship.citizen")]);

    return (
        <div className="px-1">
            <TypographyLarge className="italic my-3 uppercase">
                I. PERSONAL INFORMATION
            </TypographyLarge>

            <Form {...form}>
                <form onSubmit={form.onSubmit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4 p-1 px-0">
                            <FormInput
                                form={form}
                                label="Last Name"
                                name="lastname"
                                inputClass="uppercase"
                            />
                            <FormInput
                                form={form}
                                label="First Name"
                                name="firstname"
                                inputClass="uppercase"
                            />
                            <FormInput
                                form={form}
                                label="Middle Name"
                                name="middlename"
                                required={false}
                                inputClass="uppercase"
                            />
                            <FormSelect
                                form={form}
                                name="extensionname"
                                label="Extension Name"
                                triggerClass="uppercase"
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
                                required={false}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4 p-1 px-0">
                            <FormCalendar
                                form={form}
                                name="dateofbirth"
                                label="Date of Birth"
                                triggerClass="uppercase"
                            />
                            <FormInput
                                form={form}
                                name="placeofbirth"
                                label="Place of Birth"
                                inputClass="uppercase"
                            />
                            <FormSelect
                                form={form}
                                name="gender"
                                label="Gender"
                                triggerClass="uppercase"
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
                        </div>

                        <div className="grid grid-cols-5 gap-4 p-1 px-0">
                            <FormSelect
                                form={form}
                                name="civilstatus.status"
                                label="Civil Status"
                                triggerClass="uppercase"
                                items={
                                    <>
                                        <SelectItem
                                            value="single"
                                            children="Single"
                                        />
                                        <SelectItem
                                            value="married"
                                            children="Married"
                                        />
                                        <SelectItem
                                            value="widowed"
                                            children="Widowed"
                                        />
                                        <SelectItem
                                            value="separate"
                                            children="Separate"
                                        />
                                        <SelectItem
                                            value="others"
                                            children="Others"
                                        />
                                    </>
                                }
                            />
                            <FormInput
                                form={form}
                                name="civilstatus.others"
                                label="If civil status is others:"
                                required={false}
                                disabled={watchCivilStatus != "others"}
                                inputClass="uppercase"
                            />
                            <FormInput
                                form={form}
                                name="height"
                                label="Height"
                                inputClass="uppercase"
                                icon={
                                    <div className="font-medium !opacity-100 text-sm">
                                        cm
                                    </div>
                                }
                            />
                            <FormInput
                                form={form}
                                name="weight"
                                label="Weight"
                                inputClass="uppercase"
                                icon={
                                    <div className="font-medium !opacity-100 text-sm">
                                        kg
                                    </div>
                                }
                            />
                            <FormSelect
                                form={form}
                                name="bloodtype"
                                label="Blood Type"
                                triggerClass="uppercase"
                                items={
                                    <>
                                        <SelectItem value="A" children="A" />
                                        <SelectItem value="A+" children="A+" />
                                        <SelectItem value="A-" children="A-" />
                                        <SelectItem value="B" children="B" />
                                        <SelectItem value="B+" children="B+" />
                                        <SelectItem value="B-" children="B-" />
                                        <SelectItem
                                            value="AB"
                                            children="AB"
                                        />
                                        <SelectItem
                                            value="AB+"
                                            children="AB+"
                                        />
                                        <SelectItem
                                            value="AB-"
                                            children="AB-"
                                        />
                                        <SelectItem value="O" children="O" />
                                        <SelectItem value="O+" children="O+" />
                                        <SelectItem value="O-" children="O-" />
                                    </>
                                }
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4 p-1 px-0">
                            <FormInput
                                form={form}
                                name="gsis"
                                label="GSIS No."
                                inputClass="uppercase"
                                type="number"
                                maxLength={8}
                            />
                            <FormInput
                                form={form}
                                name="pagibig"
                                label="Pag-ibig No."
                                inputClass="uppercase"
                                type="number"
                                maxLength={12}
                            />
                            <FormInput
                                form={form}
                                name="philhealth"
                                label="Philhealth No."
                                inputClass="uppercase"
                                type="number"
                                maxLength={12}
                            />
                            <FormInput
                                form={form}
                                name="sss"
                                label="SSS No."
                                inputClass="uppercase"
                                type="number"
                                maxLength={9}
                            />
                            <FormInput
                                form={form}
                                name="tin"
                                label="TIN No."
                                inputClass="uppercase"
                                type="number"
                                maxLength={12}
                            />
                            <FormInput
                                form={form}
                                name="agencyemployee"
                                label="Agency Employee No."
                                inputClass="uppercase"
                                type="number"
                                maxLength={9}
                            />
                        </div>

                        <div>
                            <FormRadioGroup
                                form={form}
                                required={false}
                                name="citizenship.citizen"
                                label={
                                    <div>
                                        <div className="required">
                                            Citizenship
                                        </div>
                                        <TypographySmall className="text-foreground/60 font-normal text-sm">
                                            If holder of dual citizenship,
                                            please indicate the details.
                                        </TypographySmall>
                                    </div>
                                }
                                position="vertical"
                            >
                                <FormRadioItem
                                    value="filipino"
                                    label="Filipino"
                                />
                                <FormRadioItem
                                    value="dual"
                                    label="Dual Citizenship"
                                />
                            </FormRadioGroup>
                            <div className="pl-7 space-y-4">
                                <FormRadioGroup
                                    form={form}
                                    name="citizenship.dual.by"
                                    label=""
                                    required={false}
                                    disabled={
                                        form.watch("citizenship.citizen") ===
                                            "filipino" ||
                                        !form.watch("citizenship.citizen")
                                    }
                                >
                                    <FormRadioItem
                                        value="birth"
                                        label="by birth"
                                    />
                                    <FormRadioItem
                                        value="naturalization"
                                        label="by naturalization"
                                    />
                                </FormRadioGroup>
                                <div className="max-w-72">
                                    <FormSelect
                                        form={form}
                                        name="citizenship.dual.country"
                                        label="Please indicate country"
                                        triggerClass="uppercase"
                                        items={
                                            <Fragment>
                                                {COUNTRIES.map(
                                                    (country, index) => (
                                                        <SelectItem
                                                            key={index}
                                                            value={country}
                                                            children={country}
                                                        />
                                                    )
                                                )}
                                            </Fragment>
                                        }
                                        disabled={
                                            form.watch(
                                                "citizenship.citizen"
                                            ) === "filipino" ||
                                            !form.watch("citizenship.citizen")
                                        }
                                        required={
                                            form.watch(
                                                "citizenship.citizen"
                                            ) === "dual"
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <Address form={form} name="residentialaddress" />

                        <Address
                            form={form}
                            name="permanentaddress"
                            addresstype="Permanent"
                            disabled={watchIsSameResidential}
                        />

                        <div className="grid grid-cols-3 gap-4 p-1 px-0">
                            <FormInput
                                form={form}
                                name="telephone"
                                label="Telephone No."
                                inputClass="uppercase"
                            />
                            <FormInput
                                form={form}
                                name="mobile"
                                label="Mobile No."
                                inputClass="uppercase"
                                type="number"
                                maxLength={10}
                                icon={
                                    <div className="font-medium !opacity-100 text-sm">
                                        +63
                                    </div>
                                }
                            />
                            <FormInput
                                form={form}
                                name="email"
                                label="Email address (if any)"
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

type PROVINCE = {
    code: string;
    name: string;
    regionCode: string;
    islandGroupCode: string;
};

type CITYMUNICIPALITY = {
    code: string;
    name: string;
    oldName: string;
    isCapital: boolean;
    isCity: boolean;
    isMunicipality: boolean;
    districtCode: string;
    provinceCode: string;
    regionCode: string;
    islandGroupCode: string;
};

type BARANGAY = {
    code: string;
    name: string;
    oldName: string;
    subMunicipalityCode: string;
    cityCode: string;
    municipalityCode: string;
    districtCode: string;
    provinceCode: string;
    regionCode: string;
    islandGroupCode: string;
};

async function getApiAddress<T>(
    route: string,
    setData: (data: Array<T>) => void
) {
    try {
        const response = await window.axios.get(route);

        setData(response.data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

const Address: React.FC<{
    form: any;
    name: string;
    addresstype?: string;
    disabled?: boolean;
}> = ({ form, name, addresstype = "Residential", disabled }) => {
    const [provinces, setProvinces] = useState<PROVINCE[]>([]);
    const [citymunicipality, setMunicipalityCity] = useState<
        CITYMUNICIPALITY[]
    >([]);
    const [barangays, setBarangay] = useState<BARANGAY[]>([]);

    const watchProvince = form.watch(name + ".province");
    const watchCityMunicipality = form.watch(name + ".citymunicipality");

    const onProvinceSelect = (provinceCode?: string) => {
        getApiAddress<CITYMUNICIPALITY>(
            "https://psgc.gitlab.io/api/provinces/" +
                provinceCode +
                "/cities-municipalities.json",
            setMunicipalityCity
        );
        form.setValue(name + ".citymunicipality", "");
        form.setValue(name + ".barangay", "");
    };

    const onCityMunicipalitySelect = (CMCode: string) => {
        getApiAddress<BARANGAY>(
            "https://psgc.gitlab.io/api/cities-municipalities/" +
                CMCode +
                "/barangays.json",
            setBarangay
        );
        form.setValue(name + ".barangay", "");
    };

    useEffect(() => {
        getApiAddress<PROVINCE>(
            "https://psgc.gitlab.io/api/provinces.json",
            setProvinces
        );
    }, []);

    return (
        <div>
            <FormField
                control={form.control}
                name={"permanentaddress.isSameResidential"}
                render={({ field }) => (
                    <FormItem
                        className={cn(
                            "items-center space-y-0 gap-2",
                            addresstype == "Permanent" ? "flex" : "hidden"
                        )}
                    >
                        <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={(value) => {
                                    if (!value) {
                                        form.setValue(
                                            "permanentaddress",
                                            {
                                                province: "",
                                                citymunicipality: "",
                                                barangay: "",
                                                subdivision: "",
                                                street: "",
                                                houselotblockno: "",
                                                zipcode: "",
                                                isSameResidential: false,
                                            },
                                            {
                                                shouldDirty: true,
                                                shouldTouch: true,
                                            }
                                        );
                                    } else {
                                        field.onChange(value);
                                    }
                                }}
                            />
                        </FormControl>
                        <FormLabel className="text-foreground/70">
                            Same as Residential Address
                        </FormLabel>
                    </FormItem>
                )}
            />

            <TypographySmall className="uppercase font-bold underline">
                {addresstype} Address
            </TypographySmall>
            <div className="grid grid-cols-3 gap-4 p-1 px-0">
                <FormSelect
                    form={form}
                    name={name + ".province"}
                    label="Province"
                    triggerClass="uppercase"
                    items={
                        <>
                            {provinces.map((province, index) => (
                                <SelectItem
                                    key={index}
                                    value={province.name}
                                    children={province.name}
                                    onClick={() =>
                                        onProvinceSelect(province.code)
                                    }
                                />
                            ))}
                        </>
                    }
                    disabled={disabled}
                />
                <FormSelect
                    form={form}
                    name={name + ".citymunicipality"}
                    label="City/Municipality"
                    triggerClass="uppercase"
                    disabled={!watchProvince || disabled}
                    items={
                        <>
                            {citymunicipality.map((cm, index) => (
                                <SelectItem
                                    key={index}
                                    value={cm.name}
                                    children={cm.name}
                                    onClick={() =>
                                        onCityMunicipalitySelect(cm.code)
                                    }
                                />
                            ))}
                        </>
                    }
                />
                <FormSelect
                    form={form}
                    name={name + ".barangay"}
                    label="Barangay"
                    triggerClass="uppercase"
                    disabled={!watchCityMunicipality || disabled}
                    items={
                        <>
                            {barangays.map((barangay, index) => (
                                <SelectItem
                                    key={index}
                                    value={barangay.name}
                                    children={barangay.name}
                                />
                            ))}
                        </>
                    }
                />

                <FormInput
                    form={form}
                    name={name + ".subdivision"}
                    label="Subdivision"
                    inputClass="uppercase"
                    required={false}
                    disabled={disabled}
                />
                <FormInput
                    form={form}
                    name={name + ".street"}
                    label="Street"
                    inputClass="uppercase"
                    required={false}
                    disabled={disabled}
                />
                <FormInput
                    form={form}
                    name={name + ".houselotblockno"}
                    label="House/Block/Lot No."
                    inputClass="uppercase"
                    required={false}
                    disabled={disabled}
                />
                <FormInput
                    form={form}
                    name={name + ".zipcode"}
                    label="ZIP code"
                    inputClass="uppercase"
                    disabled={disabled}
                    type="number"
                    maxLength={4}
                />
            </div>
        </div>
    );
};

export default PersonalInformationForm;
