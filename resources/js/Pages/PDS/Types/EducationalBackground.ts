import { requiredError } from "@/Types/types"
import { z } from "zod"

export const EDUCATION = z.object({
    nameofschool: z.string().min(1, requiredError('name of school')).default("N/A"),
    basiceddegreecourse: z.string().min(1, requiredError('basic education/degree/course')).default("N/A"),
    period: z.object({
        from: z.string().min(1, requiredError('"from"')).default("N/A"),
        to: z.string().min(1, requiredError('"to"')).default("N/A")
    }),
    highestlvl: z.string().min(1, requiredError('highest level/units earned')).default("N/A"),
    yeargraduated: z.string().length(4, "The year graduated field must be YYYY or N/A format.").min(1, requiredError('year graduated')).or(z.literal("N/A")).default("N/A"),
    scholarshiphonor: z.string().min(1, requiredError('scholarship/academic honor received')).default("N/A")
})

export const EDUCATIONALBACKGROUNDSCHEMA = z.object({
    elementary: z.array(EDUCATION).optional().default([]),
    secondary: z.array(EDUCATION).optional().default([]),
    senior: z.array(EDUCATION).optional().default([]),
    vocational: z.array(EDUCATION).optional().default([]),
    college: z.array(EDUCATION).optional().default([]),
    graduatestudies: z.array(EDUCATION).optional().default([])
})

export type EDUCATIONTYPE = z.infer<typeof EDUCATION>

export type IFormEducationalBackground = z.infer<typeof EDUCATIONALBACKGROUNDSCHEMA>

export type EDUCATIONALBACKGROUNDTYPESINGLE = {
    id: number;
    user_id: number;
    type: "elementary"|"secondary"|"senior"|"vocational"|"college"|"graduate";
    details: any;
}

export type EDUCATIONALBACKGROUNDTYPE = Array<EDUCATIONALBACKGROUNDTYPESINGLE>

export const educationalBackgroundDefaults = {
    elementary: [],
    secondary: [],
    senior: [],
    vocational: [],
    college: [],
    graduatestudies: []
}

export const getEducation = (
    data: EDUCATIONALBACKGROUNDTYPE,
    type:
        | "elementary"
        | "secondary"
        | "senior"
        | "vocational"
        | "college"
        | "graduate"
) => {
    const education = data?.find((e) => e.type === type);

    if (education) {
        return education.details;
    }

    return [];
}
