import { requiredError } from "@/Types/types";
import { z } from "zod";

const CHILD = z.object({
    name: z.string().min(1, requiredError('name')).default(""),
    dateofbirth: z.date({ invalid_type_error: requiredError('date of birth') }).nullable().optional(),
});

const NAME = z.object({
    familyname: z.string().min(1, requiredError('surname')).default("N/A"),
    firstname: z.string().min(1, requiredError('first name')).default("N/A"),
    middlename: z.string().min(1, requiredError('middle name')).default("N/A"),
})

export const FAMILYBACKGROUNDSCHEMA = z.object({
    spouse: z.object({
        familyname: z.string().min(1, requiredError('surname')).default(""),
        firstname: z.string().min(1, requiredError('first name')).default(""),
        middlename: z.string().min(1, requiredError('middle name')).default(""),
        extensionname: z.string().min(1, requiredError('extension name')),
        occupation: z.string().min(1, requiredError('occupation')).default(""),
        employerbusiness: z.string().min(1, requiredError('employer/business name')).default(""),
        businessaddress: z.string().min(1, requiredError('business address')).default(""),
        telephone: z.string().min(1, requiredError('telephone no.')).default(""),
    }),
    father: NAME.extend({
        extensionname: z.string().min(1, requiredError('extension name')).default("N/A")
    }),
    mother: NAME,
    children: z.array(CHILD).optional().default([{ name: "", dateofbirth: null }])
})

export type IFormFamilyBackground = z.infer<typeof FAMILYBACKGROUNDSCHEMA>

export type SPOUSETYPE = IFormFamilyBackground["spouse"]
export type FATHERTYPE = IFormFamilyBackground["father"]
export type MOTHERTYPE = IFormFamilyBackground["mother"]
export type CHILDRENTYPE = IFormFamilyBackground["children"]
export type FAMILYBACCKGORUNDTYPESINGLE = {
    id: number;
    user_id: number;
    type: "spouse" | "father" | "mother" | "child"
    details: any;
}
export type FAMILYBACKGROUNDTYPE = Array<FAMILYBACCKGORUNDTYPESINGLE>

export const familyBackgroundDefaults = {
    spouse: {
        familyname: "",
        firstname: "",
        middlename: "",
        extensionname: "",
        occupation: "",
        employerbusiness: "",
        businessaddress: "",
        telephone: "",
    },
    father: {
        familyname: "",
        firstname: "",
        middlename: "",
        extensionname: "",
    },
    mother: {
        familyname: "",
        firstname: "",
        middlename: "",
    },
    child: []
}

export const getFamiltData = (data?: FAMILYBACKGROUNDTYPE) => {
    const familyData: IFormFamilyBackground = {
        spouse: familyBackgroundDefaults.spouse,
        father: familyBackgroundDefaults.father,
        mother: familyBackgroundDefaults.mother,
        children: []
    }

    data?.forEach((item) => {
        switch (item.type) {
            case "spouse":
                familyData.spouse = item.details
                break;
            case "father":
                familyData.father = item.details
                break;
            case "mother":
                familyData.mother = item.details
                break;
            case "child":
                familyData.children = item.details
                break;
        }
    })

    return familyData
}
