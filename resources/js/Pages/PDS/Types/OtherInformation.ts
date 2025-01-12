import { z } from "zod"

export const OIDETAILSCHEMA = z.object({
    oiid: z.number().optional().nullable().default(null),
    detail: z.string().min(1, "This field is required.").default("")
})

export const OTHERINFORMATIONSCHEMA = z.object({
    skills: z.array(
        z.object({
            detail: z.string().min(1, "This field is required.").default("")
        })
    ).optional().default([]),
    nonacademicrecognition: z.array(
        z.object({
            detail: z.string().min(1, "This field is required.").default("")
        })
    ).optional().default([]),
    membership: z.array(
        z.object({
            detail: z.string().min(1, "This field is required.").default("")
        })
    ).optional().default([])
})

export type IFormDetail = z.infer<typeof OIDETAILSCHEMA>

export type IFormOtherInformation = z.infer<typeof OTHERINFORMATIONSCHEMA>

export const defaultOI = {
    detail: ""
}

export type OTHERINFORMATIONTYPESINGLE = {
    id: number
    user_id: number
    type: "skills" | "recognition" | "association"
    details: any
}

export type OTHERINFORMATIONTYPE = Array<OTHERINFORMATIONTYPESINGLE>
